/****************************************
 * Simple pub / sub wrapper
 ***************************************/

var Bus = {
    listeners: {},

    publish: function(topic, data) {
        if (typeof data == "undefined") {
            data = null;
        }

        if (typeof this.listeners[topic] === "undefined") {
            // no listeners for topic. cya
            return;
        }

        var i = 0;
        var listeners = this.listeners[topic];
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](data);
        }
    },

    subscribe: function(topic, callback) {
        if (typeof this.listeners[topic] === "undefined") {
            this.listeners[topic] = [];
        }
        this.listeners[topic].push(callback);
    }
}
        
