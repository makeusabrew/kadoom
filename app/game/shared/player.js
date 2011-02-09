if (typeof require === "function") {
    var Weapon = require("./weapon");
}
Player = function() {
    var _id = 0,
        _x = 320,
        _y = 240,
        _a = 0,
        _rotation = 0,
        _velocity = 0,
        _wantsToFire = false,
        _cWeapon = 0,
        _weapons = {
            "0": Weapon.factory()
        };

    this.updateState = function(state) {
        _x = state.x;
        _y = state.y;
        _a = state.a;
    };

    this.setId = function(id) {
        _id = id;
    };

    this.getId = function() {
        return _id;
    };

    this.getCurrentState = function() {
        return {
            'x': _x,
            'y': _y,
            'a': _a,
            'w': _cWeapon,
            'id': _id
        };
    };

    // no different in initial state, for now
    this.getInitialState = this.getCurrentState;

    this.loadFromData = function(data) {
        _x = data.x;
        _y = data.y;
        _a = data.a;
        _id = data.id;
    };

    this.move = function() {
        _a += _rotation;
        _x +=  Math.cos((_a/180)*Math.PI) * _velocity;
        _y += Math.sin((_a/180)*Math.PI) * _velocity;
    };

    this.getPosition = function() {
        return {
            x: _x,
            y: _y
        }
    };

    this.hashState = function() {
        return "|"+_x+"|"+_y+"|"+_a+"|";
    };

    this.wantsToFire = function(val) {
        _wantsToFire = val;
    }

    this.waitingToFire = function() {
        _wantsToFire;
    };

    this.getWeapon = function() {
        _weapons[_cWeapon];
    };
    this.fireWeapon = function() {
        var opts = {
            x: _x,
            y: _y,
            a: _a,
            o: _id
        };
        this.getWeapon().fire(opts);
    };

    this.getAngle = function() {
        return _a;
    };

    this.setRotation = function(r) {
        _rotation = r;
    };

    this.setVelocity = function(v) {
        _velocity = v;
    };
};


Player.factory = function() {
    return new Player();
};

if (typeof exports != "undefined") {
    exports.factory = Player.factory;
}
