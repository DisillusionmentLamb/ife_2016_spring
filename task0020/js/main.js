// 实现Queue类
function Queue() {
	this.dataStore = [];
	this.searchResult = [];
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

// 根据队列对象渲染页面
function renderList() {
	var resultList = document.getElementById("result-warpper"),
		htmlStr = "";
	for (var i = 0; i < pageData.dataStore.length; i++) {
		// 对符合搜索结果的值单独渲染
		function isChecked(num) {
			return num == i;
		}
		if (pageData.searchResult.some(isChecked)) {
			htmlStr += '<div class="selected">' + pageData.dataStore[i] + '</div>';
		}
		else {
			htmlStr += '<div>' + pageData.dataStore[i] + '</div>';			
		}
	}
	resultList.innerHTML = htmlStr;
}

// 将textarea中输入文本内容转换成数组
function textToArr(element) {
	return element.value.split(/[\n\r\t\s,，、;；]+/g);
}

// 当left-insert-input点击时更新队列对象数据并执行渲染
function leftInsertHandle() {
	var insertArea = document.getElementById("insert-area"),
		inputArr = textToArr(insertArea);
	//清空搜索列表
	pageData.searchResult = [];
	for (var i = 0; i < inputArr.length; i++) {
		pageData.leftInsert(inputArr[i]);
	}
	renderList();
}

// 当right-insert-input点击时更新队列对象数据并执行渲染
function rightInsertHandle() {
	var insertArea = document.getElementById("insert-area"),
		inputArr = textToArr(insertArea);
	//清空搜索列表
	pageData.searchResult = [];
	for (var i = 0; i < inputArr.length; i++) {
		pageData.rightInsert(inputArr[i]);
	}
	renderList();
}

// 当left-drop-input点击时更新队列对象数据并执行渲染
function leftDropHandle() {
	pageData.leftDrop();
	renderList();
}

// 当right-drop-input点击时更新队列对象数据并执行渲染
function rightDropHandle() {
	pageData.rightDrop();
	renderList();
}

// 当search-btn点击时更新队列对象数据并执行渲染
function searchHandle() {
	var searchInput = document.getElementById("search-input");
	// 清空搜索结果列表
	pageData.searchResult = [];
	if (searchInput.value == "") {
		alert("请输入内容");
		return;
	}
	for (var i = 0; i < pageData.dataStore.length; i++) {
		if (pageData.dataStore[i].indexOf(searchInput.value) != -1) {
			pageData.searchResult.push(i);
		}
	}
	renderList();
}

// 为元素添加监听事件，初始化数据队列
function init() {
	pageData = new Queue();

	renderList();

	// 为button添加事件监听
	document.getElementById("left-insert-btn").addEventListener("click", leftInsertHandle, false);
	document.getElementById("right-insert-btn").addEventListener("click", rightInsertHandle, false);
	document.getElementById("left-drop-btn").addEventListener("click", leftDropHandle, false);
	document.getElementById("right-drop-btn").addEventListener("click", rightDropHandle, false);
	document.getElementById("search-btn").addEventListener("click", searchHandle, false);

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