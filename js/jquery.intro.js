(function ($) {
    var freq = .1,
        amp = 20,
        canvas = document.getElementById("intro_canv"),
        canvas_hidden = document.getElementById("intro_canv_hidden"),
        ctx = canvas.getContext("2d"),
        ctx_hidden = canvas_hidden.getContext("2d"),
        w = canvas.width,
        h = canvas.height,
        x = w / 2,
        y = h / 2,
        top = 100
        ;

    $.intro = function (demo) {
        this.demo = demo;
    };

    $.intro.prototype.start = function () {
        var
            self = this
            ;

        // array text => duration
        var text = {
            "G'day fellow outliners": 2000,
            "This is a small demo": 2000,
            "as a tribute to the one game we all love": 2000,
            "(I really tried not to screw it up)": 2000,
            "(with this being my first demo and all)": 1600
        };


        ctx_hidden.font = "36px Atari";
        ctx_hidden.fillStyle = '#fff';
        ctx_hidden.textAlign = 'center';
        ctx_hidden.fillText("G'day fellow outliners", x, top);

        animate();
    };

    var _y = top, printed = 0, counter = 0;

    function animate() {
        requestAnimationFrame(animate);
        var d = ctx_hidden.getImageData(0, 0, w, h);
        counter++;
        if (_y++ > h) _y = top;

        // for each y loop through the x and shift its position
        for (var _x = 0; _x < w; _x++) {
            var idx = 4 * (_x + _y * w);
            if (d.data[idx] == 0 && d.data[idx + 1] == 0 && d.data[idx + 2] == 0 && d.data[idx + 3] == 0) {
                continue;
                d.data[idx] = d.data[idx];
                d.data[idx + 1] = d.data[idx + 1];
                d.data[idx + 2] = d.data[idx + 2];
                d.data[idx + 3] = d.data[idx + 3];
            } else {
                // now we have to transpose a new y, calc a new position, and put the old data in there
                var new_x = Math.round(Math.abs(Math.sin(freq * counter) * amp) + _x), new_idx = Math.round(4 * (new_x + _y * w));
                if (printed++ < 50) console.log([_x, new_x, idx, new_idx]);
                d.data[new_idx] = 255;//d.data[idx];
                d.data[new_idx+1] = 255;//d.data[idx+1];
                d.data[new_idx+2] = 255;//d.data[idx+2];
                d.data[new_idx + 3] = 255;//d.data[idx + 3];
                d.data[idx] = 0;
                d.data[idx + 1] = 0;
                d.data[idx + 2] = 0;
                d.data[idx + 3] = 0;
            }
        }

        ctx.clearRect(0, 0, w, h);
        ctx.putImageData(d, 0, 0);
    }
}(jQuery));
