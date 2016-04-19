// 实际行星状态
var StarState = [];

var controller = {
	// 将字符串为element对象
	parseDom : function(str) {
		var element = document.createElement("div");
		element.innerHTML = str;
		return element.childNodes[0];
	},
	// 添加飞船点击时触发动作
	addStarHandle : function() {
		//读取指挥官假象状态，若大于4不在添加
		if (commander.StarState.length >= 4) {
			console.log("飞船数量达到上限！");
			return;
		}
		// 发送指令
		commander.createCommand(0, "add");
		// 更新指令处dom
		var id = StarState[StarState.length - 1].id;
		document.getElementById("control").innerHTML += render.createBtnHtml(id);
		// 更新行星dom
		var starElement = controller.parseDom(render.createStarHtml(id, 100));
		document.getElementsByClassName("space")[0].appendChild(starElement);
	},
	// 销毁飞船时触发动作
	removeStarHandle : function(id) {
		// 发送指令
		commander.createCommand(id, "destroy");
		// 判断指令是否接受成功
		var success = (function(id) {
			for (var i = 0; i < StarState.length; i++) {
				if (id == StarState[i].id) {
					return false;
				}
			}
			return true;
		})();
		if (success) {
			// 更新指令处dom
			var removeBtn = document.getElementById("ctrl-" + id);
			document.getElementById("control").removeChild(removeBtn);
			// 更新行星dom
			var removeStar = document.getElementById("star-" + id);
			document.getElementsByClassName("space")[0].removeChild(removeStar);
		}
	},
	// 飞行指令触发动作
	startHandle : function(id) {
		commander.createCommand(id, "start");
	},
	// 停止指令触发动作
	stopHandle : function(id) {
		commander.createCommand(id, "stop");
	},
	// 为命令控制添加事件代理
	addControlDelegate : function() {
		var control = document.getElementById("control");
		control.addEventListener("click", function(event) {
			if (event.target && event.target.nodeName == "BUTTON") {
				var id = event.target.parentNode.getAttribute('id').split('-')[1],
					command = event.target.getAttribute('class');
				switch (command) {
					case 'add':
						controller.addStarHandle();
						break;
					case 'start':
						controller.startHandle(id);
						break;
					case 'stop':
						controller.stopHandle(id);
						break;
					case 'destroy':
						controller.removeStarHandle(id);
						break; 
				}
			}
		})
	}
}

controller.addControlDelegate();