Bullet = function() {
    /**
     * private
     */
    var _x,
        _y,
        _a,
        _v,
        _o;

    /**
     * public
     */
    this.spawn = function(options) {
        _x = options.x;
        _y = options.y;
        _a = options.a;
        _v = options.v;
        _o = options.o;
        if (typeof require === "function") {
            var e = stateManager._eventEmitter;
            require("util").debug("sending notification");
            e.emit("bulletSpawn", this.getCurrentState());
        }
    };

    this.getCurrentState = function() {
        return {
            x: _x,
            y: _y,
            a: _a,
            v: _v,
            o: _o
        };
    };

    this.getOwnerId = function() {
        return _o;
    };

    this.move = function() {
        _x +=  Math.cos((this.a/180)*Math.PI) * _v;
        _y += Math.sin((this.a/180)*Math.PI) * _v;
    };
};

Bullet.factory = function() {
    return new Bullet();
};

if (typeof exports !== "undefined") {
    exports.factory = Bullet.factory;
}
