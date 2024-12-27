const io = require("socket.io")(8900, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
  },
});

let users = [];

const addUser = (userId, socketId , conversationId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId , conversationId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (conversationId, senderId) => {
  // Filter users based on the conversationId
  const filteredUsers = users.filter(user => user.conversationId === conversationId);
  
  // Initialize an array to store userIds and socketIds
  const userIdsAndSocketIds = [];

  // Iterate over the filtered users
  filteredUsers.forEach(user => {
    // If senderId is provided and matches the userId, skip this user
    if (senderId && user.userId === senderId) {
      return;
    }
    
    // Otherwise, add userId and socketId to the array
    userIdsAndSocketIds.push({ userId: user.userId, socketId: user.socketId });
  });

  return userIdsAndSocketIds;
};




io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId , conversationId) => {
    
    if (conversationId != null)
    {
      addUser(userId, socket.id , conversationId);
    }
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, conversationId, text }) => {
    console.log('User is', { senderId, conversationId, text });
  
    // Retrieve members of the same conversation excluding the sender
    let members = getUser(conversationId, senderId);
    console.log('Same group users are', members);
  
    // Emit "getMessage" event to each member
    members.forEach(member => {
      console.log('socketId is', member.socketId);
      io.to(member.socketId).emit("getMessage", {
        senderId: senderId,
        text: text,
      });
    });
});

  
  

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});