/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById('aqi-city-input').value;
	var air = document.getElementById('aqi-value-input').value;

	// 城市只能为中英文和空字符(考虑到英文城市可以有空格，eg：New York)
	if (!/[a-zA-Z\u4e00-\u9fa5\s]+/.test(city)) {
		alert('城市只能为中英文');
		return false;
	}

	// 城市去除首尾空字符后不能为空
	var cityTrimed = city.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); // 首尾全部空字符

	cityTrimed = cityTrimed.replace(/[\s]{2,}/g, ' '); // 中间只能有一个空字符

	if (cityTrimed == "") {
		alert('城市为空');
		return false;
	}

	// 空气质量只能为数字
	if (!/[0-9]+/.test(air)) {
		alert('空气质量只能为数字');
		return false;
	}

	// 清除空气质量前面的0
	airNoZeroInFront = parseInt(air.toString().replace(/^[0]*/, ''));

	// 不能用点语法，因为上面我们允许城市中间有空格
	// 要是城市已经添加就不能再添加
	// 否则添加
	if (aqiData[cityTrimed] != undefined) {
		alert("该城市已经添加");
		return false;
	}
	aqiData[cityTrimed] = airNoZeroInFront;

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	// 定义一个计数器，统计aqiData大小
	var count = 0;

	// 重新生成table
	var table = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";

	for (var cityItem in aqiData) {
		table += "<tr><td>" + cityItem + "</td><td>" + aqiData[cityItem] + "</td><td><button onclick=\"delBtnHandle('" + cityItem + "')\">删除</button></td></tr>";
		count++;
	}

	// 没有数据就清空table
	if (count == 0) {
		document.getElementById('aqi-table').innerHTML = "";
		return false;
	}
	// 否则更新table
	document.getElementById('aqi-table').innerHTML = table;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(cityItem) {
	// 删除城市再渲染table, 别用设置为undefined/null，没用
	delete aqiData[cityItem];
 	renderAqiList();
}

function init() {

 	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
 	document.getElementById('add-btn').onclick = addBtnHandle;
  
 	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
 	// 题目有点坑啊，初始化时button都还没生成，没法绑定
 	// 我在生成时，给button上加 onclick 粗暴解决

}

init();
// 题目代码有坑，init应该放进window.onload函数里的
// 或者js放到文档最后加载
