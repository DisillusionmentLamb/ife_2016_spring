// 指挥官
var commander = {

	// 指挥官假想飞船状态
	StarState : [],

	// 生成命令
	// @param id 目标行星id, commandStr 命令字符
	createCommand : function (id, commandStr) {
		// 返回包装对象
		var mediator = {};
		mediator.id = id;
		mediator.command = commandStr;
		this.sendCommand(mediator);
	},

	// 广播命令
	sendCommand : function (mediator) {
		// 命令是销毁时，更新假想飞船状态
		if (mediator.command == 'destroy') {
			this.destroyStar(mediator.id);
		}

		// 加密为二进制
		mediator = this.encode(mediator);

		// 广播命令
		for (var i = 0; i < window.StarState.length; i++) {
			// 返回false就继续发送
			while(!window.StarState[i].receive(mediator)){
				console.log(mediator + '命令发送失败，将要重试');
			}
		}

		console.log(mediator + '成功发送');
	},

	// 创建飞船
	createStar : function (energyType, speedType) {
		// 取最后一个飞船的id+1为新飞船id
		// 之前没有飞船就id=1
		var id = window.StarState.length > 0 ? window.StarState[window.StarState.length - 1].id + 1 : 1;

		// 创建新飞船
		var star = new Star(id, energyType, speedType);

		// 更新全局飞船状态
		window.StarState.push(star);

		// 更新指挥官假想飞船状态
		this.StarState.push(star);


	},

	// 销毁飞船
	destroyStar : function (id) {
		// 只更新假想飞船状态
		// 遍历找到id为传入id的飞船
		for(var i = 0; i < this.StarState.length; i++){
			// 找到就删除, 退出遍历
			if (this.StarState[i].id == id) {
				this.StarState.splice(i, 1);
				break;
			}
		}
	},

	// 对象加密为二进制命令
	encode : function (mediator) {
		var commandArr = {
			'stop' : '0010',
			'start' : '0001',
			'destroy' : '1100'
		};
		var command = commandArr[mediator.command];
		var id = parseInt(mediator.id).toString(2);
		while (id.length < 4) {
			id = '0' + id;
		}
		return id + command;
	}
};

