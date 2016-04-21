var controller = {
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
						break;
					case "RIG":
						player.head = "right";
						break;
					case "TOP":
						player.head = "top";
						break;
					case "BOT":
						player.head = "bottom";
						break;
					default:
						console.log("非法输入！");
						break;
				}
				player.playerGo();
				break;
			case "TRA":
				if (commandArr[1] == "LEF" || commandArr[1] == "RIG") {
					if (commandArr[1] == "LEF") {
						// 边界判断
						if (player.position[0] > 1) {
							player.position[0]--;
						}
					}
					else {
						if (player.position[0] < 10) {
							player.position[0]++;
						}
					}
				}
				if (commandArr[1] == "TOP" || commandArr[1] == "BOT") {
					if (commandArr[1] == "TOP") {
						if (player.position[1] > 1) {
							player.position[1]--;
						}
					}
					else {
						if (player.position[1] < 10) {
							player.position[1]++;
						}
					}
				}
				break;
			case "GO":
				player.playerGo();
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

	// 为页面添加事件代理
	addPageDelegate : function() {
		var page = document.getElementsByTagName("body")[0];
		page.addEventListener("click", function(event) {
			if (event.target.nodeName = "BUTTON" && event.target.getAttribute("id") == "commandBtn") {
				var command = document.getElementById("commandInput").value;
				controller.execute(command);
			}
		}, false);
	}
}

controller.addPageDelegate();