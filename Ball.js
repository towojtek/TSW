function Ball() {
	
	
	var that;	
	var moving;	
	var vx;		
	var vy;		
	this.x;		
	this.y;		

	
	
	that = this;
	moving = false;
	vx = 0;
	vy = 0;
	this.x = Pong.WIDTH/2;
	this.y = Pong.HEIGHT/2;

	
	this.startMoving = function(){
		vx = 0;
		vy = Ball.VERTICAL_VELOCITY;
		moving = true;
	}

	
	this.isMoving = function() {
		return moving;
	}

	
	this.moveOneStep = function(topPaddle, bottomPaddle, leftPaddle, rightPaddle) {
		
		that.x += vx;
		that.y += vy;

		
		/*if (that.x <= Ball.WIDTH/2 || that.x >= Pong.WIDTH - Ball.WIDTH/2) {
			
			vx = -vx;
		} */
		//else 
		if (that.y + Ball.HEIGHT/2 > Pong.HEIGHT || that.y - Ball.HEIGHT/2 < 0 || that.x + Ball.WIDTH/2 > Pong.WIDTH || that.x - Ball.WIDTH/2 <0) {
			// Uderza w œciane, punkt zdobyty!
			that.x = Pong.WIDTH/2;
			that.y = Pong.HEIGHT/2;
			vx = 0;
			vy = 0;
			moving = false;
		} else if (that.y - Ball.HEIGHT/2 < Paddle.HEIGHT) {
			
			updateVelocity(topPaddle.x);
		} else if (that.x - Ball.WIDTH/2 < Paddle2.WIDTH) {
			
			updateVelocity(leftPaddle.x);

		} else if (that.y + Ball.HEIGHT/2 > Pong.HEIGHT - Paddle.HEIGHT) {
			
			updateVelocity(bottomPaddle.x);
		}
		else if (that.x + Ball.WIDTH/2 > Pong.WIDTH - Paddle2.WIDTH) {
			
			updateVelocity(rightPaddle.x);
		}
	}

	
	var updateVelocity = function(px) {
		
		if (that.x >= px - Paddle.R1 && that.x <= px + Paddle.R1) {
            vy = -vy;
        } else if (that.x >= px - Paddle.R2 && that.x <= px + Paddle.R2) {
            vx += (that.x > px? 1 : -1);
            vy = -vy;
        } else if (that.x >= px - Paddle.R3 && that.x <= px + Paddle.R3) {
            vx += (that.x > px? 2 : -2);
            vy = -vy;
        } else if (that.x + Ball.WIDTH/2 >= px - Paddle.WIDTH/2 && that.x - Ball.WIDTH/2 <= px + Paddle.WIDTH/2) {
            vx += (that.x > px? 3 : -3);
            vy = -vy;
        }
		if (that.y >= py - Paddle2.R1 && that.y <= py + Paddle2.R1) {
            vx = -vx;
        } else if (that.y >= py - Paddle2.R2 && that.y <= py + Paddle2.R2) {
            vy += (that.y > py? 1 : -1);
            vx = -vx;
        } else if (that.y >= py - Paddle2.R3 && that.y <= py + Paddle2.R3) {
            vy += (that.y > py? 2 : -2);
            vx = -vx;
        } else if (that.y + Ball.WIDTH/2 >= py - Paddle.WIDTH/2 && that.y - Ball.WIDTH/2 <= py + Paddle.WIDTH/2) {
            vy += (that.y > py? 3 : -3);
            vx = -vx;
        }
		
        // else = ball didn't collide with paddle
	}
	/*
	var updateVelocity = function(py) {
		// Change direction (vx) depending on collision point between ball and paddle
		if (that.y >= py - Paddle2.R1 && that.y <= py + Paddle2.R1) {
            vx = -vx;
        } else if (that.y >= py - Paddle2.R2 && that.y <= py + Paddle2.R2) {
            vy += (that.y > py? 1 : -1);
            vx = -vx;
        } else if (that.y >= py - Paddle2.R3 && that.y <= py + Paddle2.R3) {
            vy += (that.y > py? 2 : -2);
            vx = -vx;
        } else if (that.y + Ball.WIDTH/2 >= py - Paddle.WIDTH/2 && that.y - Ball.WIDTH/2 <= py + Paddle.WIDTH/2) {
            vy += (that.y > py? 3 : -3);
            vx = -vx;
        }
        // else = ball didn't collide with paddle
	}*/
}


Ball.WIDTH = 10;
Ball.HEIGHT = 10;
Ball.VERTICAL_VELOCITY = 7;


global.Ball = Ball;