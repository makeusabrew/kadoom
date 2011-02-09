var Client = {
    camera: null,
    player: null,
    players: {},
    socket: null,
    world: null,
    surface: null,
    playerHash: null,
    tileCache: {},
    awaitingConfirmation: false,
    bullets: [],

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
        var player = Client.getPlayer();
        player.move();
    },

    processInput: function() {
        var player = Client.getPlayer();
        var rotation = 0;
        var velocity = 0;
        if (Input.isKeyDown("LEFT_ARROW")) {
            rotation = -10;
        } else if (Input.isKeyDown("RIGHT_ARROW")) {
            rotation = 10;
        }

        if (Input.isKeyDown("UP_ARROW")) {
            velocity = 10;
        } else if (Input.isKeyDown("DOWN_ARROW")) {
            velocity = -10;
        }

        if (Input.isKeyDown("SPACE_BAR")) {
            player.wantsToFire(true);
        } else {
            player.wantsToFire(false);
        }

        player.setRotation(rotation);
        player.setVelocity(velocity);
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
        if (typeof Client.receive[data.type] == "function") {
            if (typeof data.data != "undefined") {
                //console.log("received ["+data.type+"] with data:", data.data);
                Client.receive[data.type](data.data);
            } else {
                throw new Error("Message has no data element");
            }
        } else {
            throw new TypeError("Client has no receive function "+data.type);
        }
    },


    render: function() {
        var pos = Client.getPlayer().getPosition();
        Client.camera.centreOnPosition(Client.getPlayer().getPosition());
        Client.camera.clipToBounds(Client.world.width*32, Client.world.height*32);

        Client.surface.clear();
        var cX = Math.floor(Client.camera.x / 32);
        var cY = Math.floor(Client.camera.y / 32);
        var xOff = Math.floor(Client.camera.x) % 32;
        var yOff = Math.floor(Client.camera.y) % 32;

        for (var i = 0; i < 21; i++) {
            for (var j = 0; j < 16; j++) {
                var tile = Client.world.getTile(cX+i, cY+j);
                if (tile !== null) {
                    Client.surface.drawImage(Client.tileCache[tile], (i*32)-xOff, (j*32)-yOff, 32, 32);
                }
            }
        }
        
        var p,k;
        for (k in Client.players) {
            p = Client.players[k];

            // draw an arrow in the most gorgeously graceful way ever!!
            var offset = Client.camera.getOffset(p.getPosition());
            var a = p.getAngle();
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

        /*
        for (var i = 0; i < Client.bullets.length; i++) {
            var b = Client.bullets[i].getCurrentState();
            Client.surface.pixel(b.x, b.y, "rgb(0, 0, 255)");
        }
        */
        
    },

    cacheWorldTiles: function() {
        for (i in Client.world.tiles) {
            var img = new Image(1, 1);
            img.src = "http://cdn.kadoom.org"+Client.world.tiles[i];
            Client.tileCache[i] = img;
        }
    },

    getCurrentState: function() {
        return this.getPlayer().getCurrentState();
    },

    send: function(type, data) {
        this.socket.send({
            "type": type,
            "data": data
        });
    },

    queryServer: function() {
        this.send("stateUpdate", this.getCurrentState());
    },

    updateState: function(data) {
        var i;
        for (i = 0; i < data.players.length; i++) {
            var pdata = data.players[i];
            if (typeof Client.players[pdata.id] === "undefined") {
                console.log("not updating state for unknown player ID ["+pdata.id+"]");
                continue;
            }
            if (pdata.id != Client.getPlayer().getId()) {
                Client.players[pdata.id].updateState(pdata);
            }
        }
    },

    /**
     * any messages from the server should go here
     */
    receive: {
        stateUpdate: function(data) {
            // update
            Client.updateState(data);
            setTimeout(function() {
                Client.queryServer();
            }, 33);
        },

        initialState: function(data) {
            console.log("initial state", data);
            Client.world.loadFromData(data.world);
            Client.cacheWorldTiles();

            for(var i = 0; i < data.players.length; i++) {
                var pdata = data.players[i];
                var p = Player.factory();
                p.loadFromData(pdata);
                Client.players[pdata.id] = p;
                if (pdata.id == data.playerId) {
                    Client.player = p;
                }
            }
            Bus.publish("client:ready");
        },

        addPlayer: function(data) {
            console.log("adding player ID ["+data.id+"] with data:", data);
            var p = Player.factory();
            p.loadFromData(data);
            Client.players[p.getId()] = p;
        },

        removePlayer: function(data) {
            console.log("removing player ID ["+data+"]");
            delete Client.players[data];
        },

        playerMove: function(data) {
            Client.players[data.id].loadFromData(data);
        },

        bulletSpawn: function(data) {
            var b = new Bullet();
            b.spawn(data);
            if (b.getOwnerId() == Client.getPlayer().getId()) {
                Client.awaitingConfirmation = false;
            }
            Clients.bullets.push(b);
        }
    }
}
