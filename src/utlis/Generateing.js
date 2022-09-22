const generateMessage = (text, username) => {
  return {
    text,
    CreateAt: new Date().getTime(),
    username,
  };
};
const generateLocation = (location1, username) => {
  return {
    location: location1,
    TimeNow: new Date().getTime(),
    username,
  };
};

module.exports = { generateLocation, generateMessage };
