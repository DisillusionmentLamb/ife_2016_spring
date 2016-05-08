/**
 * 特工
 */
var spy = {
	
	// 位置
	pos : [],
	
	// 上次位置
	lastPos : [],

	// 是否正在开火
	// 避免两次子弹之前间隔过小
	isFiring : false,

	// 移动步骤
	moveStep : [],

	// 寻路,传入终点坐标
	goTo : function (target_x, target_y) {
		return AStarSearchAlgorithm(wrapper.size[0], wrapper.size[1], spy.pos[0], spy.pos[1], target_x, target_y, true, wall.allWall.concat(guard.allGuards));
	},

	// 是否为特工
	isSpy : function (x, y) {
		return (x == spy.pos[0] && y == spy.pos[1]);
	},

	// 特工开火, 传入守卫位置
	fire : function (pos) {
		// 如果停止游戏
		if (!isInGame) {
			return;
		}
		// 获得角度
		var deg = FUN.getDeg(spy.pos[0], spy.pos[1], pos[0], pos[1]);
		// 获得子弹
		var bullet = bulletsPool.getABullet(spy.pos[0], spy.pos[1], deg, 'spy');
		// 发射子弹
		bulletsPool.bulletFly(bullet);
		// 更新为未在开火状态
		spy.isFiring = false;
	},

	// 查询附近是否有守卫, 返回守卫坐标（数组）
	hasGuard : function () {
		var guards = [];
		for (var i = 0; i < guard.allGuards.length; i++) {
			if (Math.abs(guard.allGuards[i][0] - spy.pos[0]) <= 5 || Math.abs(guard.allGuards[i][1] - spy.pos[1]) <= 5) {
				if (FUN.getDistance(guard.allGuards[i][0], guard.allGuards[i][1], spy.pos[0], spy.pos[1]) <= 100) {
					guards.push([guard.allGuards[i][0], guard.allGuards[i][1]]);
				}
			}
		}
		return guards;
	}
}