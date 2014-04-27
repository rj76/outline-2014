(function ($) {
    $.intro = function(demo) {
        this.demo = demo;
    };

    $.intro.prototype.start = function() {
        var
            self=this,
            freq=.3,
            amp=10,
            canvas=document.getElementById("intro_canv"),
            ctx = canvas.getContext("2d")
            ;

        ctx.font = "24px Atari";
        ctx.textAlign = 'center';


        $('h1.header').one('show-h1-1', function() {
            $('h1.header').html("G'day fellow outliners")
                .textillate({
                    in: {
                        effect: 'fadeInLeftBig',
                        duration: 1000,
                        done: function() {
                            $('h1.header').fadeTo(500, 0, function() {
                                h2();
                            });
                        }
                    }
                })
        });

        function h2() {
            $('h1.header').replaceWith('<h1 class="header"></h1>').fadeTo(100, 1, function() {
                $('h1.header').html('This is a small demo').textillate({
                    in: {
                        effect: 'fadeInLeftBig',
                        duration: 2000,
                        done: function() {
                            $('h1.header').fadeTo(500, 0, function() {
                                h3();
                            });
                        }
                    }
                });
            });
        }

        function h3() {
            $('h1.header').replaceWith('<h1 class="header"></h1>').fadeTo(100, 1, function() {
                $('h1.header').html('as a tribute to the one game we all love')
                .textillate({
                    in: {
                        effect: 'fadeInLeftBig',
                        duration: 2000,
                        done: function() {
                            $('h1.header').fadeTo(500, 0, function() {
                                h4();
                            });
                        }
                    }
                })
            });
        }

        function h4() {
            $('h1.header').replaceWith('<h1 class="header"></h1>').fadeTo(100, 1, function() {
                $('h1.header').html('(I really tried not to screw it up)')
                .textillate({
                    in: {
                        effect: 'fadeInLeftBig',
                        duration: 2000,
                        done: function() {
                            $('h1.header').fadeTo(500, 0, function() {
                                h5();
                            });
                        }
                    }
                })
            });
        }

        function h5() {
            $('h1.header').replaceWith('<h1 class="header"></h1>').fadeTo(100, 1, function() {
                $('h1.header').html('(with this being my first demo and all)')
                .textillate({
                    in: {
                        effect: 'fadeInLeftBig',
                        duration: 1600,
                        done: function() {
                            $('h1.header').fadeTo(500, 0, function() {
                                show_svs();
                            });
                        }
                    }
                });
            });
        }

        function show_svs() {
            $('h1.header').replaceWith('<h1 class="header"></h1>').fadeTo(100, 1, function() {
                $('h1.header').html('Spy vs. Spy')
                .textillate({
                    in: {
                        effect: 'fadeInLeftBig',
                        duration: 1600,
                        done: function() {
                            $('div.intro').fadeOut(function() {
                                $('h1.header').css('color', '#000');
                                $('div.intro').css('background-image', 'url("img/svs-sm.png")');
                                $('div.intro').fadeIn();
                            })
                        }
                    }
                });
            });
        }

        // fire it
        $('h1.header').trigger('show-h1-1');

    }
}(jQuery));
