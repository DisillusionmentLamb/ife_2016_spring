/**
 * 飞船类
 * @param {number} id
 */
function Star(id) {
	this.id = id;
	// 初始化速度为0
	this.speed = 0;
	// 私有属性,初始化能源为100
	var energy = 100;
	// 初始化行星消耗能源定时器
	this.expendEnergyTimer = null;
	// 初始化行星能源系统定时器
	this.addEnergyTimer = null;

	/**
	 *	私有方法
	 *  实现飞船的能源系统
	 */
	(function() {
		addEnergyTimer = setInterval(function(){
			// 判断飞船能源是否为满
			if (energy != 100) {
				// 飞船能源每秒增加2%
				energy += 2;
			} 
			console.log("id:" + id + "---energy:" + energy);
		}, 1000);
	})();

	this.getEnergy = function() {
		return energy;
	}
	this.setEnergy = function(data) {
		energy = data;
	}
}

Star.prototype = {
	/* 公有方法
	   对传来的mediator进行解析，并模拟丢包和延时 
	   param (object) mediator
	 */
	receiveMediator : function(mediator) {
		var that = this;
		// 通过确定随机数范围，模拟30%丢包率
		(function(){
			var randomNum = Math.random() * 10;
			// 模拟丢包，不对接受的命令解析
			if (randomNum > 7) {
				console.log("命令接受失败");
				return;
			}
		})();
		// 模拟延时
		setTimeout(function() {
			// 判断指令id是否为自身
			if (mediator.id != that.id) {
				return;
			}
			// 解析命令
			switch (mediator.command) {
				case 'start':
					that.fly();
					break;
				case 'stop':
					that.stop();
					break;
				case 'destory':
					that.destory();
					break;
			}
		}, 1000);
	},
	

	/**
	 * 公有方法
	 * 实现飞船的飞行状态
	 */
	 fly : function() {
	 	var that = this;
	 	
	 	// 消耗能源每秒减少4%;
	 	expendEnergyTimer = setInterval(function(){
	 		if (that.getEnergy() > 4){
	 			// 飞船速度保持恒定
	 			that.speed = 10;
	 			that.setEnergy(that.getEnergy() - 4);
	 			console.log("speed" + that.speed + "energy" + that.getEnergy());
	 		}
	 		else {
	 			// 能源耗尽，停止飞行
	 			that.speed = 0;
	 			clearInterval(expendEnergyTimer);
	 			console.log("stop")
	 		}
	 	}, 1000);
	 },

	 /**
	  * 公有方法
	  * 实现飞船停止运行
	  */
	 stop : function() {
	 	if (expendEnergyTimer != null) {
	 		clearInterval(expendEnergyTimer);
	 		this.speed = 0;
	 		expendEnergyTimer = null;
	 	}
	 },

	 /**
	  * 公有方法
	  * 销毁自身
	  */
	 destory : function() {
	 	// 将自身实例化对象从实际行星状态中删除
	 	var id = this.id,
	 		index = -1;		// 获取自身在StarState中的位置
	 	// 终止飞行系统
	 	this.stop();
	 	// 终止能源系统
	 	clearInterval(addEnergyTimer);
	 	// 终止能源系统
	 	index = (function (id) {
	 		for (var i = 0; i < StarState.length; i++) {
	 			if (id == StarState[i].id) {
	 				return id;
	 			}
	 		}
	 	})();
	 	if (index != -1){
	 		StarState.splice(index, 1);
	 	}
	 }
}

