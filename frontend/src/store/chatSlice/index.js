import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import socketIOClient from 'socket.io-client';
const SOCKET_SERVER = import.meta.env.VITE_API_URL;
let socket = null;

export const connectSocket = createAsyncThunk('chat/connectSocket', async (userData, { dispatch }) => {
    if (socket) socket.disconnect();

    socket = socketIOClient(SOCKET_SERVER);

    socket.on('connect', () => {
        socket.emit('join', userData);
        dispatch(setConnected(true));

        socket.emit('getUnreadCounts', { userId: userData.userId });
    });

    socket.on('newMessage', (message) => {
        dispatch(receiveMessage(message));
    });
    socket.on('conversationHistory', (messages) => {
        dispatch(setMessages(messages));
    });
    socket.on('userList', (users) => {
        dispatch(setUsers(users));
    });
    socket.on('updatedUserList', (users) => {
        dispatch(setUsers(users));
    });
    socket.on('unreadCounts', (counts) => {
        dispatch(setUnreadCounts(counts));
    });
    socket.on('disconnect', () => {
        dispatch(setConnected(false));
    });
    socket.on('messageStatus', (response) => {
        if (response.success) {
            dispatch(messageSent({
                tempId: response.tempId,
                ...response.data,
                isPending: false
            }));
        } else {
            dispatch(setError(response.error || 'Failed to send message'));
        }
    });

    return userData;
});


export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (messageData, thunkAPI) => {
        socket.emit('sendMessage', messageData);
        return;
    }
);


export const getConversation = createAsyncThunk('chat/getConversation', async (userIds) => {
    return new Promise((resolve) => {
        socket.emit('getConversation', userIds);
        resolve();
    });
}
);

export const getUsers = createAsyncThunk(
    'chat/getUsers',
    async (data) => {
        return new Promise((resolve) => {
            socket.emit('getUsers', data);
            resolve();
        });
    }
);

// export const getUsers = createAsyncThunk('chat/getUsers', async (role, thunkAPI) => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/userroles?role=${role}`, { withCredentials: true });
//         return response.data;
//     } catch (error) {
//         return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
//     }
// });
export const markMessagesRead = createAsyncThunk(
    'chat/markMessagesRead',
    async (userIds) => {
        return new Promise((resolve) => {
            socket.emit('markMessagesRead', userIds);
            resolve();
        });
    }
);

export const getUnreadCounts = createAsyncThunk(
    'chat/getUnreadCounts',
    async (userData) => {
        return new Promise((resolve) => {
            socket.emit('getUnreadCounts', userData);
            resolve();
        });
    }
);
const initialState = {
    isConnected: false,
    currentUser: null,
    selectedUser: null,
    users: [],
    messages: [],
    pendingMessages: [],
    loading: false,
    error: null,
    unreadCounts: {},
    messageError: null
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConnected: (state, action) => { state.isConnected = action.payload; },
        selectUser: (state, action) => { state.selectedUser = action.payload; },
        setUsers: (state, action) => { state.users = action.payload; },
        setMessages: (state, action) => { state.messages = action.payload; state.loading = false; },
        receiveMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        messageSent: (state, action) => {
            state.pendingMessages = state.pendingMessages.filter(m => m.tempId !== action.payload.tempId);
            state.messages.push(action.payload);
        },
        addPendingMessage: (state, action) => { state.pendingMessages.push(action.payload); },
        setUnreadCounts: (state, action) => { state.unreadCounts = action.payload; },
        clearUnreadCount: (state, action) => {
            const userId = action.payload;
            if (state.unreadCounts[userId]) state.unreadCounts[userId] = 0;
        },
        setError: (state, action) => {
            state.messageError = action.payload;
        },
        clearError: (state) => {
            state.messageError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(connectSocket.pending, (state) => { state.loading = true; })
            .addCase(connectSocket.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.loading = false;
            })
            .addCase(connectSocket.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
    }
});

export const {
    setConnected, selectUser, setUsers, setMessages,
    receiveMessage, messageSent, addPendingMessage,
    setUnreadCounts, clearUnreadCount, setError, clearError
} = chatSlice.actions;

export default chatSlice.reducer;