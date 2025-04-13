require("dotenv").config();
const http = require('http');
const mongoose = require('mongoose')
const app = require('./app');
const connectDatabase = require('./config/database');
const server = http.createServer(app);
const { Server } = require("socket.io");
const chatModel = require("./models/chatModel");
const userModel = require("./models/userModel");


app.get("/", (req, res) => {
    res.json({ message: "server deplyoed properly" })
})

//initializing Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_BASE_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
})
//connecting database
connectDatabase(process.env.MONGO_URL)
    .then((data) => {
        console.log(`mongodb connected with server: ${data.connection.host}`);

    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);

        process.exit(1)
    });


const connectedUsers = new Map();

io.on('connection', (socket) => {

    //join
    socket.on('join', (userData) => {
        //join based on role
        const { userId, role, name, branch } = userData;
        socket.join(role);
        socket.userRole = role;

        connectedUsers.set(userId, { socketId: socket.id, role, name, branch });
        broadcastUserToRole(role);
    });
    async function broadcastUserToRole(requesterRole) {
        let filter = {};
        if (requesterRole === 'student') {
            filter = { role: 'coordinator' };
        } else if (requesterRole === 'coordinator') {
            filter = { role: 'student' };
        } else {
            filter = {};
        }

        try {
            const users = await userModel
                .find(filter)
                .select('_id name role profile.branch');
            const formattedUsers = users.map(user => ({
                userId: user._id,
                name: user.name,
                role: user.role,
                branch: user.profile?.branch,
            }));

            //emit only to ussers in the room for the role
            io.to(requesterRole).emit('updatedUserList', formattedUsers);
        } catch (err) {
            console.error("Error fetching user list:", err);
        }
    }

    //send message
    socket.on('sendMessage', async (messageData) => {
        try {
            //validation
            const { sender, receiver, content, senderRole, receiverRole } = messageData;
            const isValid =
                (senderRole === 'student' && receiverRole === 'coordinator') ||
                (senderRole === 'coordinator' && receiverRole === 'student');

            if (!isValid) {
                return socket.emit('messageStatus', {
                    success: false,
                    error: 'role not allowed.',
                    tempId: messageData.tempId
                });
            }

            const newMessage = new chatModel({
                sender,
                receiver,
                content,
                senderRole,
                receiverRole,
                timestamp: new Date(),
                read: false
            });
            await newMessage.save();


            const receiverInfo = connectedUsers.get(receiver);
            if (receiverInfo) {
                io.to(receiverInfo.socketId).emit('newMessage', newMessage);
            }

            updateUnreadCount(receiver);
            socket.emit('messageStatus', {
                success: true,
                data: newMessage,
                tempId: messageData.tempId
            });
        } catch (error) {
            socket.emit('messageStatus', {
                success: false,
                error: error.message,
                tempId: messageData.tempId
            });
        }
    });


    //get conversation history
    socket.on('getConversation', async ({ userId, otherUserId }) => {
        try {
            const messages = await chatModel.find({
                $or: [
                    { sender: userId, receiver: otherUserId },
                    { sender: otherUserId, receiver: userId }
                ]
            }).sort({ timestamp: 1 });

            socket.emit('conversationHistory', messages);
        } catch (error) {

            socket.emit('conversationError', { error: 'Failed to load conversation' });
        }
    });

    //get users users
    socket.on('getUsers', async ({ role }) => {
        try {
            let filter = {};

            if (role === 'student') {
                filter = { role: 'coordinator' };
            }

            else if (role === 'coordinator') {
                filter = { role: 'student' };
            }

            const users = await userModel
                .find(filter)
                .select('_id name role profile.branch');
            const formattedUsers = users.map(user => ({
                userId: user._id,
                name: user.name,
                role: user.role,
                branch: user.profile?.branch
            }));
            // socket.emit('userList', formattedUsers);
            // socket.userRole = role;

            //only to users of the same role
            // socket.broadcast.to(role).emit('updatedUserList', formattedUsers);
            io.to(role).emit('updatedUserList', formattedUsers);

        } catch (error) {
            console.error('Error fetching users:', error);
            socket.emit('userError', { error: 'Failed to load users' });
        }
    });



    socket.on('disconnect', () => {
        for (const [userId, info] of connectedUsers.entries()) {
            if (info.socketId === socket.id) {
                connectedUsers.delete(userId);
                if (socket.userRole) broadcastUserToRole(socket.userRole);
                break;
            }
        }
    });



    //marking messages as read
    socket.on('markMessagesRead', async ({ userId, otherUserId }) => {
        try {
            await chatModel.updateMany(
                { sender: otherUserId, receiver: userId, read: false },
                { $set: { read: true } }
            );


            updateUnreadCount(userId);

        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    //unread count for each contact
    socket.on('getUnreadCounts', async ({ userId }) => {
        try {

            const unreadCounts = await chatModel.aggregate([
                {
                    $match: {
                        receiver: new mongoose.Types.ObjectId(userId),
                        read: false
                    }
                },
                {
                    $group: {
                        _id: "$sender",
                        count: { $sum: 1 }
                    }
                }
            ]);


            const formattedCounts = {};
            unreadCounts.forEach(item => {
                formattedCounts[item._id] = item.count;
            });

            socket.emit('unreadCounts', formattedCounts);
        } catch (error) {
            console.error('Error getting unread counts:', error);
        }
    });

    async function updateUnreadCount(userId) {

        try {

            const unreadCounts = await chatModel.aggregate([
                {
                    $match: {
                        receiver: new mongoose.Types.ObjectId(userId),
                        read: false
                    }
                },
                {
                    $group: {
                        _id: "$sender",
                        count: { $sum: 1 }
                    }
                }
            ]);


            const formattedCounts = {};
            unreadCounts.forEach(item => {
                formattedCounts[item._id] = item.count;
            });
            const userInfo = connectedUsers.get(userId);
            if (userInfo) {
                io.to(userInfo.socketId).emit('unreadCounts', formattedCounts);
            }

        } catch (error) {
            console.error('Error updating unread counts:', error);
        }
    }


})




process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught exception`);
    process.exit(1)

})

//unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`);


    server.close(() => {
        process.exit(1)
    })
})
server.listen(process.env.PORT, () => {
    console.log("server is working", process.env.PORT);
})


