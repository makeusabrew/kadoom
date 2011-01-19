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

Camera.prototype.clipToBounds = function(x, y) {
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > x - this.width) {
        this.x = x - this.width;
    }

    if (this.y < 0) {
        this.y = 0;
    } else if (this.y > y - this.height) {
        this.y = y - this.height;
    }
};

Camera.factory = function() {
    return new Camera();
}
