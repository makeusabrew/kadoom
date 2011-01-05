Player = function() {
    this.x = 0;
    this.y = 0;
    this.a = 0;
};

Player.prototype.init = function() {
    //
};

Player.factory = function() {
    return new Player();
}

if (typeof exports != "undefined") {
    exports.factory = Player.factory;
}
