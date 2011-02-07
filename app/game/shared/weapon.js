if (typeof require === "function") {
    var Bullet = require("./bullet");
}
Weapon = function() {
    var _rof = 1000,
        _bVel = 10,
        _readyToFire = true,
        _readyToFireHandler = null;

    this.readyToFire = function() {
        return _readyToFire;
    };

    this.fire = function(options) {
        var bullet = Bullet.factory();
        bullet.spawn(options);
        options.v = _bVel;
        _readyToFire = false;
        _readyToFireHandler = setTimeout(function() {
            _readyToFire = true;
        }, _rof);
    };
};

Weapon.factory = function() {
    return new Weapon();
};

if (typeof exports !== "undefined") {
    exports.factory = Weapon.factory;
}
