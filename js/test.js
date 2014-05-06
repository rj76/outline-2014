(function ($) {
    var canvas = document.getElementById("intro_canv"),
//        canvas_hidden = document.getElementById("intro_canv_hidden"),
        ctx = canvas.getContext("2d"),
//        ctx_hidden = canvas_hidden.getContext("2d"),
        w = canvas.width,
        h = canvas.height
    ;

    ctx.fillStyle = '#000'; // set canvas background color
    ctx.fillRect(0, 0, w, h);  // now fill the canvas

    window.effects = new $.effects();
    setTimeout(function() {
        console.log('calling regionAlphaToMinCenter');
        var now= _.now();
        $.when(window.effects.regionAlphaToMinCenterX({
            ctx: ctx, el: canvas, x: 0, y: 0, w: w, h: h
        }))
        .then(function() {
            console.log('done, took: '+(now- _.now()));
        });
    }, 2000);

})(jQuery);
