const http = require("http"); //should write to use to create new severe
const path = require("path");
const Filter = require("bad-words"); //module use to check if text has bad word or not
const socket = require("socket.io");
const express = require("express");
//Server
const app = express();
const server = http.createServer(app);
const io = socket(server);
const filter = new Filter(); //use  to create filter to use with bad words
app.use(express.static(path.join(__dirname, "../public"))); //use to set the static folder
const port = process.env.PORT || 3000; ///use to set the port

//Global Function
const { generateLocation, generateMessage } = require("./utlis/Generateing");

//use to use the all method in the file users
const {
  addUser,
  getALlUsers,
  getUser,
  getUserInRoom,
  removeUser,
} = require("./utlis/users");

//use to connect with client side
io.on("connection", (socket) => {
  //should write connection or connect ,if not write like this then is not work

  //use to listen if send message
  socket.on("Sending-message", (Message, callback) => {
    const user = getUser(socket.id);
    // console.log(user);
    if (filter.isProfane(Message)) {
      //if the message has bad word then callback and send the message for show to user
      return callback("This is text has bad words is not worked !!!");
    }
    //otherwise send to other client and show the message
    io.to(user.room).emit(
      "Sending-message",
      generateMessage(Message, user.username)
    ); //use to send to every user and with me
    callback(); //execute the callback without passing any error message
    //generateMessage(Message) use to generate the message with time now
  });
  //position
  socket.on("Send-Position", (Position, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "Send-Position",
      generateLocation(
        `https://www.google.com/maps?q=${Position.latitude},${Position.longitude}`,
        user.username
      )
    );
    callback();
  });

  socket.on("join1", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room }); //use to add to array
    // console.log(error);
    // console.log(user.room);
    // console.log(room);
    if (error)
      //we use callback to send the error to the file client and from teh file client the n show to user
      return callback(error); //if error from the file then throw error

    //use to join to room with same name of room name
    //is mean if user sign in the room ,all user inner can chat with him
    socket.join(user.room); //use to join to room
    // socket.id is use to get the specific user id from the socket
    socket.emit(
      "Sending-message",
      generateMessage(`Welcome ${user.username} , You Back !`, "Admin")
    ); //send to  current client
    socket.broadcast //use to send to every user in the room ,use has joined to this chat
      //use to select the special room
      .to(user.room)
      .emit(
        "Sending-message",
        generateMessage(`${user.username} has  Joined To Chat `, user.username)
      ); //send to everyone without me
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    return callback();
  });

  socket.on("disconnect", () => {
    //use if close the tab or close the browser then send user is left
    const user = removeUser(socket.id);
    // const room = user.room;
    // console.log(user, room);
    if (user)
      io.to(user.room).emit(
        "Sending-message",
        generateMessage(` ${user.username} user has a Left ! `, user.username)
      );
    //use to show all element in this room and show in the side bar or in the console
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

//very important
//socket use to deal with this client and this server
//io.sockets.emit use to deal with all client with me
//io.sockets.emit or io.emit //is same work
//socket.broadcast use to send messages to all clients without me
//moment module use to formate the date
// Mustache module use to render the template to client

/*
module validator 
more method use is isURL ,isEmail

module chalk 
use to config the termianl output 

module fs 
use to dealing with the file system  

module yargs
use to dealing with argument in command line 

module request 
use to dealing with http and can get info from the http 


API
moudle express
user to dealing creat API 

moudle hbs
use to create html variable
 */
