var controller = {
	// 对用户输入的命令进行解析并调用方块方法
	execute : function(command) {
		var commandArr = command.split(" ");
		switch (commandArr[0]) {
			case "TUN":
				controller.changeHead(commandArr[1]);
				break;
			case "MOV":
				controller.changeHead(commandArr[1]);
				player.playerGo();
				break;
			case "GO":
				player.playerGo();
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