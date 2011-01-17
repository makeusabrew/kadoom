var http = require("http"),
    url = require("url"),
    path = require("path"),
    util = require("util"),
    mime = require("./modules/mime"),
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
            var isShared = false;
            if (cUrl.match(/\/js\/shared\/.*\.js/)) {
                filename = "app/game/shared/"+cUrl.substr(10);
                isShared = true;
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
var stateManager = require("./game/state_manager.js").factory();
stateManager.init();
// @todo move this to json encoded files instead
var worldData = {
    cells: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    tiles: {
        0: "/img/tiles/blank.png",
        1: "/img/tiles/wall.png"
    }
};

stateManager.loadWorldFromData(worldData);    // @todo how do we make this load from a file, given that world.js is exposed client side too?

socket.on("connection", function(socketClient) {
    var player = require("./game/shared/player").factory();
    stateManager.addPlayer(player);

    // inform other clients
    socketClient.broadcast({
        'type': 'addPlayer',
        'data': player.getCurrentState()
    });
    // give this client info about the world state. probably should just
    // consolodate this to world.getData() or something at some stage
    socketClient.send({
        'type': 'loadState',
        'data': stateManager.getCurrentState()
    });

    socketClient.on("message", function(data) {
        switch (data.type) {
            case 'playerMove':
                stateManager.movePlayer(data.data);
                socketClient.broadcast(data);
                break;
        }
    });

    socketClient.on("disconnect", function() {
        socketClient.broadcast({
            'type': 'removePlayer',
            'data': player.getCurrentState()
        });
    });
});
