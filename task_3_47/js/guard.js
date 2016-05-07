/**
 * 守卫
 */
var guard = {
	// 位置数组
	allGuards : [],
	// 正在发子弹的守卫
	firing : [],
	// 消灭一个守卫
	kill : function (x, y) {
		FUN.rmFromArr(x, y, guard.allGuards);
		render.fillRec(x, y, '#FFE6CD');

	},
	// 判断是否为守卫
	isGuard : function (x, y) {
		return FUN.isInArr(x, y, guard.allGuards);
	},

	// 是否正在发射子弹
	isFiring : function (x, y) {
		return FUN.isInArr(x, y, guard.firing);
	},

	// 停止发射子弹
	stopFiring : function (x, y) {
		FUN.rmFromArr(x, y, guard.firing);
	},
	// 是否点击到守卫
	// 这里因为20px的方格有点小，所以守卫和附近一圈被点击到都算点击守卫
	// 防止误点到守卫周围直接走过去就死了
	// 如果点击到周围，返回正确的守卫坐标
	isClickGuard : function (x, y) {
		if (guard.isGuard(x, y)) {
			return [x, y];
		}		
		if (guard.isGuard(x, y + 1)) {
			return [x, y + 1];
		}
		if (guard.isGuard(x, y - 1)) {
			return [x, y - 1];
		}
		if (guard.isGuard(x + 1, y)) {
			return [x + 1, y];
		}
		if (guard.isGuard(x - 1, y)) {
			return [x - 1, y];
		}
		if (guard.isGuard(x + 1, y + 1)) {
			return [x + 1, y + 1];
		}
		if (guard.isGuard(x - 1, y + 1)) {
			return [x - 1, y + 1];
		}
		if (guard.isGuard(x + 1, y - 1)) {
			return [x + 1, y - 1];
		}
		if (guard.isGuard(x - 1, y - 1)) {
			return [x - 1, y - 1];
		}
		return [];
	},
	// 是否有相邻的守卫
	hasGuard : function (x, y) {
		return (
				   guard.isGuard(x, y + 1)
				|| guard.isGuard(x, y - 1)
				|| guard.isGuard(x + 1, y)
				|| guard.isGuard(x - 1, y)
				|| guard.isGuard(x + 1, y + 1)
				|| guard.isGuard(x + 1, y - 1)
				|| guard.isGuard(x - 1, y + 1)
				|| guard.isGuard(x - 1, y - 1)
			  );
	},
	// 随机守卫
	create : function () {
		// 初始化，清除原来的
		guard.allGuards = [];

		// 随机生成
		// 数量
		var num = FUN.randomNum(5, wrapper.size[0] * wrapper.size[1] / 25);
		
		// 缓存将要生成的墙的坐标
		var x = 0;
		var y = 0;

		// 循环生成
		for (var i = 0; i < num; i++) {
			
			x = FUN.randomNum(1, wrapper.size[0]);
			y = FUN.randomNum(1, wrapper.size[1]);

			// 前2行不要守卫，以免初始化时特工一出来就死
			if (y <= 2) {
				continue;
			}
			
			// 可以就设为守卫
			if (!spy.isSpy(x, y) && !file.isFile(x, y) && !guard.isGuard() && !guard.hasGuard(x, y) && !wall.isWall(x, y)) {
				guard.allGuards.push([x, y]);
			}

		}
	},
	// 发射子弹
	fire : function (x, y, which) {
		// 如果守卫已经被杀，退出
		if (!guard.isGuard(x, y)) {
			return;
		}
		// 自己定时调用会带which参数
		// 特工移动时, controller调用不会传参数
		// 如果守卫正在发子弹，就拒绝controller再调用
		if (guard.isFiring(x, y) && which == undefined) {
			return;
		}
		// 特工在自己的范围内，开火
		if (FUN.getDistance(x, y, spy.pos[0], spy.pos[1]) <= 100){
			var deg = FUN.getDeg(x, y, spy.pos[0], spy.pos[1]);
			var bullet = bulletsPool.getABullet(x, y, deg, 'guard');
			bulletsPool.bulletFly(bullet);
			if (!guard.isFiring(x, y)) {
				guard.firing.push([x, y]);
			}
		// 特工已经不在自己的范围里，停火
		} else {
			guard.stopFiring(x, y);
			return;
		}
		// 定时调用自己
		setTimeout(function () {
			guard.fire(x, y, true);
		}, 800);		
	}
}