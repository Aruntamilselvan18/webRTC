const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const server = require('http').createServer(app);
const connectedClients = {};
const User = [{user:''}];
// basic functionalities
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors(
  {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
));

app.use(morgan('combined'));

// Handle cross orgin
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


//  socket connection 
  io.on('connection', (socket) => {
  console.log('New client connected');
  console.log('connected user id', socket.id)

  User.push({user:socket.id})
  connectedClients[socket.id] = socket;
  
  
  // console.log(connectedClients[socket.id]);
  // message handler
  // socket.on('signal', (data) => {
  //   console.log('Signal received:', data);
  //   socket.broadcast.emit('signal', data);
  // });
  app.post('/message/:socketId', (req, res) => {
    const { socketId } = req.params;
    const { message } = req.body;
    
    // Send the message to the specified client
    if (connectedClients[socketId]) {
      connectedClients[socketId].emit('message', message);
      res.send('Message sent',message);
    } else {
      res.status(404).send('Client not found');
    }
  });

  // user disconnet
  socket.on('disconnect', () => {
    delete connectedClients[socket.id];
    console.log('Client disconnected');
  });
});



app.get('/UserList', (req, res) => {
  console.log(User);
  res.json(User)
})



// adding morgan to log HTTP requests

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});


server.listen(3000, () => {
  console.log('Server listening on port 3000');
});