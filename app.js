var express = require('express');
var app = express();
const state = {};
const roomLookup = {};

app.use(express.static("public"));

var server = app.listen(3000, function(){
	console.log('listening');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var socket = require("socket.io");
var io = socket(server);
io.sockets.on('connection', function(socket){
	console.log('socket id', socket.id);
	socket.on('mouse', message);
	socket.on('newWhiteBoard', handleNewBoard);
	socket.on('joinRoom', handleJoinRoom);
	socket.on('joinRoom', handleJoinRoom);

	function message(data){
		socket.broadcast.emit("mouse", data);
		console.log("data received",data);


	}

	function handleNewBoard(){
		var roomID = makeNewID();
		roomLookup[socket.id] = roomID;
		socket.emit("roomCode", roomID);
		socket.join(roomID)

	}

	function handleJoinRoom(){

	}

	function makeNewID() {
	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < 6; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}

})