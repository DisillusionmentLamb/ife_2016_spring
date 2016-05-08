/**
 * 渲染类
 */
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

		// 渲染特工
		render.renderSpy();

		// 渲染守卫
		render.renderGuard();

	},

	// 渲染墙
	renderWalls : function () {
		var ctx = render.getCtx();
		for (var i = 0; i < wall.allWall.length; i++) {
			render.fillRec(wall.allWall[i][0], wall.allWall[i][1], '#2E1E1E');
		}
	},

	// 渲染特工
	renderSpy : function () {
		// 之前位置填充背景色
		render.fillRec(spy.lastPos[0], spy.lastPos[1], '#FFE6CD');
		// 画新位置
		render.fillRec(spy.pos[0], spy.pos[1], '#44B811');
	},

	// 得到canvas DOM
	getCanvas : function () {
		return document.getElementById('wrap');
	},

	// 得到画布
	getCtx : function () {
		return document.getElementById('wrap').getContext('2d');
	},

	// 填充一个位置,20*20正方形
	fillRec : function (x, y, color) {
		var ctx = render.getCtx();
		ctx.fillStyle = color;
		ctx.fillRect((x - 1) * 20, (y - 1) * 20, 20, 20);
	},

	// 渲染秘密文件
	renderFile : function () {
		render.fillRec(file.pos[0], file.pos[1], '#F4AF29');
	},

	// 清空画布
	emptyCanvas : function () {
		var ctx = render.getCtx()
		ctx.fillStyle = '#FFE6CD';
		ctx.fillRect(0, 0, wrapper.size[0] * 20, wrapper.size[1] * 20);
	},

	// 设置画布大小
	setSize : function () {
		var wrap = render.getCanvas();
		// 按照20px一个方块，划出画布
		wrap.setAttribute('height', (wrapper.size[1] * 20).toString() + 'px');
		wrap.setAttribute('width', (wrapper.size[0] * 20).toString() + 'px');
		// 除不尽的放周围
		wrap.style.marginTop = (((window.document.documentElement.clientHeight - 70) % 20) / 2 + 30).toString() + 'px';
		wrap.style.marginLeft = ((window.document.documentElement.clientWidth % 20) / 2).toString() + 'px';
	},

	// 渲染守卫
	renderGuard : function () {
		for (var i = 0; i < guard.allGuards.length; i++) {
			render.fillRec(guard.allGuards[i][0], guard.allGuards[i][1], '#E65844');
		}
	},

	// 渲染子弹
	renderBullet : function (x, y, who) {
		x = parseInt(x);
		y = parseInt(y);
		var ctx = render.getCtx();
		// 按照创建者不同，设置子弹不同颜色
		if (who == 'spy') {
			ctx.fillStyle = '#44B811';
		} else {
			ctx.fillStyle = '#E65844';
		}
		// 画一个半径为5的子弹
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, 2 * Math.PI);
		ctx.fill();
	},

	// 清除子弹前一位置
	removeBullet : function (x, y, who) {
		
		x = parseInt(x);
		y = parseInt(y);

		var ctx = render.getCtx();
		var has = 0;
		var index = 0;

		// 如果是特工的子弹，并且子弹还与特工相邻
		if (who == 'spy' && bulletsPool.isBulletInRect([x, y], spy.pos)) {
			has = 1;
		}
		// 如果是守卫的子弹，并且子弹还与守卫相邻
		if (has == 0 && who == 'guard') {
			for (var i = 0; i < guard.allGuards.length; i++) {
				if (bulletsPool.isBulletInRect([x, y], guard.allGuards[i])) {
					has = 2;
					index = i;
					break;
				}
			}
		}
		
		// 填充之前子弹为画布背景色
		ctx.fillStyle = '#FFE6CD';
		ctx.fillRect(x - 5, y - 5, 10, 10);		

		// 如果子弹与特工或者守卫相邻，重新画一下特工或者守卫
		// 以免刚才填充背景色正好覆盖了守卫或特工
		if (has == 1) {
			render.fillRec(spy.pos[0], spy.pos[1], '#44B811');
		}
		if (has == 2) {
			render.fillRec(guard.allGuards[index][0], guard.allGuards[index][1], '#E65844');
		}
	},

	// 渲染底部按钮
	showMenu : function (type) {
		switch (type) {
			case 'start':
				document.getElementById('newGame').style.display = 'block';
				document.getElementById('msg').style.display = 'block';
				break;
			case 'stop':
				document.getElementById('newGame').style.display = 'none';
				document.getElementById('stopGame').style.display = 'none';
				document.getElementById('startGame').style.display = 'block';
				document.getElementById('msg').style.display = 'none';
				break;
			default:
				document.getElementById('newGame').style.display = 'none';
				document.getElementById('stopGame').style.display = 'block';
				document.getElementById('startGame').style.display = 'none';
				document.getElementById('msg').style.display = 'none';
				break;
		}
	}

}
