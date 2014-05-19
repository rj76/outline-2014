(function ($) {
    $.randomize = function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    };

    $.demo = function () {
    };

    $.demo.prototype.init = function () {
        var self = this;
        this.$media = new $.media(this);
        this.$intro = new $.intro(this);
        this.$room = new $.room();
        this.$outro = new $.outro(this);
    };

    $.demo.prototype.run = function () {
        var self = this;

        // this will fire events to get things started
        $.when(self.$media.start()).then(function () {});
    };

    window.demo = new $.demo();
    window.effects = new $.effects();

    window.demo.init();
    window.demo.run();

}(jQuery));
