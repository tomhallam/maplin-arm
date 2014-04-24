maplin-arm
==========

Node.js // Socket.io control script for the Maplin USB Robot Arm "Arnold"

This simple script allows you to connect to your Maplin arm and control it using basic Socket.io commands. 
You can connect to port 8081 on the server you're running things from and issue comments in the following format:

	var socket = io.connect('http://localhost:8081');
	socket.emit('command', {
		'type': 'movement',
		'movement': 'base_cw' // moves the base clockwise for 1 second
	});

Feel free to fork and butcher the code. Requires `usb`, `socket.io` and `underscore`.
