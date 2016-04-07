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


// 根据队列对象渲染目标元素
function renderList(pageData, element) {
	var htmlStr = "";
	for (var i = 0; i < pageData.dataStore.length; i++) {
			htmlStr += '<div>' + pageData.dataStore[i] + '</div>';			
	}
	element.innerHTML = htmlStr;
}

// 数组去重操作
function uniqueArr(arr) {
	var result = [],
		object = {};
	for (var i = 0; i < arr.length; i++) {
		//判断对象内是否存在重名属性
		if (!object[arr[i]]) {
			result.push(arr[i]);
			object[arr[i]] = true;
		}
	}
	return result;
}

// 当tags-input按下Enter时触发动作
function tagsEnterHandle() {
	var tagInput = document.getElementById("tag-input"),
		tagValue = tagInput.value.trim(),
		tags = document.getElementById("tags-warpper");
	function checked(str) {
		return str != tagValue;
	}
	if (tagData.dataStore.every(checked)) {
		if (tagData.dataStore.length < 10) {
			tagData.rightInsert(tagValue);
		}
		else {
			tagData.leftDrop();
			tagData.rightInsert(tagValue);
		}
	}
	renderList(tagData, tags);
	// 清空input中内容
	tagInput.value = "";
}

// 将textarea中输入文本内容转换成数组
function textToArr(element) {
	return element.value.split(/[\n\r\t\s ,，、;；]+/g);
}

// 当habbitBtn点击时触发动作
function habbitClickHandle() {
	var habbitArea = document.getElementById("habbit-area"),
		habbitArr = textToArr(habbitArea),
		habbits = document.getElementById("habbit-warpper");
	habbitArr = uniqueArr(habbitArr);
	if (habbitArr.length > 10) {
		alert("最多允许输入10个爱好");
		return;
	}
	if (habbitData.dataStore.length + habbitArr.length < 10) {
		for (var i = 0; i < habbitArr.length; i++) {
			habbitData.rightInsert(habbitArr[i]);
		}
	}
	else {
		// 计算需要移除队列的元素个数
		var removeNum = habbitData.dataStore.length + habbitArr.length - 10;
		// 移除旧元素
		for (var i = 0; i < removeNum; i++) {
			habbitData.leftDrop();
		}
		// 增添新元素
		for (var i = 0; i < habbitArr.length; i++) {
			habbitData.rightInsert(habbitArr[i]);
		}
	}
	habbitData.dataStore = uniqueArr(habbitData.dataStore);
	renderList(habbitData, habbits);
	habbitArea.value = "";
}

function init() {
	var tags = document.getElementById("tags-warpper"),
		tagInput = document.getElementById("tag-input"),
		habbitBtn = document.getElementById("habbit-btn");

	// 为tags添加事件代理
	tags.addEventListener("click", function(event){
		if (event.target.tagName == "DIV") {
			// 删除节点
			event.target.parentNode.removeChild(event.target);
			// 删除队列数据
			for (var i = 0; i < tagData.dataStore.length; i++) {
				if (event.target.textContent.slice(2, -1) == tagData.dataStore[i]) {
					tagData.dataStore.splice(i, 1);
					return;
				}
			}
		}
	},false);
	tags.addEventListener("mouseover", function(event){
		if (event.target.tagName == "DIV") {
			event.target.textContent = "删除" + event.target.textContent + "?";
			event.target.style.background = "#333";
			event.target.style.color = "#fff";
		}
	},false);
	tags.addEventListener("mouseout", function(event){
		if (event.target.tagName == "DIV") {
			event.target.textContent = event.target.textContent.slice(2, -1);
			event.target.style.background = "#aaa";
			event.target.style.color = "#333";
		}
	},false);
	// 添加事件监听器
	tagInput.addEventListener("keyup", function(event){
		if (/[，,；;、\s\n]+/.test(tagInput.value) || event.keyCode == 13) {
			tagsEnterHandle();
		}
	}, false);
	habbitBtn.addEventListener("click", habbitClickHandle, false);
}

var tagData = new Queue(),
	habbitData = new Queue();
init();