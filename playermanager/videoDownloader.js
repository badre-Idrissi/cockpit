
var fs = require('fs'),http = require('http');
// Constructor
function VideoDownloader(dest) {
  this.dest = './public/videos/';
}
// class methods
VideoDownloader.prototype.downlodFile = function(url, filename, callback) {
	var full_file_name = this.dest+filename;
	var file = fs.createWriteStream(full_file_name);
	  var request = http.get(url, function(response) {
	    response.pipe(file);
	    file.on('finish', function() {
	      file.close();
	      console.log('downlod terminé')
	      callback(filename);
	    });
	  });
};

VideoDownloader.prototype.deleteFile = function(filename, callback) {
	var full_file_name = this.dest+filename;
	fs.unlink(full_file_name, function (err) {
		  if (err) throw err;
		  console.log('successfully deleted '+ full_file_name);
		  callback(filename);
		});
};

// export the class
module.exports = VideoDownloader;