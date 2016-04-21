var render = {
	// 初始化渲染全部方格
	// 只运行一次
	init : function () {
		render.renderTopNum();
		render.renderLeftNum();
		render.renderChessBox();
	},

	// 记录小方块指向
	lastHead : 'top',

	// 更新小方块
	refresh : function () {
		var box = document.getElementById('box');

		// 更新位置
		box.style.top = (player.position[1] - 1) * 50 + 'px';
		box.style.left = (player.position[0] - 1) * 50 + 'px';

		// 更新指向
		box.style.transform = render.rotateBoxStyle(box);

		// 更新记录指向
		render.lastHead = player.head;
	},

	// 根据head返回样式
	rotateBoxStyle : function (box) {

		if (render.lastHead == player.head) {
			return box.style.transform;
		}

		var posArr = {
			'top' : 0,
			'right' : 1,
			'bottom' : 2,
			'left' : 3,
		};

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
		html += '<div id="box" '
				+'style="transform:rotate(0deg);'
				+'top:' + (player.position[1] - 1) * 50 + 'px;'
				+'left:' + (player.position[0] - 1) * 50 + 'px;'
				+'">'
				+'<div id="boxHead"></div>'
				+'<div id="boxBody"></div>'
				+'</div>';
		return html;
	}
}

render.init();
