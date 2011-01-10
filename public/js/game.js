var Game = {
    fps: 30,
    tickHandler: null,

    renderStack: [],
    tickStack: [],
    inputStack: [],

    tick: function() {
        Game.processInput();
        Game.doTicks();
        Game.render();

        // yes, setInterval may seem more logical, but let's use setTimeout
        // so we can dynamically adjust at run time (maybe)
        Game.tickHandler = setTimeout(function() {
            Game.tick();
        }, 1000/Game.fps);
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
