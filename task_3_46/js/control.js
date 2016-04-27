// 大概设想，按需要修改
// 所有的位置都是坐标值，不是px大小值
// canvas 顶部第一个小方格坐标是[1, 1]
var controller = {
	
	// 初始化函数
	// 根据屏幕尺寸线设置好画布大小
	// 渲染画布
	init : function () {
		
		// 绑定页面点击事件到click处理
		// some code

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

		// 任务47要在这里判断是否点击到守卫
		// 点击到守卫就发一个子弹，消灭守卫
		// 并且退出，不移动小球

		// 把坐标作为终点坐标
		// 使用model的寻路算法
		// 得到步骤数组
		var setpArr = model.ball.goTo(pos);

		// 无法走到该点就退出
		if (!setpArr) {
			return;
		}

		// 按照步骤数组渲染动画
		controller.ballMove(stepArr);

	},

	// 根据点击的点在屏幕上的位置
	// 获取该位置的坐标
	getPos : function ([x_by_px, y_by_px]) {
		// 返回坐标
	},

	// 小球移动
	// 传入每次步骤的坐标数组
	// arr = [
	// 		[x0,y0], // 起点
	// 		[x1,y1], // 中间点，不能穿墙，可以斜着走
	// 		[x2,y2],
	// 		…………
	// 		[x3,y3] // 终点
	// ]
	ballMove : function (stepArr) {

		// 遍历步骤
		for (var i = 0; i < stepArr.length; i++) {

			// 应该需要一个延时

			// 更新小球位置
			model.ball.pos = stepArr[i];
		
			// 按步骤坐标渲染小球
			render.renderBall(stepArr[i]);

			// 任务47要在这里查询小球是否到了守卫的防卫范围
			// 以及子弹是否打到小球

		}

		// 判断是否结束
		if (end) {
			// 结束就开始新游戏
			controller.startGame();
		}
	}

}

// 页面加载时调用初始化函数
controller.init();
