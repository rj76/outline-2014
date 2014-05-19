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
                    dancer = new Dancer();
                    dancer
                        .onceAt(0, function() {
                            console.log('start intro');
                            self.demo.$intro.start();
                        })
                        .onceAt(23.2, function() {
                            $.when(self.demo.$room.start());
                            console.log('end intro, start beat/room start')
                        })
                        .onceAt(46.3, function() {
                            console.log('end intro, start tune1/triggering switch')
                            $('#canv_room').trigger('switch');
                        })
                        .onceAt(69.6, function() {
                            console.log('end tune1, start tune2/triggering switch')
                            $('#canv_room').trigger('switch');
                        })
                        .onceAt(92.7, function() {
                            console.log('end tune2, start tune3/triggering switch')
                            $('#canv_room').trigger('switch');
                        })
                        .onceAt(115.8, function() {
                            console.log('end tune3, start tune4/triggering switch')
                            $('#canv_room').trigger('switch');
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
