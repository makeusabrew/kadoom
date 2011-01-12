Camera = function() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
};

Camera.prototype.setViewport = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
};

Camera.prototype.centreOnPosition = function(p) {
    this.x = p.x - (this.width / 2);
    this.y = p.y - (this.height / 2);
};

Camera.prototype.getOffset = function(p) {
    var oX = p.x - this.x;
    var oY = p.y - this.y;

    return {
        x: oX,
        y: oY
    };
};

Camera.factory = function() {
    return new Camera();
}
