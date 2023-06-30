const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
        cors: {
          origin: "http://localhost:4200",
          methods: ["GET", "POST"],
          allowedHeaders: ["my-custom-header"],
          credentials: true
        }});
app.get('/', (req, res) => {
    res.send('Hello from Codedamn');
})


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('signal', (data) => {
    console.log('Signal received:', data);
    socket.broadcast.emit('signal', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});