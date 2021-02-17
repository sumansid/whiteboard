var express = require('express');
var app = express();
const state = {};
const roomLookup = {};

app.use(express.static("public"));

var server = app.listen(process.env.PORT || 3000, function(){
	console.log('listening on port 3000');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var socket = require("socket.io");
var io = socket(server);
io.sockets.on('connection', function(client){
	//console.log('socket id', socket.id);
	client.on('mouse', message);
	//socket.on('newWhiteBoard', handleNewBoard);
	client.on('createNewRoom',handleNewRoom)
	client.on('joinRoom', handleJoinRoom);

	function message(data){
		client.broadcast.emit("mouse", data);
		console.log("data received",data);
	}

	function handleNewRoom(){

		var roomID = makeNewID();
		roomLookup[socket.id] = roomID;
		console.log("New room id was made", roomID);
		client.join(roomID);
		console.log('client emitted roomdcode', roomID);
		client.emit("roomCode", roomID);

	}

	function handleJoinRoom(roomID){
		console.log('Join room function triggered to join room'+ roomID);
		client.join(roomID);

	}

	function makeNewID() {
	   var generatedRoomCode = '';
	   var letters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var lettersLength = letters.length;
	   for ( var i = 0; i < 6; i++ ) {
	      generatedRoomCode += letters.charAt(Math.floor(Math.random() * lettersLength));
	   }
	   return generatedRoomCode;
	}

})