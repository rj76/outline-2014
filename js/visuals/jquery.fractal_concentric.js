(function ($) {
    var
        do_loop=true,
        opts
    ;

    $.fractal_concentric = function() {};
    $.fractal_concentric.prototype.start = function (_opts) {
        opts = _opts;
        animate();
    };

    $.fractal_concentric.prototype.stop = function() {
        do_loop = false;
    };

    function animate() {
        if (do_loop) {
            generate();
            requestAnimationFrame(animate, opts.canvas);
        }
    }

    function setLinePoints(iterations) {
		var pointList = {};
		pointList.first = {x:0, y:1};
		var lastPoint = {x:1, y:1};
		var minY = 10;
		var maxY = 10;
		var point;
		var nextPoint;
		var dx, newX, newY;

		pointList.first.next = lastPoint;
		for (var i = 0; i < iterations; i++) {
			point = pointList.first;
			while (point.next != null) {
				nextPoint = point.next;

				dx = nextPoint.x - point.x;
				newX = 0.5*(point.x + nextPoint.x);
				newY = 0.5*(point.y + nextPoint.y);
				newY += dx*(Math.random()*2 - 1);

				var newPoint = {x:newX, y:newY};

				//min, max
				if (newY < minY) {
					minY = newY;
				}
				else if (newY > maxY) {
					maxY = newY;
				}

				//put between points
				newPoint.next = nextPoint;
				point.next = newPoint;

				point = nextPoint;
			}
		}

		//normalize to values between 0 and 1
		if (maxY != minY) {
			var normalizeRate = 1/(maxY - minY);
			point = pointList.first;
			while (point != null) {
				point.y = normalizeRate*(point.y - minY);
				point = point.next;
			}
		}
		//unlikely that max = min, but could happen if using zero iterations. In this case, set all points equal to 1.
		else {
			point = pointList.first;
			while (point != null) {
				point.y = 1;
				point = point.next;
			}
		}

		return pointList;
	}

	function generate() {
        var centerX, centerY;
		var r,g,b,a;
		var color0, color1;
		var lineW;
		var maxRad, minRad;
		var phase;

		centerX = opts.w/2;
		centerY = opts.h/2;

		var numCircles = 20;
		var startAlpha = 55/255;
		var endAlpha = 32/255;


		for (var i = 0; i < numCircles; i++) {
            var f = typeof window.Dancer == 'undefined' ? 1 : window.Dancer.getFrequency(10,50)*100;
            maxRad = 140 + (i+1*f)/numCircles*220;
            minRad = 50 + (0.85+0.15*f*i)/numCircles*220;

			r = Math.floor(Math.random()*255);
			g = Math.floor(Math.random()*255);
			b = Math.floor(Math.random()*255);
			//square-rooting the parameter moves the alpha towards transparent more rapidly.
			a = startAlpha + (i/(numCircles-1))*(endAlpha - startAlpha);
			var a0 = 0.67*a;

			//very subtle radial gradient
			color1 = "rgba("+r+","+g+","+b+","+a+")";
			color0 = "rgba("+r+","+g+","+b+","+a0+")";
			var grad = opts.ctx.createRadialGradient(centerX,centerY,0.67*maxRad,centerX,centerY,maxRad);
			grad.addColorStop(0,color0);
			grad.addColorStop(1,color1);
			opts.ctx.fillStyle = grad;

			phase = Math.random()*Math.PI*2;

			drawCircle(centerX, centerY, minRad, maxRad, phase, color1, grad);
		}
	}

	function drawCircle(centerX, centerY, minRad, maxRad, phase, lineColor, fill) {
		var point;
		var rad, theta;
		var twoPi = 2*Math.PI;
		var x0,y0;

		//generate the random function that will be used to vary the radius, 9 iterations of subdivision
		var pointList = setLinePoints(9);

		opts.ctx.strokeStyle = lineColor;
		opts.ctx.lineWidth = 1.01;
		opts.ctx.fillStyle = fill;
		opts.ctx.beginPath();
		point = pointList.first;
		theta = phase;
		rad = minRad + point.y*(maxRad - minRad);
		x0 = centerX + rad*Math.cos(theta);
		y0 = centerY + rad*Math.sin(theta);
		opts.ctx.lineTo(x0, y0);
		while (point.next != null) {
			point = point.next;
			theta = twoPi*point.x + phase;
			rad = minRad + point.y*(maxRad - minRad);
			x0 = centerX + rad*Math.cos(theta);
			y0 = centerY + rad*Math.sin(theta);
			opts.ctx.lineTo(x0, y0);
		}
		opts.ctx.stroke();
		opts.ctx.fill();
	}

})(jQuery);
