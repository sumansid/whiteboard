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
	
	client.on('createNewRoom',handleNewRoom)
	client.on('joinRoom', handleJoinRoom);

	function message(data){
		//console.log("room lookup", roomLookup[client.id])

		const currRoom = io.sockets.adapter.rooms[roomLookup[client.id]];


		console.log('current room', currRoom);
		//client.broadcast.emit("mouse", data);
		client.to(roomLookup[client.id]).emit("mouse", data);
		//io.to(roomLookup[client.id]).emit("mouse", data);
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
		const currRoom = io.sockets.adapter.rooms[roomID];
		let allUsers ;
		if (currRoom){
			allUsers = currRoom.sockets;

		}
		let numberOfClients;
		if (allUsers){
			console.log("ALL users", allUsers);
			numberOfClients = Object.keys(allUsers).length;
			console.log("Number of users in the room", numberOfClients);

		}

		console.log('Join room function triggered to join room'+ roomID);
		roomLookup[client.id] = roomID;
		console.log("roomLookup",roomLookup);
		client.join(roomID);
		client.emit("init");

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