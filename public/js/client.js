var Client = {
    camera: null,
    player: null,
    players: {},
    socket: null,
    world: null,
    surface: null,
    playerHash: null,
    tileCache: {},

    init: function() {
        //
    },

    setViewport: function(options) {
        Client.surface = new Surface(options.buffer, options.width, options.height);
        Client.camera.setViewport({
            x: 0,
            y: 0,
            width: options.width,
            height: options.height
        });
    },

    tick: function() {
        Client.getPlayer().move();
        if (Client.getPlayer().hashState() != Client.playerHash) {
            Client.socket.send({
                'type':'playerMove',
                'data': Client.getPlayer().getCurrentState()
            });
            Client.playerHash = Client.getPlayer().hashState();
        }
    },

    processInput: function() {
        if (Input.isKeyDown("LEFT_ARROW")) {
            Client.getPlayer().rotation = -10;
        } else if (Input.isKeyDown("RIGHT_ARROW")) {
            Client.getPlayer().rotation = 10;
        } else {
            Client.getPlayer().rotation = 0;
        }

        if (Input.isKeyDown("UP_ARROW")) {
            Client.getPlayer().velocity = 10;
        } else if (Input.isKeyDown("DOWN_ARROW")) {
            Client.getPlayer().velocity = -10;
        } else {
            Client.getPlayer().velocity = 0;
        }
    },

    setCamera: function(c) {
        Client.camera = c;
    },

    setPlayer: function(p) {
        Client.player = p;
    },

    setWorld: function(w) {
        Client.world = w;
    },

    getPlayer: function() {
        return Client.player;
    },

    connect: function() {
        Client.socket = new io.Socket();
        Client.socket.connect();
        Client.socket.on("message", Client.onMessage);
    },

    onMessage: function(data) {
        if (typeof Client[data.type] == "function") {
            if (typeof data.data != "undefined") {
                Client[data.type](data.data);
            } else {
                throw new Error("Message has no data element");
            }
        } else {
            throw new TypeError("Client has no function "+data.type);
        }
    },

    loadState: function(data) {
        Client.world.loadFromData(data.world);
        Client.cacheWorldTiles();

        for(var i = 0; i < data.players.length; i++) {
            var p = Player.factory();
            p.loadFromData(data.players[i]);
            Client.players[p.id] = p;
            if (p.id == data.sessionId) {
                Client.player = p;
                Client.playerHash = Client.getPlayer().hashState();
            }
        }
        Bus.publish("client_ready");
    },

    addPlayer: function(data) {
        var p = Player.factory();
        p.loadFromData(data);
        Client.players[p.id] = p;
    },

    playerMove: function(data) {
        console.log(data);
        console.log(Client.players);
        Client.players[data.id].loadFromData(data);
    },

    render: function() {
        Client.camera.centreOnPosition(Client.getPlayer().getPosition());

        Client.surface.clear();
        var cX = Math.floor(Client.camera.x / 32);
        var cY = Math.floor(Client.camera.y / 32);
        var xOff = Client.camera.x % 32;
        var yOff = Client.camera.y % 32;

        //console.log("cX: "+cX+" cY: "+cY+" xOff: "+xOff+" yOff: "+yOff);

        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 15; j++) {
                var tile = Client.world.getTile(cX+i, cY+j);
                if (tile !== null) {
                    Client.surface.drawImage(Client.tileCache[tile], (i*32)-xOff, (j*32)-yOff, 32, 32);
                }
            }
        }
        
        for (i in Client.players) {
            p = Client.players[i];

            // draw an arrow in the most gorgeously graceful way ever!!
            var offset = Client.camera.getOffset(p.getPosition());
            var a = p.a;
            var x1 = offset.x + Math.cos((a/180)*Math.PI) * 25;
            var y1 = offset.y + Math.sin((a/180)*Math.PI) * 25;
            Client.surface.line(offset.x, offset.y, x1, y1, "rgb(255, 0, 0)");
            a = a - 30;
            var x2 = Math.cos((a/180)*Math.PI) * -10;
            var y2 = Math.sin((a/180)*Math.PI) * -10;
            Client.surface.line(x1, y1, x1 + x2, y1 + y2, "rgb(255, 0, 0)");
            a = a + 60;
            var x2 = Math.cos((a/180)*Math.PI) * -10;
            var y2 = Math.sin((a/180)*Math.PI) * -10;
            Client.surface.line(x1, y1, x1 + x2, y1 + y2, "rgb(255, 0, 0)");
        }
        
    },

    cacheWorldTiles: function() {
        for (i in Client.world.tiles) {
            var img = new Image(1, 1);
            img.src = "http://cdn.kadoom.org"+Client.world.tiles[i];
            Client.tileCache[i] = img;
        }
    }
};
