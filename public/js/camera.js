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

Camera.factory = function() {
    return new Camera();
}
