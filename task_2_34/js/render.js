var render = {
	// 初始化渲染全部方格
	// 只运行一次
	init : function () {
		render.renderTopNum();
		render.renderLeftNum();
		render.renderChessBox();
		render.refresh();
	},

	// 记录小方块位置
	lastPosition : [1, 1],

	// 记录小方块指向
	lastHead : 'top',

	// 更新小方块
	refresh : function () {

		// 之前小方块
		var oldBox = document.getElementById('row-' + render.lastPosition[1] + '-col-' + render.lastPosition[0]);

		// 目前小方块
		var newBox = document.getElementById('row-' + player.position[1] + '-col-' + player.position[0]);

		// 更新指向
		if (oldBox == newBox) {
			render.rotateBox();

		// 更新位置
		} else {
			render.exchangeBox(oldBox, newBox);
		}

		// 更新记录位置
		render.lastPosition[0] = player.position[0];
		render.lastPosition[1] = player.position[1];

		// 更新记录指向
		render.lastHead = player.head;
	},

	// 替换小方块位置
	exchangeBox : function (oldBox, newBox) {
		oldBox.innerHTML = '';
		newBox.innerHTML = '<div style="transform:' + render.rotateBoxStyle() + '" id="box"><div class="head"></div><div class="box"></div></div>';
	},

	// 旋转小方块指向
	rotateBox : function () {
		var box = document.getElementById('box');
		box.style.transform = render.rotateBoxStyle(box);
	},

	// 根据head返回样式
	rotateBoxStyle : function (box) {

		var posArr = {
			'top' : 0,
			'right' : 1,
			'bottom' : 2,
			'left' : 3,
		};

		if (!box) {
			return 'rotate(' + (posArr[player.head] * 90) + 'deg)';
		}

		var degBefore = parseInt(box.style.transform.slice(7, -4));
		
		var change = posArr[player.head] - posArr[render.lastHead];

		switch (change) {
			case -3:
				change = 1;
				break;
			case 3:
				change = -1;
				break;
		}

		return 'rotate(' + (degBefore + change * 90) + 'deg)';
	},

	// 渲染顶部数字
	renderTopNum : function () {
		var html = render.createNumHtml(ChessBox.width);
		var topNum = document.getElementById('topNum');
		html = '<div></div>' + html;
		topNum.innerHTML = html;
	},

	// 渲染左边数字
	renderLeftNum : function () {
		var html = render.createNumHtml(ChessBox.height);
		var leftNum = document.getElementById('leftNum');
		leftNum.innerHTML = html;
	},

	// 渲染棋盘
	renderChessBox : function () {
		var html = render.createChessBoxHtml(ChessBox.width, ChessBox.height);
		var chessBox = document.getElementById('chessBox');
		chessBox.innerHTML = html;
	},

	// 创建数字html
	createNumHtml : function (num) {
		var html = '';
		for (var i = 1; i <= num; i++) {
			html += '<div>' + i + '</div>';
		}
		return html;
	},

	// 创建棋盘html
	createChessBoxHtml : function (width, height) {
		var html = '';
		for (var i = 1; i <= height; i++) {
			html += '<div>';
			for (var j = 1; j <= width; j++) {
				html += '<div id="row-'+ i +'-col-' + j + '"></div>';
			}
			html += '</div>';
		}
		return html;
	}
}

render.init();
