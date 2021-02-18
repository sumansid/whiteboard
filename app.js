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

	client.on('mouse', message);
	client.on('createNewRoom',handleNewRoom)
	client.on('joinRoom', handleJoinRoom);

	function message(data){
		console.log('current room', currRoom);
		client.to(roomLookup[client.id]).emit("mouse", data);
		console.log("data received");
	}

	function handleNewRoom(){

		var roomID = makeNewID();
		roomLookup[client.id] = roomID;
		console.log("New room id was made ", roomID);
		client.join(roomID);
		console.log('client emitted room code ', roomID);
		client.emit("roomCode", roomID);
		client.emit("init");

	}

	function handleJoinRoom(roomID){
		console.log('trying to join ', roomID);
		roomLookup[client.id] = roomID;
		client.join(roomID);
		client.emit("init");
		client.emit("displayCurrentRoom", roomID);

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