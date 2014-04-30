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
        y_min = 100,
        bounds,
        d,d0,
        printed=0
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


        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle   = '#000'; // set canvas background color
        ctx.fillRect(0, 0, w, h);  // now fill the canvas
//        d0 = ctx.getImageData(0, 0, w, h);
//        console.log(d0);return;
        ctx.font = "36px Atari";
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText("G'day fellow outliners", x, y_min);
        d = ctx.getImageData(0, 0, w, h);
        bounds=get_bounds();
        console.log(bounds);

//        animate();
    };

    function idx_is_empty(idx) {
        var e = (
//            (d.data[idx] == d0.data[idx] && d.data[idx + 1] == d0.data[idx+1] && d.data[idx + 2] == d0.data[idx+2] && d.data[idx + 3] == d0.data[idx+3]) ||
            (d.data[idx] == 0 && d.data[idx + 1] == 0 && d.data[idx + 2] == 0 && d.data[idx + 3] == 255)
//            (d.data[idx] == 255 && d.data[idx + 1] == 255 && d.data[idx + 2] == 255)
        )
//        var e = (
//            d.data[idx] == 0 && d.data[idx + 1] == 0 && d.data[idx + 2] == 0 ||
//            d.data[idx] == 255 && d.data[idx + 1] == 255 && d.data[idx + 2] == 255 && d.data[idx + 3] == 255
//        );
        if(!e && printed++<10) console.log([e, idx, d.data[idx], d.data[idx + 1], d.data[idx + 2], d.data[idx + 3]]);
        return e;
    }

    function get_bounds() {
        var y_max=h, x_min=w, x_max= 0;
        for(var _y=y_min, empty_y_cnt=0, _x=0, bla=0, pixel_found=false, idx=0;_y<y_max;_y++) {
//            if(_y%4==0) console.log(_y);
            // loop from left to first pixel and set x_min
            for(_x=0;_x<w;idx=4*(_x++ +_y*w)) {
                if (!idx_is_empty(idx)) {
                    if (_y==h-1 && bla++<50) {
                        console.log('not empty @ ('+_x+','+_y+')');
                        console.log([idx, d.data[idx], d.data[idx + 1], d.data[idx + 2], d.data[idx + 3]])
                    }
                    pixel_found=true;
                    if (_x < x_min)  {
                        x_min = _x;
                    }
                    break;
                }
            }

            // loop from right to first pixel and set x_max
            for(_x=w;_x>=0; idx=4*(_x-- +_y*w)) {
                if (!idx_is_empty(idx)) {
                    pixel_found=true;
//                    if (_y>y_min+300&& bla++<10) console.log('not empty @'+_y);
                    if (_x > x_max)  {
                        x_max = _x;
                    }
                    break;
                }
            }

            if (!pixel_found) {
                console.log(empty_y_cnt);
                if (empty_y_cnt++>5) {
                    console.log('no pixel found at y='+_y);
                    y_max = _y;
                    return {
                        x_min: x_min,
                        x_max: x_max,
                        y_max: y_max
                    }
                }
            }
        }
    }

    var _y=y_min, counter=0;

    function animate() {
        requestAnimationFrame(animate);

        counter++;
        if (_y++>bounds.y_max) _y=y_min;

        // for each y loop through the x and shift its position
        for (var _x=bounds.x_min, idx=4*(_x+_y*w);_x<bounds.x_max;_x++) {
            if (idx_is_empty(d.data, idx)) {
                d.data[idx] = d.data[idx];
                d.data[idx + 1] = d.data[idx + 1];
                d.data[idx + 2] = d.data[idx + 2];
                d.data[idx + 3] = d.data[idx + 3];
            } else {
                // now we have to transpose a new y, calc a new position, and put the old data in there
                var new_x = Math.round(Math.abs(Math.sin(freq * counter) * amp) + _x), new_idx = Math.round(4 * (new_x + _y * w));
//                if (printed++ < 50) console.log([_x, new_x, idx, new_idx]);
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
