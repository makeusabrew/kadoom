var Client = {
    camera: null,
    player: null,
    players: [],
    socket: null,
    world: null,
    surface: null,
    onReady: null,
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
    },

    processInput: function() {
        if (Input.isKeyDown("LEFT_ARROW")) {
            Client.getPlayer().rotation += -10;
            console.log(Client.getPlayer().rotation);
        } else if (Input.isKeyDown("RIGHT_ARROW")) {
            Client.getPlayer().rotation += 10;
            console.log(Client.getPlayer().rotation);
        } else {
            Client.getPlayer().rotation = 0;
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
            Client.loadPlayer(data.players[i]);
        }
        Client.players = data.players;
        Bus.publish("client_ready");
    },

    loadPlayer: function(data) {
        var p = Player.factory();
        p.loadFromData(data);
        Client.players.push(p);
        if (data.id != 0) {
            Client.player = p;
        }
    },

    render: function() {
        var cX = Math.floor(Client.camera.x / 32);
        var cY = Math.floor(Client.camera.y / 32);
        var xOff = Client.camera.x % 32;
        var yOff = Client.camera.y % 32;

        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 15; j++) {
                var tile = Client.world.getTile(cX+i, cY+j);
                if (tile !== null) {
                    Client.surface.drawImage(Client.tileCache[tile], (i*32)-xOff, (j*32)-yOff, 32, 32);
                }
            }
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
