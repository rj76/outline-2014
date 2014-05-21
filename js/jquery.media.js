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
                    var step = 23/8;
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
                        .onceAt(28.95, function() {
                            console.log('end intro, start beat/room intro start (cat) 2/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })
                        .onceAt(31.825, function() {
                            console.log('end intro, start beat/room intro start (spy full) 3/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })
                        .onceAt(34.7, function() {
                            console.log('end intro, start beat/room intro start (cat full) 4/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })
                        .onceAt(43.325, function() {
                            console.log('end intro, start beat/room intro start (both and out)5/5')
                            $('#canv_room').trigger('room_intro_plusplus');
                        })

                        .onceAt(46.3, function() {
                            console.log('end intro, start tune1/triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(69.6, function() {
                            console.log('end tune1, start tune2/triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(92.7, function() {
                            console.log('end tune2, start tune3/triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(115.8, function() {
                            console.log('end tune3, start tune4/triggering switch');
                            $('#canv_room').trigger('switch_visual');
                        })
                        .onceAt(138.9, function() {
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

    var last_time= 0, playing_d, last_time_cnt= 0, is_good=0;
    function checkPlaying() {
        if (!playing_d) playing_d=new $.Deferred(0)
        if (last_time==0) {
            window.Dancer.setVolume(0);
            window.Dancer.play();
            setTimeout(checkPlaying, 500);
        } else {
            last_time = window.Dancer.getTime();
            if (last_time == window.Dancer.getTime()) {
                if (last_time_cnt++ > 5) {
                    document.location.href=document.location.href;
                    playing_d.resolve();
                }
            } else {
                is_good++;
            }
        }
        return playing_d;
    }

}(jQuery));
