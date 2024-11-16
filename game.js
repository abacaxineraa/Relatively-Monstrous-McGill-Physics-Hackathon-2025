// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Player {

    constructor(x,y,w,h,vx,vy,ax,ay,hp,l){
        this.x = x,
        this.y = y,
        this.w = w, 
        this.h = h, 
        this.vx = vx, 
        this.vy = vy;
        this.ax = ay, 
        this.hp = hp
        this.l = l};
    


}

class Box {
    constructor(x,y,c){this.x = x; this.y=y; this.c = c}
    create() {
        ctx.fillStyle = 'red';
        ctx.fillRect( canvas.width/2 + this.x - cameraX -this.c/2, canvas.height/2 + this.y - cameraY -this.c/2, this.c, this.c);
    }
}

// Player and camera settings
const playerSize = 30;
const playerSpeed = 5;
const smoothness = 0.2; // Smoothness for camera movement (lower is smoother but slower)

let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
let cameraX = canvas.width/2;
let cameraY = canvas.width/2;
let cameraNewX;
let cameraNewY = cameraY;

arrayBox=[]
arrayBox.push(new Box(300, 200, 100))
arrayBox.push(new Box(400, 200, 50))
// setting up player
let player = new Player()


// Handle player movement
function movePlayer(event) {
    if (event.key === 'ArrowUp') {
        playerY -= playerSpeed; 
        updateCamera()       
    }

    if (event.key === 'ArrowDown') {
        playerY += playerSpeed; 
        updateCamera()  
       
    }
    if (event.key === 'ArrowLeft') {
        playerX -= playerSpeed;
	updateCamera()
    }
    if (event.key === 'ArrowRight') {
        playerX += playerSpeed;
	updateCamera()
    }
}

// Smooth interpolation (lerp) for the camera to follow the player
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = '#007bff';
    ctx.fillRect(canvas.width/2  + playerX - cameraX - playerSize/2, canvas.height/2 + playerY - cameraY - playerSize/2, playerSize, playerSize); // Adjust for camera
}

// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, playerX, smoothness);
    cameraY = lerp(cameraY, playerY, smoothness);
}

// Clear the canvas and redraw the game elements
function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera position
    updateCamera();

    // Draw the player at the updated position
    drawPlayer();
    for(i=0; i < arrayBox.length; i++){
        arrayBox[i].create()
    }

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);

for(i = 0; i < 5; i++){
    i += 1;
}
// Start the game loop
updateGame();