var Client = {
    player: null,
    socket: null,
    world: null,

    init: function() {
        //
    },

    setViewport: function(options) {
        //
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
        Client.world.loadMapFromData(data.mapData);
    }
};
