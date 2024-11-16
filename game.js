// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


let monsters = [];
let spawnRate = 0.03;

// Function to spawn monsters outside the frame
function spawnMonster() {
    // Only spawn a monster if the number of monsters is less than 5
    if (monsters.length >= Math.round(5 + 10 * spawnRate)) return;

    // Random position outside the player's current view
    let spawnX = player.x + (Math.random() * 800 - 400);  // Spawn outside the screen on X-axis
    let spawnY = player.y + (Math.random() * 800 - 400);  // Spawn outside the screen on Y-axis

    // Random size for the monster
    let size = Math.random() * 40 + 20;
    
    // Random velocity for the monster (to make them move)
    let vx = Math.random() * 2 - 1; // Random velocity between -1 and 1
    let vy = Math.random() * 2 - 1; // Random velocity between -1 and 1
 
    let hp = true;
    
    // Random glow effect for the monster
    let glow = Math.random() < 0.5;
    let ran = (1-spawnRate) * Math.random() * Math.min(canvas.height/3, canvas.width/3) + 2.5 * Math.min(player.w, player.h)
    
    // Create a new monster and add it to the monsters array
    monsters.push(new Monsters(spawnX, spawnY, vx, vy, size, size, hp, glow, ran));
}

// Player and camera settings
const smoothness = 0.1; // Smoothness for camera movement (lower is smoother but slower)

let cameraX = canvas.width/2;
let cameraY = canvas.height/2;




// setting up player
let player = new Player(canvas.width/2, canvas.height/2, 60, 60, 0, 0, 0.25, 0.25, true)
let aimer = new Aimer(0, 30, 10)


// Math functions
function dist(x1, y1, x2, y2){
    return (Math.sqrt((x1-x2)**2 + (y1-y2)**2))
}

function collision(obj1, obj2){
    return (Math.abs(obj1.x - obj2.x) <= (obj1.w/2 + obj2.w/2) && // Distance between x-coordinates <= Sum of half-widths
            Math.abs(obj1.y - obj2.y) <= (obj1.h/2 + obj2.h/2)) // Distance between y-coordinates <= Sum of half-heights  
}


let keysPressed = {}; // Tracks keys that are currently pressed

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    movePlayer();
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});


canvas.addEventListener('click',shoot);

function movePlayer() {
    let dx = 0;
    let dy = 0;

    // Check the keys that are currently pressed and set dx and dy accordingly
    if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W']) dy = -1;
    if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) dy = 1;
    if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) dx = -1;
    if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) dx = 1;
    
    // Normalize the movement vector if both x and y directions are active
    
    if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;

        // Update player position with normalized speed
        if (Math.abs(player.vx) < 3) player.vx += dx * player.ax;

        if (Math.abs(player.vy) < 3) player.vy += dy * player.ay;

    
        
        
    }
    
}


// Smooth interpolation (lerp) for the camera to follow the player
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Draw the player
// function drawPlayer() {
//     ctx.fillStyle = '#007bff';
//     ctx.fillRect(canvas.width/2  + player.x - cameraX - player.w/2, canvas.height/2 + player.y - cameraY - player.h/2, player.w, player.h); // Adjust for camera
// }

// Draw and update aimer()
function moveAim(event){
    let trueX = canvas.width/2 + player.x -cameraX
    let trueY = canvas.height/2 + player.y -cameraY
    if (event.offsetX >= (trueX)){
        aimer.angle = Math.atan((event.offsetY - trueY)/(event.offsetX - trueX))
    } else if (event.offsetX < trueX){
        aimer.angle = (Math.atan((event.offsetY - trueY)/(event.offsetX - trueX)) + Math.PI)
    }
}

// Setting up photons
let c = 5; // speed of light

let photons = []
let redphotons = []

function shoot(){
    if (photons.length < 4){
    let shootVX = c * Math.cos(aimer.angle);
    let shootVY = c * Math.sin(aimer.angle);  
    let shootR = Math.min(canvas.width/2,canvas.height/2);
    photons.push(new Photons(aimer.x + aimer.w * Math.cos(aimer.angle), aimer.y + aimer.w * Math.sin(aimer.angle),
        5,5,shootVX,shootVY,shootR, "blue"));
    }
}

function redshoot(monster, target){
    console.log(monster.x, monster.y, target.x, target.y)
    let followAngle;
    if (target.x >= monster.x){
        followAngle = Math.atan((target.y - monster.y)/(target.x - monster.x))
    } else if (player.x < monster.x){
        followAngle = Math.atan((target.y - monster.y)/(target.x - monster.x)) + Math.PI
    }
    console.log(followAngle)
    followAngle += Math.PI/12 - Math.random() * Math.PI/6 // Variety in Shooting
    let shootVX = c * Math.cos(followAngle);
    let shootVY = c * Math.sin(followAngle);  
    let shootR = Math.min(canvas.width/2,canvas.height/2);
    redphotons.push(new Photons(monster.x, monster.y, 5,5,shootVX,shootVY,shootR, "red"));
    
}


// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, player.x, smoothness);
    cameraY = lerp(cameraY, player.y, smoothness);
}




function updateGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera()

    // Inside updateGame function:
    player.draw(ctx, player.spriteSheet, cameraX, cameraY, canvas);
    aimer.draw();

    if (Math.random() < spawnRate) spawnMonster()
    
    // Draw the monsters
    for(i=0; i < monsters.length; i++){
        monsters[i].move()
        monsters[i].draw();

    }
    
    // Check photons
    photons = photons.filter(checkRange);
    redphotons = redphotons.filter(checkRange);


    function checkRange(photon) {
        return photon.ran >= 0;
    }

    // Draw the photons
    for(i = 0; i < photons.length; i++){
        photons[i].draw();
        photons[i].move();  
    }
    for(i = 0; i < redphotons.length; i++){
        redphotons[i].draw();
        redphotons[i].move();  
    }

    // Check monsters-photons
    monsters = monsters.filter(checkCollision);
    function checkCollision(monster){
        for (i = 0; i < photons.length; i++){
            if (collision(monster, photons[i])) {
                if (spawnRate < 1) spawnRate *= 1.05
                /* if (Math.random() < Math.min(5*spawnRate, 1)) */ redshoot(monster, player)
                return false}
        }
        return true
    }

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);
canvas.addEventListener('mousemove', moveAim);

// Start the game loop
updateGame();
