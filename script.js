function Enemy() {
	this.xPos = 1500;
	this.yPos = 250;
}

Enemy.prototype.dx = -5;
Enemy.prototype.dy = 0;

function drawEachEnemy(Enemy) {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext("2d");
	context.beginPath();
	context.fillStyle = "red";
	context.arc(Enemy.xPos, Enemy.yPos, 10, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
	Enemy.xPos += Enemy.dx;
	Enemy.yPos += Enemy.dy;
	if (Enemy.xPos < 200) {
		lastDead = Enemies.indexOf(Enemy);
	}
}

function drawEnemies(Enemies) {
	for(var i=Enemies.length-1; i>lastDead; i--) {
		drawEachEnemy(Enemies[i]);
	}
}

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

function drawWeapon() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext("2d");
	var rotDeg = Math.atan(mousePos.y-weaponCenter.y, mousePos.x-weaponCenter.x);
	context.beginPath();
	context.lineWidth = 15;
	context.arc(weaponCenter.x, weaponCenter.y, 50,
	0+rotDeg, Math.PI+rotDeg, true);
	context.strokeStyle = "blue";
	context.stroke();
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");
var Enemies = new Array();
var lastDead = 0;
var weaponCenter = {
	x:250,
	y:250
};
var mousePos;

canvas.addEventListener('mousemove', function(event) {
	mousePos = getMousePos(canvas, event);
}, false);

setInterval(function () {
	Enemies.push(new Enemy);
}, 1000);

setInterval(function () {
	context.clearRect(0, 0, 1500, 500);
	drawWeapon();
	drawEnemies(Enemies);
}, 10);
