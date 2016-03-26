// 封装一个队列
var queue = {

	content: [], // 队列内容

	length: 0, // 队列长度

	// 队列初始化
	init: function (arr = []) {
		this.length = arr.length;
		this.content = arr;
		this.render();
		return this;
	},

	// 右侧进入
	push: function (num) {
		this.content.push(num);
		this.length += 1;
		this.render();
	},

	// 左侧进入
	unshift: function (num) {
		this.content.unshift(num);
		this.length += 1;
		this.render();
	},

	// 右侧删除
	pop: function () {
		if (this.content.length == 0) {
			alert("队列为空");
			return false;
		}
		var popValue = this.content.pop();
		this.length -= 1;
		this.render();
		return popValue;
	},

	// 左侧删除
	shift: function () {
		if (this.content.length == 0) {
			alert("队列为空");
			return false;
		}
		var shiftValue = this.content.shift();
		this.length -= 1;
		this.render();
		return shiftValue;
	},

	// 删除队列成员
	delete: function (position, amount = 1) {
		if (position > this.content.length - 1) {
			alert("没有此元素");
			return false;
		}
		this.content.splice(position, amount);
		this.length -= 1;
		this.render();
	},

	// 渲染队列
	render: function () {
		var html = "";
		for (var i = 0; i < this.content.length; i++) {
			html += "<div onclick=\"deleteHandle()\">" + this.content[i] + "</div>";
		}
		document.getElementById("container").innerHTML = html;
	}
}

// 验证输入合法性
function validateInput () {
	var num = document.getElementById("inputNum").value;
	num = num.replace(/\s+/g, '');
	if (!/^[1-9]+[0-9]*/.test(num)) {
		alert("请输入数字");
		return false;
	} else {
		return num;
	}
}

// 右侧进入函数
function pushBtnHandle () {
	if (validateInput()) {
		queue.push(validateInput());
	}
	document.getElementById("inputNum").value = "";
}

// 左侧进入处理函数
function unshiftBtnHandle () {
	if (validateInput()) {
		queue.unshift(validateInput());
	}
	document.getElementById("inputNum").value = "";
}

// 左侧删除处理函数
function shiftBtnHandle () {
	alert(queue.shift());
}

// 右侧删除处理函数
function popBtnHandle () {
	alert(queue.pop());
}

// 点击删除处理函数
function deleteHandle () {
	queue.delete(parseInt(this.innerText));
}

// 初始化函数
function init () {
	queue = queue.init(); // 隐式申明全局变量，不推荐这样干，不过这里为了放在init里就这么干了
	document.getElementById("pushBtn").onclick = pushBtnHandle;
	document.getElementById("shiftBtn").onclick = shiftBtnHandle;
	document.getElementById("popBtn").onclick = popBtnHandle;
	document.getElementById("unshiftBtn").onclick = unshiftBtnHandle;
}

init(); // 初始化页面
