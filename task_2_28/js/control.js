// 实际行星状态
var StarState = [];

// DC
var DC = [];

var controller = {

	// 添加飞船点击时触发动作
	addStarHandle : function() {
		//读取指挥官假象状态，若大于4不在添加
		if (commander.StarState.length >= 4) {
			console.log("飞船数量达到上限！");
			return;
		}
		
		// 取选择框的选项为能量与动力参数
		var energyType = document.getElementById('energyType').value;
		var speedType = document.getElementById('speedType').value;

		// 发送指令
		commander.createStar(energyType, speedType);
		// 更新指令处dom
		var id = StarState[StarState.length - 1].id;
		document.getElementById("btn").appendChild(render.createBtnHtml(id));
		// 更新行星dom
		document.getElementById("ship").appendChild(render.createStarHtml(id, 100));
	},
	// 销毁飞船时触发动作
	removeStarHandle : function(id) {
		// 发送指令
		commander.createCommand(id, "destroy");
		// 不需要判断直接更新，反正命令一定成功
		var removeBtn = document.getElementById("ctrl-" + id);
		document.getElementById("btn").removeChild(removeBtn);
		// 更新行星dom
		var removeStar = document.getElementById("star-" + id);
		document.getElementById("ship").removeChild(removeStar);
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
			if (event.target && event.target.nodeName.toUpperCase() == "BUTTON") {
				var id = event.target.parentNode.getAttribute('id');
				var command = event.target.getAttribute('class');
				id = id ? id.split('-')[1] : 0;
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
