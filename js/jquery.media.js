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
                        .onceAt(0, function() {
                            console.log('start intro');
                            self.demo.$intro.start();
                        })
                        .onceAt(23.2, function() {
                            console.log('end intro, start beat')
                        })
                        .onceAt(46.3, function() {
                            console.log('end intro, start tune1')
                        })
                        .onceAt(69.6, function() {
                            console.log('end tune1, start tune2')
                        })
                        .onceAt(92.7, function() {
                            console.log('end tune2, start tune3')
                        })
                        .onceAt(115.8, function() {
                            console.log('end tune3, start tune4')
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
                    ;

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
