StateManager = function() {
    this.world = null;
    this.players = {};
};

StateManager.prototype.init = function() {
    this.world = require("./shared/world").factory();
};

StateManager.prototype.addPlayer = function(p) {
    this.players[p.id] = p;
};

StateManager.prototype.loadWorldFromData = function(data) {
    this.world.loadFromData(data);
};

StateManager.prototype.getCurrentState = function(sessionId) {
    return {
        'world': this.world.getCurrentState(sessionId),
        'players': this.getPlayerStates(sessionId),
        'sessionId': sessionId
    };
};

StateManager.prototype.getPlayerStates = function(sessionId) {
    var states = [];
    for (i in this.players) {
        states.push(this.players[i].getCurrentState(sessionId));
    }
    return states;
};

StateManager.prototype.movePlayer = function(data) {
    this.players[data.id].loadFromData(data);
};

StateManager.factory = function() {
    return new StateManager();
};

exports.factory = StateManager.factory;
