(function ($) {
    $.effects = function () {
    };

    var
        opts,
        current_x, current_y,
        deferred,
        x_factor=4, y_factor= 2,
        counter=0
        ;

    $.effects.prototype.regionAlphaToMin = function(_opts) {
        /*
            modify all pixels in region to become alpha=0
            opts : {
                x, y, w, h, ctx, el
            }
        */
        opts = _opts;
        var d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h);
        for(var i=0;i< d.data.length;i+=4, d.data[i+3] = 0) ;
        opts.ctx.putImageData(d, opts.x, opts.y);
    };

    $.effects.prototype.regionAlphaToMax = function(_opts) {
        /*
            modify all pixels in region to become alpha=255
            opts : {
                x, y, w, h, ctx, el
            }
        */
        opts = _opts;
        var d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h);
        for(var i=0;i< d.data.length;i+=4, d.data[i+3] = 255) ;
        opts.ctx.putImageData(d, opts.x, opts.y);
    };

    /*
        these methods return a deferred object and do animations
    */
    $.effects.prototype.regionAlphaToMinCenter = function(_opts) {
        /*
            modify all pixels in region to become alpha=0 from y=0 to y=h/2 (y=h to y=h/2)
            opts : {
                x, y, w, h, ctx, el
            }
        */
        deferred = new $.Deferred();
        opts = _opts;
        current_x = 0; current_y = 0;
        setTimeout(regionAlphaToMinCenter, 100);
        return deferred;
    };

    function regionAlphaToMinCenter() {
        var d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h);
        for(var _y=current_y;_y<current_y+y_factor;_y++) {
            for(var current_x=0;current_x<=opts.w;current_x+=x_factor) {
                for(var _x=current_x;_x<current_x+x_factor;_x++) {
                    var
                        idx_x=4*(_x + _y*opts.w),
                        idx_x_b=4*(_x + (opts.h-_y)*opts.w);
                        d.data[idx_x+3] = 0;
                        d.data[idx_x_b+3] = 0;
                }
            }
        }

        opts.ctx.clearRect(opts.x, opts.y, opts.w, opts.h);
        opts.ctx.putImageData(d, opts.x, opts.y);
        current_y += y_factor;

        if (current_y <= opts.h/2+2) requestAnimationFrame(regionAlphaToMinCenter, opts.el);
        else {
            deferred.resolve();
        }
    }

    $.effects.prototype.regionAlphaToMaxCenter = function(_opts) {
        /*
            modify all pixels in region to become alpha=0 from y=0 to y=h/2 (y=h to y=h/2)
            opts : {
                x, y, w, h, ctx, el
            }
        */
        deferred = new $.Deferred();
        opts = _opts;
        current_x = 0; current_y = 0;
        setTimeout(regionAlphaToMaxCenter, 100);
        return deferred;
    };

    function regionAlphaToMaxCenter() {
        var
            d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h),
            d_org=opts.ctx_org.getImageData(opts.x, opts.y, opts.w, opts.h)
        for(var _y=current_y;_y<current_y+y_factor;_y++) {
            for(var current_x=0;current_x<=opts.w;current_x+=x_factor) {
                current_x = Math.ceil(current_x);
                for(var _x=current_x;_x<current_x+x_factor;_x++) {
                    var
                        idx_x=4*(_x + _y*opts.w),
                        idx_x_b=4*(_x + (opts.h-_y)*opts.w);

                    d.data[idx_x] = d_org.data[idx_x];
                    d.data[idx_x_b] = d_org.data[idx_x_b];

                    d.data[idx_x+1] = d_org.data[idx_x+1];
                    d.data[idx_x_b+1] = d_org.data[idx_x_b+1];

                    d.data[idx_x+2] = d_org.data[idx_x+2];
                    d.data[idx_x_b+2] = d_org.data[idx_x_b+2];

                    d.data[idx_x+3] = d_org.data[idx_x+3];
                    d.data[idx_x_b+3] = d_org.data[idx_x_b+3];
                }
            }
        }

        opts.ctx.clearRect(opts.x, opts.y, opts.w, opts.h);
        opts.ctx.putImageData(d, opts.x, opts.y);
        current_y += y_factor;

        if (current_y <= opts.h/2+2) window.requestAnimationFrame(regionAlphaToMaxCenter, opts.el);
        else {
            deferred.resolve();
        }
    }

}(jQuery));
