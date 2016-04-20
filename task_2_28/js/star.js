/**
 * 飞船类
 * @param {number} id
 */
function Star(id, energyId, speedId) {
	this.id = id;
	
	// 目前速度,为0是停止，等于presetSpeed就是运行
	this.speed = 0;
	
	// 设置的速度
	this.presetSpeed = this.convertSpeed(speedId).speed;
	
	// 能量消耗速度
	this.energyExpendSpeed = this.convertSpeed(speedId).expend;
	
	// 私有属性,初始化能源为100
	var energy = 100;
	
	// 能量收集速度
	var energyGatherSpeed = (function () {
								var energyAll = [2, 3, 4];
								return energyAll[energyId - 1];
							})();
	
	// 初始化行星消耗能源定时器
	this.expendEnergyTimer = null;
	
	// 初始化行星能源系统定时器
	var addEnergyTimer = null;

	// 初始化发送状态定时器
	var sendMsgTimer = null;

	// 初始化行星状态
	var state = false;

	/**
	 *	私有方法
	 *  实现飞船的能源系统
	 */
	(function() {
		addEnergyTimer = setInterval(function(){
			// 判断飞船能源是否为满
			if (energy < 100) {
				// 飞船能源每秒增加energyGatherSpeed
				energy += energyGatherSpeed;
				// 恰巧超过100需要修正为100
				energy = energy > 100 ? 100 : energy;
				console.log("id:" + id + "---energy:" + energy);
			}
		}, 1000);
	})();

	// 私有方法，定时向commander发送行星当前状态
	(function() {
		sendMsgTimer = setInterval(function() {
			var msg = "",
				energyString = "";
			msg += parseInt(id).toString(2);
			while (msg.length < 4) {
				msg = '0' + msg;
			}
			if (!state) {
				msg += "0010";
			}
			else {
				msg += "0001";
			}
			energyString += parseInt(energy).toString(2);
			while (energyString.length < 8) {
				energyString = '0' + energyString;
			}
			msg += energyString;
			commander.updateDC(msg);
			console.log(msg + '----message');
		} ,500)
	})();

	this.getEnergy = function() {
		return energy;
	}

	this.setEnergy = function(data) {
		energy = data;
	}

	this.getState = function() {
		return state;
	}

	this.setState = function(bool) {
		state = bool;
	}

	this.getSendMsgTimer = function() {
		return sendMsgTimer;
	}

	this.getAddEnergyTimer = function() {
		return addEnergyTimer;
	}
}

Star.prototype = {
	/* 公有方法
	   对传来的mediator进行解析，并模拟丢包和延时 
	   param (object) mediator
	 */
	receive : function(mediator) {
		var mediator = this.decode(mediator);
		var that = this;
		// 通过确定随机数范围，模拟30%丢包率
		var randomNum = Math.random() * 10;
		// 模拟丢包，不对接受的命令解析
		// 丢包并且id为本飞船时，返回false
		// 否则返回true
		if (mediator.id == that.id) {
			if (randomNum > 9) {
				console.log("id:" + that.id + "----命令接受失败");
				return false;
			}
		} else {
			return true;
		}
		// 模拟延时
		setTimeout(function() {
			// 解析命令
			switch (mediator.command) {
				case 'start':
					that.fly();
					break;
				case 'stop':
					that.stop();
					break;
				case 'destroy':
					that.destroy();
					break;
			}
		}, 300);
		return true;
	},
	

	/**
	 * 公有方法
	 * 实现飞船的飞行状态
	 */
	 fly : function() {
	 	var that = this;
	 	
	 	// 判断当前飞船是否运行
	 	if (this.expendEnergyTimer != null) {
	 		console.log("飞船已经运行！");
	 		return;
	 	}
	 	this.setState(true);
	 	// 消耗能源每秒减少energyExpendSpeed
	 	this.expendEnergyTimer = setInterval(function(){
	 		if (that.getEnergy() > 4){
	 			// 飞船速度保持恒定
	 			that.speed = that.presetSpeed;
	 			that.setEnergy(that.getEnergy() - that.energyExpendSpeed);
	 			console.log("id:" + that.id + "----speed:" + that.speed + ",energy:" + that.getEnergy());
	 		}
	 		else {
	 			// 能源耗尽，停止飞行
	 			that.stop();
	 		}
	 	}, 1000);
	 },

	 /**
	  * 公有方法
	  * 实现飞船停止运行
	  */
	 stop : function() {
	 	if (this.expendEnergyTimer != null) {
	 		clearInterval(this.expendEnergyTimer);
	 		this.speed = 0;
	 		this.expendEnergyTimer = null;
	 		console.log("id:" + this.id + "----stop")
	 		this.setState(false);
	 	}
	 },

	 /**
	  * 公有方法
	  * 销毁自身
	  */
	 destroy : function() {
	 	// 将自身实例化对象从实际行星状态中删除
	 	var that = this,
	 		index = -1,		// 获取自身在StarState中的位置
	 		idString = parseInt(this.id).toString(2);
	 	while (idString.length < 4) {
	 		idString = '0' + idString;
	 	}
	 	// 终止飞行系统
	 	this.stop();
	 	// 终止能源系统
	 	clearInterval(this.getAddEnergyTimer());
	 	// 终止发送系统
	 	clearInterval(this.getSendMsgTimer());
	 	// 向commander发送销毁指令
	 	commander.updateDC(idString + "110000000000");
	 	console.log(idString + "110000000000----destroy");
	 	// 终止能源系统
	 	index = (function () {
	 		for (var i = 0; i < StarState.length; i++) {
	 			if (that.id == StarState[i].id) {
	 				return i;
	 			}
	 		}
	 	})();
	 	if (index != -1){
	 		StarState.splice(index, 1);
	 	}
	 	console.log("id:" + that.id + "----destory")
	 },

	// 根据速度id生成speed对象
	convertSpeed : function(speedId) {
		var speedAll = [
			{speed : 30, expend: 5},
			{speed : 40, expend: 7},
			{speed : 80, expend: 9}
		];
		return speedAll[speedId - 1];
	},

	 // 解密命令
	decode : function (mediator) {
	 	var id = parseInt(mediator.slice(0, 4), 2);
	 	var command = "";
	 	var index = parseInt(mediator.slice(4), 2);
	 	switch (index) {
	 		case 1 :
	 			command = "start";
	 			break;
	 		case 2 :
	 			command = "stop";
	 			break;
	 		case 12 :
	 			command = "destroy";
	 			break;
	 	}
	 	return {id, command};
	 }
}

