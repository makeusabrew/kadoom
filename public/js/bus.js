/****************************************
 * Simple pub / sub wrapper
 ***************************************/

var Bus = (function() {
    var _listeners = {};
    var self = this;

    self.publish = function(topic, data) {
        if (typeof data == "undefined") {
            data = null;
        }

        if (typeof _listeners[topic] === "undefined") {
            // no listeners for topic. cya
            return;
        }

        var i = 0;
        var listeners = _listeners[topic];
        for (i = 0; i < listeners.length; i++) {
            listeners[i](data);
        }
    };

    self.subscribe = function(topic, callback) {
        if (typeof _listeners[topic] === "undefined") {
            _listeners[topic] = [];
        }
        _listeners[topic].push(callback);
    };

    return self;
})();
