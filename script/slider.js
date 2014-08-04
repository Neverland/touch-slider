/**!
 *@license
 * repository: https://github.com/Neverland/touch-slider
 * enix@foxmail.com
 * Date: 13-8-8
 */

!function (window, doc, undefined) {

	define(["Class"], function (Class) {
		return Class(
			function (O,cb) {

				var that = this,
					suff = ':only-child>*',
					qsa = doc.querySelectorAll;

				this.$ = function (str) {

					var t = qsa.call(doc, str);

					return t.length === 0 || (t.length > 1 ? t : t[0]);

				}
				this.slice = [].slice;

				this.O = O;

				this.tab = this.$(this.O.tab);
				this.container = this.$(this.O.container);

				this._t =  this.tab.querySelectorAll(suff);
				this._c =this.container.firstElementChild;
				this.all = this.slice.call(this._c.children);



				this.size = this.all.length;

				if(this._t.length !== this.all.length) return;


				this.callback = typeof(cb) === 'function' ?cb :function(){};

				this.init();
			},
			{
				init: function () {
					var that = this;

					this.index = 0;
					this.current = 'current';

					if(!this.size) return;

					this.initSize().setHeight().addEvent().initCss();

					Object.keys(this.O).forEach(function (x,y) {

						that[x] || (that[x] = that.o[x]);

					})

					this.callback && this.callback.call(this);

				},
				initSize: function () {
					var that = this;


					this.width = this.container.offsetWidth;




					this.all.forEach(function (x, y) {
						x.style.width = that.width + 'px';
						x.style.left = that.width * y + 'px';
					})


					return this;
				},
				initCss: function () {

					var t = this.container.children[0].style;
					this.tab.querySelectorAll('.'+this.current).className = '';

					this._t[this.index].classList.add(this.current);


					this.moveTo(-this.index * this.width);
					t.width = this.container.offsetWidth * this.size + 'px';
					t.webkitBackfaceVisibility = 'hidden';
					t.webkitTransition = 'all 0.2s ease-out';
					return this;

				},
				on: function (n, e, f, u) {
					n.addEventListener(e,function(e){
						f(e);
					},u||false);
				},
				swipeDirection: function (x1, x2, y1, y2) {
					var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
					return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
				},
				touch : {},
				addEvent: function () {

					var event = ['touchstart','touchmove','touchend','touchcancel'],
						resize = 'onorientationchange' in window?'orientationchange':'resize',
						that = this;


					event.forEach(function (x,y) {
						that.on(that.container,x, function (e) {

							that['_'+e.type.slice(5)+'_'](e);

						});
					});

					this.slice.call(this._t).forEach(function (a,b) {
						that.on(a, 'touchend', function (e) {
							e.preventDefault();
							that.index = b;

							that.currentCss(that.index );
							that.moveTo(-that.index * that.width);
						},false)
					})

					window.addEventListener(resize, function () {

						setTimeout(function () {
							that.initSize().initCss();
						},200)

					},false)

					return this;
				},
				currentCss: function (i) {
					i =  i|0;
					this.tab.querySelector('.current').classList.remove('current');
					this._t[i].className = this.current;
					return this;
				},
				moveTo: function (d) {

					this._c.style.webkitTransform = 'translate3d('+ d + 'px,0,0)';
					this.setHeight();
					return this;

				},
				_start_: function (e) {

					var now = Date.now(),
						delta = now - (this.touch.last || now),
						target = e.target;

					while(!target.hasOwnProperty('tagName')){
						target = target.parentNode;
					}
					this.touch.el = target;

					this.touch.x1 = e.touches[0].pageX;
					this.touch.y1 = e.touches[0].pageY;

					this.touch.left = -this.index * this.width;
					return this;
				},
				_move_: function (e) {

					this.touch.x2 = e.touches[0].pageX
					this.touch.y2 = e.touches[0].pageY
					/*if (Math.abs(this.touch.x1 - this.touch.x2) > 50){
					 e.preventDefault()
					 }*/


					this.delta = this.touch.left+(this.touch.x2 - this.touch.x1);
					if(Math.abs(this.touch.y2-this.touch.y1)/Math.abs(this.touch.x2-this.touch.x1)<0.8){
						e.preventDefault();
						if(this.index === 0 && this.delta>0){

							this.moveTo(0);
							return this;
						}
						if(this.index === (this.size-1) && this.delta<(-this.index*this.width)){
							this.moveTo(-this.index * this.width);
							return;
						}
						this.moveTo(this.delta);
					}
				},
				setHeight: function () {
					this._c.style.height = this.all[this.index].clientHeight + 'px';
					return this;

				},
				_end_: function (e) {

					if(this.index === 0 && this.delta>0) return;
					if(this.index === (this.size-1) && this.delta< (-this.index*this.width)) return;
					var d = this.touch.x2-this.touch.x1;

					if(d<-50){
						this.index++;
					}else if(d>50){
						this.index--;
					}


					this.moveTo(-this.index * this.width);
					this.currentCss(this.index|0);
					this.touch = {};
					return this;
				},
				_cancel_: function (e) {
					this._end_(e);
				}
			}

		);
	})

}(this, document);