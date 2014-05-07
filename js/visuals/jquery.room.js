(function ($) {
    var canvas = document.getElementById("canv"),
        ctx = canvas.getContext("2d"),
        w = canvas.width,
        h = canvas.height,
        zoom=50,
        top=50,
        right=50,
        line_width=2,
        colors = ['#d17ded', '#f9d99c'],
        coords_fill = [
            { type: 'moveto', x: 0, y: 5 },
            { type: 'lineto', x: 0, y: 1.5 },
            { type: 'lineto', x: 2, y: 0 },
            { type: 'lineto', x: 8, y: 0 },
            { type: 'lineto', x: 10, y: 1.5 },
            { type: 'lineto', x: 10, y: 5 },
            { type: 'lineto', x: 0, y: 5 }
        ],
        coords_innerlines = [
            { type: 'moveto', x: 0, y: 5 },
            { type: 'lineto', x: 2, y: 2.5 },
            { type: 'lineto', x: 8, y: 2.5 },
            { type: 'moveto', x: 2, y: 2.5 },
            { type: 'lineto', x: 2, y: 0 },
            { type: 'moveto', x: 8, y: 2.5 },
            { type: 'lineto', x: 8, y: 0 },
            { type: 'moveto', x: 8, y: 2.5 },
            { type: 'lineto', x: 10, y: 5 }
        ]
    ;
    $.room = function() {};
    $.room.prototype.start = function () {
        createRoom({
            color: colors[0]
        });
    };

    function createRoom(opts) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.lineJoin = "round";
        ctx.lineWidth = line_width;

        ctx.strokeStyle = '#000';
        ctx.fillStyle = opts.color;
        ctx.beginPath();
        moveOrDrawCoords(coords_fill);
        moveOrDrawCoords(coords_innerlines);
        ctx.fill();
        ctx.stroke();

    }

    function moveOrDrawCoords(coords) {
        for (var p=0;p<coords.length;p++) {
            if(coords[p].type == 'moveto') {
                ctx.moveTo(coords[p].x*zoom+right, coords[p].y*zoom+right);
            } else {
                ctx.lineTo(coords[p].x*zoom+right, coords[p].y*zoom+top);
            }
        }
    }

    function createDoor(opts) {
        var left_coords = [
            { x: 0 }
        ]
    }

})(jQuery);
