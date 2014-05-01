(function ($) {
    var freq = .01,
        amp = 8,
        canvas = document.getElementById("intro_canv"),
        canvas_hidden = document.getElementById("intro_canv_hidden"),
        ctx = canvas.getContext("2d"),
        ctx_hidden = canvas_hidden.getContext("2d"),
        w = canvas.width,
        h = canvas.height,
        x = w / 2,
        css_font="42px Atari",
        y_min = 100,
        d,
        a=255,
        dancer,
        texts = [
            "G'day fellow outliners",
            "This is a small demo",
            "as a tribute to the one game we all love",
            "(I really tried not to screw it up)",
            "(with this being my first demo and all)"
        ],
        txt_idx=0
    ;

    $.intro = function (demo) {
        this.demo = demo;
    };

    $.intro.prototype.start = function () {
        var
            self = this
            ;

        // array text => duration
        var

        dancer = $('div.body').data('dancer');

        ctx.fillStyle = '#000'; // set canvas background color
        ctx.fillRect(0, 0, w, h);  // now fill the canvas

        ctx_hidden.fillStyle = '#000'; // set canvas background color
        ctx_hidden.fillRect(0, 0, w, h);  // now fill the canvas

        ctx_hidden.font = css_font;
        ctx_hidden.fillStyle = '#fff';
        ctx_hidden.textAlign = 'center';

        setNextText();

        animate();
    };

    function setNextText() {
        if (txt_idx<texts.length) {
            clearAndSetText(texts[txt_idx++]);
            setTimeout(setNextText, 4000);
        }
    }

    function clearAndSetText(txt) {
        ctx.clearRect(0, 0, w, h);
        ctx_hidden.clearRect(0, 0, w, h);
        ctx_hidden.fillText(txt, x, y_min);
    }

    var counter= 0, old_time= 0, printed=0;
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

        ctx.clearRect(0, 0, w, h);
        ctx.putImageData(d1, 0, 0);



        requestAnimationFrame(animate);
    }
}(jQuery));
