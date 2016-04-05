/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
*  根据数据大小返回样式字符串啊
**/
function setStyle(data) {
  switch (true) {
    case (data > 0 && data < 100):
      return 'style="background-color:green;height:' + data + 'px;"';
      break;
    case (data >= 100 && data < 300):
      return 'style="background-color:blue;height:' + data + 'px;"';
      break;
    case (data >= 300 && data < 400):
      return 'style="background-color:purple;height:' + data + 'px;"';
      break;
    case (data >= 400):
      return 'style="background-color:black;height:' + data + 'px;"';
      break;
  }

}

/**
 * 渲染图表
 */
function renderChart() {
  var aqiChart = document.getElementsByClassName("aqi-chart-wrap")[0],
      htmlStr = "";
  for (i in chartData[pageState.nowSelectCity][pageState.nowGraTime]) {
    htmlStr += "<div " + setStyle(chartData[pageState.nowSelectCity][pageState.nowGraTime][i]) + "></div>";
  }
  aqiChart.innerHTML = htmlStr;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var radioList = document.getElementsByName("gra-time"),
      citySelect = document.getElementById("city-select");
  for (var i = 0; i < radioList.length; i++) {
    if (radioList[i].checked) {
      pageState.nowGraTime = radioList[i].value;
    }
  }
  // 设置对应数据
  pageState.nowSelectCity = citySelect.options[citySelect.selectedIndex].value;
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var radioList = document.getElementsByName("gra-time"),
      citySelect = document.getElementById("city-select");
  pageState.nowSelectCity = citySelect.options[citySelect.selectedIndex].value;
  // 设置对应数据
  for (var i = 0; i < radioList.length; i++) {
    if (radioList[i].checked) {
      pageState.nowGraTime = radioList[i].value;
    }
  }
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radioList = document.getElementsByName("gra-time");
  // 调用onchange事件句柄
  for (var i = 0; i < radioList.length; i++) {
    radioList[i].onchange = graTimeChange;
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById("city-select"),
      optionStr = "";
  for (i in aqiSourceData) {
    optionStr += "<option value=" + i + ">" + i + "</option>";
  }
  citySelect.innerHTML = optionStr;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  
  // 遍历城市
  for (city in aqiSourceData) {
    chartData[city] = {};
    chartData[city]["day"] = {};
    chartData[city]["week"] = {};
    chartData[city]["month"] = {};

    // 设置天
    for (date in aqiSourceData[city]) {
      chartData[city]["day"][date] = aqiSourceData[city][date];
    }

    // 设置周
    var dataArr = Object.keys(aqiSourceData[city]),
        days = 0,
        dataCache = 0;
    for (date in aqiSourceData[city]) {
      dataCache += aqiSourceData[city][date];
      days++;
      if (days == dataArr.length % 7) {
        chartData[city]["week"][date] = dataCache / (dataArr.length % 7);
        days = 0;
        dataCache = 0;
      }
      if (days % 7 == 0) {
        chartData[city]["week"][date] = dataCache / 7;
        dataCache = 0;
      }
    }

    // 设置月
    var monthCache = 0,         // 月份数据缓存
        monthDays = 0,          // 月份计数
        monthNow = "2016-01",   // 当前月份
        index = 0;              // 循环计数
    for (date in aqiSourceData[city]) {
      index++;
      monthDays++;
      monthCache += aqiSourceData[city][date];
      // 当date字符串改变时计入数据，并重新初始化数据
      if (date.slice(0, 7) != monthNow) {
        chartData[city]["month"][monthNow] =  monthCache / monthDays;
        monthDays = 0;
        monthCache = 0;
        monthNow = date.slice(0,7);
      }
      // 当循环结束时，强制计入chartData
      if (index = Object.keys(aqiSourceData[city]).length) {
        chartData[city]["month"][monthNow] = monthCache / monthDays;
      }
    }
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();