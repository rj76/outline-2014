(function ($) {
    var canvas = document.getElementById("canv"),
        canvas_hidden = document.getElementById("canv_hidden"),
        ctx = canvas.getContext("2d"),
        ctx_hidden = canvas_hidden.getContext("2d"),
        w = canvas.width,
        h = canvas.height
    ;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';

    window.effects = new $.effects();

    var room = new $.room();
    room.start();

})(jQuery);
