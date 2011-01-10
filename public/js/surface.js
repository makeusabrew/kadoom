Surface = function(elem, w, h) {
    var elem = document.getElementById(elem);
    if (!elem.getContext) {
        throw new Error('Canvas not available');
    }

    this.elem = elem;
    this.buffer = elem.getContext("2d");
    this.setDimensions(w, h);
};

Surface.prototype.line = function(x, y, x1, y1, colour) {
    this.buffer.strokeStyle = colour;
    this.buffer.beginPath();
    this.buffer.moveTo(x, y);
    this.buffer.lineTo(x1, y1);
    this.buffer.closePath();
    this.buffer.stroke();
};

Surface.prototype.fillRect = function(x, y, w, h, colour) {
    this.buffer.fillStyle = colour;
    this.buffer.fillRect(x, y, w, h);
};

Surface.prototype.getWidth = function() {
    return this.buffer.canvas.clientWidth;
};

Surface.prototype.getHeight = function() {
    return this.buffer.canvas.clientHeight;
};

Surface.prototype.pixel = function(x, y, colour) {
    this.buffer.fillStyle = colour;
    this.fillRect(x - 0.5, y - 0.5, 1, 1);
};

Surface.prototype.setDimensions = function(w, h) {
   this.elem.width = w;
   this.elem.height = h;
};

Surface.prototype.drawImage = function(img, x, y, w, h) {
    this.buffer.drawImage(img, x, y, w, h);
};
