function TreeWalker() {
	this.stack = [];
	this.isFinding = false;
	this.found = false;
}

// 将页面元素按层级入栈
TreeWalker.prototype.addStack = function(root) {
 	var div1 = document.getElementsByClassName("lv-1"),
 		div2 = document.getElementsByClassName("lv-2"),
 		div3 = document.getElementsByClassName("lv-3"),
 		self = this;
 	this.stack.push(root);
 	function addStack(item) {
 		self.stack.push(item);
 	}
 	[].forEach.call(div1,addStack);
 	[].forEach.call(div2,addStack);
 	[].forEach.call(div3,addStack);
 }

 // 查找元素并以动画显示
 TreeWalker.prototype.findText = function() {
 	var stack = this.stack,
 		keyword = document.getElementById("search-value").value,
 		self = this,	// 修正循环带来的作用域问题
 		timer = null,	// 计时器
 		i = 0;		// 计数器

 	// 清空状态
 	self.stack = [];
 	self.found = false;

 	if (!self.isFinding) {
 		self.isFinding = true;
 		stack[i].style.background = "blue";

 		timer = setInterval(function() {
 			if (i == stack.length - 1) {
 				stack[i].style.background = "#fff";
 				if (self.isFinding && !self.found) {
 					alert("未找到");
 				}
 				self.isFinding = false;
 				clearInterval(timer);
 			}
 			else {
 				++i;
 				stack[i - 1].style.background = "#fff";
 				stack[i].style.background = "blue";
 			}

 			if (self.isFinding) {
 				if (stack[i].innerHTML.split(/\W+/g)[0] == keyword) {
 					var findNode = stack[i];
 					self.found = true;
 					// 改变颜色
 					setTimeout(function() {
 						findNode.style.background = "red";
 					}, 1000);
 					setTimeout(function() {
 						findNode.style.background = "#fff";
 					}, 5000);
 				}
 			}
 		}, 500);
 	}
 }

 function searchHandle() {
 	var tree = new TreeWalker(),
 		root = document.getElementsByClassName("root")[0];
 	tree.addStack(root);
 	tree.findText();	
 } 

 function init() {
 	var searchBtn = document.getElementById("search-btn");

 	searchBtn.addEventListener("click", searchHandle, false);
 }


 init();