// 大概设想，按需要修改
// 所有的位置都是坐标值，不是px大小值
// canvas 顶部第一个小方格坐标是[1, 1]
var model = {
	
	// 画布大小
	wrap : [x, y],

	// 秘密文件位置
	file : [x, y],

	// 小球
	ball : {
		
		// 位置
		pos : [x, y],
		
		// 寻路算法
		// 传入终点坐标
		goTo : function ([x, y]) {
			// 返回小方块每步的位置的数组
			// 不能穿墙，可以走斜线
			// arr = [
			// 		[x0,y0], // 起点
			// 		[x1,y1], // 中间点，不能穿墙，可以斜着走
			// 		[x2,y2],
			// 		…………
			// 		[x3,y3] // 终点
			// ]
			// return arr
		}

	},

	// 墙
	walls : {
		
		// 所有墙，坐标数组
		allWall : [ [x, y], [x, y]],
		
		// 创建随机墙
		create : function () {
			// 需要有些墙是连在一起的
			// 不能超出画布大小
			// 不能把小球和秘密文件设为墙
			// 返回墙的数组
		}
	}

	// 任务47要在这里新加守卫位置
	// 以及生成随机守卫

	// 任务47需要这里或外面新加子弹模型
	// 子弹有个属性写着自己是否正在使用中
	// 新建子弹后，设置方向
	// 定时更新自己的位置, 并且判断是否撞墙
	// 所有的子弹push到子弹对象池里的一个数组里存着

	// 任务47需要在这里或外面新加子弹对象池
	// 对象池有数组存着所有子弹对象，这个数组存20个子弹应该够用
	// 子弹碰到墙后，访问对象池接口，对象池把这个子弹设置为可以使用的状态
	// 需要新子弹时，访问对象池接口，分配或新建一个子弹

}