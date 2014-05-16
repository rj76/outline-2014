(function ($) {
    var canvas = document.getElementById("canv"),
        ctx = canvas.getContext("2d"),
        canvas_hidden = document.getElementById("canv_hidden"),
        ctx_hidden = canvas_hidden.getContext("2d"),
        w = canvas.width,
        h = canvas.height,
        base_img,
        zoom=40,
        top=50,
        offset_left=50,
        line_width=2,
        len=(96-46.3),
        wait= (len/4)/10,
        colors = ['#d17ded', '#f9d99c'],
        coords_fill = [
            { type: 'moveto', x: 0, y: 5 },
            { type: 'lineto', x: 0, y: 1.5 },
            { type: 'lineto', x: 2, y: 0 },
            { type: 'lineto', x: 8, y: 0 },
            { type: 'lineto', x: 10, y: 1.5 },
            { type: 'lineto', x: 10, y: 5 },
            { type: 'lineto', x: 0, y: 5 }
        ],
        coords_innerlines = [
            { type: 'moveto', x: 0, y: 5 },
            { type: 'lineto', x: 2, y: 2.5 },
            { type: 'lineto', x: 8, y: 2.5 },
            { type: 'moveto', x: 2, y: 2.5 },
            { type: 'lineto', x: 2, y: 0 },
            { type: 'moveto', x: 8, y: 2.5 },
            { type: 'lineto', x: 8, y: 0 },
            { type: 'moveto', x: 8, y: 2.5 },
            { type: 'lineto', x: 10, y: 5 }
        ],
        doors = {
            left: {
                coords: [
                    { x: 0.8, y: 4 },
                    { x: 1.2, y: 3.5 },
                    { x: 1.2, y: 1.6 },
                    { x: 0.8, y: 2 }
                ],
                sprite: {
                    x: 0.8,
                    y: 3
                }
            },
            right: {
               coords: [
                    { x: 10-0.8, y: 4 },
                    { x: 10-1.2, y: 3.5 },
                    { x: 10-1.2, y: 1.6 },
                    { x: 10-0.8, y: 2 }
                ],
                sprite: {
                    x: 8.6,
                    y: 3
                }
            },
            back_left: {
                coords: [
                    { x: 3, y: 2.5 },
                    { x: 4, y: 2.5 },
                    { x: 4, y: .8 },
                    { x: 3, y: .8 }
                ],
                sprite: {
                    x: 3.2,
                    y: 2.5
                }
            },
            back_right: {
                coords: [
                    { x: 6, y: 2.5 },
                    { x: 7, y: 2.5 },
                    { x: 7, y: .8 },
                    { x: 6, y: .8 }
                ],
                sprite: {
                    x: 6.2,
                    y: 2.5
                }
            }
        },
        sprites = {
            spy: {
                speed: 1,
                zoom: 1.3,
                time: 0.2,
                wait: 5,
                num_images: 0,
                num_objects: 0,
                punch_right: {
                    s_w: 28,
                    s_h: 37,
                    img: 'img/sprites/punch-right.png'
                },
                walk_left: {
                    s_w: 32,
                    s_h: 37,
                    img: 'img/sprites/walk-left.png'
                },
                walk_right: {
                    s_w: 32,
                    s_h: 37,
                    img: 'img/sprites/walk-right.png'
                },
                walk_bw: {
                    s_w: 25,
                    s_h: 36,
                    img: 'img/sprites/walk-bw.png'
                },
                walk_fw: {
                    s_w: 25,
                    s_h: 36,
                    img: 'img/sprites/walk-fw.png'
                }
            }
        },
        wallpapers = [
            'img/wall/alpacaneck.jpg',
            'img/wall/knien.jpg',
            'img/wall/mandy.jpg',
            'img/wall/patrick.jpg',
            'img/wall/pony.png',
            'img/wall/trolvis.jpg',
            'img/wall/ghunter.jpg',
            'img/wall/alpacafluffy.jpg'
        ],
        wallpaper_objects = [],
        room_configs = ['lb', 'lr', 'rb'], // door: left and back (lb), left and right (lr), right and back (rb)
        active_config,
        tune_idx= 0,
        visuals=[],
        visuals_done=0
    ;

    $.room = function() {};
    $.room.prototype.start = function () {
        // load images
        $.when(loadWallpapers(), loadSprites()).then(function() {
            Modernizr.load({
                load: [
                    'js/sprite/Animation.js',
                    'js/sprite/FrameTimer.js',
                    'js/sprite/SpriteSheet.js',
                    'js/visuals/jquery.fractal_concentric.js',
                    'js/visuals/jquery.plasma.js'
                ],
                complete: function() {
                    visuals.push(new $.fractal_concentric);
                    visuals.push(new $.plasma);
                    visuals.push(new $.plasma);
                    visuals.push(new $.plasma);
                    doAll();
                }
            });
        });
    };

    function doAll() {
        // clear and fade in

        // create room config
        active_config = room_configs[randomIntFromInterval(0, room_configs.length-1)];
//                        active_config = 'lr';

        createRoom();
        createDoors();

        switch(active_config) {
            case 'lb':
                createPainting(2.5*zoom);
                break;
            case 'lr':
                createPainting(2.5*zoom);
                createPainting(5.5*zoom);
                break;

            case 'rb':
                createPainting(5.5*zoom);
                break;
        }

        base_img = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.putImageData(base_img, 0, 0);

        $.when(window.effects.regionAlphaToMaxCenterX({
            ctx: ctx, ctx_org: ctx_hidden, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            // move sprite through room
            $.when(moveSpy()).then(function() {
                $.when(window.effects.regionAlphaToMinCenterY({
                    ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
                }))
                .then(function() {
                    $.when(doVisual()).then(function() {
                        console.log('visual done');
                        if (tune_idx++<4 || visuals_done >= visuals.length) {
                            setTimeout(doAll, 10);
                        }
                    });
                });
            });
        });
    }

    function loadWallpapers() {
        var d = new $.Deferred();
        for(var i=0;i<wallpapers.length;i++) {
            var img = new Image();
            img.onload = function() {
                if (wallpaper_objects.length==wallpapers.length) d.resolve();
            };
            img.src = wallpapers[i];
            wallpaper_objects.push(img);
        }
        return d;
    }

    function loadSprites() {
        var d = new $.Deferred(), a = [], name;
        for(name in sprites.spy) if (typeof sprites.spy[name].img != 'undefined') a.push(sprites.spy[name].img);
        sprites.spy.num_images = a.length;
        for(name in sprites.spy) {
            if (typeof sprites.spy[name].img == 'undefined') continue;
            var img = new Image();
            img.onload = function() {
                sprites.spy.num_objects++;
                if (sprites.spy.num_objects==sprites.spy.num_images) d.resolve();
            };
            img.src = sprites.spy[name].img;

            sprites.spy[name].object = img;
        }
        return d;
    }

    function createRoom() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.lineJoin = "round";
        ctx.lineWidth = line_width;

        ctx.strokeStyle = '#000';
        ctx.fillStyle = colors[randomIntFromInterval(0, colors.length-1)];
        ctx.beginPath();
        moveOrDrawCoords(coords_fill);
        moveOrDrawCoords(coords_innerlines);
        ctx.fill();
        ctx.stroke();
    }

    function moveOrDrawCoords(coords) {
        for (var p=0;p<coords.length;p++) {
            if(coords[p].type == 'moveto') {
                ctx.moveTo(coords[p].x*zoom+offset_left, coords[p].y*zoom+offset_left);
            } else {
                ctx.lineTo(coords[p].x*zoom+offset_left, coords[p].y*zoom+top);
            }
        }
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function createPainting(offset_x) {
        var
            idx = Math.floor(Math.random()*(wallpaper_objects.length-1)+1),
            img = wallpaper_objects[idx],
            mode = img.height > img.width ? 'p' : 'l',
            offset_y = .2*zoom,
            width_x_min=1*zoom,
            width_x_max=1.5*zoom,
            height_y_min=.8*zoom,
            height_y_max=1.2*zoom,
            ratio, img_x, img_y
        ;

        if (mode == 'l') {
            // width can't be bigger than 2*zoom
            // pick ramdon width between 2*zoom and 1.5*zoom
            // adjust height to this factor and place image in center
            //
            var
                new_width = randomIntFromInterval(width_x_min, width_x_max)
            ;
            ratio = new_width/img.width;
            img_x = offset_left+offset_x+(width_x_max/2-new_width/2);
            img_y = offset_y+(4.5*zoom)/2-(img.height*ratio)/2;
            ctx.drawImage(img, img_x, img_y, img.width*ratio, img.height*ratio);
        }

        if (mode == 'p') {
            // height can't be bigger than 1.5*zoom
            var
                new_height = randomIntFromInterval(height_y_min, height_y_max)
            ;
            ratio = new_height/img.height;
            img_y = offset_y+1.5*zoom+(height_y_max/2-new_height/2);
            img_x = offset_left+offset_x+((img.width*ratio)/2);
            ctx.drawImage(img, img_x, img_y, img.width*ratio, img.height*ratio);
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(img_x, img_y);
        ctx.lineTo(img_x+img.width*ratio, img_y);
        ctx.lineTo(img_x+img.width*ratio, img_y+img.height*ratio);
        ctx.lineTo(img_x, img_y+img.height*ratio);
        ctx.lineTo(img_x, img_y);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.moveTo(img_x+(img.width*ratio)/2, img_y-.5*zoom);
        ctx.lineTo(img_x+(img.width*ratio)/3, img_y);
        ctx.moveTo(img_x+(img.width*ratio)/2, img_y -.5*zoom);
        ctx.lineTo(img_x+img.width*ratio-(img.width*ratio)/3, img_y);
        ctx.stroke();
    }

    function createDoors() {
        ctx.fillStyle = '#000';

        if (active_config=='lb' || active_config=='lr') {
            ctx.beginPath();
            ctx.moveTo(doors.left.coords[0].x*zoom+offset_left, doors.left.coords[0].y*zoom+offset_left);
            for(var i=0;i<doors.left.coords.length;i++) {
                ctx.lineTo(doors.left.coords[i].x*zoom+offset_left, doors.left.coords[i].y*zoom+top);
            }
            ctx.fill();
        }

        if (active_config=='rb' || active_config=='lr') {
            ctx.beginPath();
            ctx.moveTo(doors.right.coords[0].x*zoom+offset_left, doors.right.coords[0].y*zoom+offset_left);
            for(var i=0;i<doors.right.coords.length;i++) {
                ctx.lineTo(doors.right.coords[i].x*zoom+offset_left, doors.right.coords[i].y*zoom+top);
            }
            ctx.fill();
        }

        if (active_config=='rb') {
            ctx.beginPath();
            ctx.moveTo(doors.back_left.coords[0].x*zoom+offset_left, doors.back_left.coords[0].y*zoom+offset_left);
            for(var i=0;i<doors.back_left.coords.length;i++) {
                ctx.lineTo(doors.back_left.coords[i].x*zoom+offset_left, doors.back_left.coords[i].y*zoom+top);
            }
            ctx.fill();
        }

        if (active_config=='lb') {
            ctx.beginPath();
            ctx.moveTo(doors.back_right.coords[0].x*zoom+offset_left, doors.back_right.coords[0].y*zoom+offset_left);
            for(var i=0;i<doors.back_right.coords.length;i++) {
                ctx.lineTo(doors.back_right.coords[i].x*zoom+offset_left, doors.back_right.coords[i].y*zoom+top);
            }
            ctx.fill();
        }
    }

    function moveSpy() {
        var x, y, end_x, end_y, d = new $.Deferred();
        switch(active_config) {
            case 'lr':
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+doors.right.sprite.x*zoom;
                $.when(moveSpyRight({
                        x: x,
                        end_x: end_x,
                        y: y
                    })).then(function() {
                        d.resolve();
                });
                break;
            case 'rb':
                x = doors.right.sprite.x*zoom+offset_left;
                y = top+doors.right.sprite.y*zoom;
                end_x = offset_left+doors.back_left.sprite.x*zoom;
                end_y = doors.back_left.sprite.y*zoom;
                $.when(moveSpyLeft({
                        x: x,
                        end_x: end_x,
                        y: y
                    }))
                    .then(function() {
                        $.when(moveSpyBack({
                            x: end_x,
                            end_y: end_y,
                            y: y
                        }))
                        .then(function() {
                            d.resolve();
                        });
                    });
                break;
            case 'lb':
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+doors.back_right.sprite.x*zoom;
                end_y = doors.back_right.sprite.y*zoom;
                $.when(moveSpyRight({
                        x: x,
                        end_x: end_x,
                        y: y
                    }))
                    .then(function() {
                        $.when(moveSpyBack({
                            x: end_x,
                            end_y: end_y,
                            y: y
                        }))
                        .then(function() {
                            d.resolve();
                        });
                    });
                break;
        }

        return d;
    }

    function moveSpyRight(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spritesheet = new SpriteSheet({
                width: sprites.spy.walk_right.s_w,
                height: sprites.spy.walk_right.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 }
                ]
            }),
            animation = new Animation([
                    { sprite: 'fr_1', time: sprites.spy.time },
                    { sprite: 'fr_2', time: sprites.spy.time }
            ], spritesheet)
        ;

        var t = setInterval(function() {
            opts.x += sprites.spy.speed;
            if (opts.x>=opts.end_x) {
                clearTimeout(t);
                d.resolve();
                return;
            }

            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_right.object,
                frame.x, frame.y,
                sprites.spy.walk_right.s_w, sprites.spy.walk_right.s_h,
                opts.x, opts.y,
                sprites.spy.walk_right.s_w, sprites.spy.walk_right.s_h
            );

            timer.tick();
        }, sprites.spy.wait);

        return d;
    }

    function moveSpyBack(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spritesheet = new SpriteSheet({
                width: sprites.spy.walk_bw.s_w,
                height: sprites.spy.walk_bw.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 }
                ]
            }),
            animation = new Animation([
                { sprite: 'fr_1', time: sprites.spy.time },
                { sprite: 'fr_2', time: sprites.spy.time }
            ], spritesheet)
        ;

        var t = setInterval(function() {
            opts.y -= sprites.spy.speed;
            if (opts.y<=opts.end_y) {
                clearTimeout(t);
                d.resolve();
                return;
            }

            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_bw.object,
                frame.x, frame.y,
                sprites.spy.walk_bw.s_w, sprites.spy.walk_bw.s_h,
                opts.x, opts.y,
                sprites.spy.walk_bw.s_w, sprites.spy.walk_bw.s_h
            );

            timer.tick();
        }, sprites.spy.wait);

        return d;
    }

    function moveSpyLeft(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spritesheet = new SpriteSheet({
                width: sprites.spy.walk_left.s_w,
                height: sprites.spy.walk_left.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 }
                ]
            }),
            animation = new Animation([
                    { sprite: 'fr_1', time: sprites.spy.time },
                    { sprite: 'fr_2', time: sprites.spy.time }
            ], spritesheet)
        ;

        var t = setInterval(function() {
            opts.x -= sprites.spy.speed;
            if (opts.x<=opts.end_x) {
                clearTimeout(t);
                d.resolve();
                return;
            }

            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_left.object,
                frame.x, frame.y,
                sprites.spy.walk_left.s_w, sprites.spy.walk_left.s_h,
                opts.x, opts.y,
                sprites.spy.walk_left.s_w, sprites.spy.walk_left.s_h
            );

            timer.tick();
        }, sprites.spy.wait);

        return d;
    }

    function doVisual() {
        //return visuals.pop().start({
        var d = new $.Deferred();
        if (visuals_done < visuals.length) {
            $.when(visuals[visuals_done].start({
                w:w,
                h:h,
                ctx: ctx,
                canvas: canvas,
                len: len,
                wait: wait
            }))
            .then(function() {
                visuals_done++;
                d.resolve();
            });
        } else d.resolve();

        return d;
    }

})(jQuery);
