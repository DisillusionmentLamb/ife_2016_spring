// 全局飞船状态（实际的）
var StarState = [];

// 渲染函数
function render () {

}

// 页面初始化
window.onload = function () {
	// 绑定button点击事件到指挥官处理
	document.getElementById('control').addEventListener('click', commander.createCommand);
}
