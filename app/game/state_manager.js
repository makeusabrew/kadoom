StateManager = function() {
    this.world = null;
    this.players = {};
    this.cPlayerId = 0;
};

StateManager.prototype.init = function() {
    this.world = require("./shared/world").factory();
};

StateManager.prototype.addPlayer = function(p) {
    this.cPlayerId ++;
    p.setId(this.cPlayerId);
    this.players[this.cPlayerId] = p;
};

StateManager.prototype.loadWorldFromData = function(data) {
    this.world.loadFromData(data);
};

StateManager.prototype.getCurrentState = function() {
    return {
        'world': this.world.getCurrentState(),
        'players': this.getPlayerStates(),
        'playerId': this.cPlayerId
    };
};

StateManager.prototype.getPlayerStates = function() {
    var states = [];
    for (i in this.players) {
        states.push(this.players[i].getCurrentState());
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
