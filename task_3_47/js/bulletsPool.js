/**
 * 子弹对象池
 */

var bulletsPool = {
	
	// 所有子弹数组，保存子弹实例
	allBullets : [],

	/**
	 * 分配一颗子弹并且发射出去
	 * @param (int) x 发射子弹的位置的横坐标
	 * @param (int) y 发射子弹的位置的纵坐标
	 * @param (int) direction 子弹的飞行方向，顺时针度数，0~360
	 * @param (string) who 谁发射的子弹，spy | guard
	 */
	getABullet : function (x, y, direction, who) {
		
		var bullet = null;

		// 查找子弹库是否有空闲的子弹
		// 有就复用之前的
		for (var i = 0; i < bulletsPool.allBullets.length; i++) {
			
			if( bulletsPool.allBullets[i].isInUse == false ) {
				// 更新子弹信息
				bulletsPool.allBullets[i].isInUse = true;
				bulletsPool.allBullets[i].direction = direction;
				bulletsPool.allBullets[i].location = [x * 20 - 10, y * 20 - 10];
				bulletsPool.allBullets[i].who = who;
				bullet = bulletsPool.allBullets[i];
				break;

			}

		}

		// 没有就新建一颗子弹
		if (bullet == null) {
			if (bulletsPool.allBullets.length > 0) {
				// 取子弹库最后一颗子弹的id+1，为新子弹id
				bullet = new bulletsPool.bullet(bulletsPool.allBullets[bulletsPool.allBullets.length - 1].id + 1, direction, x, y, who);

			} else {
				// 子弹库空的，id=1
				bullet = new bulletsPool.bullet(1, direction, x, y, who);
			}
			// 新建的子弹加到子弹库
			bulletsPool.allBullets.push(bullet);
		}
		
		return bullet;
	},

	/**
	 * 子弹原型类 
	 * @param (int) id 子弹的id
	 * @param (int) direction 子弹的飞行方向，顺时针度数，0~360
	 * @param (int) x 发射子弹的位置的横坐标
	 * @param (int) y 发射子弹的位置的纵坐标
	 * @param (string) who 谁发射的子弹，spy | guard
	 */
	bullet : function (id, direction, x, y, who) {
		// id
		this.id = id;
		// 谁的子弹
		this.who = who;
		// 是否正在使用
		this.isInUse = true;
		// 方向, 顺时针度数
		this.direction = direction;
		// 位置,px为单位
		this.location = [x * 20 - 10, y * 20 - 10];
	},

	/**
	 * 更新子弹位置
	 * @param (object) bullet 子弹实例
	 */
	 bulletFly : function (bullet) {

		// 游戏结束，子弹不动
		if (!isInGame) {
			return;
		}

		var xx = bullet.location[0];
		var yy = bullet.location[1];

		// 移除前一位置的子弹
		render.removeBullet(bullet.location[0], bullet.location[1], bullet.who);

		// 按照方向，增加位置
		if (bullet.isInUse) {
			xx += Math.sin(bullet.direction / 180 * Math.PI);
			yy -= Math.cos(bullet.direction / 180 * Math.PI);
			bullet.location = [xx, yy];
		} else {
			return;
		}

		// 走到秘密文件
		if (bulletsPool.isBulletInRect(bullet.location, file.pos)) {
			bullet.isInUse = false;
		}

		// 走到墙
		for (var i = 0; i < wall.allWall.length; i++) {
			
			if (bulletsPool.isBulletInRect(bullet.location, wall.allWall[i])) {

				bullet.isInUse = false;
				break;
			}
		}

		// 子弹是否越界
		if (xx - 5 < 0 || xx + 5 > wrapper.size[0] * 20 || yy - 5 < 0 || yy + 5 > wrapper.size[1] * 20) {
			bullet.isInUse = false;
		}

		// 守卫的子弹，可以打特工
		if (bullet.who == 'guard') {
			
			if (bulletsPool.isBulletInRect(bullet.location, spy.pos)) {
				
				bullet.isInUse = false;
				controller.endGame(false);

			}

		}
		
		// 特工的子弹，可以打守卫
		if (bullet.who == 'spy') {
			
			for (var i = 0; i < guard.allGuards.length; i++) {

				if (bulletsPool.isBulletInRect(bullet.location, guard.allGuards[i])) {

						bullet.isInUse = false;
						guard.kill(guard.allGuards[i][0], guard.allGuards[i][1]);
						break;

				}
			}

		}
		
		// 更新位置之后，没碰到东西，继续更新位置
		if (bullet.isInUse) {
			// 在新位置画子弹
			render.renderBullet(bullet.location[0], bullet.location[1], bullet.who);
			// 定时调用自己
			setTimeout(function () {
				bulletsPool.bulletFly(bullet);
			}, 30);
		}
	 },

	/**
	 * 子弹是否进入某个方块
	 * @param (array) circleLoc 圆坐标数组
	 * @param (array) rectPos 方块坐标数组
	 */
	isBulletInRect : function (circleLoc, rectPos) {
		return FUN.isCircleInRect(circleLoc[0], circleLoc[1], 5, rectPos[0], rectPos[1], 20);
	}
}