var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
/**
 * external dependancies
 */
var io = require("../lib/socket-io-node/lib/socket.io");

/**
 * some constants we'll make use of serving files
 */
var WEBROOT = process.cwd()+"/public";

var server = http.createServer(function(request, response) {
    var cUrl = url.parse(request.url).pathname;

    switch (cUrl) {
        case '/':
            fs.readFile(WEBROOT+"/index.html", function(e, file) {
                if (e) {
                    throw e;
                }
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write(file);
                response.end();
            });
            break;
        default:
            console.log("sending 404 for URL", cUrl);
            response.writeHead(404, {'Content-Type':'text/html'});
            response.write("Sorry, that page could not be found");
            response.end();
            break;
    }
});

server.listen(8124);

console.log("Server running on port 8124");

var socket = io.listen(server);
