var amqp = require('amqp') 
,videoDownloader = require('../playermanager/videoDownloader')
;

var connection = amqp.createConnection({ host: 'dev.rabbitmq.com' });
var vl = new videoDownloader('./v.webm');


connection.on('ready', function () {
	console.log('connectin ready');
  connection.queue('my-queue', function (q) {
      // Catch all messages
      q.bind('#');

      // Receive messages
      q.subscribe(function (message) {
        // Print messages to stdout
    	  var campaign = JSON.parse(message.data.toString());
        console.log(campaign.id);
        console.log(campaign.url);
        vl.downlodFile(campaign.url,campaign.filename);
      });
  });
});
