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
	/*	var inter = setInterval(function () {
			for(var i = 0; i < window.StarState.length; i++){
				render.renderStar(window.StarState[i]);
				render.renderBtn(window.StarState[i]);
			}
		}, 1000);
		return inter;*/
	})(),

	/**
	 * renderStar
	 * @param {object} star 行星对象
	 * @description 渲染行星
	 */
	renderStar : function (star) {
		var html = render.createStarHtml(star.id, star.getEnergy());
		var deg = render.starRtateDeg(star.id, star.speed);
		render.applyHtml('star', html);
		render.setStarRtateDeg(star.id, deg);
	},

	/**
	 * renderBtn
	 * @param {object} star 行星对象
	 * @description 渲染行星控制按钮
	 */
	renderBtn : function (star) {
		var html = render.createBtnHtml(star.id);
		render.applyHtml('btn', html);
	},

	/**
	 * createBtnHtml
	 * @param  {number} starId 行星id
	 * @return {string} html字符串
	 * @description 生成行星控制按钮的html
	 */
	createBtnHtml : function (starId) {
		var html = '<div id="ctrl-'+ starId +'">'
					+'<span>对'+ starId +'号飞船下达指令</span>'
					+'<button class="start">开始</button>'
					+'<button class="stop">停止</button>'
					+'<button class="destroy">销毁</button>'
					+'</div>';
		return html;
	},

	/**
	 * createStarHtml
	 * @param  {number} starId 行星id
	 * @param {number} starEnergy 行星目前能量，百分比数字
	 * @return {string} html字符串
	 * @description 生成行星的html
	 */
	createStarHtml : function (starId, starEnergy) {
		var html = '<div id="star-'+ starId +'">'
					+'<div class="star">'
					+'<span>'+ starId +'号-'+ starEnergy +'%</span>'
					+'<div class="power" style="width: '+ starEnergy +'%;"></div>'
					+'</div></div>';
		return html;
	},

	/**
	 * applyHtml
	 * @param {string} type 哪个模块的html，btn|star
	 * @param {string} html html字符串
	 * @description 插入html
	 */
	applyHtml : function (type, html) {
		var outterEle = '';
		if (type == 'btn') {
			outterEle = document.getElementById('btn');
		} else {
			outterEle = document.getElementById('ship');
		}
		outterEle.innerHTML = html;
	},

	/**
	 * starRtateDeg
	 * @param {number} starId 行星id
	 * @param {number} speed 行星速度
	 * @return {number} 下次旋转角度
	 * @description 根据上次旋转角度，加上速度，返回下次旋转角度
	 */
	starRtateDeg : function (starId, speed) {
		var starEle = document.getElementById('star-' + starId);
		if (starEle) {
			var transformBefore = starEle.style.transform;
			var rotateDeg = transformBefore ? transformBefore.slice(7, -4) : 0;
			rotateDeg = parseInt(rotateDeg) + speed;
			return rotateDeg;
		} else {
			return 0;
		}
	},

	/**
	 * setStarRtateDeg
	 * @param {number} starId 行星id
	 * @param {number} deg  旋转角度
	 * @description 设置行星旋转角度
	 */
	setStarRtateDeg : function (starId, deg) {
		var starEle = document.getElementById('star-' + starId);
		starEle.style.transform = 'rotate('+ deg +'deg)';
	}
}