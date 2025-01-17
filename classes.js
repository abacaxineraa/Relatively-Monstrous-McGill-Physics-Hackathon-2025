class Aimer {


    // angle, width of aimer and height of aimer
    constructor(angle,w,h){
        this.angle = angle;
        this.w = w;
        this.h = h;
    }

    draw(){// Draw aimer (Rotate, draw, rotate back)
        ctx.globalAlpha = 0.5;
        let playerR = Math.sqrt(player.w**2 + player.h**2)/(2*Math.sqrt(2))
        this.x = player.x + playerR*Math.cos(aimer.angle)  
        this.y = player.y + playerR*Math.sin(aimer.angle)
        ctx.fillStyle = "black";
        ctx.translate(canvas.width/2 + this.x - cameraX, canvas.height/2 + this.y - cameraY);
        ctx.rotate(this.angle);
        ctx.translate( - canvas.width/2 - this.x + cameraX, - canvas.height/2 - this.y + cameraY);
        ctx.fillRect( canvas.width/2 + this.x - cameraX - this.w/2, canvas.height/2 + this.y - cameraY - this.h/2, this.w, this.h);
        
        
        ctx.translate(canvas.width/2 + this.x - cameraX, canvas.height/2 + this.y - cameraY);
        ctx.rotate(-this.angle);
        ctx.translate( - canvas.width/2 - this.x + cameraX, - canvas.height/2 - this.y + cameraY);
        ctx.globalAlpha = 1;
    }
    
}

class Photons {

    // position of photons, velocity of photons, radius, range of photons
    constructor(x,y,w,h,vx,vy,ran, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.ran = ran;
        this.color = color;
    }

    draw(){
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(canvas.width / 2 + this.x - cameraX - this.w / 2, 
            canvas.height / 2 + this.y - cameraY - this.h / 2, 
            this.w, this.h);
        
    }
    move(him){
        this.trueVX = this.vx + him.vx;
        this.trueVY = this.vy + him.vy;
        this.x += this.trueVX;
        this.y += this.trueVY;
        this.ran -= Math.sqrt((this.trueVX)**2+(this.trueVY)**2);
    }

}
