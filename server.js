var http = require('http');
var nodestatic = require('node-static');
var socketio = require('socket.io');

var file = new nodestatic.Server('./');

var server = http.createServer(function(request, response) {
	file.serveFile('input.html', 200, {}, request, response);
});

var io = socketio.listen(server);

io.on('connection', function(socket) {

	socket.emit('hello', {hello: 'world!'});

	socket.on('text change', function(data) {
		var action = data['action'];
		var line = data['linePosition'];
		var text = data['textdata'];

		socket.broadcast.emit('text update', {
			'action' : action,
			'lineNumber': line,
			'text' : text
		});
		

		/*
		console.log('ACTION: ' + action + '\n' + 
					'LINE:' + line + '\n' +
					'CHAR:' + text + '\n');
		*/

		//console.log(data);
	});

	socket.on('current text data', function(data) {
		var text = data['text'];

		socket.broadcast.emit('current text data', {'text' : text});
	});
});

server.listen(8000);