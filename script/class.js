//enix@foxmail.com
/*
 * 顶级命名空间
 */
//const I = (this.I || (I = {}));

var I = {};

if(typeof exports === 'undefined'){
	window['I'] = (window.I || (window.I = {}));
}

/*
 * I.NS 支持命名空间
 */
/*const*/

//EXT 源码
/*namespace : function () {
 var a = arguments, o = null, i, j, d, rt;
 for (i = 0; i < a.length; ++i) {
 d = a[i].split(".");
 rt = d[0];
 eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
 for (j = 1; j < d.length; ++j) {
 o[d[j]] = o[d[j]] || {};
 o = o[d[j]];
 }
 }
 }*/


/**
 * @param      {string}      'A.b.c'
 * @param      { all }          '{}'
 *
 * @exmaple A--
 *   |__c
 *       |__c:  {}
 *
 * */
const nameSpace = function (ns, f) {
	if (typeof(ns) != "string")return;
	ns = ns.split(".");
	var o, ni;
	for (var i = 0, len = ns.length; i < len, ni = ns[i]; i++) {
		try {
			o = (o ? (o[ni] = o[ni] || (typeof(f) ? f : {})) : (eval(ni + "=" + ni + "||{}")))
		} catch (e) {
			o = eval(ni + "={}")
		}
	}

	return o;
}
I.NS = nameSpace;

/*
 * I.module.Class 类定义
 */

function Class(init, attributes) {
	var klass = arguments.callee, that = this;

	klass.factory || (klass.factory=function(i, a) {
		a || (a = {});
		a.toString() === '[object Object]' ? a : {};
		return [
			this.init = typeof(i) === 'function' ? i : function () {
			},
			this.attrs = a
		];
	});

	return function () {
		var that = this,
			indicator = arguments.callee,
			slice = [].slice,
			args = slice.call(arguments, 0),
			ins = new klass.factory(init, attributes),
			pb,
			i;


		/*
		 *
		 * 下面几行代码用于，不使用new运算符产生类实例
		 * 代码不是很优雅但可以保证功能
		 *
		 * 优雅代码：return new indicator(...arguments);
		 * ecma6的 spread 语法 ... 拭目以待es6公布
		 *
		 * */
		indicator.fake;

		if (!(that instanceof indicator) && that===window) {
			indicator.fake=true;
			return indicator.apply(new indicator(),args);
		}
		if(indicator.fake===true){
			indicator.fake=false;
			return that;
		}
		//

		pb = indicator.prototype;
		pb.constructor = indicator;



		for (i in ins[1]) {
			if (ins[1].hasOwnProperty(i) && !pb[i]) {
				pb[i] = function () {
					var attr = ins[1][i];
					if (typeof attr === 'function') {
						return function () {
							return attr.apply && attr.apply(this, slice.call(arguments, 0));
						}
					} else {
						return attr;
					}
				}();
			}
		}
		ins[0].apply(this, arguments);



		pb._get_ || (
			pb._get_ = function (key) {
				var attr = this[key]
				return attr ? attr : -1;
			}
			);
		pb._set_ || (
			pb._set_ = function (key, value) {
				this[key] || (this[key] = value);
			}
			);
		ins[1].init && ins[1].init.call(this);

		return that;
	}
}

I.NS('I.Class',Class);

