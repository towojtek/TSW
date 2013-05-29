function Player(sid, pid, yPos) {
    
	this.sid;		
    this.pid;		
    this.paddle;	
    var delay;		
	var xPos = yPos;
    
    this.sid = sid;
    this.pid = pid;
	if(this.pid === 1 || this.pid === 2)
    this.paddle = new Paddle(yPos);
	if(this.pid === 3 || this.pid === 4)
	this.paddle = new Paddle2(xPos);
    var delay = 0;

    this.setDelay = function(newDelay) {
    	delay = newDelay;
    }

    /*
    	Return 0 if no delay
    	Else, return a value between:
    	delay * (1 - errorPercentage%) to delay * (1 + errorPercentage%)
    	Note: Math.random() returns a value between 0 to 1
    */
    this.getDelay = function() {
		var errorPercentage = 20;
	    var lowerbound = delay * (1 - errorPercentage/100);
	    var range = delay * (2 * errorPercentage/100);
		if (delay != 0) {
				return lowerbound + Math.floor(Math.random() * range);
		}
		else 
				return 0
	}
}

// For node.js require
global.Player = Player;
