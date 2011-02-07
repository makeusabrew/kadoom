var Game = {
    fps: 30,
    tickHandler: null,
    frame: 0,
    lastTick: 0,
    tickTime: 0,

    renderStack: [],
    tickStack: [],
    inputStack: [],

    tick: function() {
        Game.processInput();
        Game.doTicks();
        Game.render();

        var t =  new Date().getTime();
        Game.tickTime = t - Game.lastTick;
        Game.frame ++;
    },

    registerRenderHandler: function(method) {
        Game.renderStack.push(method);
    },

    registerTickHandler: function(method) {
        Game.tickStack.push(method);
    },

    registerInputHandler: function(method) {
        Game.inputStack.push(method);
    },

    render: function() {
        for (var i = 0; i < Game.renderStack.length; i++) {
            Game.renderStack[i]();
        }
    },

    doTicks: function() {
        for (var i = 0; i < Game.tickStack.length; i++) {
            Game.tickStack[i]();
        }
    },

    processInput: function() {
        for (var i = 0; i < Game.inputStack.length; i++) {
            Game.inputStack[i]();
        }
    }
};
