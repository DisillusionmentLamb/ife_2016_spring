/**
 * A* 寻路算法，与外部解耦，可复用
 * @param (int) max_x 横坐标边界
 * @param (int) max_y 纵坐标边界
 * @param (int) from_x 起点横坐标
 * @param (int) from_y 起点纵坐标
 * @param (int) to_x 终点横坐标
 * @param (int) to_y 终点纵坐标 
 * @param (bool) diagonal 是否可以斜着走
 * @param (array) bannedArr 墙的坐标数组
 * @return (array) 路径数组，包括起点与终点，没路就返回空数组
 */

function AStarSearchAlgorithm (max_x, max_y, from_x, from_y, to_x, to_y, diagonal, bannedArr) {
	//目标越界，退出
	if (to_y > max_y || to_y < 1 || to_x < 1 || to_x > max_x) {
		return [];
	}
	//目标是墙，退出
	if (isInBannedArr(to_x, to_y)) {
		return [];
	}

	// 目前位置
	var nowNode = new Node(from_x, from_y);
	// 目标位置
	var target = new Node(to_x, to_y, null);
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
			if (node.y < max_y) {
				checkPath(node.x, node.y + 1, node, target);
			}
			// 左
			if (node.x > 1) {
				checkPath(node.x - 1, node.y, node, target);
			}
			// 右
			if (node.x < max_x) {
				checkPath(node.x + 1, node.y, node, target);
			}	

			// 斜着走				
			if (diagonal) {
				// 上左
				if (node.y > 1 && node.x > 1 && !isInBannedArr(node.x - 1, node.y) && !isInBannedArr(node.x, node.y - 1)) {
					checkPath(node.x - 1, node.y - 1, node, target);
				}
				// 下左
				if (node.y < max_y && node.x > 1 && !isInBannedArr(node.x - 1, node.y) && !isInBannedArr(node.x, node.y + 1)) {
					checkPath(node.x - 1, node.y + 1, node, target);
				}
				// 上右
				if (node.x < max_x && node.y > 1 && !isInBannedArr(node.x + 1, node.y) && !isInBannedArr(node.x, node.y - 1)) {
					checkPath(node.x + 1, node.y - 1, node, target);
				}
				// 下右
				if (node.x < max_x && node.y < max_y && !isInBannedArr(node.x + 1, node.y) && !isInBannedArr(node.x, node.y + 1)) {
					checkPath(node.x + 1, node.y + 1, node, target);
				}
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
	// 检查节点是否可用
	function checkPath (x, y, parentNode, target) {
		// 新建节点，设置父节点
		var node = new Node(x, y, parentNode);
		// 是墙或者守卫就push到关闭列表
		if (isInBannedArr(x, y)) {
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
	// 是否是墙
	function isInBannedArr (x, y) {
		for (var i = 0; i < bannedArr.length; i++) {
			if (bannedArr[i][0] == x && bannedArr[i][1] == y) {
				return true;
			}
		}
		return false;
	}
	// 计算 f,s,h
	function countFGH (now, target) {
		// g为父节点g加上花费
		if (now.parentNode == null || now.parentNode == undefined) {
			now.g = cost;
		} else if (diagonal && Math.abs(now.parentNode.x - now.x) == 1 && Math.abs(now.parentNode.y - now.y) == 1) {
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