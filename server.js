const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");

const app = express();
const server = require('http').Server(app);
const io = socketIo(server);

// Connect to MongoDB Atlas
mongoose
  .connect("mongodb://localhost:27017",{dbName:"test"})
  .then(() => console.log("Connected successfully to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a schema for the user data
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNo: String,
  email: String,
  street: String,
  city: String,
  state: String,
  country: String,
  loginId: String,
  password: String,
  creationTime: { type: Date, default: Date.now },
  updationTime: { type: Date, default: Date.now }
});

// Define a model based on the schema
const User = mongoose.model("User", userSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, JavaScript)
app.use(express.static("public"));



let AllUsers = []


// Socket.io connection event
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle form submission
  socket.on('submitForm', async (userData) => {
    
    try {
      let newUser = new User(userData);
      await newUser.save();
      newUser = {
        userData,
        socketId : socket.id
      }
      AllUsers.push(newUser);
      socket.join("live room")
      io.to("live room").emit("userJoined" , newUser);
      // Emit new user data to all connected clients
      io.emit('newUser', { name: userData.firstName + ' ' + userData.lastName, email: userData.email, socketId: socket.id,mobileNo:userData.mobileNo,street:userData.street,city:userData.city,state:userData.state,country:userData.country,loginId:userData.loginId });
      socket.emit('formSubmissionSuccess');
    } catch (err) {
      console.error(err);
      // Send error message to the client
      socket.emit('formSubmissionError', 'Failed to submit form. Please try again.');
    }
  });

  // Handle client disconnection
  
  io.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Emit disconnect event to all connected clients
    io.emit('userDisconnected', socket.id);
  });
});

app.get("/api/user",(req,res)=>{
    console.log(AllUsers)
  res.send(AllUsers)
})

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
