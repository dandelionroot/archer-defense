function Enemy() {
	this.x = 1500;
	this.y = 400;
}

Enemy.prototype.dx = -5;
Enemy.prototype.dy = 0;

function Arrow() {
	this.tail = {
		x : 0,
		y : 0
	};
	this.head = {
		x : 0,
		y : 0
	};
	this.velocity = {
		x : 0,
		y : 0
	}
	this.isFlying = false;
	this.dTheta = 0.38;
}

Arrow.prototype.dTheta = 0.38;
Arrow.prototype.dy = 0.1;
Arrow.prototype.length = 200;
Arrow.prototype.toFlying = function () {
	this.isFlying = true;
};
Arrow.prototype.toNotFlying = function () {
	this.isFlying = false;
};
Arrow.prototype.saveVelocity = function (Mouse) {
	this.velocity.x = -(Mouse.position.x - Bow.center.x)/10;
	this.velocity.y = -(Mouse.position.y - Bow.center.y)/10;
};
Arrow.prototype.rotateTail = function (dTheta) {
	var dSetDegree = dTheta * Math.PI / 180;
	var cosq = Math.cos(dSetDegree);
	var sinq = Math.sin(dSetDegree);
	var sx = this.tail.x - this.head.x;
	var sy = this.tail.y - this.head.y;
	this.tail.x = (sx * cosq - sy * sinq) + this.head.x;
	this.tail.y = (sx * sinq + sy * cosq) + this.head.y;
}

var canvas = document.getElementById('myCanvas');

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
	draw : function (Mouse) {
		var context = canvas.getContext("2d");
		var distX = Math.abs(this.center.x - Mouse.position.x);
		var distY = Math.abs(this.center.y - Mouse.position.y);
		var dist = Math.sqrt(distX * distX + distY * distY);
		if(this.center.y > Mouse.position.y)
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
		x : 0,
		y : 0
	},
	rightEdge : {
		x : 0,
		y : 0
	},
	width : 5,
	color : "black",
	draw : function (Bow, BowButton) {
		this.leftEdge.x = Bow.center.x + Bow.radius * Math.sin(Bow.rotRadian + Math.PI/2);
		this.leftEdge.y = Bow.center.y - Bow.radius * Math.cos(Bow.rotRadian + Math.PI/2);
		this.rightEdge.x = Bow.center.x - Bow.radius * Math.sin(Bow.rotRadian + Math.PI/2);
		this.rightEdge.y = Bow.center.y + Bow.radius * Math.cos(Bow.rotRadian + Math.PI/2);
		context = canvas.getContext('2d');
		context.beginPath();
		context.moveTo(this.leftEdge.x, this.leftEdge.y);
		context.lineTo(BowButton.x, BowButton.y);
		context.lineTo(this.rightEdge.x, this.rightEdge.y);
		context.lineWidth = this.width;
		context.strokeStyle = this.color;
		context.stroke();
	}
};

var Arrows = {
	objs : new Array(),
	isAiming : false,
	number : 0,
	length : 220,
	rodColor : "orange",
	headColor : "green",
	generate : function () {
		this.objs[this.number] = new Arrow();
		this.number++;
	},
	drawRodAndHead : function (arrow) {
		context = canvas.getContext('2d');
		context.beginPath();
		context.moveTo(arrow.tail.x, arrow.tail.y);
		context.lineTo(arrow.head.x, arrow.head.y);
		context.strokeStyle = this.rodColor;
		context.stroke();
		context.beginPath();
		context.arc(arrow.head.x, arrow.head.y, 5, 0, Math.PI * 2, true);
		context.closePath();
		context.fillStyle = this.headColor;
		context.fill();
	},
	draw : function (Bow, BowButton) {
		if(BowButton.isClicked == true && this.isAiming == true) {
			this.objs[this.number-1].tail.x = BowButton.x;
			this.objs[this.number-1].tail.y = BowButton.y;
			this.objs[this.number-1].head.x = BowButton.x + this.length * Math.sin(Bow.rotRadian); 
			this.objs[this.number-1].head.y = BowButton.y - this.length * Math.cos(Bow.rotRadian); 
			this.drawRodAndHead(this.objs[this.number-1]);
		}
		for(var i=0; i<this.number; i++) {
			var arrow = this.objs[i];
			if(arrow.isFlying == true) {
				if(arrow.velocity.x < 0)
					arrow.dTheta = 360 - arrow.dTheta;
				arrow.rotateTail(arrow.dTheta);
				arrow.tail.x += arrow.velocity.x;
				arrow.tail.y += arrow.velocity.y;
				arrow.head.x += arrow.velocity.x;
				arrow.head.y += arrow.velocity.y;
				arrow.velocity.y += arrow.dy;
				this.drawRodAndHead(arrow);
				if(arrow.head.x > 1500 || arrow.head.y > 500)
					arrow.toNotFlying();
			}
		}
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
		if(Arrows.isAiming == false) {
			Arrows.generate();
			Arrows.isAiming = true;
		}
	}
}, false);

canvas.addEventListener('mouseup', function() {
	BowButton.toOriginal();
	if(Arrows.isAiming == true) {
		Arrows.isAiming = false;
		Arrows.objs[Arrows.number-1].toFlying();
		Arrows.objs[Arrows.number-1].saveVelocity(Mouse);
	}
}, false);

setInterval(function () {
	Enemies.generate();
}, 1500);

setInterval(function () {
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	Enemies.draw();
	Bow.draw(Mouse);
	BowButton.draw();
	BowString.draw(Bow, BowButton);
	Arrows.draw(Bow, BowButton);
	context.font = "italic 20px";
	context.fillStyle = "black";
	context.fillText("mouse -> x : " + Mouse.position.x + ", y : " + Mouse.position.y, 20, 20);
}, 10);

/* to do list
1. 마우스에 따른 활방향 제대로 만들기 *
2. 활시위 구현하기*
3. 화살 구현하기(마우스 클릭이벤트와 연동하여)
4. Enemy와 화살이 닿았을 때 화살과 공 멈추기, 사라지기
5. 처치 수 구현
6. 성벽 및 성벽 내구도 구현
7. 게임 시작화면, 패배 화면 구현
*/
