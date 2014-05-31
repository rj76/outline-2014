(function ($) {
    $.media = function(demo) {
        this.demo = demo;
    };

    $.media.prototype.start = function() {
        var deferred = new $.Deferred();
        var self = this;

        var
            dancer,
            audio  = document.getElementsByTagName('audio')[0];

        Modernizr.load({
            load: [
                'js/dancer/dancer.js',
                ],
            complete: function() {
                try {
                    var step = 23.2/ 4, $room_canvas = $('#canv_room');
                    dancer = new Dancer();
                    dancer
                        .onceAt(0, function() {
                            self.demo.$intro.start();
                        })

                        .onceAt(23.2, function() {
                            $room_canvas.trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+step, function() {
                            $room_canvas.trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+2*step, function() {
                            $room_canvas.trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+2.5*step, function() {
                            $room_canvas.trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+3*step, function() {
                            $room_canvas.trigger('room_intro_plusplus');
                        })

                        .onceAt(46.3, function() {
                            $room_canvas.trigger('switch_visual');
                        })
                        .onceAt(46.3+step*2, function() {
                            $room_canvas.trigger('stop_visual');
                            $room_canvas.trigger('switch_visual');
                        })
                        .onceAt(46.3+step*4, function() {
                            $room_canvas.trigger('stop_visual');
                            $room_canvas.trigger('switch_visual');
                        })
                        .onceAt(46.3+step*6, function() {
                            $room_canvas.trigger('stop_visual');
                            $room_canvas.trigger('switch_visual');
                        })
                        .onceAt(46.3+step*8, function() {
                            $room_canvas.trigger('stop_visual');
                            $room_canvas.trigger('switch_visual');
                        })
                        .onceAt(46.3+step*10, function() {
                            $room_canvas.trigger('stop_visual');
                            $room_canvas.trigger('switch_visual');
                        })
                        .onceAt(46.3+step*12, function() {
                            $room_canvas.trigger('stop_visual');
                            $room_canvas.trigger('switch_visual');
                        })
                        .onceAt(46.3+step*14, function() {
                            $room_canvas.trigger('stop_visual');
                            $room_canvas.trigger('switch_visual');
                        })

                        .onceAt(46.3+step*16, function() {
                            $room_canvas.trigger('stop_visual');
                            self.demo.$outro.start();
                        })

                        .onceAt(150.5, function() {
                        })
                        .onceAt(162.4, function() {
                            $('div.outro').fadeOut();
                        })
                        .load(audio)
                    ;

                    if (dancer.isLoaded()) {
                        dancer.play();
//                        dancer.setVolume(0);
                        deferred.resolve();
                    } else {
                    }

                } catch(err) {
                    console.log(err);
                    deferred.reject();
                }

                window.Dancer = dancer;
            }
        });

        return deferred;
    };


}(jQuery));
