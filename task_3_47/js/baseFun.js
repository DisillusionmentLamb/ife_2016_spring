/**
 * 函数库
 */

var FUN = {
	
	/**
	 * 坐标是否处于数组里
	 * @param (int) x 横坐标
	 * @param (int) y 纵坐标
	 * @param (array) arr 数组
	 * @return (bool) 是否在
	 */
	isInArr : function (x, y, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][0] == x && arr[i][1] == y) {
				return true;
			}
		}
		return false;
	},

	/**
	 * 从数组中移除
	 * @param (int) x 横坐标
	 * @param (int) y 纵坐标
	 * @param (array) arr 数组
	 */
	rmFromArr : function (x, y, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][0] == x && arr[i][1] == y) {
				arr.splice(i, 1);
				break;
			}
		}
	},

	/**
	 * 计算两点之间角度
	 * @param (int) x1 起点横坐标
	 * @param (int) y1 起点纵坐标	 
	 * @param (int) x2 终点横坐标
	 * @param (int) y2 终点纵坐标
	 * @return (int) 角度，顺时针度数，0~360
	 */
	getDeg : function (x1, y1, x2, y2) {
		var deg = Math.atan2(x2 - x1, y1 - y2) / Math.PI * 180;
		if (deg < 0) {
			deg += 360;
		}
		return deg;
	},

	/**
	 * 计算两点之间距离
	 * @param (int) x1 起点横坐标
	 * @param (int) y1 起点纵坐标	 
	 * @param (int) x2 终点横坐标
	 * @param (int) y2 终点纵坐标
	 * @return (int) 距离
	 */
	getDistance : function (x1, y1, x2, y2) {
		return Math.sqrt(Math.pow((x1 - x2) * 20, 2) + Math.pow((y1 - y2) * 20, 2));
	},

	/**
	 * 根据点击的点在屏幕上的位置, 获取该位置的坐标
	 * @param (event) 点击事件
	 * @return (array) 坐标数组
	 */
	getPos : function (e) {
		var width = e.clientX;
		var height = e.clientY;
		return [parseInt(width / 20 + 1), parseInt(height / 20 + 1)];
	},

	/**
	 * 生成某个区间的随机数
	 * @param (int) min 最小数
	 * @param (int) max 最大数
	 * @return (int) 随机数
	 */
	randomNum : function (min, max) {
		if (min >= max) {
			return parseInt(min);
		}
		return parseInt(min + Math.random() * (max - min + 1));
	},

	/**
	 * 圆是否碰到方块
	 * @param (int) circle_x 圆横坐标
	 * @param (int) circle_y 圆纵坐标
	 * @param (int) circle_r 圆半径
	 * @param (int) rect_x 方块横坐标
	 * @param (int) rect_y 方块纵坐标
	 * @param (int) rect_r 方块长(宽)
	 * @return (bool) 是否碰到
	 */
	isCircleInRect : function (circle_x, circle_y, circle_r, rect_x, rect_y, rect_r) {
		var x = Math.abs(circle_x - rect_x * rect_r + rect_r / 2) - rect_r / 2;
		var y = Math.abs(circle_y - rect_y * rect_r + rect_r / 2) - rect_r / 2;
		x = x < 0 ? 0 : x;
		y = y < 0 ? 0 : y;
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) <= circle_r;
	},

	/**
	 * 根据屏幕大小，获得画布坐标大小
	 * @return (array) 画布大小，[x, y]
	 */
	getSizeByPos : function () {
		return [parseInt(window.document.documentElement.clientWidth / 20), parseInt(window.document.documentElement.clientHeight / 20)];
	}

}









