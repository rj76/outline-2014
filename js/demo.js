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
        this.$outro = new $.outro(this);

        $('div.body').on('start-sprite', function() {
            self.$sprite.start();
        });

    };

    $.demo.prototype.run = function () {
        var self = this;

        // this will fire events to get things started
        $.when(self.$media.start()).then(function () {});
    };

    var $demo = new $.demo();
    $demo.init();
    $demo.run();

}(jQuery));
