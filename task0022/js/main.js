// 存放动画元素顺序
var animationList = [];
var timer = null;

// 获取根节点
var rootNode = document.getElementsByClassName("tree-warpper")[0].firstElementChild;

// 设定二叉树遍历方法
var BinaryTree = {
	preOrder: function (node) {
		if (node != null) {
			animationList.push(node);
			// 递归调用
			if (node.firstElementChild != null) {
				arguments.callee(node.firstElementChild);
			}
			if (node.lastElementChild != null) {
				arguments.callee(node.lastElementChild);
			}
		}
	},
	inOrder: function(node) {
		if (node != null) {		
			if (node.firstElementChild != null) {
				arguments.callee(node.firstElementChild);
			}
			animationList.push(node);
			if (node.lastElementChild != null) {
				arguments.callee(node.lastElementChild);
			}
		}
	},
	postOrder: function(node) {
		if (node != null) {		
			if (node.firstElementChild != null) {
				arguments.callee(node.firstElementChild);
			}
			if (node.lastElementChild != null) {
				arguments.callee(node.lastElementChild);
			}
			animationList.push(node);
		}
	},
	// 根据animationList实现动画
	animate: function() {
		var i = 0;
		addClass(animationList[0], "active");
		timer = setInterval(function() {
			i++;
			if (i < animationList.length) {
				removeClass(animationList[i - 1]);
				addClass(animationList[i], "active");
			}
			else {
				clearInterval(timer);
				removeClass(animationList[i - 1]);
			}
		}, 500)
	},
	// 清楚所有div上className
	reset: function() {
		var divArr = document.getElementsByTagName("div");
		for (var i = 0; i < divArr.length; i++) {
			removeClass(divArr[i]);
		}
	}

}

// 为元素添加类名
function addClass(element, nodeName) {
	element.className = nodeName;
}

// 移除元素所有类名
function removeClass(element) {
	element.className = "";
}

// inOrder点击时触发动作
function inOrderHandle() {
	// 首先清楚当前的动画元素列表
	animationList = [];
	if (timer != null) {
		clearInterval(timer);
	}
	BinaryTree.reset();
	BinaryTree.inOrder(rootNode);
	BinaryTree.animate();
}
// preOrder点击时触发动作
function preOrderHandle() {
	animationList = [];
	if (timer != null) {
		clearInterval(timer);
	}
	BinaryTree.reset();
	BinaryTree.preOrder(rootNode);
	BinaryTree.animate();
}
// postOrder点击时触发动作
function postOrderHandle() {
	animationList = [];
	if (timer != null) {
		clearInterval(timer);
	}
	BinaryTree.reset();
	BinaryTree.postOrder(rootNode);
	BinaryTree.animate();
}

// 初始化函数添加事件监听
function init() {
	var preButton = document.getElementById("preOrder-btn"),
		inButton = document.getElementById("inOrder-btn"),
		postButton = document.getElementById("postOrder-btn");

	preButton.addEventListener("click", preOrderHandle, false);
	inButton.addEventListener("click", inOrderHandle, false);
	postButton.addEventListener("click", postOrderHandle, false);
}

init();