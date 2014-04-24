maplin-arm
==========

Node.js // Socket.io control script for the Maplin USB Robot Arm

This simple script allows you to connect to your Maplin arm and control it using basic Socket.io commands. 
You can connect to port 8081 on the server you're running things from and issue comments in the following format:

  	  socket.emit('command', {
	      'type': 'movement',
		    'movement': 'base_cw' // moves the base counter clockwise for 1 second (default)
	    });

