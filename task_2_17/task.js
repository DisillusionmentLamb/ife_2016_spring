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

/*
用于渲染图表的数据
格式 
 {
     "北京" : {
                 "day" : {
                             "2016-01-01" : 100,
                             bla bla 
                         }

                 "week" : {
                             "2016-01-01 2016-01-07" : 100,
                             bla bla
                         }

                 "month" : {
                             "2016-01" : 100,
                             bla bla
                         }
             },
             
     bla bla
 }
*/
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    var preHtml = "";
    for (date in chartData[pageState.nowSelectCity][pageState.nowGraTime]) {
        preHtml += "<div title=\""
                    + date 
                    + " " 
                    + parseInt(chartData[pageState.nowSelectCity][pageState.nowGraTime][date]) 
                    + "\" style=\"background-color:" 
                    + setClassByData(chartData[pageState.nowSelectCity][pageState.nowGraTime][date]) 
                    + ";height:" 
                    + parseInt(chartData[pageState.nowSelectCity][pageState.nowGraTime][date]) 
                    + "px;\"></div>";
    }
    document.getElementsByClassName("aqi-chart-wrap")[0].innerHTML = preHtml;
}

/**
 * 根据数据大小设定样式
 */
function setClassByData(data) {
    if (data > 400) {
        return "black";
    } else if (data > 300) {
        return "purple";
    } else if (data > 200) {
        return "red";
    } else if (data > 100) {
        return "blue";
    } else {
        return "green";
    }
}


/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化 
    // 我用的onchange事件，改变了才会触发，这里不测试是否改变

    // 设置对应数据
    pageState.nowGraTime = this.value; // 这里this 指向触发事件的element

    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化 
    // onchange事件肯定变化

    // 设置对应数据
    var selectEle = document.getElementById('city-select');
    pageState.nowSelectCity = selectEle.options[selectEle.selectedIndex].value;

    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radioArr = document.getElementsByName("gra-time");
    for (var i = 0; i < radioArr.length; i++) {
        radioArr[i].onchange = graTimeChange;
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = document.getElementById('city-select');
    var options = "";
    for (city in aqiSourceData) {
        options += "<option vlaue=" + city + ">" + city + "</option>";
    }
    citySelect.innerHTML = options;

    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelect.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    for (var nowCity in aqiSourceData) {

        chartData[nowCity] = new Object();
        chartData[nowCity]["day"] = new Object();
        chartData[nowCity]["week"] = new Object();
        chartData[nowCity]["month"] = new Object();

        // 天数据
        chartData[nowCity]["day"] = aqiSourceData[nowCity]; // 每天的统计直接复制当前城市数据过去


        // 周数据
        var i = 0; // 设置日期计数器
        var weekStartDate = ""; // 一周开始日期
        var preData = 0; // 一周数据总和缓存
        // 遍历当前城市数据
        for (date in aqiSourceData[nowCity]) {

            preData += aqiSourceData[nowCity][date]; // 统计一周数据
            i++; // 计数器更新

            // 如果为一周开始，记录下日期
            if (i % 7 == 1) {
                weekStartDate = date;
            }

            // 如果为一周结束，提交数据到chartData，清空preData缓存
            if (i % 7 == 0) {
                chartData[nowCity]["week"][weekStartDate + " " + date] = preData / 7;
                preData = 0;
            }

            // 如果遍历结束，不管是否满一周，提交数据到chartData
            if (i == Object.keys(aqiSourceData[nowCity]).length + 1) {
                chartData[nowCity]["week"][weekStartDate + " " + date] = preData / (i % 7);
            }
        }


        // 月数据
        var monthNow = ""; //当前月份
        preData = 0; // 月份总数缓存
        i = 1; // 月份天数计数器
        var j = 0; // 遍历次数计数器
        // 遍历当前城市数据
        for (date in aqiSourceData[nowCity]) {

            // 如果处于月份开始，记录下当前月份
            if (i == 1) {
                monthNow = date.substr(0, 7);
            }

            // 如果到了下月份，提交数据到chartData，清空preData和计数器i，更新monthNow
            if (monthNow != date.substr(0, 7)) {
                chartData[nowCity]["month"][monthNow] = preData / i; // 上个月数据
                preData = 0;
                i = 0;
                monthNow = date.substr(0, 7); // 这句不是多余的，考虑到如果正好最后一月只有一天
            }

            preData += aqiSourceData[nowCity][date]; // 统计月份数据
            i++; // 更新计数器
            j++;

            // 如果遍历结束，不管怎样，提交数据到chartData
            if (j == Object.keys(aqiSourceData[nowCity]).length) {
                chartData[nowCity]["month"][monthNow] = preData / i;
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
// 题目代码有坑，init应该放进window.onload函数里的
// 或者js放到文档最后加载