function Enemy() {
	this.x = 1500;
	this.y = 400;
}

Enemy.prototype.dx = -5;
Enemy.prototype.dy = 0;

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");

var Mouse = {
	position : {
		x : 0,
		y : 0
	},
	getPosition : function (canvas, event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}
};

var Enemies = {
	objs : new Array(),
	number : 0,
	indexOfLastDead : 0,
	generate : function () {
		this.objs[this.number] = new Enemy;
		this.number++;
	},
	drawEachEnemy : function (Enemy) {
		var context = canvas.getContext("2d");
		context.beginPath();
		context.fillStyle = "red";
		context.arc(Enemy.x, Enemy.y, 10, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
		Enemy.x += Enemy.dx;
		Enemy.y += Enemy.dy;
		if (Enemy.x < 200) {
			this.indexOfLastDead = this.objs.indexOf(Enemy);
		}
	},
	draw : function () {
		for(var i = this.objs.length - 1; i > this.indexOfLastDead; i--) {
			this.drawEachEnemy(this.objs[i]);
		}
	}
};

var Bow = {
	center : {
		x : 150,
		y : 350
	},
	rotRadian : 0,
	width : 15,
	radius : 50,
	color : "blue",
	draw : function () {
		var context = canvas.getContext("2d");
		var distX = Math.abs(this.center.x - Mouse.position.x);
		var distY = Math.abs(this.center.y - Mouse.position.y);
		var dist = Math.sqrt(distX * distX + distY * distY);
		if(Bow.center.y > Mouse.position.y)
			this.rotRadian = Math.acos((this.center.x - Mouse.position.x) / dist) + Math.PI / 2;
		else
			this.rotRadian = Math.asin((this.center.x - Mouse.position.x) / dist);
		context.beginPath();
		context.lineWidth = this.width;
		context.arc(this.center.x, this.center.y, this.radius, this.rotRadian, this.rotRadian + Math.PI, true);
		context.strokeStyle = this.color;
		context.stroke();
	}
};

var BowButton = {
	x : Bow.center.x,
	y : Bow.center.y,
	radius : 5,
	isClicked : false,
	toOriginal : function () {
		this.x = Bow.center.x;
		this.y = Bow.center.y;
		this.isClicked = false;
	},
	draw : function() {
		context = canvas.getContext('2d');
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
		context.closePath();
		context.fillStyle = "red"
		context.fill();
	}
};

var BowString = {
	leftEdge : {
	},
	rightEdge : {
	},
	draw : function () {
	}
};

canvas.addEventListener('mousemove', function(event) {
	Mouse.position = Mouse.getPosition(canvas, event);
	if(BowButton.isClicked == true) {
		BowButton.x = Mouse.position.x;
		BowButton.y = Mouse.position.y;
	}
}, false);

canvas.addEventListener('mousedown', function() {
	if(Math.abs(Mouse.position.x - BowButton.x) < BowButton.radius && Math.abs(Mouse.position.y - BowButton.y) < BowButton.radius) {
		BowButton.isClicked = true;
	}
}, false);

canvas.addEventListener('mouseup', function() {
	BowButton.toOriginal();
}, false);

setInterval(function () {
	Enemies.generate();
}, 1500);

setInterval(function () {
	context.clearRect(0, 0, canvas.width, canvas.height);
	Enemies.draw();
	Bow.draw();
	BowButton.draw();
	context.font = "italic 20px";
	context.fillText("mouse -> x : " + Mouse.position.x + ", y : " + Mouse.position.y, 20, 20);
}, 10);

/* to do list
1. 마우스에 따른 활방향 제대로 만들기 *
2. 활시위 구현하기
3. 화살 구현하기(마우스 클릭이벤트와 연동하여)
4. Enemy와 화살이 닿았을 때 화살과 공 멈추기, 사라지기
5. 처치 수 구현
6. 성벽 및 성벽 내구도 구현
7. 게임 시작화면, 패배 화면 구현
*/
