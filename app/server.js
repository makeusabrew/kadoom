var http = require("http"),
    url = require("url"),
    path = require("path"),
    mime = require("./modules/mime");
    fs = require("fs");
/**
 * external dependancies
 */
var io = require("../deps/socket-io-node/lib/socket.io");

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
            var filename;
            if (cUrl.match(/\/js\/shared\/.*\.js/)) {
                filename = "app/game/"+cUrl.substr(10);
            } else {
                filename = path.join(WEBROOT, cUrl);
            }
            path.exists(filename, function(exists) {
                if (!exists) {
                    console.log("sending 404 for URL", cUrl);
                    response.writeHead(404, {'Content-Type':'text/html'});
                    response.write("Sorry, that page could not be found");
                    response.end();
                    return;
                }
                fs.readFile(filename, function (e, file) {
                    if (e) {
                        throw e;
                    }
                    response.writeHead(200, {
                        'Content-Length' : file.length,
                        'Content-Type' : mime.getType(filename)
                    });
                    response.write(file);
                    response.end();
                });
            });
            break;
    }
});

server.listen(8124);

console.log("Server running on port 8124");

var socket = io.listen(server);

/**
 * run once initialisation here
 */
var world = require("./game/world").factory();
var mapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
world.loadMapFromData(mapData);    // @todo how do we make this load from a file, given that world.js is exposed client side too?

socket.on("connection", function(socketClient) {
    var player = require("./game/player").factory();

    // give this client info about the world state. probably should just
    // consolodate this to world.getData() or something at some stage
    socketClient.send({
        'type': 'loadWorld',
        'mapData': mapData
    });
});
