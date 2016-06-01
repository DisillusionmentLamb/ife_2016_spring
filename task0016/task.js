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
  var cityInput = document.getElementById("aqi-city-input"),
      valueInput = document.getElementById("aqi-value-input"),
      cityReg =  /[\u4e00-\u9fa5]/,
      valueReg = /[1-9]\d*/;

  // 验证输入合法性
  if (!((cityReg.test(cityInput.value)) && (valueReg.test(valueInput.value)))) {
    alert("您输入的城市名或空气质量指数不合法，请重新输入！");
    return;
  }

  // 向aqiData中增加数据
  aqiData[cityInput.value] = valueInput.value;

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var aqiTable = document.getElementById("aqi-table"),
      titleNode = document.createElement("tr");

  // 清空aqitable中所有元素
  if (!(aqiTable.children.length == 0)) {
    var listLength = aqiTable.children.length;
    for (var i = 0; i < listLength; i++) {
      aqiTable.removeChild(aqiTable.children[0]);
    }
  }

  // 渲染表格
  titleNode.innerHTML = "<td>城市</td><td>空气质量</td><td>操作</td>";
  aqiTable.appendChild(titleNode);
  for (i in aqiData) {
    var trNode = document.createElement("tr");
    trNode.innerHTML = "<td>" + i + "</td><td>" + aqiData[i].toString() + "</td><td><button>删除</button></td>";
    aqiTable.appendChild(trNode);
  }
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
function delBtnHandle(target) {
  // do sth.
  var aqiTable = document.getElementById("aqi-table");
  aqiTable.removeChild(aqiTable.children[target.parentNode.parentNode.rowIndex]);
  // 移除对象属性
  delete aqiData[target.parentNode.parentNode.firstChild.innerHTML];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn = document.getElementById("add-btn"),
      aqiTable = document.getElementById("aqi-table");
  addBtn.addEventListener("click", addBtnHandle, false);

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  aqiTable.addEventListener("click", function(event){
    if (event.target.tagName == "BUTTON") {
      delBtnHandle(event.target);
    }
  },false);

}

init();