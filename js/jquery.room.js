(function ($) {
    var canvas = document.getElementById("canv_room"),
        ctx = canvas.getContext("2d"),
        canvas_hidden = document.getElementById("canv_hidden_room"),
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
                    x: 8.6, y: 3
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
                    x: 3.2, y: 2.5
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
                    x: 6.2, y: 2.5
                }
            }
        },
        sprites = {
            num_images: 0,
            num_objects: 0,
            spy: {
                speed: 3,
                time: 0.2,
                num_images: 0,
                num_objects: 0,
                punch_right: {
                    s_w: 28, s_h: 37,
                    img: 'img/sprites/punch-right.png'
                },
                walk_left: {
                    s_w: 32, s_h: 37,
                    img: 'img/sprites/walk-left.png'
                },
                walk_right: {
                    s_w: 32, s_h: 37,
                    img: 'img/sprites/walk-right.png'
                },
                walk_bw: {
                    s_w: 25, s_h: 36,
                    img: 'img/sprites/walk-bw.png'
                },
                walk_fw: {
                    s_w: 25, s_h: 36,
                    img: 'img/sprites/walk-fw.png'
                }
            },
            qm: {
                speed: 1,
                time: 0.2,
                wait: 10,
                length: 1000,
                num_images: 0,
                num_objects: 0,
                qm: {
                    s_w: 50, s_h: 50,
                    img: 'img/sprites/question-mk-50px.png'
                }
            },
            cat: {
                speed: 3,
                time: 0.2,
                num_images: 0,
                num_objects: 0,
                walk_left: {
                    s_w: 32, s_h: 33,
                    img: 'img/sprites/cat-left.png'
                },
                walk_right: {
                    s_w: 32, s_h: 33,
                    img: 'img/sprites/cat-right.png'
                },
                walk_bw: {
                    s_w: 32, s_h: 33,
                    img: 'img/sprites/cat-bw.png'
                },
                walk_fw: {
                    s_w: 32, s_h: 33,
                    img: 'img/sprites/cat-fw.png'
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
        props = {
            num_objects: 0,
            num_images: 0,
            heart: {
                ratio: .1,
                img: 'img/heart.png'
            }
        },
        wallpaper_objects = [],
        room_configs = ['l', 'lb', 'lr', 'rl', 'rb', 'r'],// door: left and back (lb), left and right (lr), right and back (rb), etc.
        choosable = ['lb', 'lr', 'rl', 'rb'],
        active_config,
        visuals=[], intro_steps=[],
        current_visual =0, current_intro_step= 0,
        $canvas = $('#canv_room')
    ;

    $.room = function() {};
    $.room.prototype.init = function () {
        // load images
        $.when(loadProps(), loadWallpapers(), loadSprites()).then(function() {
            console.log('images loaded');
            Modernizr.load({
                load: [
                    'js/sprite/Animation.js',
                    'js/sprite/FrameTimer.js',
                    'js/sprite/SpriteSheet.js',
                ],
                complete: function() {
                    visuals.push(new $.fractal_curves);
                    visuals.push(new $.fractal_concentric());
                    visuals.push(new $.plasma());
                    visuals.push(new $.hgraph);

                    $canvas.on('room_intro_plusplus', function() {
                        $('#canv_intro').hide();
                        $('#canv_hidden_intro').hide();
                        $('#canv_room').show();
                        if (current_intro_step < intro_steps.length) intro_steps[current_intro_step++]();
                    });

                    $canvas.on('switch_visual', function() {
                        visuals[current_visual].stop();
                        current_visual++;
                        if (current_visual == visuals.length-1) current_visual = 0;
                        console.log('current_visual: '+current_visual);
                        doNextVisual();
                    });

                    $canvas.on('start_visuals', function() {
//                        current_visual = randomIntFromInterval(0, visuals.length-1);
                        console.log('current_visual: '+current_visual);
                        doNextVisual();
                    });
                }
            });
        });
    };

    $.room.prototype.do_visual = function(idx) {
        for(var i=0; i<visuals.length;i++) visuals[i].stop();
        current_visual = idx;
        doNextVisual();
    };

    /*
        Room spy & cat intro
     */
    intro_steps.push(function() {
        // 1) spy from left to center-10 or so, face front, show question mark, walk out
        // deze duurt 5.75 @ 23.2
        console.log('intro step 1');
        active_config = 'l';
        createRoom();
        createDoors();
        createPaintings();

        base_img = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.putImageData(base_img, 0, 0);

        $.when(window.effects.regionAlphaToMaxCenterX({
            ctx: ctx, ctx_org: ctx_hidden, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            // move sprite through room
            $.when(moveSpy()).then(function() {
                window.effects.regionAlphaToMinCenterY({
                    ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
                });
            });
        });
    });

    intro_steps.push(function() {
        // 2) cat from right to center-something, face front, show question mark, walk out
        // deze duurt 5.75 @ 28,95
        console.log('intro step 2');
        active_config = 'l';
        createRoom();
        createDoors();
        createPaintings();

        base_img = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.putImageData(base_img, 0, 0);

        $.when(window.effects.regionAlphaToMaxCenterX({
            ctx: ctx, ctx_org: ctx_hidden, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            // move sprite through room
            $.when(moveCat()).then(function() {
                window.effects.regionAlphaToMinCenterY({
                    ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
                });
            });
        });
    });

    intro_steps.push(function() {
        // 3) spy moves through room w/ paintings, left to right
        // deze duurt 2.875 @ 31,825
        console.log('intro step 3');
        active_config = 'lr';

        createRoom();
        createDoors();
        createPaintings();

        base_img = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.putImageData(base_img, 0, 0);

        $.when(window.effects.regionAlphaToMaxCenterX({
            ctx: ctx, ctx_org: ctx_hidden, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            // move sprite through room
            $.when(moveSpy()).then(function() {
                window.effects.regionAlphaToMinCenterY({
                    ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
                });
            });
        });
    });

    intro_steps.push(function () {
        // 4) cat moves through room w/ paintings, right to left
        // deze duurt 2.875 @ 34,7
        console.log('intro step 4');
        active_config = 'rl';

        createRoom();
        createDoors();
        createPaintings();

        base_img = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.putImageData(base_img, 0, 0);

        $.when(window.effects.regionAlphaToMaxCenterX({
            ctx: ctx, ctx_org: ctx_hidden, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            // move sprite through room
            $.when(moveCat()).then(function() {
                window.effects.regionAlphaToMinCenterY({
                    ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
                });
            });
        });
    });

    intro_steps.push(function () {
        // 5) spy from left, cat from right, they meet: love, they both walk out
        // deze duurt 5.75 + 2.875 @ 43,325
        console.log('intro step 5');
        active_config = 'spy-l-cat-r';
        var spy_cat_img;

        createRoom();
        createDoors();
        createPaintings();

        base_img = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.putImageData(base_img, 0, 0);

        $.when(window.effects.regionAlphaToMaxCenterX({
            ctx: ctx, ctx_org: ctx_hidden, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            // move spy from left to center and cat from right to center
            $.when(moveSpyRightCatLeftCenter({
                spy_x: doors.left.sprite.x*zoom+offset_left,
                spy_y: top+doors.left.sprite.y*zoom,
                cat_x: doors.right.sprite.x*zoom+offset_left,
                cat_y: top+doors.left.sprite.y*zoom,
                spy_end_x: offset_left+(doors.right.sprite.x*zoom)/2-40,
                cat_end_x: offset_left+(doors.right.sprite.x*zoom)/2+40
            }))
            .then(function() {
                // store cat and spy image to restore after heart
                spy_cat_img = ctx.getImageData(0, 0, w, h);

                // display heart in the center
                setTimeout(function() {
                    ctx.drawImage(
                        props.heart.object,
                        offset_left+(doors.right.sprite.x*zoom)/2+20,
                        doors.left.sprite.y*zoom,
                        props.heart.object.width*props.heart.ratio,
                        props.heart.object.height*props.heart.ratio
                    );
                    // Remove heart, wait
                    setTimeout(function() {
                        ctx.clearRect(0, 0, w, h);
                        ctx.putImageData(spy_cat_img, 0, 0);

                        // Move spy right, cat follows
                        setTimeout(function() {
                            $.when(moveSpyCatLeft({
                                spy_x: offset_left+(doors.right.sprite.x*zoom)/2-40,
                                spy_y: top+doors.left.sprite.y*zoom,
                                cat_x: offset_left+(doors.right.sprite.x*zoom)/2+40,
                                cat_y: top+doors.left.sprite.y*zoom,
                                end_x: offset_left+doors.left.sprite.x*zoom
                            }))
                            .then(function() {
                                window.effects.regionAlphaToMinCenterY({
                                    ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
                                });
                            });
                        }, 1000);
                    }, 1000);
                }, 1000);
            });
        });
    });

    /*
        Visuals
     */
    function doNextVisual() {
        // create room config
        active_config = choosable[randomIntFromInterval(0, choosable.length-1)];

        $('#canv_visual0, #canv_visual1, #canv_visual2, #canv_visual3').hide();
        $canvas.show();

        ctx.clearRect(0, 0, w, h);

        createRoom();
        createDoors();
        createPaintings();

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
                        $canvas.hide();
                        $('#canv_visual'+current_visual).show();
                        var c = document.getElementById('canv_visual'+current_visual);
                        visuals[current_visual].start({
                            w: c.width,
                            h: c.height,
                            ctx: c.getContext("2d"),
                            canvas: c,
                            len: len,
                            wait: wait
                        });
                });
            });
        });
    }

    /*
        General
     */
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

    function loadProps() {
        var d = new $.Deferred(), a = [], prop;
        for (prop in props) {
            if (typeof props[prop].img != 'undefined') {
                a.push(props[prop].img);
            }
        }
        props.num_images = a.length;

        for (prop in props) {
            if (typeof props[prop].img == 'undefined') continue;
            var img = new Image();
            img.onload = function() {
                props.num_objects++;
                if (props.num_objects==props.num_images) d.resolve();
            };
            img.src = props[prop].img;
            props[prop].object = img;
        }
        return d;
    }

    function loadSprites() {
        var d = new $.Deferred(), s, a = [], section, name;
        for (section in sprites) {
            s = [];
            for(name in sprites[section]) {
                if (typeof sprites[section][name].img != 'undefined') {
                    s.push(sprites[section][name].img)
                    a.push(sprites[section][name].img);
                }
            }
            sprites[section].num_images = s.length;
        }
        sprites.num_images = a.length;

        for (section in sprites) {
            for(name in sprites[section]) {
                if (typeof sprites[section][name].img == 'undefined') continue;
                var img = new Image();
                img.onload = function() {
                    sprites.num_objects++;
                    if (sprites.num_objects==sprites.num_images) d.resolve();
                };
                img.src = sprites[section][name].img;

                sprites[section][name].object = img;
            }
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

    /*
        Paintings
     */
    function createPaintings() {
        switch(active_config) {
            case 'lb':
                createPainting(2.5*zoom);
                break;
            case 'spy-l-cat-r':
            case 'lr':
            case 'rl':
            case 'r':
            case 'l':
                createPainting(2.5*zoom);
                createPainting(5.5*zoom);
                break;

            case 'rb':
                createPainting(5.5*zoom);
                break;
        }
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
            img_y = offset_y+(4.8*zoom)/2-(img.height*ratio)/2;
            ctx.drawImage(img, img_x, img_y, img.width*ratio, img.height*ratio);
        }

        if (mode == 'p') {
            // height can't be bigger than 1.5*zoom
            var
                new_height = randomIntFromInterval(height_y_min, height_y_max)
            ;
            ratio = new_height/img.height;
            img_y = offset_y+1.8*zoom+(height_y_max/2-new_height/2);
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

    /*
        Doooooooooooooors
     */
    function createDoors() {
        ctx.fillStyle = '#000';

        if (active_config=='lb' || active_config=='lr' || active_config=='l' || active_config=='rl' || active_config=='spy-l-cat-r') {
            createDoorLeft();
        }

        if (active_config=='rb' || active_config=='lr' || active_config=='r' || active_config=='rl' || active_config=='spy-l-cat-r') {
            createDoorRight();
        }

        if (active_config=='rb') {
            createDoorBackLeft();
        }

        if (active_config=='lb') {
            createDoorBackRight();
        }
    }

    function createDoorLeft() {
        ctx.beginPath();
        ctx.moveTo(doors.left.coords[0].x*zoom+offset_left, doors.left.coords[0].y*zoom+offset_left);
        for(var i=0;i<doors.left.coords.length;i++) {
            ctx.lineTo(doors.left.coords[i].x*zoom+offset_left, doors.left.coords[i].y*zoom+top);
        }
        ctx.fill();
    }

    function createDoorRight() {
        ctx.beginPath();
        ctx.moveTo(doors.right.coords[0].x*zoom+offset_left, doors.right.coords[0].y*zoom+offset_left);
        for(var i=0;i<doors.right.coords.length;i++) {
            ctx.lineTo(doors.right.coords[i].x*zoom+offset_left, doors.right.coords[i].y*zoom+top);
        }
        ctx.fill();
    }

    function createDoorBackLeft() {
        ctx.beginPath();
        ctx.moveTo(doors.back_left.coords[0].x*zoom+offset_left, doors.back_left.coords[0].y*zoom+offset_left);
        for(var i=0;i<doors.back_left.coords.length;i++) {
            ctx.lineTo(doors.back_left.coords[i].x*zoom+offset_left, doors.back_left.coords[i].y*zoom+top);
        }
        ctx.fill();
    }

    function createDoorBackRight() {
        ctx.beginPath();
        ctx.moveTo(doors.back_right.coords[0].x*zoom+offset_left, doors.back_right.coords[0].y*zoom+offset_left);
        for(var i=0;i<doors.back_right.coords.length;i++) {
            ctx.lineTo(doors.back_right.coords[i].x*zoom+offset_left, doors.back_right.coords[i].y*zoom+top);
        }
        ctx.fill();
    }

    /*
        Spy sprite movements
     */
    function moveSpy() {
        var x, y, end_x, end_y, d = new $.Deferred();
        switch(active_config) {
            case 'spy-l-cat-r':
                // move from left door to center and back
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+(doors.right.sprite.x*zoom)/2-40;
                $.when(moveSpyRight({
                    x: x,
                    end_x: end_x,
                    y: y
                }))
                .then(function() {
                    d.resolve();
                });
                break;
            case 'l':
                // move from left door to center and back
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+(doors.right.sprite.x*zoom)/2-40;
                $.when(moveSpyRight({
                    x: x,
                    end_x: end_x,
                    y: y
                }))
                .then(function() {
                    // insert question mark sprite for 1 second or so
                    $.when(showQuestionmark({
                        x: offset_left+(doors.right.sprite.x*zoom)/2-20,
                        y: top+(doors.left.sprite.y*zoom)-50
                    }))
                    .then(function() {
                        $.when(moveSpyLeft({
                            x: end_x,
                            end_x: x,
                            y: y
                        }))
                        .then(function() {
                            d.resolve();
                        });
                    });
                });
                break;
            case 'r':
                // move from right door to center and back
                x = doors.right.sprite.x*zoom+offset_left;
                y = top+doors.right.sprite.y*zoom;
                end_x = offset_left+(doors.left.sprite.x*zoom)/2+40;
                $.when(moveSpyLeft({
                    x: x,
                    end_x: end_x,
                    y: y
                }))
                .then(function() {
                    // insert question mark sprite for 1 second or so
                    $.when(showQuestionmark({
                        x: offset_left+(doors.right.sprite.x*zoom)/2-20,
                        y: top+(doors.left.sprite.y*zoom)-50
                    }))
                    .then(function() {
                        $.when(moveSpyRight({
                            x: end_x,
                            end_x: x,
                            y: y
                        }))
                        .then(function() {
                            d.resolve();
                        });
                    });
                });
                break;
            case 'lr':
                // move from left door to right door
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
            case 'rl':
                // move from left door to right door
                x = doors.right.sprite.x*zoom+offset_left;
                y = top+doors.right.sprite.y*zoom;
                end_x = offset_left+doors.left.sprite.x*zoom;
                $.when(moveSpyLeft({
                        x: x,
                        end_x: end_x,
                        y: y
                    })).then(function() {
                        d.resolve();
                });
                break;
            case 'rb':
                // move from right door to left back
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
                // move from left door to right back
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

        function animate() {
            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_right.object,
                frame.x|0, frame.y|0,
                sprites.spy.walk_right.s_w, sprites.spy.walk_right.s_h,
                opts.x|0, opts.y|0,
                sprites.spy.walk_right.s_w, sprites.spy.walk_right.s_h
            );

            timer.tick();

            opts.x += sprites.spy.speed;
            if (opts.x>=opts.end_x) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

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

        function animate() {
            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_bw.object,
                frame.x|0, frame.y|0,
                sprites.spy.walk_bw.s_w, sprites.spy.walk_bw.s_h,
                opts.x|0, opts.y|0,
                sprites.spy.walk_bw.s_w, sprites.spy.walk_bw.s_h
            );

            timer.tick();

            opts.y -= sprites.spy.speed;
            if (opts.y<=opts.end_y) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

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

        function animate() {
            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_left.object,
                frame.x|0, frame.y|0,
                sprites.spy.walk_left.s_w, sprites.spy.walk_left.s_h,
                opts.x|0, opts.y|0,
                sprites.spy.walk_left.s_w, sprites.spy.walk_left.s_h
            );

            timer.tick();

            opts.x -= sprites.spy.speed;
            if (opts.x<=opts.end_x) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

        return d;
    }

    function spyFaceFront(opts) {
        // show spy image facing the front and show animated questionmark
        ctx.clearRect(0, 0, w, h);
        ctx.putImageData(base_img, 0, 0);
        ctx.drawImage(
            sprites.spy.walk_fw.object,
            0, 0,
            sprites.spy.walk_fw.s_w, sprites.spy.walk_fw.s_h,
            opts.x|0, opts.y|0,
            sprites.spy.walk_fw.s_w, sprites.spy.walk_fw.s_h
        );
    }

    /*
        Cat sprite movements
     */
    function moveCat() {
        var x, y, end_x, end_y, d = new $.Deferred();
        switch(active_config) {
            case 'spy-l-cat-r':
                // move from right door to center
                x = doors.right.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+(doors.right.sprite.x*zoom)/2+40;
                $.when(moveCatLeft({
                    x: x,
                    end_x: end_x,
                    y: y
                }))
                .then(function() {
                    d.resolve();
                });
                break;
            case 'l':
                // move from left door to center and back
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+(doors.right.sprite.x*zoom)/2-40;
                $.when(moveCatRight({
                    x: x,
                    end_x: end_x,
                    y: y
                }))
                .then(function() {
                    // insert question mark sprite for 1 second or so
                    $.when(showQuestionmark({
                        x: offset_left+(doors.right.sprite.x*zoom)/2-20,
                        y: top+(doors.left.sprite.y*zoom)-40
                    }))
                    .then(function() {
                        $.when(moveCatLeft({
                            x: end_x,
                            end_x: x,
                            y: y
                        }))
                        .then(function() {
                            d.resolve();
                        });
                    });
                });
                break;
            case 'r':
                // move from right door to center and back
                x = doors.right.sprite.x*zoom+offset_left;
                y = top+doors.right.sprite.y*zoom;
                end_x = offset_left+(doors.right.sprite.x*zoom)/2;
                $.when(moveCatLeft({
                    x: x,
                    end_x: end_x,
                    y: y
                }))
                .then(function() {
                    // insert question mark sprite for 1 second or so
                    $.when(moveCatRight({
                        x: end_x,
                        end_x: x,
                        y: y
                    }))
                    .then(function() {
                        d.resolve();
                    });
                });
                break;
            case 'lr':
                // left to right
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+doors.right.sprite.x*zoom;
                $.when(moveCatRight({
                        x: x,
                        end_x: end_x,
                        y: y
                    })).then(function() {
                        d.resolve();
                });
                break;
            case 'rl':
                // right to left
                x = doors.right.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+doors.left.sprite.x*zoom;
                $.when(moveCatLeft({
                        x: x,
                        end_x: end_x,
                        y: y
                    })).then(function() {
                        d.resolve();
                });
                break;
            case 'lc':
                // left to center
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+((doors.right.sprite.x*zoom)/2);
                $.when(moveCatRight({
                        x: x,
                        end_x: end_x,
                        y: y
                    })).then(function() {
                        d.resolve();
                });
                break;

            case 'rb':
                // right to back left
                x = doors.right.sprite.x*zoom+offset_left;
                y = top+doors.right.sprite.y*zoom;
                end_x = offset_left+doors.back_left.sprite.x*zoom;
                end_y = doors.back_left.sprite.y*zoom;
                $.when(moveCatLeft({
                        x: x,
                        end_x: end_x,
                        y: y
                    }))
                    .then(function() {
                        $.when(moveCatBack({
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
                // left to back right
                x = doors.left.sprite.x*zoom+offset_left;
                y = top+doors.left.sprite.y*zoom;
                end_x = offset_left+doors.back_right.sprite.x*zoom;
                end_y = doors.back_right.sprite.y*zoom;
                $.when(moveCatRight({
                        x: x,
                        end_x: end_x,
                        y: y
                    }))
                    .then(function() {
                        $.when(moveCatBack({
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

    function moveCatRight(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spritesheet = new SpriteSheet({
                width: sprites.cat.walk_right.s_w,
                height: sprites.cat.walk_right.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 },
                    { name: 'fr_3', x: 0, y: 0 }
                ]
            }),
            animation = new Animation([
                    { sprite: 'fr_1', time: sprites.cat.time },
                    { sprite: 'fr_2', time: sprites.cat.time },
                    { sprite: 'fr_3', time: sprites.cat.time }
            ], spritesheet)
        ;

        function animate() {
            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.cat.walk_right.object,
                frame.x|0, frame.y|0,
                sprites.cat.walk_right.s_w, sprites.cat.walk_right.s_h,
                opts.x|0, opts.y|0,
                sprites.cat.walk_right.s_w, sprites.cat.walk_right.s_h
            );

            timer.tick();

            opts.x += sprites.cat.speed;
            if (opts.x>=opts.end_x) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

        return d;
    }

    function moveCatBack(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spritesheet = new SpriteSheet({
                width: sprites.cat.walk_bw.s_w,
                height: sprites.cat.walk_bw.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 },
                    { name: 'fr_3', x: 0, y: 0 }
                ]
            }),
            animation = new Animation([
                { sprite: 'fr_1', time: sprites.cat.time },
                { sprite: 'fr_2', time: sprites.cat.time },
                { sprite: 'fr_3', time: sprites.cat.time }
            ], spritesheet)
        ;

        function animate() {
            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.cat.walk_bw.object,
                frame.x|0, frame.y|0,
                sprites.cat.walk_bw.s_w, sprites.cat.walk_bw.s_h,
                opts.x|0, opts.y|0,
                sprites.cat.walk_bw.s_w, sprites.cat.walk_bw.s_h
            );

            timer.tick();

            opts.y -= sprites.cat.speed;
            if (opts.y<=opts.end_y) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

        return d;
    }

    function moveCatLeft(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spritesheet = new SpriteSheet({
                width: sprites.cat.walk_left.s_w,
                height: sprites.cat.walk_left.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 },
                    { name: 'fr_3', x: 0, y: 0 }
                ]
            }),
            animation = new Animation([
                    { sprite: 'fr_1', time: sprites.cat.time },
                    { sprite: 'fr_2', time: sprites.cat.time },
                    { sprite: 'fr_3', time: sprites.cat.time }
            ], spritesheet)
        ;

        function animate() {
            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.cat.walk_left.object,
                frame.x|0, frame.y|0,
                sprites.cat.walk_left.s_w, sprites.cat.walk_left.s_h,
                opts.x|0, opts.y|0,
                sprites.cat.walk_left.s_w, sprites.cat.walk_left.s_h
            );

            timer.tick();

            opts.x -= sprites.cat.speed;
            if (opts.x<=opts.end_x) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

        return d;
    }

    /*
        Combined spy/cat sprites
     */
    function moveSpyRightCatLeftCenter(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spy_spritesheet = new SpriteSheet({
                width: sprites.spy.walk_right.s_w,
                height: sprites.spy.walk_right.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 }
                ]
            }),
            spy_animation = new Animation([
                    { sprite: 'fr_1', time: sprites.spy.time },
                    { sprite: 'fr_2', time: sprites.spy.time }
            ], spy_spritesheet),
            cat_spritesheet = new SpriteSheet({
                width: sprites.cat.walk_left.s_w,
                height: sprites.cat.walk_left.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 },
                    { name: 'fr_3', x: 0, y: 0 }
                ]
            }),
            cat_animation = new Animation([
                    { sprite: 'fr_1', time: sprites.cat.time },
                    { sprite: 'fr_2', time: sprites.cat.time },
                    { sprite: 'fr_3', time: sprites.cat.time }
            ], cat_spritesheet)
        ;

        console.log('end spy_x: '+opts.spy_end_x+', end cat_x: '+opts.cat_end_x);

        function animate() {
            spy_animation.animate(timer.getSeconds());
            cat_animation.animate(timer.getSeconds());
            var spy_frame = spy_animation.getSprite(), cat_frame = cat_animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_right.object,
                spy_frame.x|0, spy_frame.y|0,
                sprites.spy.walk_right.s_w, sprites.spy.walk_right.s_h,
                opts.spy_x|0, opts.spy_y|0,
                sprites.spy.walk_right.s_w, sprites.spy.walk_right.s_h
            );
            ctx.drawImage(
                sprites.cat.walk_left.object,
                cat_frame.x|0, cat_frame.y|0,
                sprites.cat.walk_left.s_w, sprites.cat.walk_left.s_h,
                opts.cat_x|0, opts.cat_y|0,
                sprites.cat.walk_left.s_w, sprites.cat.walk_left.s_h
            );

            timer.tick();

            opts.spy_x += sprites.spy.speed;
            opts.cat_x -= sprites.cat.speed;
            if (opts.spy_x >= opts.spy_end_x && opts.cat_x <= opts.cat_end_x) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

        return d;
    }

    function moveSpyCatLeft(opts) {
        var
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spy_spritesheet = new SpriteSheet({
                width: sprites.spy.walk_left.s_w,
                height: sprites.spy.walk_left.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 }
                ]
            }),
            spy_animation = new Animation([
                    { sprite: 'fr_1', time: sprites.spy.time },
                    { sprite: 'fr_2', time: sprites.spy.time }
            ], spy_spritesheet),
            cat_spritesheet = new SpriteSheet({
                width: sprites.cat.walk_left.s_w,
                height: sprites.cat.walk_left.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 },
                    { name: 'fr_3', x: 0, y: 0 }
                ]
            }),
            cat_animation = new Animation([
                    { sprite: 'fr_1', time: sprites.cat.time },
                    { sprite: 'fr_2', time: sprites.cat.time },
                    { sprite: 'fr_3', time: sprites.cat.time }
            ], cat_spritesheet)
        ;

        function animate() {
            spy_animation.animate(timer.getSeconds());
            cat_animation.animate(timer.getSeconds());
            var spy_frame = spy_animation.getSprite(), cat_frame = cat_animation.getSprite();
            ctx.clearRect(0, 0, w, h);
            ctx.putImageData(base_img, 0, 0);
            ctx.drawImage(
                sprites.spy.walk_left.object,
                spy_frame.x|0, spy_frame.y|0,
                sprites.spy.walk_left.s_w, sprites.spy.walk_left.s_h,
                opts.spy_x|0, opts.spy_y|0,
                sprites.spy.walk_left.s_w, sprites.spy.walk_left.s_h
            );
            ctx.drawImage(
                sprites.cat.walk_left.object,
                cat_frame.x|0, cat_frame.y|0,
                sprites.cat.walk_left.s_w, sprites.cat.walk_left.s_h,
                opts.cat_x|0, opts.cat_y|0,
                sprites.cat.walk_left.s_w, sprites.cat.walk_left.s_h
            );

            timer.tick();

            // cat is moving behind spy, so resolve when cat_x hits end_x
            if (opts.spy_x > opts.end_x) opts.spy_x -= sprites.spy.speed;
            opts.cat_x -= sprites.cat.speed;
            if (opts.cat_x <= opts.end_x) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

        return d;
    }

    /*
        Questionmark sprites
     */
    function showQuestionmark(opts) {
        var
            tot = 0,
            d = new $.Deferred(),
            timer = new FrameTimer(),
            spritesheet = new SpriteSheet({
                width: sprites.qm.qm.s_w,
                height: sprites.qm.qm.s_h,
                sprites: [
                    { name: 'fr_1', x: 0, y: 0 },
                    { name: 'fr_2', x: 0, y: 0 },
                    { name: 'fr_3', x: 0, y: 0 },
                    { name: 'fr_4', x: 0, y: 0 },
                    { name: 'fr_5', x: 0, y: 0 },
                    { name: 'fr_6', x: 0, y: 0 },
                    { name: 'fr_7', x: 0, y: 0 },
                    { name: 'fr_8', x: 0, y: 0 },
                    { name: 'fr_9', x: 0, y: 0 },
                    { name: 'fr_10', x: 0, y: 0 },
                    { name: 'fr_11', x: 0, y: 0 },
                    { name: 'fr_12', x: 0, y: 0 }
                ]
            }),
            animation = new Animation([
                    { sprite: 'fr_1', time: sprites.qm.time },
                    { sprite: 'fr_2', time: sprites.qm.time },
                    { sprite: 'fr_3', time: sprites.qm.time },
                    { sprite: 'fr_4', time: sprites.qm.time },
                    { sprite: 'fr_5', time: sprites.qm.time },
                    { sprite: 'fr_6', time: sprites.qm.time },
                    { sprite: 'fr_7', time: sprites.qm.time },
                    { sprite: 'fr_8', time: sprites.qm.time },
                    { sprite: 'fr_9', time: sprites.qm.time },
                    { sprite: 'fr_10', time: sprites.qm.time },
                    { sprite: 'fr_11', time: sprites.qm.time },
                    { sprite: 'fr_12', time: sprites.qm.time }
            ], spritesheet)
        ;

        function animate() {
            animation.animate(timer.getSeconds());
            var frame = animation.getSprite();
            ctx.drawImage(
                sprites.qm.qm.object,
                frame.x|0, frame.y|0,
                sprites.qm.qm.s_w, sprites.qm.qm.s_h,
                opts.x|0, opts.y|0,
                sprites.qm.qm.s_w, sprites.qm.qm.s_h
            );

            timer.tick();

            tot += sprites.qm.wait;
            if (tot>=sprites.qm.length) {
                d.resolve();
            } else {
                requestAnimationFrame(animate);
            }
        }

        setTimeout(animate, 10);

        return d;
    }

})(jQuery);
