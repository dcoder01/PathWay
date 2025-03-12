require("dotenv").config();
const http = require('http');
const app = require('./app');
const connectDatabase = require('./config/database');
const jwt = require("jsonwebtoken");
const { error } = require("console");
const server = http.createServer(app);

app.get("/", (req, res)=>{
    res.json({message:"server deplyoed properly"})
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


