import express from "express";
import path from "path";
import session from "express-session"
import cors from "cors";
import helmet from "helmet";
import http from "http";

import { Server } from "socket.io";
import { loginRouter } from "./routes/loginRouter.js";
import { postRouter } from "./routes/postRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import { userRouter } from "./routes/userRouter.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

global.__dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.resolve("../client/dist")));
app.use(express.static(path.resolve("../client/public/uploads")));
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ credentials: true, origin: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    httpOnly: false,
    sameSite: true,
    cookie: { secure: false }
}));

// -------- ROUTES --------- //
app.use('/login', loginRouter) 
app.use('/posts', postRouter)  
app.use('/comments', commentRouter)  
app.use('/users', userRouter)  

// ------ SOCKET ------ //

const connectedUsers = []
const messages = []

io.on('connection', (socket) => {

    // user connects 
    socket.emit("user-connected")
    socket.on("username-connected", (data) => {
        connectedUsers.push(data)
        io.emit("share-connected-users", connectedUsers)
    })

    // user disconnects
    socket.on("disconnect-user", (data) => {
        const index = connectedUsers.indexOf(data);
        connectedUsers.splice(index, 1);
        io.emit("user-disconnected", data)
    })

    // chatroom messages
    io.emit("persistent-messages", { comments: messages })

    socket.on("new-message", (message) => {
        messages.push(message)
        io.emit("recieved-message", { message });
    });

});

// --------- PORT --------- //
const PORT = 8080 || process.env.PORT;
server.listen(PORT, () => console.log("Server is running on port", PORT));



