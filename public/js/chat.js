//Client
const socket = window.io(); //should use to know this side is client
// const moment = require("moment");

//Element
const form = document.querySelector("form");
const messageButton = document.querySelector("#messageButton");
const LocationButton = document.querySelector("#LocationButton");
const message = document.querySelector("input");

//Template
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $LocationTemplate = document.querySelector("#LocationTemplate").innerHTML;
const $Messages = document.querySelector("#Messages");
const $sideBar = document.querySelector("#sidebar-template").innerHTML;
//Option
const { room, username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
}); //use to ignore query prefix
//button send message
messageButton.addEventListener("click", (e) => {
  e.preventDefault(); //use to prevent default
  //send message
  socket.emit("Sending-message", message.value, (Error) => {
    //callback function
    if (Error) return console.error(Error); //if found error then stop and show message
    console.log("Fine Word sent Message successfully"); //otherwise show message and send message to client
  });
  message.value = "";
});
//button send Location
LocationButton.addEventListener("click", (e) => {
  e.preventDefault();
  //success method has only one argument is position
  const success = (MyPosition) => {
    //successfully
    socket.emit(
      "Send-Position",
      {
        latitude: MyPosition.coords.latitude,
        longitude: MyPosition.coords.longitude,
      },
      //callback function
      () => {
        console.log("Location shared ");
      }
    );
  };
  ///success method
  const failure = (error) => {
    console.log(error);
  };

  //have two arguments ,first is successfully ,second is failed
  navigator.geolocation.getCurrentPosition(success, failure);
});

//Message use to show for use
socket.on("Sending-message", ({ text, CreateAt, username }) => {
  //use to show message in the console
  const html = Mustache.render($messageTemplate, {
    //use to render the template
    Message: text,
    CreateAt: moment(CreateAt).format("h:mm a"), //when show to user then formate the time and convert to the specified format
    username,
  }); //use to render the template
  $Messages.insertAdjacentHTML("beforeend", html); //use to add the template to the message
  //insert the message beforeend the messages
});

//Location use to show for use
socket.on("Send-Position", ({ location, TimeNow, username }) => {
  const html = Mustache.render($LocationTemplate, {
    location,
    TimeNow: moment(TimeNow).format("h:mm a"),
    username,
  });
  $Messages.insertAdjacentHTML("beforeend", html);
});

socket.emit("join1", { username, room }, (error) => {
  if (error) {
    alert(error); //use to show error message
    location.href = "/"; //use to go to home page
  }
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sideBar, {
    room,
    users,
  });
  //use this way because we want to remove all items in side bare and rewrite again
  document.querySelector("#slideBareId").innerHTML = html;
});
