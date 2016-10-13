$(document).ready(function()    {
	$('body').css('cursor', 'none');
	startSocketCommunication();
	VideoPlayer.init();
});

function startSocketCommunication() {
	var socket = io.connect('http://localhost:3000');
	socket.emit('message', 'salut from client');

	socket.on('addVideo', function(url_video) {
		VideoPlayer.addVideo(url_video);
		if(!VideoPlayer.started) VideoPlayer.play();
	});
	socket.on('initPlayList', function(playList) {
		VideoPlayer.initPlayList(playList);
		if(!VideoPlayer.started) VideoPlayer.play();
	});
}
var VideoPlayer = {
	 videoElement : document.getElementsByTagName("video"),
 	 videoDir : "../videos/",
	 playList : [],
	 current : 0,
	started : false,

	init : function(){
		var that = this;
		this.videoElement[0].removeAttribute("controls");
		this.videoElement[0].removeAttribute("poster");
		this.videoElement[0].addEventListener('ended', function () {
			that.next();
			that.play();
		});
	},
	addVideo : function(url){
		console.log('push video');
		this.playList.push(url);
	},
	initPlayList : function(playList) {
		this.playList = playList.split(',');
	},
	next : function() {
		this.current ++;
		if(this.current >= this.playList.length) {
			this.current = 0;
		}
	},
	play : function() {
		var source = this.videoElement[0].getElementsByTagName("source");
		source[0].src = this.videoDir + this.playList[this.current];
		this.videoElement[0].load();
		this.videoElement[0].play();
		this.started = true;
	}
}
