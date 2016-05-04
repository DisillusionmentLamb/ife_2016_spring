// 大概设想，按需要修改
// 所有的位置都是坐标，然后用 posToRec 方法来转化为canvas的px单位的值
// canvas 顶部第一个小方格坐标是[1, 1]
var render = {
	
	// 开始新游戏
	newGame : function () {
		
		// 按照model的画布大小设置画布大小
		render.setSize();

		// 清空画布
		render.emptyCanvas();
		
		// 渲染墙
		render.renderWalls();

		// 渲染秘密文件
		render.renderFile();

		// 渲染小球
		render.renderBall();

		// 渲染守卫
		render.renderGuard();

	},

	// 渲染墙
	renderWalls : function () {
		var ctx = render.getCtx();
		for (var i = 0; i < model.walls.allWall.length; i++) {
			render.fillRec(model.walls.allWall[i][0], model.walls.allWall[i][1], '#2E1E1E');
		}
	},

	// 渲染小球
	renderBall : function () {
		render.fillRec(model.ball.lastPos[0], model.ball.lastPos[1], '#FFE6CD');
		render.fillRec(model.ball.pos[0], model.ball.pos[1], '#44B811');
	},

	// 得到canvas
	getCanvas : function () {
		return document.getElementById('wrap');
	},

	getCtx : function () {
		return document.getElementById('wrap').getContext('2d');
	},

	// 填充一个位置,20*20正方形
	fillRec : function (x, y, color) {
		var ctx = render.getCtx();
		ctx.fillStyle = color;
		ctx.fillRect((x - 1) * 20, (y - 1) * 20, 20, 20);
	},

	// 填充子弹
	fillCircle : function (x, y, color) {
		var ctx = render.getCtx();
		ctx.fillStyle = color;
		if (color == '#44B811') {
			ctx.beginPath();
			ctx.arc(x, y, 5, 0, 2 * Math.PI);
			ctx.fill();
		} else {
			ctx.fillRect(x - 5, y - 5, 10, 10);
		}
	},

	// 渲染秘密文件
	renderFile : function () {
		render.fillRec(model.file[0], model.file[1], '#F4AF29');
	},

	// 清空画布
	emptyCanvas : function () {
		var ctx = render.getCtx()
		ctx.fillStyle = '#FFE6CD';
		ctx.fillRect(0, 0, model.wrap[0] * 20, model.wrap[1] * 20);
	},

	// 设置画布大小
	setSize : function () {
		var wrap = render.getCanvas();
		wrap.setAttribute('height', (model.wrap[1] * 20).toString() + 'px');
		wrap.setAttribute('width', (model.wrap[0] * 20).toString() + 'px');
		wrap.style.marginTop = ((window.screen.height % 20) / 2).toString() + 'px';
		wrap.style.marginLeft = ((window.screen.width % 20) / 2).toString() + 'px';
	},

	// 渲染守卫
	renderGuard : function () {
		for (var i = 0; i < model.guards.allGuards.length; i++) {
			render.fillRec(model.guards.allGuards[i][0], model.guards.allGuards[i][1], '#E65844');
		}
	},

	// 渲染子弹
	renderBullet : function (x, y, color) {
		render.fillCircle(x, y, '#44B811');
	},

	// 清除子弹前一位置
	removeBullet : function (x, y) {
		render.fillCircle(x, y, '#FFE6CD');
	}

}
