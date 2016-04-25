// 棋盘对象
var ChessBox = {
	// 棋盘宽度
	width : 10,
	height : 10,
	Walls : []
}

// 方块对象
var player = {
	// 方块当前位置
	position : [6, 6],
	// 方块头部朝向
	head : "top",
	// 方块向头部朝向前进
	playerGo : function() {
		// 根据方块朝向判断移动x，y
		
		// 记录下次位置，以便判断墙
		var next_x = parseInt(this.position[0]);
		var next_y = parseInt(this.position[1]);

		if (this.head == "left" || this.head == "right") {
			if (this.head == "left") {
				// 边界判断
				if (this.position[0] > 1) {
					next_x = this.position[0] - 1;
				}
			}
			else {
				if (this.position[0] < 10) {
					next_x = this.position[0] + 1;
				}
			}
		}
		else {
			if (this.head == "top") {
				if (this.position[1] > 1) {
					next_y = this.position[1] - 1;
				}
			}
			else {
				if (this.position[1] < 10) {
					next_y = this.position[1] + 1;
				}
			}
		}

		if (!this.isWall(next_x, next_y)) {
			this.position = [next_x, next_y];
		}
	},
	// 向左旋转朝向,逆时针旋转90°
	turnLeft : function() {
		switch (this.head) {
			case "top":
				this.head = "left";
				break;
			case "left":
				this.head = "bottom";
				break;
			case "right":
				this.head = "top";
				break;
			case "bottom":
				this.head = "right";
				break;
		}
	},
	// 向右旋转朝向,顺时针旋转90°
	turnRight : function() {
		switch (this.head) {
			case "top":
				this.head = "right";
				break;
			case "left":
				this.head = "top";
				break;
			case "right":
				this.head = "bottom";
				break;
			case "bottom":
				this.head = "left";
				break;
		}
	},
	// 向右旋转180°
	turnBack : function() {
		switch (this.head) {
			case "top":
				this.head = "bottom";
				break;
			case "left":
				this.head = "right";
				break;
			case "right":
				this.head = "left";
				break;
			case "bottom":
				this.head = "top";
				break;
		}
	},
	// 在方块head朝向位置建立墙
	buildWall : function() {

		var Wall_x = parseInt(this.position[0]);
		var Wall_y = parseInt(this.position[1]);

		if (this.head == "left" || this.head == "right") {

			if (this.head == "left") {
				Wall_x -= 1;
			}
			else {
				Wall_x += 1;
			}

		}
		else {
			if (this.head == "top") {
				Wall_y -=  1;
			}
			else {
				Wall_y += 1;
			}
		
		}

		if (Wall_x < 1 || Wall_x > 10 || Wall_y < 1 || Wall_y > 10) {
			return ;
		}

		if (!this.isWall(Wall_x, Wall_y)) {
			ChessBox.Walls.push([Wall_x, Wall_y]);
		}
	},

	// 判断某位置是否是墙
	isWall : function (x, y) {
		for (var i = 0; i < ChessBox.Walls.length; i++) {
			if (ChessBox.Walls[i][0] == x && ChessBox.Walls[i][1] == y) {
				return true;
			}
		}
		return false;
	}
}