var socket;
var started = false;


// html elements
var whiteboardDiv = document.getElementById("whiteboard");
var primaryScreen = document.getElementById('primaryScreen');

var newRoom = document.getElementById("createRoom");
var joinRoomBtn = document.getElementById("joinRoom");
var generatedRoomCode = document.getElementById("newRoomCode");
//socket.on("roomCode", handleNewRoom);
newRoom.addEventListener("click", newBoard);
joinRoomBtn.addEventListener('click', joinExistingRoom);


function newBoard(){
    socket.emit("newWhiteBoard");
    started = true;
    primaryScreen.style.display = "none";
    whiteboardDiv.style.display = "block";
}

function joinExistingRoom(){
    var roomCode = document.getElementById("roomCode").value;
    socket.emit("joinRoom", roomCode);
    primaryScreen.style.display = "none";
    whiteboardDiv.style.display = "block";

}


function handleNewRoom(roomCode){
    generatedRoomCode.innerText = roomCode;
}



// Functions for setting up canvas
function setup() {

    let canvas = createCanvas(1200, 800);
    canvas.parent("mainCanvas");
    background(222,222,222);

    socket = io.connect("http://localhost:3000");
    socket.on('mouse', newChanges);
      
}


function newChanges(data){
    noStroke();
    fill(6,6,6);
    ellipse(data.x, data.y, 30, 30);

}

function mouseDragged(){
    if (started){
        var data = {
            x: mouseX,
            y: mouseY
        };
        socket.emit("mouse", data);
        var penColor = document.getElementById("penColor").value;
        var penSize = document.getElementById("penSize").value;

        noStroke();
        fill(penColor);
        ellipse(mouseX, mouseY, penSize, penSize);

    }
  
}
