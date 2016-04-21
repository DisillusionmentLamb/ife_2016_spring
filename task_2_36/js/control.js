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
					default:
						console.log("非法输入！");
						break;
				}
				player.playerGo();
				break;
			case "TRA":
				if (commandArr[1] == "LEF" || commandArr[1] == "RIG") {
					var n = 1;
					if (commandArr[2] != undefined) {
						n = parseInt(commandArr[2]);
					}
					if (commandArr[1] == "LEF") {
						// 边界判断
						if (player.position[0] > 1) {
							player.position[0] -= n;
						}
					}
					else {
						if (player.position[0] < 10) {
							player.position[0] += n;
						}
					}
				}
				if (commandArr[1] == "TOP" || commandArr[1] == "BOT") {
					if (commandArr[1] == "TOP") {
						if (player.position[1] > 1) {
							player.position[1] -= n;
						}
					}
					else {
						if (player.position[1] < 10) {
							player.position[1] += n;
						}
					}
				}
				break;
			case "GO":
				var n = 1;
				if (commandArr[1] != undefined) {
					n = parseInt(commandArr[1]);
				}
				for (var i = 0; i < n; i++) {
					player.playerGo();
				}
				break;
			case "BUILD":
				player.buildWall();
				break;
			case "BRI":
				render.setWallColor(commandArr[1]);
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
				if (commandArr[1] == "LEF" || commandArr[1] == "RIG" || commandArr[1] == "TOP" || commandArr[1] == "BOT") {
					if (/^\d+$/.test(commandArr[2]) || commandArr[2] == undefined) {
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
					if (/^\d+$/.test(commandArr[2]) || commandArr[2] == undefined) {
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
				if (/^\d+$/.test(commandArr[1]) || commandArr[1] == undefined) {
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
			p = null;		// 前驱结点
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
		timer = setInterval(function(){ 
			if (!(Stack.length == 0)){
			p = Stack.pop();
			// 判断节点是否为终点
			if (p[0] == x && p[1] == y) {
				clearInterval(timer);
				return;
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
			// 若栈顶元素改变，执行动画
			if (!(p[0] == Stack[Stack.length-1][0] && p[1] == Stack[Stack.length-1][1])) {
				if (p[0] == Stack[Stack.length-1][0]) {
					if (p[1] > Stack[Stack.length-1][1]) {
						controller.execute("MOV TOP");
					}
					else {
						controller.execute("MOV BOT");
					}
				}
				else {
					if (p[0] > Stack[Stack.length-1][0]) {
						controller.execute("MOV LEF");
					}
					else {
						controller.execute("MOV RIG");
					}
				}
			}
		}
		else {
			clearInterval(timer);
		}
		}, 1000);
	},
	// 为页面添加事件代理
	addPageDelegate : function() {
		var page = document.getElementsByTagName("body")[0],
			textarea = document.getElementById("commandTextarea");
		page.addEventListener("click", function(event) {
			if (event.target.nodeName = "BUTTON" && event.target.getAttribute("id") == "commandBtn") {
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
			}
			if (event.target.nodeName = "BUTTON" && event.target.getAttribute("id") == "refreshBtn") {
				render.emptyCommand();
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