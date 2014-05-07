var run = true;
var timer = null;

$("#canvas").click(function() {
	if (run) {
		clearInterval(timer);
		run = false;
	}
	else {
		timer = setInterval(randomHarmonograph, 10);
		run = true;
	}
});

var A1 = 100, f1 = 2, p1 = 1/16, d1 = 0.02;
var A2 = 100, f2 = 2, p2 = 3 / 2, d2 = 0.0315;
var A3 = 100, f3 = 2, p3 = 13 / 15, d3 = 0.02;
var A4 = 100, f4 = 2, p4 = 1, d4 = 0.02;

var r = 0, g = 0, b = 0;

var ctx = document.getElementById("canvas").getContext("2d");

setInterval(randomColor, 5000);

timer = setInterval(randomHarmonograph, 30);

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
	p1 += 0.05 % (Math.PI*2)
	drawHarmonograph();
}

function drawHarmonograph() {
	ctx.clearRect(0, 0, 600, 400);
	ctx.save();
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
	ctx.fillRect(0, 0, 600, 400);
	ctx.translate(300, 200);
	ctx.beginPath();
	for (var t = 0; t < 100; t+=0.01) {
		var x = A1 * Math.sin(f1 * t + Math.PI * p1) * Math.exp(-d1 * t) + A2 * Math.sin(f2 * t + Math.PI * p2) * Math.exp(-d2 * t);
		var y = A3 * Math.sin(f3 * t + Math.PI * p3) * Math.exp(-d3 * t) + A4 * Math.sin(f4 * t + Math.PI * p4) * Math.exp(-d4 * t);
		ctx.lineTo(x, y);
	}
	ctx.stroke();
	ctx.restore();
}
