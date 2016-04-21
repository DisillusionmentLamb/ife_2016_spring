// 棋盘对象
var ChessBox = {
	// 棋盘宽度
	width : 10,
	height : 10
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
		if (this.head == "left" || this.head == "right") {
			if (this.head == "left") {
				// 边界判断
				if (this.position[0] > 1) {
					this.position[0]--;
				}
			}
			else {
				if (this.position[0] < 10) {
					this.position[0]++;
				}
			}
		}
		else {
			if (this.head == "top") {
				if (this.position[1] > 1) {
					this.position[1]--;
				}
			}
			else {
				if (this.position[1] < 10) {
					this.position[1]++;
				}
			}
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
	}
}