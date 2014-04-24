 
 	// Set up the history container
 	var history = [];
 
	// Load in the USB module
	var usb = require('usb'),
		_   = require('underscore'),
		io  = require('socket.io').listen(8081);
	
	// First, try and find the arm device
	var arnold = usb.findByIds(0x1267, 0x000);
	
	// If we can't find Arnold, we's in trouble
	if(arnold.length == 0) {
		throw new Error("Arnold could not be detected. Ensure he's plugged in and there's batteries in his arse.");
	}
		
	arnold.open();
		
	// Start listening for actions
	io.sockets.on('connection', function(socket) {
	
		// Send welcome
		socket.emit('welcome');
	
		// Otherwise, the game is on.
		arnold.open();
	
		// Wait until we get a command, and execute it
		socket.on('command', function(command) {
		
			if(isNaN(command.duration) || command.duration <= 0) {
				command.duration = 1;
			}
		
			switch(command.type) {
				case 'movement':
					hey_arnold(command.duration, command.movement);
				break;
			}
		});
		
		// When they disconnect
		socket.on('disconnect', function() {
			arnold.close();
		});
		
	});
		
	// 
	function hey_arnold(duration, movement, callback) {
	
		var cmd = [], timeout = 0;
		switch(movement) {
			case 'base_cw':
				cmd = [0,2,0];
				timeout = 8;
			break;
			case 'base_ccw':
				cmd = [0,1,0];
				timeout = 8;
			break;
			case 'shoulder_up':
				cmd = [64,0,0];
			break;
			case 'shoulder_down':
				cmd = [128,0,0];
			break;
			case 'elbow_up':
				cmd = [16,0,0];
			break;
			case 'elbow_down':
				cmd = [32,0,0];
			break;
			case 'wrist_up':
				cmd = [4,0,0];
			break;
			case 'wrist_down':
				cmd = [8,0,0];
			break;
			case 'grip_open':
				cmd = [2,0,0];
			break;
			case 'grip_closed':
				cmd = [1,0,0];
			break;
			
			case 'noop':
			default:
				cmd = [0,0,0];
			break;
		}
		
		//
		console.log('Ok, executing ' + movement + ' for ' + duration + ' seconds');
		
		if(typeof history[movement] == 'undefined') {
			history[movement] = [];
		}
		
		//
		_.each(history, function(item) {
			console.log(item.command);
		});
		
		// Execute the command
		arnold.controlTransfer(0x40, 6, 0x100, 0, new Buffer(cmd), function() {
					
			// Wait after executing the command for (duration) seconds
			setTimeout(function() {
							
				// Stop
				arnold.controlTransfer(0x40, 6, 0x100, 0, new Buffer([0,0,0]));
				
				// Add the command and duration to the history
				history.push({
					'command': movement,
					'duration': duration
				});
				
				//socket.emit('command_complete', {});
				if(typeof callback == 'function') {
					callback.call(this);
				}
				
			}, (duration * 1000));
			
			
		});
		
		
	}
		