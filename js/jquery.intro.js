(function ($) {
    var freq = .01,
        amp = 8,
        canvas = document.getElementById("canv_intro"),
        canvas_hidden = document.getElementById("canv_hidden_intro"),
        ctx = canvas.getContext("2d"),
        ctx_hidden = canvas_hidden.getContext("2d"),
        w = canvas.width,
        h = canvas.height,
        x = w / 2,
        css_font="42px Atari",
        y_min = 100,
        d,
        a=255,
        texts = [
            "G'day fellow outliners",
            "This is a small demo",
            "as a tribute to the one game we all love",
            "or comics...",
            "or television..."
        ],
        wait=18/texts.length,
        txt_idx= 0,
        alpha
    ;

    ctx.globalCompositeOperation = 'copy';
    ctx_hidden.globalCompositeOperation = 'copy';

    $.intro = function (demo) {
        this.demo = demo;
    };

    $.intro.prototype.start = function () {
        var
            self = this
            ;

        $('#canv_room').hide();
        $('#canv_hidden_room').hide();

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        ctx_hidden.fillStyle = '#000';
        ctx_hidden.fillRect(0, 0, w, h);

        setNextText();

        animate();
    };

    function setNextText() {
        txt_idx++;
        if (txt_idx<texts.length) {
            clearAndSetText(texts[txt_idx]);
            setTimeout(setNextText, wait*1000);
        }
    }

    function clearAndSetText(txt) {
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.clearRect(0, 0, w, h);
        ctx_hidden.font = css_font;
        ctx_hidden.fillStyle = '#fff';
        ctx_hidden.textAlign = 'center';
        ctx_hidden.fillText(txt, x, y_min);
    }

    var counter= 0, printed=0;
    function animate() {
        d = ctx_hidden.getImageData(0, 0, w, h);
        var d1 = ctx_hidden.getImageData(0, 0, w, h), audio_freq=window.Dancer.getFrequency(10,50);
        counter++;
        var old_sin= 0;
        for(var _y=0;_y<h;++_y) {
            var
                new_sin = Math.sin((freq+10*audio_freq) * (counter+_y)) * amp
            ;
            old_sin = new_sin;
            for (var _x= 0,idx= 0;_x<w;idx=4*(++_x + _y*w)) {
                if (d.data[idx] != 0 || d.data[idx+1] != 0 || d.data[idx+2] != 0) {
                    var
                        new_x = Math.round(new_sin + _x),
                        new_idx = Math.round(4 * (new_x + _y * w));
                    d1.data[new_idx] = d.data[idx];
                    d1.data[new_idx+1] = d.data[idx+1];
                    d1.data[new_idx+2] = d.data[idx+2];
                    d1.data[new_idx + 3] = d.data[idx + 3];
                    d1.data[idx] = 0;
                    d1.data[idx + 1] = 0;
                    d1.data[idx + 2] = 0;
                    d1.data[idx + 3] = a;
                } else {
                    d1.data[idx] = 0;//d.data[idx];
                    d1.data[idx + 1] = 0;//d.data[idx + 1];
                    d1.data[idx + 2] = 0;//d.data[idx + 2];
                    d1.data[idx + 3] = a;//d.data[idx + 3];
                }
            }
        }

//        ctx.clearRect(0, 0, w, h);
        ctx.putImageData(d1, 0, 0);

        if (txt_idx<texts.length) window.requestAnimationFrame(animate, canvas);
        else doImage();
    }

    function doImage() {
        console.log('calling window.effects.regionAlphaToMinCenter');
        $.when(window.effects.regionAlphaToMinCenterY({
            ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            // load image
            var img = new Image();
            ctx_hidden.clearRect(0, 0, w, h);
            ctx.clearRect(0, 0, w, h);
            img.onload = function() {
                ctx_hidden.drawImage(img, 0, 0, 1000, 750);
                d = ctx_hidden.getImageData(0, 0, w, h);
                console.log('window.effects.regionAlphaToMaxCenter');
                $.when(window.effects.regionAlphaToMaxCenterX({
                    ctx: ctx, ctx_org: ctx_hidden, el: canvas, x: 0, y: 0, w: w, h: h
                }))
                .then(function() {
                        setTimeout(
                            function() {
                                window.effects.regionAlphaToMinCenterY({
                                    ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
                                });
                            }, 1000)
                    });
            };
            img.src = 'img/svs-sm.png';
        });
    }
}(jQuery));
