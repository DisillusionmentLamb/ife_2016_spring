// 大概设想，按需要修改
// 所有的位置都是坐标值，不是px大小值
// canvas 顶部第一个小方格坐标是[1, 1]
var controller = {
	
	// 初始化函数
	// 根据屏幕尺寸线设置好画布大小
	// 渲染画布
	init : function () {
		
		// 绑定页面点击事件到click处理
		document.getElementById('wrap').addEventListener('click', controller.click);
		document.getElementById('newGame').addEventListener('click', function () {
			window.location.reload();
		});
		window.addEventListener('resize', controller.init);

		// 根据屏幕尺寸线设置好画布大小
		// 每20px一个坐标点，有余数放两边
		// 画布大小存在model里，坐标值个数
		model.wrap = [parseInt(window.document.documentElement.clientWidth / 20), parseInt(window.document.documentElement.clientHeight / 20)];

		// 开始游戏
		controller.startGame();
		
	},

	// 开始一次游戏
	startGame : function () {

		// 隐藏遮罩
		document.getElementById('mask').style.display = 'none';

		// 初始化秘密文件位置
		model.file = [parseInt(Math.random() * model.wrap[0] + 1), model.wrap[1]];

		// 初始化小球位置
		model.ball.pos = [parseInt(Math.random() * model.wrap[0] + 1), 1];
		model.ball.lastPos = [model.ball.pos[0], model.ball.pos[1]];

		// 初始化墙
		// 生成随机墙
		model.walls.create();

		// 生成守卫
		model.guards.create();
		
		// 使用寻路算法判断是否能到终点
		while (model.ball.goTo(model.file[0], model.file[1]).length == 0) {
			// 不能到再次生成随机墙直到可以
			model.walls.create();
		}

		// 渲染，开始游戏
		render.newGame();
	},

	// 处理页面点击事件
	click : function (event) {
		var e = event || window.event;

		// 根据点击的点在屏幕上的位置
		// 获取该位置的坐标
		var pos = controller.getPos(e);

		// 判断该坐标是否为墙
		if (model.walls.isWall(pos[0], pos[1])) {
			// 是就退出
			return;
		}

		// 任务47要在这里判断是否点击到守卫
		// 点击到守卫就发一个子弹，消灭守卫
		// 并且退出，不移动小球
		if (model.guards.isGuard(pos[0], pos[1])) {
			var deg = controller.getDeg(model.ball.pos[0], model.ball.pos[1], pos[0], pos[1]);
			model.bulletsPool.getABullet(model.ball.pos[0], model.ball.pos[1], deg, 'ball');
			return;
		}

		// 把坐标作为终点坐标
		// 使用model的寻路算法
		// 得到步骤数组
		model.ball.moveStep = model.ball.goTo(pos[0], pos[1]);

		// 无法走到该点就退出
		if (!model.ball.moveStep || model.ball.moveStep.length == 0) {
			return;
		}

		// 按照步骤数组渲染动画
		controller.ballMove();

	},

	// 计算角度
	getDeg : function (x1, y1, x2, y2) {
		var deg = Math.atan2(x2 - x1, y1 - y2) / Math.PI * 180;
		if (deg < 0) {
			deg += 360;
		}
		return deg;
	},

	// 根据点击的点在屏幕上的位置
	// 获取该位置的坐标
	getPos : function (e) {
		var width = e.clientX;
		var height = e.clientY;
		return [parseInt(width / 20 + 1), parseInt(height / 20 + 1)];
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
	ballMove : function () {

		if (model.ball.moveStep.length == 0) {
			return;
		}

		var tmpPos = [];

		tmpPos = model.ball.moveStep.shift();

		// 更新小球位置
		model.ball.lastPos = [model.ball.pos[0], model.ball.pos[1]];
		model.ball.pos = [tmpPos[0], tmpPos[1]];
	
		// 渲染小球
		render.renderBall();

		// 任务47要在这里查询小球是否到了守卫的防卫范围
		// 以及子弹是否打到小球
		var guards = controller.hasGuard(model.ball.pos[0], model.ball.pos[1]);
		var deg = 0;
		for (var i = 0; i < guards.length; i++) {
			deg = controller.getDeg(guards[i][0], guards[i][1], model.ball.pos[0], model.ball.pos[1]);
			model.bulletsPool.getABullet(guards[i][0], guards[i][1], deg, 'guard');
		}


		// 判断是否结束
		if (model.ball.pos[0] == model.file[0] && model.ball.pos[1] == model.file[1]) {
			// 结束就开始新游戏
			controller.endGame(true);
		}

		if (model.ball.moveStep.length > 0) {
			setTimeout(function () {
				controller.ballMove();
			}, 200);
		}
	},

	// 查询附近是否有守卫, 返回守卫坐标（数组）
	hasGuard : function (x, y) {
		var guards = [];
		for (var i = 0; i < model.guards.allGuards.length; i++) {
			if (Math.abs(model.guards.allGuards[i][0] - x) <= 4 || Math.abs(model.guards.allGuards[i][1] - y) <= 4) {
				if (controller.getDistance(model.guards.allGuards[i][0], model.guards.allGuards[i][1], x, y) <= 80) {
					guards.push([model.guards.allGuards[i][0], model.guards.allGuards[i][1]]);
				}
			}
		}
		return guards;
	},

	// 计算距离
	getDistance : function (x1, y1, x2, y2) {
		return Math.sqrt(Math.pow((x1 - x2) * 20, 2) + Math.pow((y1 - y2) * 20, 2));
	},

	// 游戏结束
	endGame : function (result) {
		model.ball.moveStep = [];
		if (result) {
			document.getElementById('result').innerHTML = '任务成功!';
			document.getElementById('mask').style.display = 'block';
		} else {
			document.getElementById('result').innerHTML = '任务失败!';
			document.getElementById('mask').style.display = 'block';
		}
	}

}

// 页面加载时调用初始化函数
controller.init();
