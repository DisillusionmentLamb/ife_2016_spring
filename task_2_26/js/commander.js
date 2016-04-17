// 指挥官
var commander = {

	// 指挥官假想飞船状态
	StarState : [],

	// 生成命令
	createCommand : function (e) {

		// 初始化命令
		var mediator = {
			id : 0,
			command : ''
		};

		// 接管button点击事件
		if (e.target && e.target.nodeName.toLowerCase() == 'button') {

			// 读取button的class作为命令
			mediator.command = e.target.getAttribute('class');

			// 读取button外层div的id为飞船id
			if (mediator.command != 'add') {
				mediator.id = e.target.parentNode.getAttribute('id').split('-')[1];
			}

			// 发送命令
			commander.sendCommand(mediator);
		}
	},

	// 广播命令
	sendCommand : function (mediator) {
		// 命令是销毁时，更新假想飞船状态
		if (mediator.command == 'destroy') {
			commander.destroyStar(mediator.id);
			
		// 命令是创建飞船时，不需要发送命令	
		} else if (mediator.command == 'add') {
			commander.createStar();
			return true;
		}

		// 广播命令
		for (var i = 0; i < window.StarState.length; i++) {
			window.StarState[i].receiveMediator(mediator);
		}
	},

	// 创建飞船
	createStar : function () {
		// 取最后一个飞船的id+1为新飞船id
		var id = window.StarState[window.StarState.length - 1].id + 1;

		// 创建新飞船
		var star = new Star(id);

		// 更新全局飞船状态
		window.StarState.push(star);

		// 更新指挥官假想飞船状态
		commander.StarState.push(star);

		// 重新渲染
		render();
	},

	// 销毁飞船
	destroyStar : function (id) {
		// 只更新假想飞船状态
		// 遍历找到id为传入id的飞船
		for(var i = 0; i < commander.StarState.length; i++){
			// 找到就删除, 退出遍历
			if (commander.StarState[i].id == id) {
				commander.StarState.splice(i, 1);
				break;
			}
		}
	}
};

