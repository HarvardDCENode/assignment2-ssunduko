const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

var content = require('./associate-content-type');

var server = http.createServer((req, res) => {
	console.log(req.url);

	// parse the URL into its component parts
	const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
	console.log(parsedUrl);
	// extract the pathname and query properties
	const { pathname, query } = parsedUrl;

	// output absolute path info
	console.log('__dirname is %s', __dirname);
	console.log('cwd is %s', process.cwd());

	var contentType = 'text/plain';
	// Extract the filename extension
	//  then set the mimetype if it is known
	var extname = String(path.extname(pathname)).toLowerCase();

	contentType = content(extname) || contentType;


	parsedUrl.searchParams.forEach(function(value, key) {
		console.log(key +": "+ value);
	});


	// Create an absolute path to the requested file.
	// Assume the server was started from the webroot
	const absolute_path_to_file = path.join(__dirname,"htdocs/"+pathname);
	console.log('absolute_path_to_file is %s', absolute_path_to_file);


	fs.readFile(absolute_path_to_file, (err, data) => {
		if (err) {
			console.log(err);
			if (err.code == 'ENOENT'){
				// file does not exist - we should return a 404 status code
				console.log('404 error getting ' + pathname);
				res.writeHead(404, {"Content-Type": "text/plain"});
				res.end('404: Page Not Found!');
			} else if (err.code == 'EISDIR'){
				// this is actually a directory - we should create a directory listing
				console.log('directory listing ' + pathname);
				fs.readdir(absolute_path_to_file, (err, files)=>{
					if (err) {
						res.writeHead(500, {"Content-Type": "text/plain"});
						res.end('Server Error 500');
					}
					let s = '<b>Directory Listing</b><br>';
					files.forEach((i)=>{
						s += (i + "<br>");
					});
					res.writeHead(200, {"Content-Type": "text/plain"});
					res.end(s, 'utf8');
				});
			}
		} else {
			// If we get to here, 'data' should contain the contents of the file
			res.writeHead(200, contentType);
			res.end(data, 'binary', ()=>{
				console.log("file delivered: " + pathname);
			});
		}
	});
});

var port = 8080;
server.listen(port, () => {
	console.log("Listening on " + port);
});