

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
			
			io.sockets.on('connection', function (socket) {
				count++;

				
				socket.emit('serverMsg', {msg: "There is now " + count + " players."});

				if (count > 4) {
					
					socket.emit('serverMsg', {msg: "Sorry, game full. Come back another time!"});

					
					socket.disconnect();
					count--;
				} else {
					
					socket.broadcast.emit('serverMsg', {msg: "There is now " + count + " players."});
					
					
					var watchPaddle;
					var startPos;
					if(nextPID ===1){ watchPaddle = "top"; startPos = Paddle.HEIGHT;}
					if(nextPID ===2){ watchPaddle = "bottom"; startPos = Pong.HEIGHT;}
					if(nextPID ===3){ watchPaddle = "left"; startPos = (Paddle2.WIDTH);}
					if(nextPID ===4){ watchPaddle = "right"; startPos = (Pong.WIDTH);}
					

					
					socket.emit('serverMsg', {msg: "You are Player " + nextPID + ". Your paddle is at the " + watchPaddle + startPos});					

					
					
					players[socket.id] = new Player(socket.id, nextPID, startPos);
					console.log("Players" + players[socket.id].pid);
					
					nextPID = nextPID + 1;
					if(nextPID === 5) nextPID = 1;
				}

				
				socket.on('disconnect',
					function(e) {
						
						if (gameInterval !== undefined) {
							resetGame();
						}

						
						count--;

						
						nextPID = players[socket.id].pid;

						
						delete players[socket.id];

						
						socket.broadcast.emit('serverMsg', {msg: "There is now " + count + " players."});
					});

				
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


var gameServer = new PongServer();
gameServer.start();

// vim:ts=4
