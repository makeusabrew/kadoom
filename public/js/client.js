var Client = {
    player: null,
    socket: null,

    init: function() {
        //
    },

    setViewport: function(options) {
        //
    },

    setPlayer: function(p) {
        Client.player = p;
    },

    connect: function() {
        Client.socket = new io.Socket();
        Client.socket.connect();
    }
};

