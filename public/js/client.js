var Client = {
    player: null,
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
    },

    setPlayer: function(p) {
        Client.player = p;
    },

    setWorld: function(w) {
        Client.world = w;
    },

    connect: function() {
        Client.socket = new io.Socket();
        Client.socket.connect();
        Client.socket.on("message", Client.onMessage);
    },

    onMessage: function(data) {
        var fn = data.type;
        if (typeof Client[fn] == "function") {
            Client[fn](data);
        } else {
            throw new TypeError("Client has no function "+data.type);
        }
    },

    loadWorld: function(data) {
        Client.world.loadFromData(data.worldData);
        Client.cacheWorldTiles();
        if (typeof Client.onReady == "function") {
            Client.onReady();
        }
    },

    render: function() {
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 15; j++) {
                var tile = Client.world.getTile(i, j);
                if (tile !== null) {
                    Client.surface.drawImage(Client.tileCache[tile], i*32, j*32, 32, 32);
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
