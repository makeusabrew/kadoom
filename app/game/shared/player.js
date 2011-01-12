Player = function() {
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.rotation = 0;
    this.velocity = 0;
    this.id = 0;
};

Player.prototype.init = function() {
    //
};

Player.prototype.setId = function(id) {
    this.id = id;
};

Player.prototype.getCurrentState = function(sessionId) {
    return {
        'x': this.x,
        'y': this.y,
        'a': this.a,
        'id': (this.id == sessionId) ? sessionId : 0
    };
};

Player.prototype.loadFromData = function(data) {
    this.x = data.x;
    this.y = data.y;
    this.a = data.a;
    this.id = data.id;
};

Player.prototype.move = function() {
    this.a += this.rotation;
    this.x +=  Math.cos((this.a/180)*Math.PI) * this.velocity;
    this.y += Math.sin((this.a/180)*Math.PI) * this.velocity;
};

Player.prototype.getPosition = function() {
    return {
        x: this.x,
        y: this.y
    }
};

Player.factory = function() {
    return new Player();
};

if (typeof exports != "undefined") {
    exports.factory = Player.factory;
}