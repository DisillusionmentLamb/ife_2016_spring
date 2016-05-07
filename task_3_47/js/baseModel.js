// 是否正在游戏
var isInGame = false;

//画布
var wrapper = {
	// 坐标大小
	size : [],
	// 坐标是否超出画布
	isOut : function (x, y) {
		return (x > wrapper.size[0] || x < 1 || y > wrapper.size[1] || y < 1);
	}
}

//秘密文件
var file = {
	// 位置
	pos : [],
	// 坐标是否为文件
	isFile : function  (x, y) {
		return (x == file.pos[0] && y == file.pos[1]);
	}
}

//墙
var wall = {
	
	// 所有墙，坐标数组
	allWall : [],

	// 判断是否是墙
	isWall : function (x, y) {
		return FUN.isInArr(x, y, wall.allWall);
	},

	// 创建随机墙
	create : function () {
		// 清除原来的墙
		wall.allWall = [];
		
		// 随机生成
		var row_left = 0; // 现在正处于左边行数
		var row_right = 0; // 现在正处于右边行数
		var num_left = 0; // 左边列数
		var num_right = 0; // 右边列数
		while (row_left < wrapper.size[1] - 2 && row_right < wrapper.size[1] - 2) {
			// 前后两行不要
			if (row_left < 2 || row_right < 2) {
				row_left += FUN.randomNum(4, 5);
				row_right += FUN.randomNum(4, 5);
				continue;
			}
			// 左边
			num_left = FUN.randomNum(1, wrapper.size[0] / 2);
			for (var i = 1; i < num_left + 1; i++) {
				wall.allWall.push([i, row_left]);
				wall.allWall.push([i, row_left + 1]);
			}
			row_left += FUN.randomNum(4, 5);
			// 右边
			num_right = FUN.randomNum(1, wrapper.size[0] / 2);
			for (var i = 0; i < num_right; i++) {
				wall.allWall.push([wrapper.size[0] - i, row_right]);
				wall.allWall.push([wrapper.size[0] - i, row_right + 1]);
			}
			row_right += FUN.randomNum(4, 5);
		}
	}
}
