// 实现Queue类
function Queue() {
	this.dataStore = [];
	this.leftInsert = leftInsert;
	this.rightInsert = rightInsert;
	this.leftDrop = leftDrop;
	this.rightDrop = rightDrop;
	this.isEmpty = isEmpty;
}
// 队列首部插入元素
function leftInsert(element) {
	this.dataStore.unshift(element);
}
// 队列尾部插入元素
function rightInsert(element) {
	this.dataStore.push(element);
}
// 队列首部删除元素
function leftDrop() {
	this.dataStore.shift();
}
// 队列尾部删除元素
function rightDrop() {
	this.dataStore.pop();
}
// 判断队列是否为空，返回boolean
function isEmpty() {
	if (this.dataStore.length == 0) {
		return true;
	}
	else {
		return false;
	}
}

// 判断输入元素是否为正整数，返回boolean
function checkStr(element) {
	return /[1-9]\d*/.test(element);
}

// 根据队列对象渲染页面
function renderList() {
	var resultList = document.getElementById("result-warpper"),
		htmlStr = "";
	for (var i = 0; i < pageData.dataStore.length; i++) {
		htmlStr += "<div>" + pageData.dataStore[i].toString() + "</div>";
	}
	resultList.innerHTML = htmlStr;
}

// 当left-insert-input点击时更新队列对象数据并执行渲染
function leftInsertHandle() {
	var input = document.getElementById("insert-input");
	if (!(checkStr(input.value))) {
		alert("请输入正整数值！");
		return;
	}
	pageData.leftInsert(input.value);
	renderList();
}

// 当right-insert-input点击时更新队列对象数据并执行渲染
function rightInsertHandle() {
	var input = document.getElementById("insert-input");
	if (!(checkStr(input.value))) {
		alert("请输入正整数值！");
		return;
	}
	pageData.rightInsert(input.value);
	renderList();
}

// 当left-drop-input点击时更新队列对象数据并执行渲染
function leftDropHandle() {
	if (pageData.isEmpty()) {
		alert("请输入值！");
		return;
	}
	pageData.leftDrop();
	renderList();
}

// 当right-drop-input点击时更新队列对象数据并执行渲染
function rightDropHandle() {
	if (pageData.isEmpty()) {
		alert("请输入值！");
		return;
	}
	pageData.rightDrop();
	renderList();
}

// 为元素添加监听事件，初始化数据队列
function init() {
	pageData = new Queue();

	// 为button添加事件监听
	document.getElementById("left-insert-btn").addEventListener("click", leftInsertHandle, false);
	document.getElementById("right-insert-btn").addEventListener("click", rightInsertHandle, false);
	document.getElementById("left-drop-btn").addEventListener("click", leftDropHandle, false);
	document.getElementById("right-drop-btn").addEventListener("click", rightDropHandle, false);

	// 为resultList添加事件代理
	var resultList = document.getElementById("result-warpper");
	resultList.addEventListener("click", function(event){
		if (event.target.tagName = "DIV") {
			// 删除节点
			event.target.parentNode.removeChild(event.target);
			// 删除队列数据
			for (var i = 0; i < pageData.dataStore.length; i++) {
				if (event.target.textContent == pageData.dataStore[i]) {
					pageData.dataStore.splice(i, 1);
					return;
				}
			}
		}
	},false);
}

init();




