var controller = {
	// 对用户输入的命令进行解析并调用方块方法
	execute : function(command) {
		switch (command) {
			case "GO":
				player.playerGo();
				break;
			case "TUN LEF":
				player.turnLeft();
				break;
			case "TUN RIG":
				player.turnRight();
				break;
			case "TUN BAC":
				player.turnBack();
				break;
			default : 
				console.log("非法命令！");
				break;
		}
		render.refresh();
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