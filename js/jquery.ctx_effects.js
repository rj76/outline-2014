(function ($) {
    $.effects = function () {
    };

    var
        opts,
        current_x, current_y,
        deferred,
        x_factor=10, y_factor= 8,
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
    $.effects.prototype.regionAlphaToMinCenterX = function(_opts) {
        /*
            modify all pixels in region to become alpha=0 from y=0 to y=h/2 (y=h to y=h/2)
            opts : {
                x, y, w, h, ctx, el
            }
        */
        deferred = new $.Deferred();
        opts = _opts;
        current_x = 0; current_y = 0;
        setTimeout(regionAlphaToMinCenterX, 100);
        return deferred;
    };

    function regionAlphaToMinCenterX() {
        var d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h);
        for(var _x=current_x;_x<current_x+x_factor;_x++) {
            for(var current_y=0;current_y<=opts.h;current_y+=y_factor) {
                for(var _y=current_y;_y<=current_y+y_factor;_y++) {
                    var
                        a = 0, // a = ((_x/current_x)*255)-255
                        idx_x=(4*(_x + _y*opts.w))|0,
                        idx_x_b=(4*((opts.w-_x) + _y*opts.w))|0;
                        d.data[idx_x+3] = a|0;
                        d.data[idx_x_b+3] = a|0;
                }
            }
        }

        opts.ctx.clearRect(opts.x, opts.y, opts.w, opts.h);
        opts.ctx.putImageData(d, opts.x, opts.y);
        current_x += x_factor;

        if (current_x <= opts.w/2+2) requestAnimationFrame(regionAlphaToMinCenterX, opts.el);
        else {
            deferred.resolve();
        }
    }

    $.effects.prototype.regionAlphaToMinCenterY = function(_opts) {
        /*
            modify all pixels in region to become alpha=0 from y=0 to y=h/2 (y=h to y=h/2)
            opts : {
                x, y, w, h, ctx, el
            }
        */
        deferred = new $.Deferred();
        opts = _opts;
        current_x = 0; current_y = 0;
        setTimeout(regionAlphaToMinCenterY, 100);
        return deferred;
    };

    function regionAlphaToMinCenterY() {
        var d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h);
        for(var _y=current_y;_y<current_y+y_factor;_y++) {
            for(var current_x=0;current_x<=opts.w;current_x+=x_factor) {
                for(var _x=current_x;_x<=current_x+x_factor;_x++) {
                    var
                        a = 0, // a = ((_x/current_x)*255)-255
                        idx_x=(4*(_x + _y*opts.w))|0,
                        idx_x_b=(4*(_x + (opts.h-_y)*opts.w))|0;
                        d.data[idx_x+3] = a|0;
                        d.data[idx_x_b+3] = a|0;
                }
            }
        }

        opts.ctx.clearRect(opts.x, opts.y, opts.w, opts.h);
        opts.ctx.putImageData(d, opts.x, opts.y);
        current_y += y_factor;

        if (current_y <= opts.h/2+2) requestAnimationFrame(regionAlphaToMinCenterY, opts.el);
        else {
            deferred.resolve();
        }
    }

    $.effects.prototype.regionAlphaToMaxCenterX = function(_opts) {
        /*
            modify all pixels in region to become alpha=0 from x=0 to x=w/2 (x=w to x=w/2)
            opts : {
                x, y, w, h, ctx, el
            }
        */
        deferred = new $.Deferred();
        opts = _opts;
        current_x = 0; current_y = 0;
        setTimeout(regionAlphaToMaxCenterX, 100);
        return deferred;
    };

    function regionAlphaToMaxCenterX() {
        var
            d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h),
            d_org=opts.ctx_org.getImageData(opts.x, opts.y, opts.w, opts.h)
        ;
        for(var _x=current_x;_x<current_x+x_factor;_x++) {
            for(var current_y=0;current_y<=opts.h;current_y+=y_factor) {
                for(var _y=current_y;_y<=current_y+y_factor;_y++) {
                    var
                        idx_x=(4*(_x + _y*opts.w))|0,
                        idx_x_b=(4*((opts.w-_x) + _y*opts.w))|0;

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
        current_x += x_factor;

        if (current_x <= opts.w/2+2) window.requestAnimationFrame(regionAlphaToMaxCenterX, opts.el);
        else {
            deferred.resolve();
        }
    }

    $.effects.prototype.regionAlphaToMaxCenterY = function(_opts) {
        /*
            modify all pixels in region to become alpha=0 from y=0 to y=h/2 (y=h to y=h/2)
            opts : {
                x, y, w, h, ctx, el
            }
        */
        deferred = new $.Deferred();
        opts = _opts;
        current_x = 0; current_y = 0;
        setTimeout(regionAlphaToMaxCenterY, 100);
        return deferred;
    };

    function regionAlphaToMaxCenterY() {
        var
            d=opts.ctx.getImageData(opts.x, opts.y, opts.w, opts.h),
            d_org=opts.ctx_org.getImageData(opts.x, opts.y, opts.w, opts.h)
        for(var _y=current_y;_y<current_y+y_factor;_y++) {
            for(var current_x=0;current_x<=opts.w;current_x+=x_factor) {
                current_x = Math.ceil(current_x);
                for(var _x=current_x;_x<current_x+x_factor;_x++) {
                    var
                        idx_x=(4*(_x + _y*opts.w))|0,
                        idx_x_b=(4*(_x + (opts.h-_y)*opts.w))|0;

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

        if (current_y <= opts.h/2+2) window.requestAnimationFrame(regionAlphaToMaxCenterY, opts.el);
        else {
            deferred.resolve();
        }
    }
}(jQuery));
