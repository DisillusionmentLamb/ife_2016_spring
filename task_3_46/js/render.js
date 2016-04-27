// 大概设想，按需要修改
// 所有的位置都是坐标，然后用 posToRec 方法来转化为canvas的px单位的值
// canvas 顶部第一个小方格坐标是[1, 1]
var render = {
	
	// 开始新游戏
	newGame : function () {
		
		// 获取画布DOM
		// some code
		
		// 按照model的画布大小设置画布大小
		// somecode

		// 清空画布
		// some code
		
		// 从model获取墙
		// 渲染墙
		render.renderWalls(model.walls.allWall);

		// 从model获取秘密文件位置
		// 渲染秘密文件
		// some code

		// 从model获取小球位置
		// 渲染小球
		render.renderBall(model.ball.pos);

	},

	// 小球移动
	// 传入每次坐标数组
	// arr = [
	// 		[x0,y0], // 起点
	// 		[x1,y1], // 中间点，不能穿墙，可以斜着走
	// 		[x2,y2],
	// 		…………
	// 		[x3,y3] // 终点
	// ]
	ballMove : function (arr) {
		//	遍历数组
			//  依次调用 renderBall
			//  渲染小球位置
			render.renderBall(pos);
	},

	// 渲染墙
	renderWalls : function (walls) {
		// 遍历渲染
	},

	// 渲染小球
	renderBall : function (pos) {
		// 按位置渲染小球
	},

	// 画布是每20px的正方体为一个坐标点
	// 这个函数接受坐标点
	// 返回canvas可用的区域值(px为单位)
	// 比如
	// pos = [2, 2]
	// 返回
	//  {
	//  	'start_x' : 20, // 开始x位置，均相对于canvas起点，px单位
	//  	'start_y' : 20, // 开始y位置
	//  	'x_len' : 20, // 长度
	//  	'y_len' : 20 // 宽度
	//  }
	posToRec : function (pos) {
		// some code
	}

}
