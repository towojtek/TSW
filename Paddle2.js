function Paddle2(xPos){
	
	
	var that;	
	this.x;		
	this.y;		

	
	
	that = this; 
	this.x = xPos - Paddle2.WIDTH/2;
	this.y = Pong.HEIGHT/2;
}



Paddle2.WIDTH = 16;
Paddle2.HEIGHT = 60;
Paddle2.R1 = 5;
Paddle2.R2 = 10;
Paddle2.R3 =25;

/*=============
  move [Public]
  =============*/
Paddle2.prototype.move2 = function(newy) {
	if (newy < Paddle2.HEIGHT/2)
		this.y = Paddle2.HEIGHT/2;
	else if (newy > Pong.HEIGHT - Paddle2.HEIGHT/2)
		this.y = Pong.HEIGHT - Paddle2.HEIGHT/2;
	else
		this.y = newy;
}

// For node.js require
global.Paddle2 = Paddle2;