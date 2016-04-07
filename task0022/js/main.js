// 实现节点类
function Node(data, left, right) {
	this.data = data;
	this.left = left;
	this.right = right;
}

// 实现二叉树类
function BinaryTree() {
	this.root = null;	//根节点默认为空
	this.insert = insert;
}