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

    /*
        het moet mogelijk zijn op te geven welke kant de spy op gaat,
        tot welke positie en welke sprite (kant dan op).
        Dus de richtingen moeten voor geprogrammeerd worden, waarbij de spy
        van start_x naar end_x beweegt

     */

//    var sprite = new $.sprite();
//    sprite.start({
//        ctx: ctx,
//        w: w,
//        h: h,
//        s_w: 32,
//        s_h: 37,
//        img: 'img/walk-right.png'
//    });

    var room = new $.room();
    room.start();

})(jQuery);
