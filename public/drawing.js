var socket;
var started = false;


// html elements
var whiteboardDiv = document.getElementById("whiteboard");
var primaryScreen = document.getElementById('primaryScreen');

var newRoom = document.getElementById("createRoom");
var joinRoomBtn = document.getElementById("joinRoom");
var generatedRoomCode = document.getElementById("newRoomCode");
var roomDisplayTag = document.getElementById("roomDisplayTag");

newRoom.addEventListener("click", handleNewRoom);
joinRoomBtn.addEventListener('click', joinExistingRoom);


// Initialize socket in client side
socket = io.connect("http://localhost:3000");
socket.on("createNewRoom", handleNewRoom);
socket.on("roomCode",handleRoomCode);
socket.on("init", handleinit);
socket.on('mouse', newChanges);
socket.on("displayCurrentRoom", handleDisplayCurrentRoom);


function handleinit(){
    console.log("handle init triggered");
}

function handleDisplayCurrentRoom(currentRoomID){
    roomDisplayTag.innerHTML = "Current Room: <span>"+ currentRoomID+" </span>";
}


function init(){
    primaryScreen.style.display = "none";
    whiteboardDiv.style.display = "block";

}

function joinExistingRoom(){
    var roomCode = document.getElementById("roomCode").value;
    console.log('roomCode about to join client side', roomCode)
    socket.emit("joinRoom", roomCode);
    init();

}


function handleNewRoom(){
    socket.emit("createNewRoom");
    
    init();
    //generatedRoomCode.innerText = roomCode;

}

function handleRoomCode(roomCode){
    generatedRoomCode.innerText = roomCode;
}


function start(){
    started = true;
}


// Functions for setting up canvas


function setup() {
    
    let canvas = createCanvas(1200, 800);
    canvas.parent("mainCanvas");
    background(222,222,222);
    //socket.on('mouse', newChanges);
        
}


function newChanges(data){
    noStroke();
    fill(data.color);
    ellipse(data.x, data.y, data.size, data.size);
}


function mouseDragged(){
    var penColor = document.getElementById("penColor").value;
    var penSize = document.getElementById("penSize").value;
    started = true;
    if (started){
        var data = {
            x: mouseX,
            y: mouseY,
            size: penSize,
            color: penColor
        };
        socket.emit("mouse", data);
        noStroke();
        fill(penColor);
        ellipse(mouseX, mouseY, penSize, penSize);

    }
  
}

