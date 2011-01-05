Player = function() {
    this.x = 0;
    this.y = 0;
    this.a = 0;
};

Player.prototype.init = function() {
    //
};

Player.prototype.factory = function() {
    return new Player();
}

if (typeof exports != "undefined") {
    exports.factory = Player.prototype.factory;
}
