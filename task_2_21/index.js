// 封装一个队列对象制造工厂
function Queue () {

	var newQueue = {};
	
	newQueue.content = [], // 队列内容

	// 单个进入
	newQueue.push = function (ele) {
		if (this.unique(ele)) {
			// 左侧进入
			this.content.unshift(ele);
			// 满了就pop
			if (this.content.length == 10) {
				this.content.pop();
			}
			this.render();
		}
	}

	// 数组进入
	newQueue.pushArr = function (eleArr = []) {
		// 循环单一进入
		for (var i = eleArr.length - 1; i >= 0; i--) {
			if (this.unique(eleArr[i])) {
				// 左侧进入
				this.content.unshift(eleArr[i]);
			}
		}
		// 满了就删掉10个以后的
		if (this.content.length > 10) {
			this.content.splice(10, this.content.length - 10);
		}
		this.render('hobby');
	}

	// 渲染队列
	newQueue.render = function (type = 'tag') { 
		// 默认渲染tag，也可以传入字符串渲染hobby
		var html = "";
		for (var i = 0; i < this.content.length; i++) {
			html += "<div "
				 + (type == 'tag' ? "onclick=\"removeItem(this)\">" : ">")
				 + this.content[i] 
				 + "</div>";
		}
		document.getElementById(type).innerHTML = html;
	}

	// 单一测试
	newQueue.unique = function (testEle) {
		if (testEle == "") {
			return false;
		}
		// indexOf 在ECMA5才有，这里不考虑兼容性
		return this.content.indexOf(testEle) == -1;
	}

	// 删除元素
	newQueue.deleteOne = function (ele) {
		this.content.splice(this.content.indexOf(ele), 1);
		this.render();
	}

	return newQueue;
}

// 删除元素处理函数
function removeItem (myself) {
	tags.deleteOne(myself.innerText);
}

// hobby处理函数
function hobbyBtnHandle () {
	var num = document.getElementById("hobbyInput").value;
	// 中间空字符全部换成一个空格，首尾空字符不要
	num = num.replace(/[\s,，、]+/g, ' ').replace(/^\s+|\s+$/, '');
	hobbys.pushArr(num.split(" "));
	document.getElementById("hobbyInput").value = "";
}

// tag输入框处理函数
function tagHandle (event) {
	var event = event || window.event; // 捕获事件
	var tagText = this.value;
	// 如果末尾有空格或逗号，或者按下的是回车键，处理数据
	if (/[\s，,]+$/.test(tagText) || event.keyCode == 13) {
	 	tagText = tagText.replace(/[\s\r，,]+$/, '');
	 	if (tagText != "") {
	 		tags.push(tagText);
	 		this.value = "";
	 	}
	 }
}

// 初始化函数
function init () {
	hobbys = Queue(); 
	tags = Queue(); // 隐式申明全局变量，不推荐这样干，不过这里为了放在init里就这么干了
	document.getElementById("tagInput").onkeyup = tagHandle;
	document.getElementById("hobbyBtn").onclick = hobbyBtnHandle;
}

init(); // 初始化页面
