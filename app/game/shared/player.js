if (typeof require === "function") {
    var Weapon = require("./weapon");
}
Player = function() {
    this.x = 320;
    this.y = 240;
    this.a = 0;
    this.rotation = 0;
    this.velocity = 0;
    this.id = 0;
    this._wantsToFire = false;
    this._cWeapon = 0;
    this._weapons = {
        "0": Weapon.factory()
    };
};

Player.prototype.init = function() {
    //
};

Player.prototype.setId = function(id) {
    this.id = id;
};

Player.prototype.getId = function() {
    return this.id;
};

Player.prototype.getCurrentState = function() {
    return {
        'x': this.x,
        'y': this.y,
        'a': this.a,
        'w': this._cWeapon,
        'id': this.getId()
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
        y: this.y,
    }
};

Player.prototype.hashState = function() {
    return "|"+this.x+"|"+this.y+"|"+this.a+"|";
};

Player.prototype.wantsToFire = function(val) {
    this._wantsToFire = val;
}

Player.prototype.waitingToFire = function() {
    return this._wantsToFire;
};

Player.prototype.getWeapon = function() {
    return this._weapons[this._cWeapon];
};

Player.prototype.fireWeapon = function() {
    var opts = {
        x: this.x,
        y: this.y,
        a: this.a,
        o: this.getId()
    };
    this.getWeapon().fire(opts);
};

Player.factory = function() {
    return new Player();
};

if (typeof exports != "undefined") {
    exports.factory = Player.factory;
}
