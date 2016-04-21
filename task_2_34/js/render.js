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

	// 更新小方块
	refresh : function () {

		// 之前小方块
		var oldBox = document.getElementById('row-' + render.lastPosition[1] + '-col-' + render.lastPosition[0]);

		// 目前小方块
		var newBox = document.getElementById('row-' + window.player.position[1] + '-col-' + window.player.position[0]);

		// 更新指向
		if (oldBox == newBox) {
			render.rotateBox();

		// 更新位置
		} else {
			render.exchangeBox(oldBox, newBox);
		}

		// 更新记录位置
		render.lastPosition[0] = window.player.position[0];
		render.lastPosition[1] = window.player.position[1];
	},

	// 替换小方块位置
	exchangeBox : function (oldBox, newBox) {
		oldBox.innerHTML = '';
		newBox.innerHTML = '<div style="transform:' + render.rotateBoxStyle() + '" id="box"><div class="head"></div><div class="box"></div></div>';
	},

	// 旋转小方块指向
	rotateBox : function () {
		var box = document.getElementById('box');
		box.style.transform = render.rotateBoxStyle();
	},

	// 根据head返回样式
	rotateBoxStyle : function () {
		switch (window.player.head) {
			case 'left':
				return 'rotate(270deg)';
				break;
			case 'bottom':
				return 'rotate(180deg)';
				break;
			case 'right':
				return 'rotate(90deg)';
				break;
			default : 
				return 'rotate(0deg)';
				break;
		}
	},

	// 渲染顶部数字
	renderTopNum : function () {
		var html = render.createNumHtml(window.ChessBox.width);
		var topNum = document.getElementById('topNum');
		html = '<div></div>' + html;
		topNum.innerHTML = html;
	},

	// 渲染左边数字
	renderLeftNum : function () {
		var html = render.createNumHtml(window.ChessBox.height);
		var leftNum = document.getElementById('leftNum');
		leftNum.innerHTML = html;
	},

	// 渲染棋盘
	renderChessBox : function () {
		var html = render.createChessBoxHtml(window.ChessBox.width, window.ChessBox.height);
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
