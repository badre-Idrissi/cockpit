
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	,videoDownloader = require('./playermanager/videoDownloader')
	, http = require('http')
	,fs = require('fs')
	,amqp = require('amqp')
	, path = require('path');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var html_dir = './public/html/';

//routes to serve the static HTML files
app.get('/', function(req, res) {
	res.sendfile(html_dir + 'index.html');
});

//app.get('/users', user.list);

app.get('/foo', function() {
	console.log('foo perforemed');
	io.sockets.emit('msg' , 'salut ');
});

var server = http.createServer(app);

//Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	console.log('Un client est connecté !');

	socket.on('message', function (message) {
		console.log('message from client :' + message );
	});

});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));

	//require('./mq/campaignConsumer');
});

///RabbitMq listener

var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'dev.rabbitmq.com' });
var vl = new videoDownloader('./v.webm');

connection.on('ready', function () {
	console.log('connection ready');
	connection.queue('Badre.IN.QUEUE', function (q) {
		// Catch all messages
		q.bind('#');
		// Receive messages
		q.subscribe(function (message) {
			// Print messages to stdout
			console.log('message');
			var campaign = JSON.parse(message.data.toString());
			vl.downlodFile(campaign.message.medias.url,campaign.message.medias.nomOriginal, postDownload);
		});
	});
});

function postDownload(filename) {
	console.log('callback ok');
	io.sockets.emit('msg' , filename);
}




/*
 {"id":0,"budget":1000.0,"message":{"id":0,"fluxTexte":{"id":0,"duree":0,"positionnement":0,"skin":"mySkin","text":"mytext"},"type":"avi"},"url":"http://demosthenes.info/assets/videos/glacier.webm","filename":"galcierJSon.webm"}

 http://dev.rabbitmq.com/mgmt/#/queues/%2F/my-queue


 {"id":0,"budget":1000.0,"ciblage":"Anchan cible","keywords":"auchan coca","dateDebut":"Mar 22, 2015 12:00:00 AM","dateFin":"Mar 30, 2015 12:00:00 AM","message":{"id":0,"fluxTexte":{"id":0,"duree":0,"positionnement":1,"skin":"mySkin","text":"Auchan publicitaire texte"},"medias":{"id":1,"duree":10,"md5":"e0d123e5f316bef78bfdf5a008837577","nomOriginal":"glacier.webm","url":"http://demosthenes.info/assets/videos/glacier.webm"},"type":"avi"}}
 * 
 * 
 * */

