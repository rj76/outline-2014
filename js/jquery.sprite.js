(function ($) {
    $.sprite = function(demo) {
        this.demo = demo;
    };

    $.sprite.prototype.start = function() {
        var d = new $.Deferred();
        var self = this;
        $('div.body').fadeOut(function() {
            Modernizr.load({
                load: [
                    'js/sprite/Animation.js',
                    'js/sprite/FrameTimer.js',
                    'js/sprite/SpriteSheet.js'
                ],
                complete: function() {
                    var timer = new FrameTimer();
                    timer.tick();

                    var bg = new Image();
                    bg.src = 'img/rivercity-mall.gif';

                    var alpaca = new Image();
                    alpaca.src = 'img/alpaca.png'

                    var ctx = document.getElementById('sprite_canvas').getContext('2d');
                    var sprites = new SpriteSheet({
                        width: 32,
                        height: 32,
                        sprites: [
                            { name: 'stand' },
                            { name: 'walk_1', x: 0, y: 0 },
                            { name: 'walk_2', x: 0, y: 0 }
                        ]
                    });

                    var walk = new Animation([
                        { sprite: 'walk_1', time: 0.2 },
                        { sprite: 'stand', time: 0.2 },
                        { sprite: 'walk_2', time: 0.2 },
                        { sprite: 'stand', time: 0.2 }
                    ], sprites);
                    var kunioImage = new Image();
                    var alpaca_y = 90;
                    kunioImage.onload = function() {
                        $('#sprite_canvas').fadeIn();
                        var x_off = 0,alpaca_pos={x:500,y:alpaca_y},tween_started=false;
                        setInterval(function(){
                            walk.animate(timer.getSeconds());
                            var frame = walk.getSprite();
                            ctx.clearRect(0, 0, 400, 200);
                            ctx.drawImage(bg, x_off, 0, 503, 160);
                            ctx.drawImage(bg, bg.width-1-Math.abs(x_off), 0, 503, 160);

                            if (alpaca_pos.x <= 160 && !tween_started) {
                                TWEEN.removeAll();
                                tween_started = true;
                                console.log('starting tween');
                                var tween = new TWEEN.Tween(alpaca_pos)
                                    .to({y:alpaca_y-kunioImage.height-5}, 700)
//                                    .onUpdate(function() {camera.position.x=position.x;})
                                    .onComplete(function() {
                                        var tween = new TWEEN.Tween(alpaca_pos)
                                            .to({y:alpaca_y}, 800)
//                                            .onUpdate(function() {camera.position.x=position.x;})
                                            .onComplete(function() {
                                            });
                                        tween.start();
                                    });
                                tween.start();

                            }

                            ctx.drawImage(kunioImage, frame.x, frame.y, 32, 32, 100, 120, 32, 32);
                            ctx.drawImage(alpaca, alpaca_pos.x, alpaca_pos.y);

                            timer.tick();
                            x_off -= .5;
                            alpaca_pos.x -= .5;

                            if (Math.abs(x_off) > bg.width) x_off = 0;
                            if (alpaca_pos.x < -60) {
                                alpaca_pos.x = 500;
                                tween_started = false;
                            }
                            TWEEN.update();

                        }, 5);
                    };

                    kunioImage.src = 'img/kunio.gif';
                }
            });

            $('#body_container').on('end-sprite', function() {
                d.resolve();
            });
        });

        return d;
    };

}(jQuery));
