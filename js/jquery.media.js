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
                'js/dancer/dancer.min.js',
                'js/dancer/kick.js',
                'js/dancer/adapterWebkit.js',
                'js/dancer/adapterMoz.js'
                ],
            complete: function() {
                try {
                    dancer = new Dancer();
                    dancer
                        .load(audio)
                        .onceAt(22, function() {
                            self.demo.$preintro.tweenViewport()
                        })
                        .onceAt(44, function() {
                            self.demo.second_run();
                        })
                        .onceAt(175, function() {
                            console.log('triggering stop-hellnight');
                            $('#body_container').trigger('stop-hellnight');
                        })
                        .onceAt(218, function() {
                            if ($('div.iframe').is(":visible")) {
                                $('#body_container').trigger('visual-done');
                            }
                        });

                    if (dancer.isLoaded()) {
                        dancer.play();
//                        dancer.setVolume(0);
                        deferred.resolve();
//                        var int=window.setInterval(function(){$('div.time').html(dancer.getTime())},1000);
                        $('#audio').bind('ended', function() {
                            $('div.outro').fadeOut();
//                            window.clearInterval(int);
                        });

                        $('div.body').data('dancer', dancer);
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
