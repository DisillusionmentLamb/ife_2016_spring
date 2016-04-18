// 全局飞船状态（实际的）
var StarState = [];


// 一下仅供测试
// 页面初始化
window.onload = function () {
	// 绑定button点击事件到指挥官处理
	document.getElementById('control').addEventListener('click', function (e) {
		// 接管button点击事件
		if (e.target && e.target.nodeName.toLowerCase() == 'button') {

			var command = '';
			var id = 0;

			// 读取button的class作为命令
			command = e.target.getAttribute('class');

			// 读取button外层div的id为飞船id
			if (command != 'add') {
				id = e.target.parentNode.getAttribute('id').split('-')[1];
			}

			// 生成命令
			commander.createCommand(id, command);
		}
	});
}
