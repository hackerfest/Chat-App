const express=require('express')
const dotenv=require('dotenv');
const connectDB = require('./config/db');
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
const messageRoute=require('./routes/messageRoute');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config()
connectDB();

const app=express();

app.use(express.json());

app.get("/",(req,res)=>{
res.send("Api runnning");
})

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoute);

app.use(notFound);
app.use(errorHandler)

const port=process.env.PORT
const server=app.listen(port,console.log(`runs at ${port}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (user) => {
      // console.log(userData);
      socket.join(user?.data._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          //console.log(user);
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
    
    //   socket.off("setup", () => {
    //     console.log("USER DISCONNECTED");
    //     socket.leave(userData._id);
    //   });
    });