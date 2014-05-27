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
                    var step = 23.2/4;
                    dancer = new Dancer();
                    dancer
                        .onceAt(0, function() {
                            console.log('start intro');
                            self.demo.$intro.start();
                        })

                        .onceAt(23.2, function() {
                            console.log('end intro, start beat/room intro start (spy) 1/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+step, function() {
                            console.log('end intro, start beat/room intro start (cat) 2/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+2*step, function() {
                            console.log('end intro, start beat/room intro start (spy full) 3/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+2.5*step, function() {
                            console.log('end intro, start beat/room intro start (cat full) 4/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })
                        .onceAt(23.2+3*step, function() {
                            console.log('end intro, start beat/room intro start (both and out)5/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })

                        .onceAt(46.3, function() {
                            console.log('end intro, start tune1/triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*2, function() {
                            console.log('triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*4, function() {
                            console.log('end tune1, start tune2/triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*6, function() {
                            console.log('triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*8, function() {
                            console.log('end tune2, start tune3/triggering switch')
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*10, function() {
                            console.log('triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*12, function() {
                            console.log('end tune3, start tune4/triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*14, function() {
                            console.log('triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*16, function() {
                            console.log('triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(46.3+step*18, function() {
                            console.log('end tune4, start outro1')
                        })

                        .onceAt(150.5, function() {
                            console.log('end outro1, start outro2')
                        })
                        .onceAt(162.4, function() {
                            console.log('end outro2')
                        })
                        .load(audio)
                    ;

                    if (dancer.isLoaded()) {
                        dancer.play();
                        dancer.setVolume(0);
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
