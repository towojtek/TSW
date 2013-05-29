function Paddle(yPos){
	
	
	var that;	
	this.x;		
	this.y;		

	
	
	that = this; 
	this.x = Pong.WIDTH/2;
	this.y = yPos - Paddle.HEIGHT/2;
}



Paddle.WIDTH = 60;
Paddle.HEIGHT = 16;
Paddle.R1 = 5;
Paddle.R2 = 10;
Paddle.R3 = 25;



Paddle.prototype.move = function(newx) {
	if (newx < Paddle.WIDTH/2)
		this.x = Paddle.WIDTH/2;
	else if (newx > Pong.WIDTH - Paddle.WIDTH/2)
		this.x = Pong.WIDTH - Paddle.WIDTH/2;
	else
		this.x = newx;
}

Paddle.prototype.move2 = function(newy) {
	if (newy < Paddle.HEIGHT/2)
		this.y = Paddle.HEIGHT/2;
	else if (newy > Pong.HEIGHT - Paddle.HEIGHT/2)
		this.y = Pong.HEIGHT - Paddle.HEIGHT/2;
	else
		this.x = newy;
}

global.Paddle = Paddle;