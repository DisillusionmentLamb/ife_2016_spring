// 封装一个队列
var queue = {

	content: [], // 队列内容

	length: 0, // 队列长度，外部不直接访问content，故设置这个属性

	// 队列初始化
	init: function (arr = []) {
		this.length = arr.length;
		this.content = arr;
		this.render();
		return this;

	},

	// 右侧进入
	push: function (numArr = []) {
		// 右侧进可以直接合并
		this.content = this.content.concat(numArr); 
		this.length = this.content.length;
		this.render();
	},

	// 左侧进入
	unshift: function (numArr = []) {
		// 左侧进可以反过来合并
		this.content = numArr.concat(this.content);
		this.length = this.content.length;
		this.render();
	},

	// 右侧删除
	pop: function () {
		if (this.content.length == 0) {
			alert("队列为空");
			return false;
		}
		var popValue = this.content.pop();
		this.length = this.content.length;
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
		this.length = this.content.length;
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
		this.length = this.content.length;
		this.render();
	},

	// 渲染队列
	render: function (arr = this.content) { 
		// 默认渲染content，也可以传入数组渲染
		var html = "";
		for (var i = 0; i < arr.length; i++) {
			html += "<div onclick=\"deleteHandle()\">" + arr[i] + "</div>";
		}
		document.getElementById("container").innerHTML = html;
	},

	// 搜索
	search: function (searchWord) {

		// 避免污染原数据，新建一个
		var newContent = [];

		// 把this.content的所有元素拷贝到newContent
		// 千万不能newContent = this.content;
		// 这里坑了我4小时
		// js里对象复值是传递引用
		// 不想传递引用就要深复制
		// 凌晨五点我的心真的好卵痛 =_=||
		for (var i = 0; i < this.content.length; i++) {
			newContent[i] = this.content[i];
		}

		// 遍历，替换
		for (var i = 0; i < newContent.length; i++) {
			newContent[i] = newContent[i].toString().replace(searchWord, "<span>" + searchWord + "</span>");
		}

		// 重新渲染
		this.render(newContent);
	}
}

// 验证输入合法性
function validateInput () {

	var num = document.getElementById("inputNum").value;

	// 中间空字符全部换成一个空格，首尾空字符不要
	num = num.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '');

	// 只能数字中英文和空格
	if (!/[0-9a-zA-Z\s]*/g.test(num) || num == "") {
		alert("请输入数字,可以用空字符间隔");
		return false;
	} else {
		return num.split(" ");
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

// 搜索处理函数
function searchBtnHandle () {
	// 清除首尾空格
	var searchWord = document.getElementById("searchWord").value.replace(/^\s+|\s+$/, '');

	// 清空输入框
	document.getElementById("searchWord").value = "";
	
	// 渲染数据
	queue.search(searchWord);
}



// 初始化函数
function init () {
	queue = queue.init(); // 隐式申明全局变量，不推荐这样干，不过这里为了放在init里就这么干了
	document.getElementById("pushBtn").onclick = pushBtnHandle;
	document.getElementById("shiftBtn").onclick = shiftBtnHandle;
	document.getElementById("popBtn").onclick = popBtnHandle;
	document.getElementById("unshiftBtn").onclick = unshiftBtnHandle;
	document.getElementById("searchBtn").onclick = searchBtnHandle;
}

init(); // 初始化页面
