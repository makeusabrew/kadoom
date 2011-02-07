var fs = require("fs");

StateManager = function() {
   var _world = null;
   var _players = {};
   var _cPlayerId = 0;

    this.init = function() {
        _world = require("./shared/world").factory();
    };

    this.addPlayer = function(p) {
        _cPlayerId ++;
        p.setId(_cPlayerId);
        _players[_cPlayerId] = p;
    };

    this.loadWorldFromData = function(data) {
        _world.loadFromData(data);
    };

    this.getCurrentState = function() {
        return {
            'world': _world.getCurrentState(),
            'players': this.getPlayerStates(),
            'playerId': _cPlayerId
        };
    };
    this.getPlayerStates = function() {
        var states = [];
        for (i in _players) {
            states.push(_players[i].getCurrentState());
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

    this. removePlayer = function(pId) {
        delete _players[pId];
    };

    this.setupSocket = function(socket) {
        var self = this;
        socket.on("connection", function(client) {
            var player = require("./shared/player").factory();
            self.addPlayer(player);

            // inform other clients
            client.broadcast({
                'type': 'addPlayer',
                'data': player.getCurrentState()
            });

            // greet client
            client.send({
                "type": "initialState",
                "data": self.getCurrentState()
            });

            // setup handlers for later
            client.on("message", function(msg) {
                self.onMessage(client, msg);
            });

            client.on("disconnect", function() {
                client.broadcast({
                    'type': 'removePlayer',
                    'data': player.getCurrentState()
                });
                self.removePlayer(player.getId());
            });
        });
    };

    this.onMessage = function(client, msg) {
        if (typeof _receive[msg.type] == "function") {
            if (typeof msg.data != "undefined") {
                _receive[msg.type](client, msg.data);
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
    var _receive = {
        stateUpdate: function(client, data) {
            // what's new for this client?
        }
    };
};

StateManager.factory = function() {
    return new StateManager();
};

exports.factory = StateManager.factory;
