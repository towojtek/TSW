function PongClient() {
	/*=========
	  Variables
	  =========*/
	var socket;		
	var playArea;	
	var ball;		
	var myPaddle;		
	var opponentPaddle;	
	var opponentPaddle2; 
	var opponentPaddle3; 
	var delay;			

	/*=================
	  display [Private]
	  =================*/
	var display = function(location, msg) {
		
		document.getElementById(location).innerHTML = msg; 
	}

	/*=================
	  appendLog [Private]
	  =================*/
	var appendLog = function(location, msg) {
		
		var prev_msgs = document.getElementById(location).innerHTML;
		document.getElementById(location).innerHTML = "[" + new Date().toString() + "] " + msg + "<br />" + prev_msgs;
	}

	/*=====================
	  initNetwork [Private]
	  =====================*/
	var initNetwork = function() {
		
		try {
			socket = io.connect("http://" + Pong.SERVER_NAME + ":" + Pong.PORT);


	
			socket.on("disconnect", function() {
				console.log("You have disconnected from game server.");

				
				appendLog("serverMsg", "You have disconnected from game server");
			});
			
			
			socket.on("serverMsg", function(data) {
				
				
				appendLog("serverMsg", data.msg);
			});

			
			socket.on("update", function(data) {
				updateStates(data.ballX, data.ballY, data.myPaddleX, data.myPaddleY, data.opponentPaddleX, data.opponentPaddleY, data.opponent2PaddleX, data.opponent2PaddleY, data.opponent3PaddleX, data.opponent3PaddleY );
			});
		} catch (e) {
			console.log("Failed to connect to " + "http://" + Pong.SERVER_NAME + ":" + Pong.PORT);
		}
	}

	/*=================
	  initGUI [Private]
	  =================*/
	var initGUI = function() {
		while(document.readyState !== "complete") {console.log("loading...");};

		
		playArea = document.getElementById("playArea");
		playArea.height = Pong.HEIGHT;
		playArea.width = Pong.WIDTH;

		
		playArea.addEventListener("mousemove", function(e) {
			onMouseMove(e);
			}, false);
		playArea.addEventListener("click", function(e) {
			onMouseClick(e);
			}, false);
		document.addEventListener("keydown", function(e) {
			onKeyPress(e);
			}, false);
	}

	
	var onMouseMove = function(e) {
		var canvasMinX = playArea.offsetLeft;
		var canvasMaxX = canvasMinX + playArea.width;
		var canvasMinY = playArea.offsetTop;
		var canvasMaxY = canvasMinX + playArea.height;
		var new_mouseX = e.pageX - canvasMinX;
		var new_mouseY = e.pageY - canvasMinY;

		
		socket.emit("move", {x: new_mouseX});
		socket.emit("move2", {y: new_mouseY});
	}

	
	var onMouseClick = function(e) {
		if (!ball.isMoving()) {
			//Send event to server
			socket.emit("start", {});
		}
	
	}

	
	var onKeyPress = function(e) {
	
		switch(e.keyCode) {
			case 38: { // Up
				delay += 50;
				
				socket.emit("delay", {delay: delay});
				display("delay", "Delay to Server: " + delay + " ms");
				break;
			}
			case 40: { // Down
				if (delay >= 50) {
					delay -= 50;
					
					socket.emit("delay", {delay: delay});
					display("delay", "Delay to Server: " + delay + " ms");
				}
				break;
			}
		}
	}

	
	var updateStates = function(ballX, ballY, myPaddleX, myPaddleY, opponentPaddleX, opponentPaddleY, opponent2PaddleX, opponent2PaddleY,opponent3PaddleX, opponent3PaddleY) {
		ball.x = ballX;
		ball.y = ballY;
		myPaddle.x = myPaddleX;
		myPaddle.y = myPaddleY;
		opponentPaddle.x = opponentPaddleX;
		opponentPaddle.y = opponentPaddleY;
		opponent2Paddle.x = opponent2PaddleX;
		opponent2Paddle.y = opponent2PaddleY;
		opponent3Paddle.x = opponent3PaddleX;
		opponent3Paddle.y = opponent3PaddleY;
		console.log("p3x" + opponent2Paddle.x);
		console.log("p3y" + opponent2Paddle.y);
		console.log("p4x" + opponent3Paddle.x);
		console.log("p4y" + opponent3Paddle.y);
	}


	var render = function() {
	
		var context = playArea.getContext("2d");

		
		context.clearRect(0, 0, playArea.width, playArea.height);

		
		context.fillStyle = "#000000";
		context.fillRect(0, 0, playArea.width, playArea.height);

		
		context.fillStyle = "#ffffff";
		context.beginPath();
		context.arc(ball.x, ball.y, Ball.WIDTH, 0, Math.PI*2, true);
		context.closePath();
		context.fill();

	

		context.fillStyle = "#ffff00";
		context.fillRect(myPaddle.x - Paddle.WIDTH/2, 
						myPaddle.y - Paddle.HEIGHT/2,
						Paddle.WIDTH, Paddle.HEIGHT);
		context.fillRect(opponentPaddle.x - Paddle.WIDTH/2, 
						opponentPaddle.y - Paddle.HEIGHT/2,
						Paddle.WIDTH, Paddle.HEIGHT);
		context.fillRect(opponent2Paddle.x - Paddle2.WIDTH/2,opponent2Paddle.y - Paddle2.HEIGHT/2,
						Paddle2.WIDTH, Paddle2.HEIGHT);
		context.fillRect(opponent3Paddle.x - Paddle2.WIDTH/2,opponent3Paddle.y - Paddle2.HEIGHT/2,
						Paddle2.WIDTH, Paddle2.HEIGHT);
	}


	this.start = function() {
		// Initialize game objects
		ball = new Ball();
		myPaddle = new Paddle(Pong.HEIGHT);
		opponentPaddle = new Paddle(Paddle.HEIGHT);
		opponent2Paddle = new Paddle2(Paddle2.WIDTH);
		opponent3Paddle = new Paddle2(Pong.WIDTH);
		delay = 0;

	
		
		initNetwork();
		initGUI();

		
		setInterval(function() {render();}, 1000/Pong.FRAME_RATE);
	}
}


var lib_path = "./";
loadScript(lib_path, "Ball.js");
loadScript(lib_path, "Paddle.js");
loadScript(lib_path, "Paddle2.js");
loadScript("", "http://" + Pong.SERVER_NAME + ":" + Pong.PORT + "/socket.io/socket.io.js");


var client = new PongClient();
setTimeout(function() {client.start();}, 1000);

// vim:ts=4
