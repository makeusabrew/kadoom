StateManager = function() {
    this.world = null;
    this.players = [];
};

StateManager.prototype.init = function() {
    this.world = require("./shared/world").factory();
};

StateManager.prototype.addPlayer = function(p) {
    this.players.push(p);
};

StateManager.prototype.loadWorldFromData = function(data) {
    this.world.loadFromData(data);
};

StateManager.prototype.getCurrentState = function(sessionId) {
    return {
        'world': this.world.getCurrentState(sessionId),
        'players': this.getPlayerStates(sessionId)
    };
};

StateManager.prototype.getPlayerStates = function(sessionId) {
    var states = [];
    for (var i = 0; i < this.players.length; i++) {
        states.push(this.players[i].getCurrentState(sessionId));
    }
    return states;
};

StateManager.factory = function() {
    return new StateManager();
};

exports.factory = StateManager.factory;
