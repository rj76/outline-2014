(function ($) {
    var
        do_loop=true,
        opts
        ;

    $.hgraph = function () {};
    $.hgraph.prototype.start = function (_opts) {
        opts = _opts;
        animate();
    };

    $.hgraph.prototype.stop = function () {
        do_loop=false;
    };

    function animate() {
        if (do_loop) {
            randomHarmonograph();
            requestAnimationFrame(animate, opts.canvas);
        }
    }

    var A1 = 100, f1 = 2, p1 = 1 / 16, d1 = 0.02;
    var A2 = 100, f2 = 2, p2 = 3 / 2, d2 = 0.0315;
    var A3 = 100, f3 = 2, p3 = 13 / 15, d3 = 0.02;
    var A4 = 100, f4 = 2, p4 = 1, d4 = 0.02;

    var r = 0, g = 0, b = 0;

    function randomColor() {
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
    }

    function randomHarmonograph() {
        f1 = (f1 + Math.random() / 40) % 10;
        f2 = (f2 + Math.random() / 40) % 10;
        f3 = (f3 + Math.random() / 40) % 10;
        f4 = (f4 + Math.random() / 40) % 10;
        p1 += 0.05 % (Math.PI * 2)
        drawHarmonograph();
    }

    function drawHarmonograph() {
        opts.ctx.clearRect(0, 0, opts.w, opts.h);
        opts.ctx.save();
        opts.ctx.fillStyle = "#ffffff";
        opts.ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
        opts.ctx.fillRect(0, 0, opts.w, opts.h);
        opts.ctx.translate(opts.w/2, opts.h/2);
        opts.ctx.beginPath();
        for (var t = 0; t < 100; t += 0.01) {
            var x = A1 * Math.sin(f1 * t + Math.PI * p1) * Math.exp(-d1 * t) + A2 * Math.sin(f2 * t + Math.PI * p2) * Math.exp(-d2 * t) * window.Dancer.getFrequency(10,50)*100;
            var y = A3 * Math.sin(f3 * t + Math.PI * p3) * Math.exp(-d3 * t) + A4 * Math.sin(f4 * t + Math.PI * p4) * Math.exp(-d4 * t) * window.Dancer.getFrequency(10,50)*100;
            opts.ctx.lineTo(x, y);
        }
        opts.ctx.stroke();
        opts.ctx.restore();
    }
})(jQuery);
