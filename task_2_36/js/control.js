var controller = {
	// 错误行数
	falseRow : [],
	// 对用户输入的命令进行解析并调用方块方法
	execute : function(command) {
		var commandArr = command.split(" ");
		switch (commandArr[0]) {
			case "TUN":
				controller.changeHead(commandArr[1]);
				break;
			case "MOV":
				switch (commandArr[1]) {
					case "LEF":
						player.head = "left";
						controller.execute("GO " + commandArr[2]);
						break;
					case "RIG":
						player.head = "right";
						controller.execute("GO " + commandArr[2]);
						break;
					case "TOP":
						player.head = "top";
						controller.execute("GO " + commandArr[2]);
						break;
					case "BOT":
						player.head = "bottom";
						controller.execute("GO " + commandArr[2]);
						break;
					case "TO":
						var positionArr = commandArr[2].split(",");
						controller.findWay(positionArr[0], positionArr[1]);
						break;
					default:
						console.log("非法输入！");
						break;
				}
				break;
			case "TRA":
				var n = 1;
				if (commandArr[2] != undefined) {
					n = parseInt(commandArr[2]);
				}

				if (commandArr[1] == "LEF" || commandArr[1] == "RIG") {
					
					if (commandArr[1] == "LEF") {
						// 边界判断
						if (player.position[0] > n) {
							player.position[0] -= n;
						}
					}
					else {
						if (player.position[0] <= 10 - n) {
							player.position[0] += n;
						}
					}
				}
				if (commandArr[1] == "TOP" || commandArr[1] == "BOT") {
					if (commandArr[1] == "TOP") {
						if (player.position[1] > n) {
							player.position[1] -= n;
						}
					}
					else {
						if (player.position[1] <= 10 - n) {
							player.position[1] += n;
						}
					}
				}
				break;
			case "GO":
				var n = 1;
				if (   commandArr[1] != 'undefined' 
					&& commandArr[1] != undefined 
					&& commandArr[1] != ''
					) {
					n = parseInt(commandArr[1]);
				}
				for (var i = 0; i < n; i++) {
					player.playerGo();
				}
				break;
			case "BUILD":
				player.buildWall();
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
				render.setWallColor(x, y, commandArr[1]);
				break;
			default:
				console.log("command false");
				break;
		}
		render.refresh();
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
				console.log("command false!")
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
	// DFS寻路算法，接受目标位置坐标
	findWay : function(x, y) {
		var Stack = [],
			visited = [],
			p = null,		// 前驱结点
			walked = [],	// 方块走过的路径
			temp = null;
		// 判断是否该节点访问过
		function isVisited(arr) {
			var result = [].some.call(visited, function(item) {
				return (item[0] == arr[0]) && (item[1] == arr[1]);
			});
			return result;
		}
		// 判断目标位置为是否是围墙
		function isWall(arr) {
			var result = [].some.call(ChessBox.Walls, function(item) {
				return (item[0] == arr[0]) && (item[1] == arr[1]);
			});
			return result;
		}
		// 将起点位置压入栈
		Stack.push([player.position[0],player.position[1]]);
		visited.push([player.position[0],player.position[1]]);
		while (Stack.length != 0) {
			p = Stack.pop();
			walked.push([p[0], p[1]]);
			// 记录当前栈顶元素
			(Stack.length != 0) ? temp = Stack[Stack.length - 1] : temp = undefined;
			// 判断节点是否为终点
			if (p[0] == x && p[1] == y) {
				break;
			}
			// 向右移动
			if (p[0] < 10 && !isVisited([p[0] + 1, p[1]]) && !isWall([p[0] + 1, p[1]])) {
				visited.push([p[0] + 1, p[1]]);
				Stack.push([p[0] + 1, p[1]]);
			}
			// 向下移动
			if (p[1] < 10 && !isVisited([p[0], p[1] + 1]) && !isWall([p[0], p[1] + 1])) {
				visited.push([p[0], p[1] + 1]);
				Stack.push([p[0], p[1] + 1]);
			}
			// 左
			if (p[0] > 1 && !isVisited([p[0] - 1, p[1]]) && !isWall([p[0] - 1, p[1]])) {
				visited.push([p[0] - 1, p[1]]);
				Stack.push([p[0] - 1, p[1]]);
			}
			// 上
			if (p[1] > 1 && !isVisited([p[0], p[1] - 1]) && !isWall([p[0], p[1] - 1])) {
				visited.push([p[0], p[1] - 1]);
				Stack.push([p[0], p[1] - 1]);
			}

			if (temp != undefined && Stack.length > 0) {
				if ((temp[0] == Stack[Stack.length - 1][0] && temp[1] == Stack[Stack.length - 1][1])){
					walked.pop();
				}
			}
		}
		controller.createCommand(walked);
	},

	// 根据寻路算法返回的路径生成动画命令
	createCommand : function(walkedArr) {
		var i = 1;
		var timer = setInterval(function() {
			if (i != walkedArr.length) {
				if (walkedArr[i][0] == walkedArr[i-1][0]) {
					if (walkedArr[i][1] < walkedArr[i-1][1]) {
						controller.execute("MOV TOP");
					}
					else {
						controller.execute("MOV BOT");
					}
				}
				if (walkedArr[i][1] == walkedArr[i-1][1]) {
					if (walkedArr[i][0] > walkedArr[i-1][0]) {
						controller.execute("MOV RIG");
					}
					else {
						controller.execute("MOV LEF");
					}
				}
				if ((walkedArr[i][1] != walkedArr[i-1][1]) && (walkedArr[i][0] != walkedArr[i-1][0])) {
					if (walkedArr[i][1] < walkedArr[i-1][1]) {
						controller.execute("MOV TOP");
					}
					else {
						controller.execute("MOV BOT");
					}
					if (walkedArr[i][0] > walkedArr[i-1][0]) {
						controller.execute("MOV RIG");
					}
					else {
						controller.execute("MOV LEF");
					}
				}
			}
		}, 1000);
	},
	// 随机墙
	randomWall : function () {
		// 初始化，清除原来的墙
		render.init();
		ChessBox.Walls = [];

		// 随机生成
		// 墙的数量
		var num = parseInt(Math.random() * 30);
		
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
		commandBtn.addEventListener("click", function() {
			if (controller.falseRow.length == 0) {
				var commandArr = textarea.value.split(/\n/),
					i = 0;
				var timer = setInterval(function() {
					controller.execute(commandArr[i]);
					i++;
					if (i > commandArr.length - 1) {
						clearInterval(timer);
					}
				}, 1000);
			}
			else {
				alert("输入命令不合法");
			}
		}, false);

		refreshBtn.addEventListener('click', function () {
			render.emptyCommand();
		}, false);

		randomWall.addEventListener('click', function () {
			controller.randomWall();
		}, false);

		interestingWall.addEventListener('click', function () {
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
	}
}

controller.addPageDelegate();
