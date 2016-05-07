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
		// 新游戏按钮
		document.getElementById('newGame').addEventListener('click', controller.startGame);
		// 窗口缩放
		window.addEventListener('resize', controller.init);

		// 根据屏幕尺寸线设置好画布大小
		wrapper.size = FUN.getSizeByPos();

		// 开始游戏
		controller.startGame();
		
	},

	// 开始一次游戏
	startGame : function () {

		// 标定正在游戏
		isInGame = true;

		// 隐藏遮罩
		document.getElementById('mask').style.display = 'none';

		// 初始化秘密文件位置
		file.pos = [FUN.randomNum(1, wrapper.size[0]), wrapper.size[1]];

		// 初始化特工位置
		spy.pos = [FUN.randomNum(1, wrapper.size[0]), 1];
		spy.lastPos = [spy.pos[0], spy.pos[1]];

		// 生成随机墙
		wall.create();

		// 生成随机守卫
		guard.create();
		
		// 使用寻路算法判断是否能到终点
		while (spy.goTo(file.pos[0], file.pos[1]).length == 0) {
			// 不能到再次生成随机墙,直到可以
			wall.create();
		}

		// 渲染，开始游戏
		render.newGame();
	},

	// 处理页面点击事件
	click : function (event) {
		
		var e = event || window.event;

		// 根据点击的点在屏幕上的位置
		// 获取该位置的坐标
		var pos = FUN.getPos(e);

		// 判断该坐标是否为墙
		if (wall.isWall(pos[0], pos[1])) {
			// 是就退出
			return;
		}

		// 如果点击到守卫就发一个子弹，消灭守卫
		var clickGuardPos = guard.isClickGuard(pos[0], pos[1]);
		if (!spy.isFiring && clickGuardPos.length > 0) {
			// 标记为正在开火
			spy.isFiring = true;
			// 特工开火
			setTimeout(spy.fire, 300, clickGuardPos);
			return;
		}

		// 得到前往该坐标的步骤数组
		spy.moveStep = spy.goTo(pos[0], pos[1]);

		// 无法走到该点就退出
		if (!spy.moveStep || spy.moveStep.length == 0) {
			return;
		}

		// 按照步骤数组渲染动画
		controller.spyMove();

	},

	// 特工移动,使用步骤的坐标数组，依次移动
	spyMove : function () {

		// 游戏结束，不走
		if (!isInGame) {
			return;
		}

		// 走完了就退出
		if (spy.moveStep.length == 0) {
			return;
		}

		// 每步坐标
		var tmpPos = [];

		// 取第一步
		tmpPos = spy.moveStep.shift();

		// 更新特工位置
		spy.lastPos = [spy.pos[0], spy.pos[1]];
		spy.pos = [tmpPos[0], tmpPos[1]];
	
		// 渲染特工
		render.renderSpy();

		// 查询特工是否到了守卫的防卫范围
		// 获得附近守卫的数组，遍历触发守卫开火
		var guards = spy.hasGuard();
		for (var i = 0; i < guards.length; i++) {
			guard.fire(guards[i][0], guards[i][1]);
		}


		// 判断是否得到秘密文件
		if (spy.pos[0] == file.pos[0] && spy.pos[1] == file.pos[1]) {
			// 结束游戏
			controller.endGame(true);
		}

		// 还有余下步骤，延时调用自己，继续走
		if (spy.moveStep.length > 0) {
			setTimeout(function () {
				controller.spyMove();
			}, 300);
		}
	},

	// 游戏结束
	endGame : function (result) {
		// 标定游戏结束状态
		isInGame = false;
		// 按照游戏结果，显示不同消息
		if (result) {
			document.getElementById('result').innerHTML = '任务成功!';
		} else {
			document.getElementById('result').innerHTML = '任务失败!';
		}
		// 弹出消息
		document.getElementById('mask').style.display = 'block';
	}

}

// 页面加载时调用初始化函数
controller.init();
