(function ($) {
    var initialDelay = 100;
    $.outro = function (demo) {
        this.demo = demo;
    };

    $.outro.prototype.start = function() {
        var self = this;

        $('div.outro,div.outro-text').show();
        $('div.outro-text').css('left', ($(window).width()/2)-($('div.outro-text').width()/2)+'px');
        $('div.outro').fadeIn('slow', function() {
            $('h1.header,div.content,div.img,div.earth,div.body,#fft').hide();
            $('div.outro').css('opacity','100');
            $('div.canvas.atari').css('left', ($(window).width()/2)-(540/2)+'px');
            $('div.canvas.atari,div.outro-text').fadeTo(2000, 1, function() {
                showCode();
            });
        });
    }

    function showCode() {
        $('p.code span.title').textillate({
            initialDelay: initialDelay,
            in: {
                effect: 'fadeInLeftBig',
                done: function() {
                    $('p.code span.value span.content').textillate({
                        initialDelay: initialDelay,
                        in: {
                            effect: 'fadeInLeftBig',
                            done: showMusic
                        }
                    });
                }
            }
        });
    }

    function showMusic() {
        $('p.music span.title').textillate({
            initialDelay: initialDelay,
            in: {
                effect: 'fadeInLeftBig',
                done: function() {
                    $('p.music span.value span.content').each(function(i, el) {
                        $(this).textillate({
                            initialDelay: initialDelay,
                            in: {
                                effect: 'fadeInLeftBig',
                                done: function() {
                                    if (i==$('p.music span.value span.content').length-1) {
                                        showSupport();
                                    }
                                }
                            }
                        });
                    });
                }
            }
        });
    }

    function showSupport() {
        $('p.support span.title').textillate({
            initialDelay: initialDelay,
            in: {
                effect: 'fadeInLeftBig',
                done: function() {
                    $('p.support span.value span.content').each(function(i, el) {
                        $(this).textillate({
                            initialDelay: initialDelay,
                            in: {
                                effect: 'fadeInLeftBig',
                                done: function() {
                                    if (i==$('p.support span.value span.content').length-1) {
                                        showHello();
                                    }
                                }
                            }
                        });
                    });
                }
            }
        });
    }

    function showHello() {
        $('p.hello span.title').textillate({
            initialDelay: initialDelay,
            in: {
                effect: 'fadeInLeftBig',
                done: function() {
                    $('p.hello span.value span.content').each(function(i, el) {
                        $(this).textillate({
                            initialDelay: initialDelay,
                            in: {
                                effect: 'fadeInLeftBig',
                                done: function() {
                                }
                            }
                        });
                    });
                }
            }
        });
    }
}(jQuery));

