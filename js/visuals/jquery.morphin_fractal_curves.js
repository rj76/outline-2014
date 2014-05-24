(function ($) {
    var
        do_loop=true,
        opts
        ;
	var numCircles;
	var maxMaxRad;
	var minMaxRad;
	var minRadFactor;
	var circles;
	var iterations;
	var numPoints;
	var drawsPerFrame;
	var drawCount;
	var bgColor;
	var lineWidth;
	var colorParamArray;
	var colorArray;
	var dataLists;
	var minX, maxX, minY, maxY;
	var xSpace, ySpace;
	var lineNumber=0;
	var twistAmount;
	var fullTurn;
	var lineAlpha;
	var maxColorValue;

    $.fractal_curves = function () {};
    $.fractal_curves.prototype.start = function (_opts) {
        opts = _opts;
        init();
        animate();
    };
    $.fractal_curves.prototype.stop = function() {
        do_loop = false;
    };

    function animate() {
        if (do_loop) {
            lineNumber++;
    		colorArray = setColorList(iterations);
            create();
            requestAnimationFrame(animate, opts.canvas);
        }
    }

	function init() {
		numCircles = 20;
		maxMaxRad = 200;
		minMaxRad = 200;
		minRadFactor = 0;
		iterations = 11;
		numPoints = Math.pow(2,iterations)+1;
		drawsPerFrame = 8;

		fullTurn = Math.PI*2*numPoints/(1+numPoints);

		minX = -maxMaxRad;
		maxX = opts.w + maxMaxRad;
		minY = opts.h/2+100;
		maxY = opts.h/2-100;

		twistAmount = 0.6*Math.PI*2;

		stepsPerSegment = Math.floor(500/numCircles);

		maxColorValue = 255;
		lineAlpha = 0.8;

		lineWidth = 1.25;

		drawCount = 0;
		opts.ctx.setTransform(1,0,0,1,0,0);

		opts.ctx.clearRect(0,0,opts.w,opts.h);

		setCircles();

		colorArray = setColorList(iterations);
	}

	function setColorList(iter) {
		//This function sets an array of colors which vary between three random choices. The variation
		//is set according to a fractal subdivision function.
		var r0,g0,b0;
		var r1,g1,b1;
		var r2,g2,b2;
		var param;
		var colorArray;
		var lastColorObject;
		var i, len;
		var r,g,b,a;
		var grad;

		var redFactor = 1;
		var blueFactor = 0.7;
		var greenFactor = 1;

		r0 = redFactor*Math.random()*maxColorValue;
		//I like to balance reds with some green, so I'm making sure green is at least 20 percent of the red.
		g0 = 0.2*r0 + greenFactor*Math.random()*(maxColorValue - 0.2*r0);
		b0 = blueFactor*Math.random()*maxColorValue;

		r2 = redFactor*Math.random()*maxColorValue;
		g2 = 0.2*r2 + greenFactor*Math.random()*(maxColorValue - 0.2*r2);
		b2 = blueFactor*Math.random()*maxColorValue;

		//middle color will be darkened average of other two
		r1 = 0.2*(r0+r2);
		g1 = 0.2*(g0+g2);
		b1 = 0.2*(b0+b2);

		a = lineAlpha;

		var colorParamArray = setLinePoints(iter);
		colorArray = [];

		len = colorParamArray.length;

		for (i = 0; i < len; i++) {
			param = colorParamArray[i];

			if (param < 0.5) {
				r = Math.floor(r0 + 2*param*(r1 - r0));
				g = Math.floor(g0 + 2*param*(g1 - g0));
				b = Math.floor(b0 + 2*param*(b1 - b0));
			}
			else {
				r = Math.floor(r1 + 2*(param-0.5)*(r2 - r1));
				g = Math.floor(g1 + 2*(param-0.5)*(g2 - g1));
				b = Math.floor(b1 + 2*(param-0.5)*(b2 - b1));
			}

			var newColor = "rgba("+r+","+g+","+b+","+a+")";

			colorArray.push(newColor);
		}

		return colorArray;

	}

	function setCircles() {
		var i;

		circles = [];

		for (i = 0; i < numCircles; i++) {
			maxR = minMaxRad+Math.random()*(maxMaxRad-minMaxRad);
			minR = minRadFactor*maxR;

			var newCircle = {
				centerX: minX + i/(numCircles-1)*(maxX - minX),
				centerY: minY + i/(numCircles-1)*(maxY - minY),
				maxRad : maxR,
				minRad : minR,
				phase : i/(numCircles-1)*twistAmount,
				//phase: Math.random()*Math.PI*2,
				pointArray : setLinePoints(iterations)
            };
			circles.push(newCircle);
		}
	}

	function create() {
		var i, j;
		var cosTheta, sinTheta;
		var theta;

		var numCircles = circles.length;

		var linParam;
		var cosParam;
		var centerX, centerY;
//		var xSqueeze = Math.random()*.1;//1.5;
        var xSqueeze = window.Dancer.getFrequency(10,50)*100;
		var x0,y0;
		var rad, rad0, rad1;
		var phase, phase0, phase1;

		for (var k = 0; k < drawsPerFrame; k++) {

			theta = -lineNumber/(numPoints-1)*fullTurn;

			opts.ctx.lineJoin = "miter";

			opts.ctx.strokeStyle = colorArray[lineNumber];
			opts.ctx.lineWidth = lineWidth;
			opts.ctx.beginPath();

			//move to first point
			centerX = circles[0].centerX;
			centerY = circles[0].centerY;
			rad = circles[0].minRad + circles[0].pointArray[lineNumber]*(circles[0].maxRad - circles[0].minRad);
			phase = circles[0].phase;
			x0 = centerX + xSqueeze*rad*Math.cos(theta + phase);
			y0 = centerY + rad*Math.sin(theta + phase);
			opts.ctx.moveTo(x0,y0);

			for (i=0; i< numCircles-1; i++) {
				//draw between i and i+1 circle
				rad0 = circles[i].minRad + circles[i].pointArray[lineNumber]*(circles[i].maxRad - circles[i].minRad);
				rad1 = circles[i+1].minRad + circles[i+1].pointArray[lineNumber]*(circles[i+1].maxRad - circles[i+1].minRad);
				phase0 = circles[i].phase;
				phase1 = circles[i+1].phase;

				for (j = 0; j < stepsPerSegment; j++) {
					linParam = j/(stepsPerSegment-1);
					cosParam = 0.5-0.5*Math.cos(linParam*Math.PI);

					//interpolate center
					centerX = circles[i].centerX + linParam*(circles[i+1].centerX - circles[i].centerX);
					centerY = circles[i].centerY + linParam*(circles[i+1].centerY - circles[i].centerY);

					//interpolate radius
					rad = rad0 + cosParam*(rad1 - rad0);

					//interpolate phase
					phase = phase0 + cosParam*(phase1 - phase0);

					x0 = centerX + xSqueeze*rad*Math.cos(theta + phase);
					y0 = centerY + rad*Math.sin(theta + phase);

					opts.ctx.lineTo(x0,y0);
				}
			}

//            if (lineNumber > numPoints-1) {
//                lineNumber = 0;
//                break;
//            }

			opts.ctx.stroke();
		}
	}

	//Here is the function that defines a noisy (but not wildly varying) data set which we will use to draw the curves.
	//We first define the points in a linked list, but then store the values in an array.
	function setLinePoints(iterations) {
		var pointList = {};
		var pointArray = [];
		pointList.first = {x:0, y:1};
		var lastPoint = {x:1, y:1};
		var minY = 1;
		var maxY = 1;
		var point;
		var nextPoint;
		var dx, newX, newY;
		var ratio;

		var minRatio = 0.5;

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
		//Also store y values in array here.
		if (maxY != minY) {
			var normalizeRate = 1/(maxY - minY);
			point = pointList.first;
			while (point != null) {
				point.y = normalizeRate*(point.y - minY);
				pointArray.push(point.y);
				point = point.next;
			}
		}
		//unlikely that max = min, but could happen if using zero iterations. In this case, set all points equal to 1.
		else {
			point = pointList.first;
			while (point != null) {
				point.y = 1;
				pointArray.push(point.y);
				point = point.next;
			}
		}

		return pointArray;
	}
})(jQuery);
