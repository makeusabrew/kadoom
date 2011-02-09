var Cookie = {

    read: function(key) {
        // read cookie jar
        var regex = new RegExp(key+"=([^;]+);?");
        var val = document.cookie.match(regex);
        if (val !== null) {
            return unescape(val[1]);
        }
        return false;
    },

    write: function(key, val) {
        document.cookie = key + "=" + val;
    }
};
