var socket;
var started = false;


// html elements
var whiteboardDiv = document.getElementById("whiteboard");
var primaryScreen = document.getElementById('primaryScreen');

var newRoom = document.getElementById("createRoom");
var joinRoomBtn = document.getElementById("joinRoom");
var generatedRoomCode = document.getElementById("newRoomCode");

newRoom.addEventListener("click", handleNewRoom);
joinRoomBtn.addEventListener('click', joinExistingRoom);
socket = io.connect("http://localhost:3000");
socket.on("createNewRoom", handleNewRoom);
socket.on("roomCode",handleRoomCode);


function newBoard(){
    started = true;
    primaryScreen.style.display = "none";
    whiteboardDiv.style.display = "block";
}

function joinExistingRoom(){
    var roomCode = document.getElementById("roomCode").value;
    socket.emit("joinRoom", roomCode);
    newBoard();

}


function handleNewRoom(){
    socket.emit("createNewRoom");
    newBoard();
    //generatedRoomCode.innerText = roomCode;

}

function handleRoomCode(roomCode){
    generatedRoomCode.innerText = roomCode;
}






// Functions for setting up canvas
function setup() {

    let canvas = createCanvas(1200, 800);
    canvas.parent("mainCanvas");
    background(222,222,222);
    socket.on('mouse', newChanges);
      
}


function newChanges(data){
    noStroke();
    fill(data.color);
    ellipse(data.x, data.y, data.size, data.size);
}

function mouseDragged(){
    var penColor = document.getElementById("penColor").value;
    var penSize = document.getElementById("penSize").value;
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

