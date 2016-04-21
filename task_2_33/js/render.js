var render = {
	// 初始化渲染全部方格
	// 闭包自动运行
	// 只运行一次
	lastPosition : (function () {
		render.renderTopNum();
		render.renderLeftNum();
		render.renderChessBox();
		render.refresh();
		return window.player.position;
	})(),

	// 更新小方块
	refresh : function () {

		// 之前小方块
		var oldBox = document.getElementById('row-' + render.lastPosition.height + '-col-' + render.lastPosition.width);

		// 目前小方块
		var newBox = document.getElementById('row-' + window.player.position.height + '-col-' + window.player.position.width);

		// 替换
		render.exchangeBox(oldBox, newBox);

		// 更新指向
		render.rotateBox(newBox, window.player.head);

		// 更新位置
		render.lastPosition.width = window.player.position.width;
		render.lastPosition.height = window.player.position.height;
	},

	// 替换小方块位置
	exchangeBox : function (oldBox, newBox) {
		oldBox.innerHTML = '';
		newBox.innerHTML = '<div class="head"></div><div class="box"></div>';
	},

	// 旋转小方块指向
	rotateBox : function (newBox, head) {
		switch (head) {
			case 'left':
				newBox.style.transform = 'rotate(270deg)';
				break;
			case 'right':
				newBox.style.transform = 'rotate(90deg)';
				break;
			case 'bottom':
				newBox.style.transform = 'rotate(180deg)';
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
				html += '<div id=row-"'+ i +'-col-' + j + '"></div>';
			}
			html += '</div>';
		}
		return html;
	}
}
