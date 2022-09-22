const users = [];

///function use to add new user in the array,every user has id ,username, password,room
const addUser = ({ id, username, room }) => {
  //use clear data without any white space
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //use to check if the any one is white space or not
  if (!username || !room)
    return { error: "username or password or room is not valid " };

  //use to check if the user found before or not
  const result = users.find((user) => {
    return user.username === username && user.room === room;
  });
  //find use to check if this in the array ,is return true if found it otherwise return false
  if (result) {
    return { error: "user already exists in the database" };
    //we write return important because to private to continue to execute next statement
  }
  // console.log("HI");
  users.push({ id, username, room }); ///use to add to array instead
  return { user: { id, username, room } }; //use to return result
};
const getALlUsers = () => {
  return users;
};
const getUser = (id) => {
  const ans = users.find((user) => user.id === id);
  if (!ans) return { Error: "Undefined user" };
  else return ans;
};
const getUserInRoom = (room) => {
  const userRoom = users.filter((user) => user.room === room);
  if (!userRoom) return [];
  else return userRoom;
};
const removeUser = (id) => {
  const index = users.findIndex((users) => users.id === id);
  //findIndex return the -1 if the element is not found otherwise return the index
  if (index === -1) return { error: "user is not found in array " };
  else {
    return users.splice(index, 1)[0]; //use to remove the element  from the array
  }
};
// ///use to add user to the array
// addUser({ id: 22, username: "Raed1", password: "12345", room: "play" });
// addUser({ id: 212, username: "Raed2", password: "12345", room: "play" });
// addUser({ id: 232, username: "Raed3", password: "12345", room: "play" });
// addUser({ id: 222, username: "Raed4", password: "12345", room: "play2" });
// addUser({ id: 224, username: "Raed5", password: "12345", room: "play2" });
// // addUser({ id: 224, username: "Raed5", password: "12345", room: "play2" });
// console.log(getALlUsers()); //use to show all user in the array
// console.log(
//   addUser({ id: 224, username: "Raed5", password: "12345", room: "play2" })
// ); //use to show all user in the array
// // console.log(removeUser(224)); //return the users after removing the user
// // console.log(getUserInRoom("play"));

module.exports = {
  addUser,
  getALlUsers,
  getUser,
  getUserInRoom,
  removeUser,
};
