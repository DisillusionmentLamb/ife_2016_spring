// 大概设想，按需要修改
// 所有的位置都是坐标值，不是px大小值
// canvas 顶部第一个小方格坐标是[1, 1]
var model = {
	
	// 画布大小
	wrap : [x, y],

	// 秘密文件位置
	file : [x, y],

	// 小球
	ball : {
		
		// 位置
		pos : [x, y],
		
		// 寻路算法
		// 传入终点坐标
		goTo : function ([x, y]) {
			// 返回小方块每步的位置的数组
			// 不能穿墙，可以走斜线
			// arr = [
			// 		[x0,y0], // 起点
			// 		[x1,y1], // 中间点，不能穿墙，可以斜着走
			// 		[x2,y2],
			// 		…………
			// 		[x3,y3] // 终点
			// ]
			// return arr
		}

	},

	// 墙
	walls : {
		
		// 所有墙，坐标数组
		allWall : [ [x, y], [x, y]],
		
		// 创建随机墙
		create : function () {
			// 需要有些墙是连在一起的
			// 不能超出画布大小
			// 返回墙的数组
		}
	}

}