/**
 * A Message Box is designed to be bound to a block level DOM element
 *
 * Its main purpose is to provide a way to add messages to this element
 * whilst taking care of any animations/transitions as well as managing
 * message limits etc
 */
MessageBox = function(_elem) {
    /**
     * private
     */
    var _limit = 10,
        _buffer = [],
        _msgElem = "<div></div>";

     /**
      * public
      */
    this.addMessage = function(msg) {
        $(_elem).prepend($(_msgElem).html(msg));
    };
};
