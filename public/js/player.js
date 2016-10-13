var link_list = [];
var currentVideo = 0;
var video;
var source;
var videoDir;
var screen;

$(document).ready(function()    {
	$('body').css('cursor', 'none');
	startSocketCommunication();
    video = $('video')[0];
    initVideo(video);
});

function startSocketCommunication() {
	var socket = io.connect('http://localhost:3000');
	socket.emit('message', 'salut from client');
	
	socket.on('msg', function(url_video) {
		//refreshPlayer(msg);
		console.log('add video : '+url_video);
		addVideo(url_video);
		if(link_list.length == 1) {
			console.log('first video ');
			playVideo(0,video);
		}
	});
}

function initVideo(video) {
	currentVideo = 0;
	video.addEventListener('error', function(event) { 
		console.log(link_list);
		link_list = jQuery.grep(link_list, function(value) {
			console.log(value);
			console.log(value != currentVideo)
			  return value.toString() != currentVideo.toString();
			});
		if ((currentVideo + 1) >= link_list.length) { 
			nextVideo = 0; 
		} else { 
			nextVideo = currentVideo+1; 
		}
	    playVideo(nextVideo, video);
	}, true);
	video.addEventListener('ended', function () {
		if ((currentVideo + 1) >= link_list.length) { 
			nextVideo = 0; 
		} else { 
			nextVideo = currentVideo+1; 
		}
	    playVideo(nextVideo, video);
	});
console.log('init video');
    source = video.getElementsByTagName("source");
	videoDir = "../videos/";
	video.removeAttribute("controls");
	video.removeAttribute("poster");
	console.log('starting player ....');
}

function addVideo(newVideo) {
	link_list[link_list.length] = newVideo;
}



function refreshPlayer(newVideo) {
	if(newVideo == null) return;
	
	playVideo(0, video);
  
}

function playVideo(index, video) {
	    source[0].src = videoDir + link_list[index];  
	    currentVideo = index;
	    video.load();
		video.play();
	}
