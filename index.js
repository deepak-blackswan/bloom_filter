/* 
* @Author: deepak
* @Date:   2015-01-14 09:49:56
* @Last Modified by:   deepak
* @Last Modified time: 2015-01-14 18:35:59
*/

var fs 				= require("fs");							// get the filesystem module
var http 			= require("http");							// get the HTTP server module
var express 		= require("express");						// get express for added functionality
var app				= express();								// initialise express
var Bloom_filter	= require("./bloom_filter");				// get bloom xx filter module
 
// setup option for Bloom Filter
var options =
{
    bits: 1024,
    hashes: 7,
    seeds: [1, 2, 3, 4, 5, 6, 7]
};
filter = new Bloom_filter(options);				// create filter (refer to: https://github.com/ceejbot/xx-bloom)

filter = Bloom_filter.createOptimal();

// get our configuration variable
var config 		= JSON.parse(fs.readFileSync("./config.json"));
var host 		= config.host;
var port		= config.port; 

var input = fs.createReadStream("./wordlist-small.txt");
readLines(input);

function readLines(input) {
	var remaining 	= '';

  	input.on('data', function(data) {
    	
    	remaining += data;
    	var index  = remaining.indexOf('\n');
    
    	while (index > -1) {
      		
      		var line 	= remaining.substring(0, index);
      		remaining 	= remaining.substring(index + 1);
			
    		add(line);

      		index = remaining.indexOf('\n');
    	}
  	});

  	input.on('end', function() {
    	if (remaining.length > 0) {
      		add(remaining);
    	}
  	});
}

function add(data) {
  	filter.add(data)
}

function check(data){
	return filter.has(data);
}


app.get('/', function(req, res){
	
	console.log("Starting");
	var input = fs.createReadStream("./words");
	readLines(input, add_to_bloom);

	res.set('Content-Type', 'text/plain');
	res.status(200).send('Hello Sir! What can i do for you today?');
	res.end();

}); 

app.get('/check-item/:text', function(req, res){
	
	console.log(req.params.text);
	console.log(filter.has(req.params.text));
	
	if(check(req.params.text) === true){
		res.set('Content-Type', 'text/plain');
		res.status(200).send('Item found : ' + req.params.text);
		res.end();				
	 } else {
		res.set('Content-Type', 'text/plain');
		res.status(404).send('Item not found ');
	 	res.end();	
	 }

});

http.createServer(app).listen(port);