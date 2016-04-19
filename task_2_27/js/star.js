/**
 * 飞船类
 * @param {number} id
 */
function Star(id, energyId, speedId) {
	this.id = id;
	// 初始化速度为0
	this.speed = 0;
	// 私有属性,初始化能源为100
	var energy = 100;
	// 初始化行星消耗能源定时器
	this.expendEnergyTimer = null;
	// 初始化行星能源系统定时器
	this.addEnergyTimer = null;
	// 初始化动力系统id
	this.speedId = speedId;	
	// 初始化能源系统id
	var energyId = energyId;
	
	/**
	 *	私有方法
	 *  实现飞船的能源系统
	 */
	(function() {
		addEnergyTimer = setInterval(function(){
			var energySystem = 0;
			switch (energyId){
				case 1:
					energySystem = 2;
					break;
				case 2:
					energySystem = 3;
					break;
				case 3:
					energySystem = 4;
					break;
				}
			// 判断飞船能源是否为满
			if (energy < 100) {
				// 飞船能源每秒增加
				energy += energySystem;
				console.log("id:" + id + "---energy:" + energy);
			}
			else {
				energy = 100;
				console.log("id:" + id + "能源已满");
			}
		}, 1000);
	})();

	this.getEnergy = function() {
		return energy;
	}
	this.setEnergy = function(data) {
		energy = data;
	}
	this.getSpeedSystem = function() {
		return speedSystem;
	}
}

Star.prototype = {
	/* 公有方法
	   对传来的mediator进行解析，并模拟丢包和延时 
	   param (object) mediator
	 */
	receive : function(mediator) {
		mediator = this.decode(mediator);
		var that = this;
		// 通过确定随机数范围，模拟30%丢包率
		var randomNum = Math.random() * 10;
		// 模拟丢包，不对接受的命令解析
		// 丢包率为90%，只是方便我测试
		// 丢包并且id为本飞船时，返回false
		// 否则返回true
		if (randomNum > 9 && mediator.id == that.id) {
			console.log("id:" + that.id + "----命令接受失败");
			return false;
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
	 	var that = this,
	 		speedSystem = that.convertSpeed(that.speedId);
	 	
	 	// 判断当前飞船是否运行
	 	if (this.expendEnergyTimer != null) {
	 		console.log("飞船已经运行！");
	 		return;
	 	}
	 	// 消耗能源每秒减少4%;
	 	this.expendEnergyTimer = setInterval(function(){
	 		if (that.getEnergy() > speedSystem.expend){
	 			// 飞船速度保持恒定
	 			that.speed = speedSystem.speed;
	 			that.setEnergy(that.getEnergy() - speedSystem.expend);
	 			console.log("id:" + that.id + "----speed:" + that.speed + ",energy:" + that.getEnergy());
	 		}
	 		else {
	 			// 能源耗尽，停止飞行
	 			that.stop();
	 			console.log("id:" + that.id + "----stop")
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
	 	}
	 },

	 /**
	  * 公有方法
	  * 销毁自身
	  */
	 destroy : function() {
	 	// 将自身实例化对象从实际行星状态中删除
	 	var that = this,
	 		index = -1;		// 获取自身在StarState中的位置
	 	// 终止飞行系统
	 	this.stop();
	 	// 终止能源系统
	 	clearInterval(addEnergyTimer);
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
		switch (speedId) {
			case 1:
				return {
					speed : 30,
					expend: 5
				};
				break;
			case 2:
				return {
					speed : 50,
					expend: 7
				};
				break;
			case 3:
				return {
					speed : 80,
					expend: 9
				};
				break;
		}
	},

	// 解密命令，这里就是我测试下
	decode : function (mediator) {
	 	var id = parseInt(mediator.slice(0, 4), 2),
	 		command = "",
	 		index = parseInt(mediator.slice(4), 2);
	 	switch (index) {
	 		case 1 :
	 			command = "start";
	 			break;
	 		case 2 :
	 			command = "stop";
	 			break;
	 		case 3 :
	 			command = "destroy";
	 			break;
	 	}
	 	return {id, command};
	 }
}

