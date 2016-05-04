// 大概设想，按需要修改
// 所有的位置都是坐标值，不是px大小值
// canvas 顶部第一个小方格坐标是[1, 1]
var model = {
	
	// 画布大小
	wrap : [],

	// 秘密文件位置
	file : [],

	// 小球
	ball : {
		
		// 位置
		pos : [],
		
		// 上次位置
		lastPos : [],

		// 移动步骤
		moveStep : [],

		// 寻路算法
		// 传入终点坐标
		goTo : function (target_x, target_y) {
			// 返回小方块每步的位置的数组
			// 不能穿墙，可以走斜线
			// arr = [
			// 		[x0,y0], // 起点
			// 		[x1,y1], // 中间点，不能穿墙，可以斜着走
			// 		[x2,y2],
			// 		…………
			// 		[x3,y3] // 终点
			// ]
			//目标越界，退出
			if (target_y > model.wrap[1] || target_y < 1 || target_x < 1 || target_x > model.wrap[0]) {
				return [];
			}
			//目标是墙，退出
			if (model.walls.isWall(target_x, target_y)) {
				return [];
			}

			// 目前位置
			var nowNode = new Node(model.ball.pos[0], model.ball.pos[1], null);
			// 目标位置
			var target = new Node(target_x, target_y, null);
			// 开放列表
			var openList = [];
			// 关闭列表
			var closeList = [];
			// 左右上下移动花费
			var cost = 10;
			// 斜着移动花费
			var vcost = 14;
			// 结果路径
			var resultList = [];

			// 把开始位置放入开放列表
			openList.push(nowNode);
			// 查找最短路径
			resultList = search(nowNode, target);

			// 查找路径
			function search (nowNode, target) {
				// 结果
				var resultList = [];
				// 是否到达终点
				var isFind = false;
				// 当前节点
				var node = null;
				// 查找直到开放列表为空
				while (openList.length > 0) {
					// 从开放列表取出一个作为当前节点
					node = openList.pop();
					// 找到就退出
					if (node.x == target.x && node.y == target.y) {
						isFind = true;
						break;
					}
					// 上
					if (node.y > 1) {
						checkPath(node.x, node.y - 1, node, target);
					}
					// 下
					if (node.y < model.wrap[1]) {
						checkPath(node.x, node.y + 1, node, target);
					}
					// 左
					if (node.x > 1) {
						checkPath(node.x - 1, node.y, node, target);
					}
					// 右
					if (node.x < model.wrap[0]) {
						checkPath(node.x + 1, node.y, node, target);
					}					

					// 上左
					if (node.y > 1 && node.x > 1 && isMoveable(node.x - 1, node.y) && isMoveable(node.x, node.y - 1)) {
						checkPath(node.x - 1, node.y - 1, node, target);
					}
					// 下左
					if (node.y < model.wrap[1] && node.x > 1 && isMoveable(node.x - 1, node.y) && isMoveable(node.x, node.y + 1)) {
						checkPath(node.x - 1, node.y + 1, node, target);
					}
					// 上右
					if (node.x < model.wrap[0] && node.y > 1 && isMoveable(node.x + 1, node.y) && isMoveable(node.x, node.y - 1)) {
						checkPath(node.x + 1, node.y - 1, node, target);
					}
					// 下右
					if (node.x < model.wrap[0] && node.y < model.wrap[1] && isMoveable(node.x + 1, node.y) && isMoveable(node.x, node.y + 1)) {
						checkPath(node.x + 1, node.y + 1, node, target);
					}

					// 当前节点放入关闭列表
					closeList.push(node);
					// 开放列表按照f值大小排序
					openList.sort(sortFun);
				}
				// 找到就去得到路径
				if (isFind) {
					getPath(resultList, node);
				}
				// 返回路径
				return resultList;
			}
			// 判断该点是否为墙或守卫
			function isMoveable (x, y) {
				if (model.walls.isWall(x, y)) {
					return false;
				}
				if (model.guards.isGuard(x, y)) {
					return false;
				}
				return true;
			}
			// 检查节点是否可用
			function checkPath (x, y, parentNode, target) {
				// 新建节点，设置父节点
				var node = new Node(x, y, parentNode);
				// 是墙或者守卫就push到关闭列表
				if (model.walls.isWall(x, y) || model.guards.isGuard(x ,y)) {
					closeList.push(node);
					return false;
				}
				// 处于关闭列表里，退出
				if (isInList(closeList, x, y) != -1) {
					return false;
				}
				var index = isInList(openList, x, y);
				// 原先处于开放列表，更新f值
				if (index != -1) {
					if ((parentNode.g + cost) < openList[index].g) {
						node.parentNode = parentNode;
						countFGH(node, target);
						openList[index] = node;
					}
				// 原来不处于开放列表，push到开放列表，设置f值
				} else {
					node.parentNode = parentNode;
					countFGH(node, target);
					openList.push(node);
				}
				return true;
			}
			// 是否处于一个列表里，返回index，否则返回-1
			function isInList (list, x, y) {
				var i;
				for (i = 0; i < list.length; i++) {
					if (list[i].x == x && list[i].y == y) {
						return i;
					}
				}
				return -1;
			}
			// 计算 f,s,h
			function countFGH (now, target) {
				// g为父节点g加上花费
				if (now.parentNode == null || now.parentNode == undefined) {
					now.g = cost;
				} else if (Math.abs(now.parentNode.x - now.x) == 1 && Math.abs(now.parentNode.y - now.y)) {
					now.g = now.parentNode.g + vcost;
				} else {
					now.g = now.parentNode.g + cost;
				}
				// h是距离终点的x加y差值乘以花费
				now.h = (Math.abs(now.x - target.x) + Math.abs(now.y - target.y)) * cost;
				// f = g + h
				now.f = now.g + now.h;
			}
			// 按f值倒序排列
			function sortFun (one, two) {
				return two.f - one.f;
			}
			// 节点类
			function Node (x, y, parentNode) {
				this.x = x;
				this.y = y;
				this.parentNode = parentNode;
				this.g = 0;
				this.h = 0;
				this.f = 0;
			}
			// 得到路径
			function getPath (resultList, node) {
				resultList.unshift([node.x, node.y]);
				if (node.parentNode != null && node.parentNode != undefined) {
					getPath(resultList, node.parentNode);
				}
			}
			
			// 返回路径数组
			return resultList;
		}

	},

	// 墙
	walls : {
		
		// 所有墙，坐标数组
		allWall : [],
		
		// 创建随机墙
		create : function () {
			// 初始化，清除原来的墙
			model.walls.allWall = [];

			// 随机生成
			// 墙的数量
			var num = parseInt(Math.random() * model.wrap[0] * model.wrap[1] / 6) + 5;
			
			// 缓存将要生成的墙的坐标
			var x = 0;
			var y = 0;

			// 循环生成
			for (var i = 0; i < num; i++) {
				
				x = parseInt(Math.random() * model.wrap[0] + 1);
				y = parseInt(Math.random() * model.wrap[1] + 1);
				
				// 不是墙就设为墙
				if (!model.walls.isWall(x, y) && !(x == model.ball.pos[0] && y == model.ball.pos[1]) && !(x == model.file[0] && y == model.file[1])) {
					model.walls.allWall.push([x, y]);
				}

			}
		},

		// 判断是否是墙
		isWall : function (x, y) {
			for (var i = 0; i < model.walls.allWall.length; i++) {
				if (model.walls.allWall[i][0] == x && model.walls.allWall[i][1] == y) {
					return true;
				}
			}
			return false;
		}
	},

	// 任务47要在这里新加守卫位置
	// 以及生成随机守卫
	guards : {
		// 位置数组
		allGuards : [],
		// 随机守卫
		create : function () {
			// 初始化，清除原来的
			model.guards.allGuards = [];

			// 随机生成
			// 数量
			var num = parseInt(Math.random() * model.wrap[0] * model.wrap[1] / 25) + 2;
			
			// 缓存将要生成的墙的坐标
			var x = 0;
			var y = 0;

			// 循环生成
			for (var i = 0; i < num; i++) {
				
				x = parseInt(Math.random() * model.wrap[0] + 1);
				y = parseInt(Math.random() * model.wrap[1] + 1);

				// 前三行和后三行不要
				if (y < 4 || model.wrap[1] - y < 4) {
					continue;
				}
				
				
				// 不是墙或守卫或秘密文件或小球，就设为守卫
				if (!model.walls.isWall(x, y) && !(x == model.ball.pos[0] && y == model.ball.pos[1]) && !(x == model.file[0] && y == model.file[1]) && !model.guards.isGuard()) {
					model.guards.allGuards.push([x, y]);
				}

			}
		},
		// 消灭一个守卫
		kill : function (x, y) {
			for (var i = 0; i < model.guards.allGuards.length; i++) {
				if (model.guards.allGuards[i][0] == x && model.guards.allGuards[i][1] == y) {
					model.guards.allGuards.splice(i, 1);
					render.fillRec(x, y, '#FFE6CD');
					return true;
				}
			}
			return false;
		},
		// 判断是否为守卫
		isGuard : function (x, y) {
			for (var i = 0; i < model.guards.allGuards.length; i++) {
				if (model.guards.allGuards[i][0] == x && model.guards.allGuards[i][1] == y) {
					return true;
				}
			}
			return false;
		}
	},

	// 任务47需要这里或外面新加子弹模型
	// 子弹有个属性写着自己是否正在使用中
	// 新建子弹后，设置方向
	// 定时更新自己的位置, 并且判断是否撞墙
	// 所有的子弹push到子弹对象池里的一个数组里存着
	bullet : function (id, direction, x, y, who) {
		// id
		this.id = id;
		// 谁的子弹
		this.who = who;
		// 是否正在使用
		this.isInUse = true;
		// 方向, 顺时针度数
		this.direction = direction;
		// 位置
		this.location = [x * 20 - 10, y * 20 - 10];
		// 上次位置
		this.lastLocation = [x * 20 - 10, y * 20 - 10];
		// 更新位置
		this.update = function (that) {
			var me = that;
			var xx = me.location[0];
			var yy = me.location[1];

			if (me.isInUse) {
				xx += (Math.sin(me.direction / 180 * Math.PI) * 5);
				yy -= (Math.cos(me.direction / 180 * Math.PI) * 5);
				me.lastLocation = [me.location[0], me.location[1]];
				me.location = [xx, yy];
			}

			var x1 = model.locToPos(xx - 5, yy)[0];
			var x2 = model.locToPos(xx + 5, yy)[0];
			var y1 = model.locToPos(xx, yy - 5)[1];
			var y2 = model.locToPos(xx, yy + 5)[1];
			var x = model.locToPos(xx, yy)[0];
			var y = model.locToPos(xx, yy)[1];

			// 走到墙和秘密文件，销毁
			if (	model.walls.isWall(x1, y1)
			 	||  model.walls.isWall(x1, y2)
			 	||  model.walls.isWall(x2, y1)
			 	||  model.walls.isWall(x2, y2)
			 	||  (x2 == model.file[0] && y2 == model.file[1])
			 	||  (x2 == model.file[0] && y1 == model.file[1])
			 	||  (x1 == model.file[0] && y2 == model.file[1])
			 	||  (x1 == model.file[0] && y1 == model.file[1])
			 	||  x1 < 1
			 	||  x2 > model.wrap[0]
			 	||  y1 < 1
			 	||  y2 > model.wrap[1]
			 	) {
				me.isInUse = false;
			}

			// 守卫的子弹，可以打特工
			if (me.who == 'guard') {
				
				if (
						(x1 == model.ball.pos[0] && y1 == model.ball.pos[1])
					||  (x1 == model.ball.pos[0] && y2 == model.ball.pos[1])
					||  (x2 == model.ball.pos[0] && y1 == model.ball.pos[1])
					||  (x2 == model.ball.pos[0] && y2 == model.ball.pos[1])
				   ) {
					me.isInUse = false;
					controller.endGame(false);
				}

			}
			
			// 特工的子弹，可以打守卫
			if (me.who == 'ball') {
				
				if (model.guards.isGuard(x1, y1)) {
					me.isInUse = false;
					model.guards.kill(x1, y1);
				} else if (model.guards.isGuard(x1, y2)) {
					me.isInUse = false;
					model.guards.kill(x1, y2);
				} else if (model.guards.isGuard(x2, y1)) {
					me.isInUse = false;
					model.guards.kill(x2, y1);
				} else if (model.guards.isGuard(x2, y2)) {
					me.isInUse = false;
					model.guards.kill(x2, y2);
				}

			}
			

			if (me.isInUse) {
				
				render.removeBullet(me.lastLocation[0], me.lastLocation[1]);
				render.renderBullet(me.location[0], me.location[1]);
				setTimeout(function () {
					me.update(me);
				}, 200);

			} else {
				render.removeBullet(me.lastLocation[0], me.lastLocation[1]);
			}
		}
	},

	// 位置转成坐标
	locToPos : function (xx, yy) {
		return [parseInt(xx / 20) + 1, parseInt(yy / 20) + 1];
	},

	// 任务47需要在这里或外面新加子弹对象池
	// 对象池有数组存着所有子弹对象
	// 子弹碰到墙后，访问对象池接口，对象池把这个子弹设置为可以使用的状态
	// 需要新子弹时，访问对象池接口，分配或新建一个子弹
	bulletsPool : {
		// 所有子弹数组，保存子弹实例
		allBullets : [],
		// 分配一颗子弹并且发射出去
		getABullet : function (x, y, direction, who) {
			var bullet = null;

			for (var i = 0; i < model.bulletsPool.allBullets.length; i++) {
				if( model.bulletsPool.allBullets[i].isInUse == false ) {
					
					model.bulletsPool.allBullets[i].isInUse = true;
					model.bulletsPool.allBullets[i].direction = direction;
					model.bulletsPool.allBullets[i].location = [x * 20 - 10, y * 20 - 10];
					model.bulletsPool.allBullets[i].lastLocation = [x * 20 - 10, y * 20 - 10];
					model.bulletsPool.allBullets[i].who = who;
					bullet = model.bulletsPool.allBullets[i];
					break;
				}
			}

			if (bullet == null) {
				if (model.bulletsPool.allBullets.length > 0) {
					
					bullet = new model.bullet(model.bulletsPool.allBullets[model.bulletsPool.allBullets.length - 1].id + 1, direction, x, y, who);

				} else {
					bullet = new model.bullet(1, direction, x, y, who);
				}
				model.bulletsPool.allBullets.push(bullet);
			}
		
			bullet.update(bullet);
		}

	}
}
