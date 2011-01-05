World = function() {
    this.cells = [];
};

World.prototype.loadMapFromData = function(d) {
    this.cells = d;
}

World.factory = function() {
    return new World();
}

if (typeof exports != "undefined") {
    exports.factory = World.factory;
}
