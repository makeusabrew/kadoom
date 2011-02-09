var fs = require("fs"),
    util = require("util");

StateManager = function() {
   var _world = null;
   var _players = {};
   var _cPlayerId = 0;

    this.init = function() {
        _world = require("./shared/world").factory();
    };

    this.addPlayer = function(p, data) {
        _cPlayerId ++;
        p.setId(_cPlayerId);
        p.setUsername(data.username);
        _players[_cPlayerId] = p;
    };

    this.loadWorldFromData = function(data) {
        _world.loadFromData(data);
    };

    this.getInitialState = function() {
        return {
            'world': _world.getCurrentState(),
            'players': this.getInitialPlayerStates(),
            'playerId': _cPlayerId
        };
    };

    this.getCurrentState = function() {
        return {
            "players": this.getPlayerStates()
        };
    };

    this.getPlayerStates = function() {
        var states = [];
        for (i in _players) {
            states.push(_players[i].getCurrentState());
        }
        return states;
    };

    this.getInitialPlayerStates = function() {
        var states = [];
        for (i in _players) {
            states.push(_players[i].getInitialState());
        }
        return states;
    };

    /*
    this.firePlayer = function(data) {
        _players[data.id].fireWeapon();
    };
    */

    /*
    this.setupListeners = function() {
        var events = require("events");
        this. _eventEmitter = new events.EventEmitter();

        this._eventEmitter.on("bulletSpawn", function(b) {
            require("util").debug("got bullet info");
            this._bullets.push(b);
            this._socket.broadcast({
                "type": "bulletSpawn",
                "data": b.getCurrentState()
            });
        });
    };
    */

    this.loadData = function(file) {
        return JSON.parse(fs.readFileSync(file));
    };

    this.removePlayer = function(pId) {
        delete _players[pId];
    };

    this.setupSocket = function(socket) {
        var self = this;
        socket.on("connection", function(client) {
            // setup handlers for later
            client.on("message", function(msg) {
                self.onMessage(client, msg);
            });
            client.on("disconnect", function() {
                if (typeof client.player !== "undefined") {
                    client.broadcast({
                        'type': 'removePlayer',
                        'data': client.player.getId()
                    });
                    self.removePlayer(client.player.getId());
                }
            });
        });
    };

    this.onMessage = function(client, msg) {
        if (typeof this[msg.type] == "function") {
            if (typeof msg.data != "undefined") {
                //util.debug("received ["+msg.type+"] with data:", msg.data);
                this[msg.type](client, msg.data);
            } else {
                throw new Error("Message has no data element");
            }
        } else {
            throw new TypeError("Client has no receive function "+msg.type);
        }
    };

    /**
     * receive handlers
     */
    this.stateUpdate = function(client, data) {
        // okay, update anything the client gave us
        client.player.updateState(data);
        client.send({
            "type": "stateUpdate",
            "data": this.getCurrentState()
        });
    };

    this.newPlayer = function(client, data) {
        var player = require("./shared/player").factory();
        this.addPlayer(player, data);

        client.player = player;
        // inform other clients
        client.broadcast({
            'type': 'addPlayer',
            'data': client.player.getInitialState()
        });

        // tell new player what's going on
        client.send({
            "type": "initialState",
            "data": this.getInitialState()
        });
    },

    this.setUsername = function(client, data) {
        var username = decodeURIComponent(data.username);
        var isValid = (username.search(/^[a-z0-9]+$/) !== -1);
        util.debug("username value ["+username+"] - valid? ["+isValid.toString()+"]");
        client.send({
            "type": "setUsername",
            "data": {
                "valid": isValid,
                "username": username
            }
        });
    }

};

StateManager.factory = function() {
    return new StateManager();
};

exports.factory = StateManager.factory;
