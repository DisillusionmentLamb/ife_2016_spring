// 大概设想，按需要修改
// 所有的位置都是坐标值，不是px大小值
// canvas 顶部第一个小方格坐标是[1, 1]
var controller = {
	
	// 初始化函数
	// 根据屏幕尺寸线设置好画布大小
	// 渲染画布
	init : function () {
		
		// 根据屏幕尺寸线设置好画布大小
		// 每20px一个坐标点，有余数放两边
		// 画布大小存在model里，坐标值个数
		// some code
		model.wrap = [x, y];

		// 开始游戏
		controller.startGame();
		
	},

	// 开始一次游戏
	startGame : function () {

		// 初始化秘密文件位置
		model.file = [x, y];

		// 初始化小球位置
		model.pos = [x, y];

		// 初始化墙
		// 生成随机墙
		var randomWalls = model.walls.create();
		
		// 使用寻路算法判断是否能到终点
		if (!ok) {
			// 不能到再次生成随机墙直到可以
			randomWalls = model.walls.create();
		}
		
		// 设置墙
		model.walls.allWall = randomWalls;

		// 渲染，开始游戏
		render.newGame();
	},

	// 处理页面点击事件
	click : function (e) {

		// 根据点击的点在屏幕上的位置
		// 获取该位置的坐标
		var pos = controller.getPos([x_by_px, y_by_px]);

		// 判断该坐标是否为墙
		if (isWall) {
			// 是就退出
			return;
		}

		// 把坐标作为终点坐标
		// 使用model的寻路算法
		// 得到步骤数组
		var setpArr = model.ball.goTo(pos);

		// 无法走到该点就退出
		if (!setpArr) {
			return;
		}

		// 按照步骤数组渲染动画
		render.ballMove(stepArr);

		// 更新小球位置
		model.ball.pos = pos;

		// 判断是否结束
		if (end) {
			// 结束就开始新游戏
			controller.startGame();
		}
	},

	// 根据点击的点在屏幕上的位置
	// 获取该位置的坐标
	getPos : function ([x_by_px, y_by_px]) {
		// 返回坐标
	}

}

// 页面加载时调用初始化函数
controller.init();
