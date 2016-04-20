/**
 * render
 * @type Object
 * @description 自运行的渲染对象，单例模式
 */
var render = {

	/**
	 * timer
	 * @type Handle
	 * @description 闭包自运行，初始化定时器
	 */
	timer : (function () {
		var inter = setInterval(function () {
			// 直接读取commander的StarState
			// 因为全局的StarState更新有延迟
			// 反正命令会重试一定会成功
			// 主要是延迟会出bug
			for(var i = 0; i < commander.StarState.length; i++){
				render.renderStar(commander.StarState[i]);
			}
		}, 1000);
		return inter;
	})(),

	/**
	 * renderStar
	 * @param {object} star 行星对象
	 * @description 渲染行星
	 */
	renderStar : function (star) {
		render.updateStarText(star.id, star.getEnergy());
		render.updateStarRtateDeg(star.id, star.speed);
	},

	/**
	 * createBtnHtml
	 * @param  {number} starId 行星id
	 * @return {string} html对象
	 * @description 生成行星控制按钮的html对象
	 */
	createBtnHtml : function (starId) {
		var html = document.createElement('div');
		html.setAttribute('id', 'ctrl-'+ starId);
		html.innerHTML = '<span>对'+ starId +'号飞船下达指令</span>'
						+'<button class="start">开始</button>'
						+'<button class="stop">停止</button>'
						+'<button class="destroy">销毁</button>';
		return html;
	},

	/**
	 * createStarHtml
	 * @param  {number} starId 行星id
	 * @param {number} starEnergy 行星目前能量，百分比数字
	 * @return {string} html对象
	 * @description 生成行星的html对象
	 */
	createStarHtml : function (starId, starEnergy) {
		var html = document.createElement('div');
		html.setAttribute('id', 'star-'+ starId);
		html.innerHTML = '<div class="star">'
				+'<span id="star-'+ starId +'-energy">'
				+ starId +'号-'+ starEnergy +'%</span>'
				+'<div class="power" style="width: '+ starEnergy +'%;" id="star-'
				+ starId +'-width"></div>'
				+'</div>';
		return html;
	},

	/**
	 * updateStarText
	 * @param  {number} starId 飞船id
	 * @param  {number} energy 飞船能量
	 * @description 更新飞船的能量的文字，以及红色背景宽度
	 */
	updateStarText : function (starId, energy) {
		var energyNum = document.getElementById('star-' + starId + '-energy');
		var energyWidth = document.getElementById('star-' + starId + '-width');
		energyNum.innerHTML = starId +'号-'+ energy +'%';
		energyWidth.style.width = energy +'%';
	},

	/**
	 * starRtateDeg
	 * @param {number} starId 行星id
	 * @param {number} speed 行星速度
	 * @description 根据上次旋转角度，加上速度，设置下次旋转角度
	 */
	updateStarRtateDeg : function (starId, speed) {
		var starEle = document.getElementById('star-' + starId);
		var transformBefore = starEle.style.transform;
		var rotateDeg = transformBefore ? transformBefore.slice(7, -4) : 0;
		rotateDeg = parseInt(rotateDeg) + speed;
		starEle.style.transform = 'rotate('+ rotateDeg +'deg)';
	}
}
