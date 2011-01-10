World = function() {
    this.cells = [];
    this.tiles = {};
    this.width = 0;
    this.height = 0;
};

World.prototype.loadFromData = function(data) {
    this.cells = data.cells;
    this.tiles = data.tiles;
    this.width = this.cells[0].length;
    this.height = this.cells.length;
};

World.prototype.getTile = function(x, y) {
    if (x < this.width && y < this.height) { 
        return this.cells[y][x];
    }
    return null;
};

World.factory = function() {
    return new World();
}

if (typeof exports != "undefined") {
    exports.factory = World.factory;
}
