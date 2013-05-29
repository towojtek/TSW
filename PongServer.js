


var lib_path = "./";
require(lib_path + "Pong.js");
require(lib_path + "Ball.js");
require(lib_path + "Paddle.js");
require(lib_path + "Player.js");
require(lib_path + "Paddle2.js");
  
function PongServer() {
	
	var port;						
	var count;						
	var nextPID;					
	var gameInterval = undefined;	
	var ball;						
	var players;					
									
									
									
	/*===================
	  getPlayer [Private]
	  ===================*/
	var getPlayer = function(pid) {
		
		for (p in players) {
			if (players[p].pid === pid)
				return players[p];
		}
	}

	/*===================
	  resetGame [Private]
	  ===================*/
	var resetGame = function() {
		
		clearInterval(gameInterval);
		gameInterval = undefined;
	}

	/*===================
	  gameLoop [Private]
	  ===================*/
	var gameLoop = function() {
		
		if (ball.isMoving()) {
			
			var p1 = getPlayer(1);
			var p2 = getPlayer(2);
			var p3 = getPlayer(3);
			var p4 = getPlayer(4);
			
			
			ball.moveOneStep(p1.paddle, p2.paddle, p3.paddle, p4.paddle);

			
			var tempBallx = ball.x;
			var tempBally = ball.y;
			var tempp1Paddlex = p1.paddle.x;
			var tempp1Paddley = p1.paddle.y;
			var tempp2Paddlex = p2.paddle.x;
			var tempp2Paddley = p2.paddle.y;
			var tempp3Paddlex = p3.paddle.x;
			var tempp3Paddley = p3.paddle.y;
			var tempp4Paddlex = p4.paddle.x;
			var tempp4Paddley = p4.paddle.y;
			
			/*console.log("p3.paddle.x:"+ p3.paddle.x);
			console.log("p3.paddle.y:"+ p3.paddle.y);
			console.log("p4.paddle.x:"+ p4.paddle.x);
			console.log("p4.paddle.x:"+ p4.paddle.y);*/
			// Update on player side
			
		
					setTimeout(function() {
				io.sockets.socket(p1.sid).emit('update', {
					ballX: tempBallx,
					ballY: tempBally,
					myPaddleX: tempp1Paddlex,
					myPaddleY: tempp1Paddley,
					opponentPaddleX: tempp2Paddlex,
					opponentPaddleY: tempp2Paddley,
					opponent2PaddleX: tempp3Paddlex,
					opponent2PaddleY: tempp3Paddley,
					opponent3PaddleX: tempp4Paddlex,
					opponent3PaddleY: tempp4Paddley});
					},
					p1.getDelay());
			setTimeout(function() {
				io.sockets.socket(p2.sid).emit('update', {
					ballX: tempBallx,
					ballY: tempBally,
					myPaddleX: tempp1Paddlex,
					myPaddleY: tempp1Paddley,
					opponentPaddleX: tempp2Paddlex,
					opponentPaddleY: tempp2Paddley,
					opponent2PaddleX: tempp3Paddlex,
					opponent2PaddleY: tempp3Paddley,
					opponent3PaddleX: tempp4Paddlex,
					opponent3PaddleY: tempp4Paddley});
					},
					p2.getDelay());
			setTimeout(function() {
				io.sockets.socket(p3.sid).emit('update', {
					ballX: tempBallx,
					ballY: tempBally,
					myPaddleX: tempp1Paddlex,
					myPaddleY: tempp1Paddley,
					opponentPaddleX: tempp2Paddlex,
					opponentPaddleY: tempp2Paddley,
					opponent2PaddleX: tempp3Paddlex,
					opponent2PaddleY: tempp3Paddley,
					opponent3PaddleX: tempp4Paddlex,
					opponent3PaddleY: tempp4Paddley});
					},
					p3.getDelay());
			setTimeout(function() {
				io.sockets.socket(p4.sid).emit('update', {
					ballX: tempBallx,
					ballY: tempBally,
					myPaddleX: tempp1Paddlex,
					myPaddleY: tempp1Paddley,
					opponentPaddleX: tempp2Paddlex,
					opponentPaddleY: tempp2Paddley,
					opponent2PaddleX: tempp3Paddlex,
					opponent2PaddleY: tempp3Paddley,
					opponent3PaddleX: tempp4Paddlex,
					opponent3PaddleY: tempp4Paddley});
					},
					p4.getDelay());		
			
		}else {
			
			resetGame();
		}
	}

	
	this.start = function() {
		try {
		
			port = Pong.PORT;
			
			
			io = require('socket.io').listen(port, {
					'log level':2 
			});

			count = 0;
			nextPID = 1;
			gameInterval = undefined;
			ball = new Ball();
			players = new Object;
			
			/*----------------------
			  Socket Event Listeners
			  ----------------------*/
			// Upon connection established from a client socket
			io.sockets.on('connection', function (socket) {
				count++;

				// Sends to client
				socket.emit('serverMsg', {msg: "There is now " + count + " players."});

				if (count > 4) {
					// Send back message that game is full
					socket.emit('serverMsg', {msg: "Sorry, game full. Come back another time!"});

					// Force a disconnect
					socket.disconnect();
					count--;
				} else {
					// Sends to everyone connected to server except the client
					socket.broadcast.emit('serverMsg', {msg: "There is now " + count + " players."});
					
					// 1st player is always top, 2nd player is always bottom
					var watchPaddle;/* = (nextPID === 1) ? "top" : "bottom";*/
					var startPos;
					if(nextPID ===1){ watchPaddle = "top"; startPos = Paddle.HEIGHT;}
					if(nextPID ===2){ watchPaddle = "bottom"; startPos = Pong.HEIGHT;}
					if(nextPID ===3){ watchPaddle = "left"; startPos = (Paddle2.WIDTH);}
					if(nextPID ===4){ watchPaddle = "right"; startPos = (Pong.WIDTH);}
					//var startPos = (nextPID === 1) ? Paddle.HEIGHT : Pong.HEIGHT;

					// Send message to new player (the current client)
					socket.emit('serverMsg', {msg: "You are Player " + nextPID + ". Your paddle is at the " + watchPaddle + startPos});					

					// Create player object and insert into players with key = socket.id
					
					players[socket.id] = new Player(socket.id, nextPID, startPos);
					console.log("Players" + players[socket.id].pid);
					// Updates the nextPID to issue (flip-flop between 1 and 2)
					//nextPID = ((nextPID + 1) % 2 === 0) ? 2 : 1;
					nextPID = nextPID + 1;
					if(nextPID === 5) nextPID = 1;
				}

				// When the client closes the connection to the server/closes the window
				socket.on('disconnect',
					function(e) {
						// Stop game if it's playing
						if (gameInterval !== undefined) {
							resetGame();
						}

						// Decrease count
						count--;

						// Set nextPID to quitting player's PID
						nextPID = players[socket.id].pid;

						// Remove player who wants to quit/closed the window
						delete players[socket.id];

						// Sends to everyone connected to server except the client
						socket.broadcast.emit('serverMsg', {msg: "There is now " + count + " players."});
					});

				// Upon receiving a message tagged with "start", along with an obj "data" (the "data" sent is {}. Refer to PongClient.js)
				socket.on('start',
					function(data) {
						if (gameInterval !== undefined) {
							console.log("Already playing!");
						} else if (Object.keys(players).length < 4) {
							console.log("Not enough players!");
							socket.emit('serverMsg', {msg: "Not enough players!"});
						} else {
							console.log("Let the games begin!");
							ball.startMoving();
							gameInterval = setInterval(function() {gameLoop();}, 1000/Pong.FRAME_RATE);
						}
					});

				// Upon receiving a message tagged with "move", along with an obj "data"
				socket.on('move',
					function(data) {
						setTimeout(function() {
							if(players[socket.id].pid === 1 || players[socket.id].pid === 2)
							players[socket.id].paddle.move(data.x);
						},
						players[socket.id].getDelay());
					});
				socket.on('move2',
					function(data) {
						setTimeout(function() {
							if(players[socket.id].pid === 3 || players[socket.id].pid === 4)
							players[socket.id].paddle.move2(data.y);
						},
						players[socket.id].getDelay());
					});
				// Upon receiving a message tagged with "delay", along with an obj "data"
				socket.on('delay',
					function(data) {
						players[socket.id].setDelay(data.delay);
					});
			});
		} catch (e) {
			console.log("Cannot listen to " + port);
		}
	}
}

// "public static void main(String[] args)"
// This will auto run after this script is loaded
var gameServer = new PongServer();
gameServer.start();

// vim:ts=4
