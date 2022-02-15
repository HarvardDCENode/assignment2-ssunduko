const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const alert = require('alert')

var content = require('./associate-content-type');

var server = http.createServer((req, res) => {

  	// parse the URL into its component parts
	const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  	// extract the pathname and query properties
	const { pathname, query } = parsedUrl;

	var local_key;
	var local_value;
	parsedUrl.searchParams.forEach(function(value, key) {
		console.log(key +": "+ value);
		alert(key +": "+ value);
	});

  	var extname = String(path.extname(pathname)).toLowerCase();
  	var contentType = content(extname)

	// Create an absolute path to the requested file.
	// Assume the server was started from the webroot
	const absolute_path_to_file = path.join(__dirname,"htdocs/"+pathname);

	fs.readFile(absolute_path_to_file, (err, data) => {

		res.writeHead(200, contentType);
		res.end(data, 'binary');
	});
});

server.listen(8080);
console.log("Listening on http://127.0.0.1:8080/");