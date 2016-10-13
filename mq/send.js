
var amqp = require('amqp');
var amqp_hacks = require('./amqp-hacks');

console.log('send.js');
var connection = amqp.createConnection({
	host : 'localhost'
});
connection.on('ready', function() {
	connection.publish('task_queue', 'Hello World!');
	console.log(" [x] Sent 'Hello World!'");
	amqp_hacks.safeEndConnection(connection);
});

console.log('end send.js');

