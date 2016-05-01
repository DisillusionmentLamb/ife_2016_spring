"use strict";
var controller = {
	// 错误行数
	falseRow : [],
	// 是否正在处理命令，是的情况下拒绝接受命令
	isExecuting : false,
	// 对用户输入的命令进行解析并调用方块方法
	execute : function(command) {
		// 标记为正在处理命令
		controller.isExecuting = true;

		// 如果command为空，退出
		if (command == '' || command == undefined || command == []) {
			// 标记为不在处理命令
			controller.isExecuting = false;
			return false;
		}

		// 取出第一条命令
		var commandArr = command.shift().split(" ");
		// 是否需要等待1s
		var result = (function () {
			// 处理命令
			switch (commandArr[0]) {
				case "TUN":
					controller.changeHead(commandArr[1]);
					return true;
					break;
				case "HEAD":
					if (player.head == commandArr[1]) {
						return false;
					}
					return player.head = commandArr[1];
					break;
				case "TRA":
					if (commandArr[1] == "LEF" || commandArr[1] == "RIG") {
						
						if (commandArr[1] == "LEF") {
							return player.move('left');
						}
						else {
							return player.move('right');
						}
					}
					if (commandArr[1] == "TOP" || commandArr[1] == "BOT") {
						if (commandArr[1] == "TOP") {
							return player.move('top');
						}
						else {
							return player.move('down');
						}
					}
					break;
				// 处理 MOV TO 指令
				case "MOV":
					var positionArr = commandArr[2].split(",");
					var stepArr = controller.findWay(positionArr[0], positionArr[1]);
					var toArr = controller.createCommand(stepArr);
					command = toArr.concat(command);
					controller.execute(command);
					return 'quit';
					break;
				case "GO":
					return player.playerGo();
					break;
				case "BUILD":
					return player.buildWall();
					break;
				case "BRU":
					var x = player.position[0];
					var y = player.position[1];
					switch (player.head) {
						case 'top':
							y -= 1;
							break;
						case 'right':
							x += 1;
							break;
						case 'bottom':
							y += 1;
							break;
						default:
							x -= 1;
							break;
					}
					return render.setWallColor(x, y, commandArr[1]);
					break;
				default:
					console.log("command false");
					return false;
					break;
			}
		})();

		// 处理MOV TO 指令时，退出本轮，调用下一轮
		if (result == 'quit') {
			return true;
		}

		// 需要等待时
		if (result) {
			// 延时处理
			setTimeout(function (){
				//渲染
				render.refresh();
				// 继续处理余下命令
				controller.execute(command);
			}, 1000);
		
		// 不需要等待时
		} else {
			controller.execute(command);
		}
		
	},
	
	// 根据传入方向改变player.head方向
	changeHead : function(directString) {
		switch (directString) {
			case "LEF":
				player.turnLeft();
				break;
			case "RIG":
				player.turnRight();
				break;
			case "BAC":
				player.turnBack();
				break;
			default:
				console.log("command false!");
		}
	},
	
	// 判断命令是否合法
	check : function(commandStr) {
		var commandArr = commandStr.split(" ");
		switch (commandArr[0]) {
			case "TUN":
				if (commandArr[1] == "LEF" || commandArr[1] == "RIG" || commandArr[1] == "BAC") {
					return true;
				}
				else {
					return false;
				}
				break;
			case "MOV":
				if (commandArr[1] == "LEF" || commandArr[1] == "RIG" || commandArr[1] == "TOP" || commandArr[1] == "BOT" || commandArr[1] == "TO") {
					if (commandArr[2] == undefined || commandArr[2].length > 0) {
						// mov to 指令后面需要正确的坐标
						if (commandArr[1] == "TO") {
							if (commandArr[2] == undefined || !commandArr[2]) {
								return false;
							}
							var comm = commandArr[2].split(',');
							if (comm[0] == undefined || comm[1] == undefined || !(comm[0] > 0) || !(comm[0] < 11) || !(comm[1] > 0) || !(comm[1] < 11)) {
								return false;
							}
						}
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return false;
				}
				break;
			case "TRA":
				if (commandArr[1] == "LEF" || commandArr[1] == "RIG" || commandArr[1] == "TOP" || commandArr[1] == "BOT") {
					if (commandArr[2] == undefined || /^\d+$/.test(commandArr[2])) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return false;
				}
				break;
			case "GO":
				if (commandArr[1] == undefined || /^\d+$/.test(commandArr[1])) {
					return true;
				}
				else {
					return false;
				}
				break;
			case "BUILD":
				if (commandArr[1] == undefined) {
					return true;
				}
				else {
					return false;
				}
				break;
			case "BRU":
				if (commandArr[1] != undefined) {
					return true;
				}
				else {
					return false;
				}
			default:
				return false;
				break;
		}
	},
	// A*寻路算法，接受目标位置坐标
	findWay : function(target_x, target_y) {
		//目标越界，退出
		if (target_y > 10 || target_y < 1 || target_x < 1 || target_x > 10) {
			return [];
		}
		//目标是墙，退出
		if (player.isWall(target_x, target_y)) {
			return [];
		}

		// 目前位置
		var nowNode = new Node(player.position[0], player.position[1], null);
		// 目标位置
		var target = new Node(target_x, target_y, null);
		// 开放列表
		var openList = [];
		// 关闭列表
		var closeList = [];
		// 左右上下移动花费
		var cost = 10;
		// 结果路径
		var resultList = [];

		// 把开始位置放入开放列表
		openList.push(nowNode);
		// 查找最短路径
		resultList = search(nowNode, target);

		// 查找路径
		function search (nowNode, target) {
			// 结果
			var resultList = [];
			// 是否到达终点
			var isFind = false;
			// 当前节点
			var node = null;
			// 查找直到开放列表为空
			while (openList.length > 0) {
				// 从开放列表取出一个作为当前节点
				node = openList.pop();
				// 找到就退出
				if (node.x == target.x && node.y == target.y) {
					isFind = true;
					break;
				}
				// 上
				if (node.y > 1) {
					checkPath(node.x, node.y - 1, node, target);
				}
				// 下
				if (node.y < 10) {
					checkPath(node.x, node.y + 1, node, target);
				}
				// 左
				if (node.x > 1) {
					checkPath(node.x - 1, node.y, node, target);
				}
				// 右
				if (node.x < 10) {
					checkPath(node.x + 1, node.y, node, target);
				}
				// 当前节点放入关闭列表
				closeList.push(node);
				// 开放列表按照f值大小排序
				openList.sort(sortFun);
			}
			// 找到就去得到路径
			if (isFind) {
				getPath(resultList, node);
			}
			// 返回路径
			return resultList;
		}
		// 检查节点是否可用
		function checkPath (x, y, parentNode, target) {
			// 新建节点，设置父节点
			var node = new Node(x, y, parentNode);
			// 是墙就push到关闭列表
			if (player.isWall(x, y)) {
				closeList.push(node);
				return false;
			}
			// 处于关闭列表里，退出
			if (isInList(closeList, x, y) != -1) {
				return false;
			}
			var index = isInList(openList, x, y);
			// 原先处于开放列表，更新f值
			if (index != -1) {
				if ((parentNode.g + cost) < openList[index].g) {
					node.parentNode = parentNode;
					countFGH(node, target);
					openList[index] = node;
				}
			// 原来不处于开放列表，push到开放列表，设置f值
			} else {
				node.parentNode = parentNode;
				countFGH(node, target);
				openList.push(node);
			}
			return true;
		}
		// 是否处于一个列表里，返回index，否则返回-1
		function isInList (list, x, y) {
			var i;
			for (i = 0; i < list.length; i++) {
				if (list[i].x == x && list[i].y == y) {
					return i;
				}
			}
			return -1;
		}
		// 计算 f,s,h
		function countFGH (now, target) {
			// g为父节点g加上花费
			if (now.parentNode == null || now.parentNode == undefined) {
				now.g = cost;
			} else {
				now.g = now.parentNode.g + cost;
			}
			// h是距离终点的x加y差值乘以花费
			now.h = (Math.abs(now.x - target.x) + Math.abs(now.y - target.y)) * cost;
			// f = g + h
			now.f = now.g + now.h;
		}
		// 按f值倒序排列
		function sortFun (one, two) {
			return two.f - one.f;
		}
		// 节点类
		function Node (x, y, parentNode) {
			this.x = x;
			this.y = y;
			this.parentNode = parentNode;
			this.g = 0;
			this.h = 0;
			this.f = 0;
		}
		// 得到路径
		function getPath (resultList, node) {
			resultList.unshift([node.x, node.y]);
			if (node.parentNode != null && node.parentNode != undefined) {
				getPath(resultList, node.parentNode);
			}
		}
		
		// 返回路径数组
		return resultList;
	},

	// 根据寻路算法返回的路径生成动画命令
	createCommand : function(walkedArr) {

		// 判断是否需要旋转
		function needTurn (direction) {
			for (var i = commandArr.length - 1; i >= 0; i--) {
				if (commandArr[i].substring(0, 4) == 'HEAD'){
					if (commandArr[i] == 'HEAD ' + direction) {
						return false;
					} 
					return true;
				}
			}
			return true;
		}

		// 如果传入空，返回空
		if (walkedArr == undefined || !walkedArr || walkedArr == []) {
			return [];
		}

		// 初始化命令数组
		var commandArr = [];
		// 遍历生成命令
		for (var i = 1; i < walkedArr.length; i++) {
			// 系统内部加一个HEAD指令，更改head
			// 下一位置x坐标大，右移
			if (walkedArr[i][0] > walkedArr[i-1][0] && needTurn('right')) {
				commandArr.push('HEAD right');
				
			// 下一位置x坐标小，左移
			} else if (walkedArr[i][0] < walkedArr[i-1][0] && needTurn('left')) {
				commandArr.push('HEAD left');
			}
			
			// 下一位置y坐标大，下移
			if (walkedArr[i][1] > walkedArr[i-1][1] && needTurn('bottom')) {
				commandArr.push('HEAD bottom');
			
			// 下一位置y坐标小，上移
			} else if (walkedArr[i][1] < walkedArr[i-1][1] && needTurn('top')) {
				commandArr.push('HEAD top');
			}

			commandArr.push('GO');
		}

		return commandArr;
		
	},
	// 随机墙
	randomWall : function () {
		// 初始化，清除原来的墙
		render.init();
		ChessBox.Walls = [];

		// 随机生成
		// 墙的数量
		var num = parseInt(Math.random() * 40);
		
		// 缓存将要生成的墙的坐标
		var x = 0;
		var y = 0;

		// 循环生成
		for (var i = 0; i < num; i++) {
			
			x = parseInt(Math.random() * 10 + 1);
			y = parseInt(Math.random() * 10 + 1);
			
			// 不是墙就设为墙
			if (!player.isWall(x, y) && !(x == player.position[0] && y == player.position[1])) {
				ChessBox.Walls.push([x, y]);
			}

		}

		render.refresh();
	},

	// 有趣的墙
	interestingWall : function () {
		var wall = {
			heart : [
				[1, 4, 'F44336'],
				[1, 5, 'F44336'],
				[2, 3, 'F44336'],
				[2, 6, 'F44336'],
				[3, 2, 'F44336'],
				[3, 7, 'F44336'],
				[4, 2, 'F44336'],
				[4, 8, 'F44336'],
				[5, 3, 'F44336'],
				[5, 9, 'F44336'],
				[10, 4, 'F44336'],
				[10, 5, 'F44336'],
				[9, 3, 'F44336'],
				[9, 6, 'F44336'],
				[8, 2, 'F44336'],
				[8, 7, 'F44336'],
				[7, 2, 'F44336'],
				[7, 8, 'F44336'],
				[6, 3, 'F44336'],
				[6, 9, 'F44336']
			],
			baidu : [
				[1, 5, '4D82E4'],
				[1, 6, '4D82E4'],
				[2, 5, '4D82E4'],
				[2, 6, '4D82E4'],
				[2, 9, '4D82E4'],
				[3, 3, '4D82E4'],
				[3, 4, '4D82E4'],
				[3, 8, '4D82E4'],
				[3, 9, '4D82E4'],
				[4, 3, '4D82E4'],
				[4, 4, '4D82E4'],
				[4, 7, '4D82E4'],
				[4, 8, '4D82E4'],
				[4, 9, '4D82E4'],
				[5, 7, '4D82E4'],
				[5, 8, '4D82E4'],
				[5, 9, '4D82E4'],
				[10, 5, '4D82E4'],
				[10, 6, '4D82E4'],
				[9, 5, '4D82E4'],
				[9, 6, '4D82E4'],
				[9, 9, '4D82E4'],
				[8, 3, '4D82E4'],
				[8, 4, '4D82E4'],
				[8, 8, '4D82E4'],
				[8, 9, '4D82E4'],
				[7, 3, '4D82E4'],
				[7, 4, '4D82E4'],
				[7, 7, '4D82E4'],
				[7, 8, '4D82E4'],
				[7, 9, '4D82E4'],
				[6, 7, '4D82E4'],
				[6, 8, '4D82E4'],
				[6, 9, '4D82E4']
			],
			google : [
				[2, 5, 'FBBC05'],
				[2, 6, 'FBBC05'],
				[3, 4, 'EA4335'],
				[3, 7, '34A853'],
				[4, 3, 'EA4335'],
				[4, 8, '34A853'],
				[5, 2, 'EA4335'],
				[5, 9, '34A853'],
				[6, 2, 'EA4335'],
				[6, 5, '4285F4'],
				[6, 9, '34A853'],
				[7, 5, '4285F4'],
				[7, 8, '34A853'],
				[8, 5, '4285F4'],
				[8, 7, '4285F4'],
				[9, 5, '4285F4'],
				[9, 6, '4285F4']
			]
		}

		var whichWall = '';
		switch (parseInt(Math.random() * 3)) {
			case 0:
				whichWall = 'heart';
				break;
			case 1:
				whichWall = 'baidu';
				break;
			default:
				whichWall = 'google';
				break;
		}
		return wall[whichWall];
	},

	// 为页面添加事件代理
	addPageDelegate : function() {
		var commandBtn = document.getElementById("commandBtn");
		var refreshBtn = document.getElementById("refreshBtn");
		var randomWall = document.getElementById("randomWall");
		var interestingWall = document.getElementById("interestingWall");
		var textarea = document.getElementById("commandTextarea");
		var chessBox = document.getElementById("chessBox");
		commandBtn.addEventListener("click", function() {
			if (!controller.isReady()) {
				return;
			}
			if (controller.falseRow.length == 0 && textarea.value) {
				var commandArr = textarea.value.split(/\n/);
				if (!commandArr || commandArr.length == 0) {
					return false;
				}
				commandArr = controller.correctCommand(commandArr);
				controller.execute(commandArr);
			} else {
				alert("输入命令不合法");
			}
		}, false);

		refreshBtn.addEventListener('click', function () {
			render.emptyCommand();
		}, false);

		randomWall.addEventListener('click', function () {
			if (controller.isReady()) {
				controller.randomWall();
			}
		}, false);

		chessBox.addEventListener('mouseup', function (e) {
			if (e.target && /row/.test(e.target.getAttribute('id')) && e.button == 2) {
				var arr = e.target.getAttribute('id').split('-');
				if (controller.isReady()) {
					controller.execute(['MOV TO '+arr[3]+','+arr[1]]);
				}
			}
		}, false);

		chessBox.addEventListener('contextmenu', function (e) {
			if (document.all) {
				window.event.returnValue = false;// for IE  
			} else {
				event.preventDefault();  
			}
		}, false);

		chessBox.addEventListener('click', function (e) {
			if (e.target && /row/.test(e.target.getAttribute('id'))) {
				var arr = e.target.getAttribute('id').split('-');
				if (controller.isReady()) {
					player.buildWall(parseInt(arr[3]), parseInt(arr[1]));
					render.renderWall();
				}
			}
		}, false);

		interestingWall.addEventListener('click', function () {
			if (!controller.isReady()) {
				return;
			}

			// 初始化，清除原来的墙
			render.init();
			ChessBox.Walls = [];

			var wall = controller.interestingWall();
			for (var i = 0; i < wall.length; i++) {
				ChessBox.Walls.push([wall[i][0], wall[i][1]]);
				render.refresh();
				render.setWallColor(wall[i][0], wall[i][1], wall[i][2]);
			}
		}, false);

		textarea.addEventListener("keyup", function(event) {
			if (event.keyCode == 13) {
				var rows = textarea.value.split(/\n/).length;
				render.renderCommandLine(rows, []);
			}
		}, false);
		textarea.addEventListener("blur", function() {
			var commandArr = textarea.value.split(/\n/);
			for (var i = 0; i < commandArr.length; i++) {
				// 如果错误加入数组
				if (!controller.check(commandArr[i])) {
					var temp = i + 1;
					controller.falseRow.push(temp);
				}
				else {
					// 如果输入正确将之前存放行数从数组中移除
					for (var j = 0; j < controller.falseRow; j++) {
						if (controller.falseRow[j] == ++i) {
							controller.falseRow.splice(j, 1);
						}
					}
				}
			}
			render.renderCommandLine(commandArr.length, controller.falseRow);
		}, false);
		textarea.addEventListener("scroll", function() {
			document.getElementById("commandLine").scrollTop = textarea.scrollTop;
		}, false);
	},

	// 将复杂命令全部转化为简单命令
	// 这样每个命令都是移动一个位置，或者变换方向
	// 方便统一动画时间，避免动画延时不同带来bug
	correctCommand : function (commandArr) {
		var command = [];
		var okCommand = [];
		for (var i = 0; i < commandArr.length; i++) {
			command = commandArr[i].split(" ");
			switch (command[0]) {
				case "MOV":
					switch (command[1]) {
						case "LEF":
							okCommand.push('HEAD left');
							if (command[2] > 0) {
								for (var i = 0; i < command[2]; i++) {
									okCommand.push('GO');
								}
							} else {
								okCommand.push('GO');
							}
							break;
						case "RIG":
							okCommand.push('HEAD right');
							if (command[2] > 0) {
								for (var i = 0; i < command[2]; i++) {
									okCommand.push('GO');
								}
							} else {
								okCommand.push('GO');
							}
							break;
						case "TOP":
							okCommand.push('HEAD top');
							if (command[2] > 0) {
								for (var i = 0; i < command[2]; i++) {
									okCommand.push('GO');
								}
							} else {
								okCommand.push('GO');
							}
							break;
						case "BOT":
							okCommand.push('HEAD bottom');
							if (command[2] > 0) {
								for (var i = 0; i < command[2]; i++) {
									okCommand.push('GO');
								}
							} else {
								okCommand.push('GO');
							}
							break;
						
						// MOV TO 指令到实际运行时再处理
						// 因为运行时才知道目前小方块位置
						case "TO":
							okCommand.push(commandArr[i]);
							break;
					}
					break;
				case 'GO':
					var n = 1;
					if (command[1] != undefined) {
						n = parseInt(command[1]);
					}
					if (isNaN(n)) {
						n = 1;
					}
					for (var j = 0; j < n; j++) {
						okCommand.push('GO');
					}
					break;
				case 'TRA':
					var n = 1;
					if (command[2] != undefined) {
						n = parseInt(command[2]);
					}
					if (isNaN(n)) {
						n = 1;
					}
					for (var j = 0; j < n; j++) {
						okCommand.push('TRA ' + command[1]);
					}
					break;
				default:
					okCommand.push(commandArr[i]);
					break;
			}
		}
		return okCommand;
	},

	// 操作前判断是否正在处理动画
	isReady : function () {
		if (controller.isExecuting == true) {
			alert('请等待当前命令执行完毕');
			return false;
		}
		return true;
	}
}

controller.addPageDelegate();
