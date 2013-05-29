function PongClient() {
	/*=========
	  Variables
	  =========*/
	var socket;			// socket used to connect to server [Private]
	var playArea;		// HTML5 canvas game window [Private]
	var ball;			// ball object in game [Private]
	var myPaddle;		// player's paddle in game [Private]
	var opponentPaddle;	// opponent paddle in game [Private]
	var opponentPaddle2; //moja
	var opponentPaddle3; //moja
	var delay;			// delay simulated on current client [Private]

	/*=================
	  display [Private]
	  =================*/
	var display = function(location, msg) {
		// Adds the msg ON TOP of all the previous messages
		document.getElementById(location).innerHTML = msg; 
	}

	/*=================
	  appendLog [Private]
	  =================*/
	var appendLog = function(location, msg) {
		// Adds the msg ON TOP of all the previous messages
		var prev_msgs = document.getElementById(location).innerHTML;
		document.getElementById(location).innerHTML = "[" + new Date().toString() + "] " + msg + "<br />" + prev_msgs;
	}

	/*=====================
	  initNetwork [Private]
	  =====================*/
	var initNetwork = function() {
		// Attempts to connect to game server
		try {
			socket = io.connect("http://" + Pong.SERVER_NAME + ":" + Pong.PORT);


			// Upon disconnecting from server
			socket.on("disconnect", function() {
				console.log("You have disconnected from game server.");

				// Display information on HTML page
				appendLog("serverMsg", "You have disconnected from game server");
			});
			
			// Upon receiving a message tagged with "serverMsg", along with an obj "data"
			socket.on("serverMsg", function(data) {
				// for debugging.  Uncomment to display messages.
				// console.log(data.msg);
				appendLog("serverMsg", data.msg);
			});

			// Upon receiving a message tagged with "update", along with an obj "data"
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

		// Sets up the canvas element
		playArea = document.getElementById("playArea");
		playArea.height = Pong.HEIGHT;
		playArea.width = Pong.WIDTH;

		// Add event handlers
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

	/*===================================
	  onMouseMove [Private Event Handler]
	  ===================================*/
	var onMouseMove = function(e) {
		var canvasMinX = playArea.offsetLeft;
		var canvasMaxX = canvasMinX + playArea.width;
		var canvasMinY = playArea.offsetTop;
		var canvasMaxY = canvasMinX + playArea.height;
		var new_mouseX = e.pageX - canvasMinX;
		var new_mouseY = e.pageY - canvasMinY;

		// Send event to server
		socket.emit("move", {x: new_mouseX});
		socket.emit("move2", {y: new_mouseY});
	}

	/*====================================
	  onMouseClick [Private Event Handler]
	  ====================================*/
	var onMouseClick = function(e) {
		if (!ball.isMoving()) {
			//Send event to server
			socket.emit("start", {});
		}
		// else, do nothing. It's already playing!
	}

	/*==================================
	  onKeyPress [Private Event Handler]
	  ==================================*/
	var onKeyPress = function(e) {
		/*
		keyCode represents keyboard button
		38: up arrow
		40: down arrow
		37: left arrow
		39: right arrow
		*/
		switch(e.keyCode) {
			case 38: { // Up
				delay += 50;
				// Send event to server
				socket.emit("delay", {delay: delay});
				display("delay", "Delay to Server: " + delay + " ms");
				break;
			}
			case 40: { // Down
				if (delay >= 50) {
					delay -= 50;
					// Send event to server
					socket.emit("delay", {delay: delay});
					display("delay", "Delay to Server: " + delay + " ms");
				}
				break;
			}
		}
	}

	/*======================
	  updateStates [Private]
	  ======================*/
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

	/*===================
	  render [Private]
	  ===================*/
	var render = function() {
		// Get context
		var context = playArea.getContext("2d");

		// Clears the playArea
		context.clearRect(0, 0, playArea.width, playArea.height);

		// Draw playArea border
		context.fillStyle = "#000000";
		context.fillRect(0, 0, playArea.width, playArea.height);

		// Draw the ball
		context.fillStyle = "#ffffff";
		context.beginPath();
		context.arc(ball.x, ball.y, Ball.WIDTH, 0, Math.PI*2, true);
		context.closePath();
		context.fill();

		// Draw the paddle

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

	/*==================
	  start [Privileged]
	  ==================*/
	this.start = function() {
		// Initialize game objects
		ball = new Ball();
		myPaddle = new Paddle(Pong.HEIGHT);
		opponentPaddle = new Paddle(Paddle.HEIGHT);
		opponent2Paddle = new Paddle2(Paddle2.WIDTH);
		opponent3Paddle = new Paddle2(Pong.WIDTH);
		delay = 0;

	
		// Initialize network and GUI
		initNetwork();
		initGUI();

		// Start gameCycle
		setInterval(function() {render();}, 1000/Pong.FRAME_RATE);
	}
}

// "public static void main(String[] args)"
// This will auto run after this script is loaded

// Load libraries
var lib_path = "./";
loadScript(lib_path, "Ball.js");
loadScript(lib_path, "Paddle.js");
loadScript(lib_path, "Paddle2.js");
loadScript("", "http://" + Pong.SERVER_NAME + ":" + Pong.PORT + "/socket.io/socket.io.js");

// Run Client. Give leeway of 0.1 second for libraries to load
var client = new PongClient();
setTimeout(function() {client.start();}, 1000);

// vim:ts=4
