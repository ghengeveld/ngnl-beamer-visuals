/**********************************************************************************
 * @name: trigons.js - d3.js plugin for creating and animating colored triangles
 * @version: 1.0
 * @requires: d3.js v3 or later (http://d3js.org)
 * @URL: http://trigons.net
 * @copyright: (c) 2014 DeeThemes (http://codecanyon.net/user/DeeThemes)
 * @licenses: http://codecanyon.net/licenses/regular
              http://codecanyon.net/licenses/extended
**********************************************************************************/

//creating Trigons d3 plugin
;(function() {
	"use strict";

	//if true, show in console a container's node where Trigons img is placed and all its stored options
	var debug = false;

	//the main method for creating and redrawing of trigons
	//must be called first
	d3.selection.prototype.trigons = function(opt, val) {
		if (arguments.length < 2) {
			if (typeof opt === 'undefined') {
				var options = {};
			} else {
				var options = opt;
			};
		} else {
			var options = {};
			options[opt] = val;
		};
		
		//do the following for each container element in d3 selection
		this.each(function () {
			var container = d3.select(this),
				options_to_store = {},
				saved_options = {},
				cur_options = {},
				unique = 'tgs' + uniqueNum() + '-',
				cur_color,
				palette = [];
			
			//container always is an element where Trigons are placed
			container.classed('tgs-trigons', true)
					 .each(function(d) { saved_options = d; })
					 .selectAll('svg').remove();

			//check for default options
			if (typeof saved_options === 'undefined') {//first init
				//dimensions
				options_to_store.width = checkDefaults(options.width, 900);
				options_to_store.height = checkDefaults(options.height, 500);
				options_to_store.size = checkDefaults(options.size, 140);
				options_to_store.offset = checkDefaults(options.offset, 0.8);
				//colors
				options_to_store.colors = checkDefaults(options.colors, '#007700, #004500');
				options_to_store.colorMode = checkDefaults(options.colorMode, 'simple');
				options_to_store.colorBuild = checkDefaults(options.colorBuild, 'build9');
				options_to_store.colorSpace = checkDefaults(options.colorSpace, 'rgb');
				options_to_store.colorWay = checkDefaults(options.colorWay, 0.5);
				options_to_store.lightDark = checkDefaults(options.lightDark, 2);
				//responsive or not
				options_to_store.responsive = checkDefaults(options.responsive, true);
				//visible on initialization
				options_to_store.startVisible = checkDefaults(options.startVisible, true);
				//callbacks
				options_to_store.beforeCreate = checkDefaults(options.beforeCreate, false);
				options_to_store.afterCreate = checkDefaults(options.afterCreate, false);
				//flag for trigonsAnimInit, do not change it
				options_to_store.flag = false;
			} else {//when redraw
				options_to_store.width = checkDefaults(options.width, saved_options.width);
				options_to_store.height = checkDefaults(options.height, saved_options.height);
				options_to_store.size = checkDefaults(options.size, saved_options.size);
				options_to_store.offset = checkDefaults(options.offset, saved_options.offset);
				options_to_store.colors = checkDefaults(options.colors, saved_options.colors);
				options_to_store.colorMode = checkDefaults(options.colorMode, saved_options.colorMode);
				options_to_store.colorBuild = checkDefaults(options.colorBuild, saved_options.colorBuild);
				options_to_store.colorSpace = checkDefaults(options.colorSpace, saved_options.colorSpace);
				options_to_store.colorWay = checkDefaults(options.colorWay, saved_options.colorWay);
				options_to_store.lightDark = checkDefaults(options.lightDark, saved_options.lightDark);
				options_to_store.responsive = checkDefaults(options.responsive, saved_options.responsive);
				options_to_store.startVisible = checkDefaults(options.startVisible, saved_options.startVisible);
				options_to_store.beforeCreate = checkDefaults(options.beforeCreate, saved_options.beforeCreate);
				options_to_store.afterCreate = checkDefaults(options.afterCreate, saved_options.afterCreate);
			};
				
			//remove all invalid chars
			if ( typeof options_to_store.width === 'string') {
				options_to_store.width = +options_to_store.width.replace(/[^0-9]/g, '');
			}
			if ( typeof options_to_store.height === 'string') {
				options_to_store.height = +options_to_store.height.replace(/[^0-9]/g, '');
			};
			if ( typeof options_to_store.size === 'string') {
				options_to_store.size = +options_to_store.size.replace(/[^0-9]/g, '');
			};
			if ( typeof options_to_store.offset === 'string') {
				options_to_store.offset = +options_to_store.offset.replace(/[^0-9.]/g, '');
			};
			if ( typeof options_to_store.colorWay === 'string') {
				options_to_store.colorWay = +options_to_store.colorWay.replace(/[^0-9.]/g, '');
			};
			if ( typeof options_to_store.lightDark === 'string') {
				options_to_store.lightDark = +options_to_store.lightDark.replace(/[^0-9.-]/g, '');
			};
			
			//converting all 'true' and 'false' strings to boolean
			for (var key in options_to_store) {
				if (options_to_store.hasOwnProperty(key)) {
					if (typeof options_to_store[key] === 'string' && options_to_store[key].toLowerCase() === 'true') {
						options_to_store[key] = true;
					};
					if (typeof options_to_store[key] === 'string' && options_to_store[key].toLowerCase() === 'false') {
						options_to_store[key] = false;
					};
				};
			};
			
			//validate responsive
			if([true, false].indexOf(options_to_store.responsive) === -1) {
				options_to_store.responsive = true;
			};
			
			//validate startVisible
			if([true, false].indexOf(options_to_store.startVisible) === -1) {
				options_to_store.startVisible = true;
			};

			//make colors as array
			if ( typeof options_to_store.colors === 'string') {
				options_to_store.colors = options_to_store.colors.replace(/\s+/g, '').split(',');
			};
			
			//validate width
			if ( options_to_store.width <= 0) {
				options_to_store.width = 900;
			};

			//validate height
			if ( options_to_store.height <= 0) {
				options_to_store.height = 500;
			};

			//validate size
			if ( options_to_store.size <= 0) {
				options_to_store.size = 140;
			};
			
			//validate offset
			if ( options_to_store.offset < 0.01) {
				options_to_store.offset = 0.01;
			} else if (options_to_store.offset > 1) {
				options_to_store.offset = 1;
			};
			
			//validate colorMode
			if(['build', 'gradient', 'simple'].indexOf(options_to_store.colorMode) === -1) {
				options_to_store.colorMode = 'simple';
			};

			//validate colorBuild
			if(['build3', 'build4', 'build5', 'build6', 'build7', 'build8', 'build9', 'build10', 'build11'].indexOf(options_to_store.colorBuild) === -1) {
				options_to_store.colorBuild = 'build9';
			};
			
			//validate colorSpace
			if(['rgb', 'hsl', 'hcl', 'lab'].indexOf(options_to_store.colorSpace) === -1) {
				options_to_store.colorSpace = 'rgb';
			};

			//validate colorWay
			if(options_to_store.colorWay < 0 || options_to_store.colorWay > 1 ) {
				options_to_store.colorWay = 0.5;
			};
						
			//validate callbacks
			if (typeof(options_to_store.beforeCreate) !== 'function') {
				options_to_store.beforeCreate = false;
			};
			if (typeof(options_to_store.afterCreate) !== 'function') {
				options_to_store.afterCreate = false;
			};

			//saving options as data to container
			container.datum( mergeObjects(saved_options, options_to_store) );
			container.each(function(d) { cur_options = d; });
			
			if (debug) {
				console.log('Container: ', container[0][0].nodeName + ' ' + container[0][0].id + ' ' + container[0][0].className);
				console.log('Saved options: ', cur_options)
			};

			//this procedure utilizes the color creation principles as described in Tables 1 and 2 here:
			//http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.361.6082&rep=rep1&type=pdf
			if (cur_options.colorMode === 'build') {
				if (cur_options.colors.length == 1) {
					var scale = d3.scale.linear().domain([0,12]).range([cur_options.colors, d3.lab(cur_options.colors).darker(cur_options.lightDark)]);
				} else if (cur_options.colors.length == 2) {
					var scale = d3.scale.linear().domain([0,12]).range(cur_options.colors);
				} else {
					var scale = d3.scale.linear().domain([-7,0,7]).range(cur_options.colors);
				};
				switch (cur_options.colorSpace) {
					case 'lab': {
						scale.interpolate(d3.interpolateLab);
						break;
					}
					case 'hsl': {
						scale.interpolate(d3.interpolateHsl);
						break;
					}
					case 'hcl': {
						scale.interpolate(d3.interpolateHcl);
						break;
					}
					default: { //rgb
						scale.interpolate(d3.interpolateRgb);
						break;
					}
				};
				if (cur_options.colors.length <= 2) {
					switch (cur_options.colorBuild) {
						case 'build3': {
							var index = [2,5,8];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build4': {
							var index = [1,4,6,9];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build5': {
							var index = [1,4,6,8,10];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build6': {
							var index = [1,3,5,3,8,10];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build7': {
							var index = [1,3,5,6,7,9,11];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build8': {
							var index = [0,2,3,5,6,7,9,11];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build9': {
							var index = [0,2,3,5,6,7,9,10,12];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						default: {
							var index = [0,2,3,5,6,7,9,10,12];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
					};
				} else {//color.length > 2
					switch (cur_options.colorBuild) {
						case 'build3': {
							var index = [-3,0,3];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build4': {
							var index = [-5,-2,2,5];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build5': {
							var index = [-5,-2,0,2,5];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build6': {
							var index = [-6,-3,-1,1,3,6];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build7': {
							var index = [-6,-3,-1,0,1,3,6];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build8': {
							var index = [-6,-4,-2,-1,1,2,4,6];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build9': {
							var index = [-6,-4,-2,-1,0,1,2,4,6];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build10': {
							var index = [-7,-6,-4,-2,-1,1,2,4,6,7];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						case 'build11': {
							var index = [-7,-6,-4,-2,-1,0,1,2,4,6,7];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
						default: {
							var index = [-7,-6,-4,-2,-1,0,1,2,4,6,7];
							for (var i = 0; i < index.length; i++) {
								palette.push(scale(index[i]));
							};
							break;
						}
					};
				};
				cur_color = palette;  
			} else {
				cur_color = cur_options.colors;
			};

			//check for responsive svg
			if (cur_options.responsive) {
				container.classed('tgs-responsive', true);
			} else {
				container.classed('tgs-responsive', false);
				container.style('padding-bottom', null);
			};

			//callback 1 - before
			if (typeof(cur_options.beforeCreate) === 'function') {
				cur_options.beforeCreate();
			};

			//calling function 'create'
			create (
				container,
				unique,
				+cur_options.width,
				+cur_options.height,
				+cur_options.size,
				+cur_options.offset * cur_options.size,
				cur_color,
				cur_options.colorMode,
				cur_options.colorSpace,
				+cur_options.colorWay,
				+cur_options.lightDark,
				cur_options.responsive,
				cur_options.startVisible
			);
			
			//reinit animation after redraw
			if (cur_options.animWasInited) {
				d3.select(this).trigonsAnimInit();
			};

			//callback 2 - after
			if (typeof(cur_options.afterCreate) === "function") {
				cur_options.afterCreate();
			};

		});//end .each
		
		return this;
	};//end .trigons

	//the main method for animation init and reinit. Will work after calling of .trigons() first
	d3.selection.prototype.trigonsAnimInit = function(opt, val) {
		if (arguments.length < 2) {
			if (typeof opt === 'undefined') {
				var options = {};
			} else {
				var options = opt;
			};
		} else {
			var options = {};
			options[opt] = val;
		};

		//do the following for each container element in d3 selection
		this.each(function () {
			var container = d3.select(this);
				
			if ( container.selectAll('svg').empty() ) {
				return this;
			};

			var options_to_store = {},
				saved_options = {},
				cur_options = {};

			container.each(function(d) { saved_options = d; });

			//defaults
			if (saved_options.flag == false) {//first init
				//order of animation (first in, then out) or (first out, then in)
				options_to_store.animOrder = checkDefaults(options.animOrder, 'in-out');
				//animation In
				options_to_store.animIn = checkDefaults(options.animIn, 'effect1-top');
				options_to_store.delayIn = checkDefaults(options.delayIn, 0);
				options_to_store.durationIn = checkDefaults(options.durationIn, 1500);
				options_to_store.easyIn = checkDefaults(options.easyIn, 'cubic-out');
				//animation Out
				options_to_store.animOut = checkDefaults(options.animOut, 'effect1-top');
				options_to_store.delayOut = checkDefaults(options.delayOut, 0);
				options_to_store.durationOut = checkDefaults(options.durationOut, 1500);
				options_to_store.easyOut = checkDefaults(options.easyOut, 'cubic-out');
				//events options
				options_to_store.eventOn = checkDefaults(options.eventOn, 'self');
				options_to_store.eventType = checkDefaults(options.eventType, 'click');
				options_to_store.eventRepeat = checkDefaults(options.eventRepeat, true);
				options_to_store.viewportShift = checkDefaults(options.viewportShift, 'one-fourth');
				//callbacks
				options_to_store.beforeAnim = checkDefaults(options.beforeAnim, false);
				options_to_store.afterAnim = checkDefaults(options.afterAnim, false);
			} else {//reinit
				options_to_store.animOrder = checkDefaults(options.animOrder, saved_options.animOrder);
				options_to_store.animIn = checkDefaults(options.animIn, saved_options.animIn);
				options_to_store.delayIn = checkDefaults(options.delayIn, saved_options.delayIn);
				options_to_store.durationIn = checkDefaults(options.durationIn, saved_options.durationIn);
				options_to_store.easyIn = checkDefaults(options.easyIn, saved_options.easyIn);
				options_to_store.animOut = checkDefaults(options.animOut, saved_options.animOut);
				options_to_store.delayOut = checkDefaults(options.delayOut, saved_options.delayOut);
				options_to_store.durationOut = checkDefaults(options.durationOut, saved_options.durationOut);
				options_to_store.easyOut = checkDefaults(options.easyOut, saved_options.easyOut);
				options_to_store.eventOn = checkDefaults(options.eventOn, saved_options.eventOn);
				options_to_store.eventType = checkDefaults(options.eventType, saved_options.eventType);
				options_to_store.eventRepeat = checkDefaults(options.eventRepeat, saved_options.eventRepeat);
				options_to_store.viewportShift = checkDefaults(options.viewportShift, saved_options.viewportShift);
				options_to_store.beforeAnim = checkDefaults(options.beforeAnim, saved_options.beforeAnim);
				options_to_store.afterAnim = checkDefaults(options.afterAnim, saved_options.afterAnim);
			};
			options_to_store.flag = true;
			options_to_store.animWasInited = true;

			//remove all chars except numbers
			if ( typeof options_to_store.delayIn === 'string') {
				options_to_store.delayIn = +options_to_store.delayIn.replace(/[^0-9]/g, '');
			}
			if ( typeof options_to_store.durationIn === 'string') {
				options_to_store.durationIn = +options_to_store.durationIn.replace(/[^0-9]/g, '');
			}
			if ( typeof options_to_store.delayOut === 'string') {
				options_to_store.delayOut = +options_to_store.delayOut.replace(/[^0-9]/g, '');
			}
			if ( typeof options_to_store.durationOut === 'string') {
				options_to_store.durationOut = +options_to_store.durationOut.replace(/[^0-9]/g, '');
			}
			
			//converting all 'true' and 'false' strings to boolean
			for (var key in options_to_store) {
				if (options_to_store.hasOwnProperty(key)) {
					if (typeof options_to_store[key] === 'string' && options_to_store[key].toLowerCase() === 'true') {
						options_to_store[key] = true;
					};
					if (typeof options_to_store[key] === 'string' && options_to_store[key].toLowerCase() === 'false') {
						options_to_store[key] = false;
					};
				};
			};
			
			//validate animOrder
			if(['in-out', 'out-in'].indexOf(options_to_store.animOrder) === -1) {
				options_to_store.animOrder = 'in-out';
			};

			//validate animOrder
			if(['in-out', 'out-in'].indexOf(options_to_store.animOrder) === -1) {
				options_to_store.animOrder = 'in-out';
			};

			//validate delay
			if ( options_to_store.delayIn <= 0) {
				options_to_store.delayIn = 0;
			};
			if ( options_to_store.delayOut <= 0) {
				options_to_store.delayOut = 0;
			};

			//validate duration
			if ( options_to_store.durationIn <= 0) {
				options_to_store.durationIn = 1500;
			};
			if ( options_to_store.durationOut <= 0) {
				options_to_store.durationOut = 1500;
			};

			//validate eventType
			if(['click', 'hover', 'viewport', 'none'].indexOf(options_to_store.eventType) === -1) {
				options_to_store.eventType = 'click';
			};

			//validate eventRepeat
			if([true, false].indexOf(options_to_store.eventRepeat) === -1) {
				options_to_store.eventRepeat = true;
			};

			//validate viewportShift
			if(['one-fourth', 'one-third', 'one-half', 'full', 'none'].indexOf(options_to_store.viewportShift) === -1) {
				options_to_store.viewportShift = 'one-fourth';
			};
			
			//validate callbacks
			if (typeof(options_to_store.beforeAnim) !== 'function') {
				options_to_store.beforeAnim = false;
			};
			if (typeof(options_to_store.afterAnim) !== 'function') {
				options_to_store.afterAnim = false;
			};

			//save options to container's data
			container.datum( mergeObjects(saved_options, options_to_store) );
			container.each(function(d) { cur_options = d; });
			
			//call initAnimation fumc
			initAnimation (
				container,
				cur_options.animOrder,
				cur_options.animIn,
				+cur_options.delayIn,
				+cur_options.durationIn,
				cur_options.easyIn,
				cur_options.animOut,
				+cur_options.delayOut,
				+cur_options.durationOut,
				cur_options.easyOut,
				cur_options.eventOn,
				cur_options.eventType,
				cur_options.eventRepeat,
				cur_options.viewportShift,
				cur_options.beforeAnim,
				cur_options.afterAnim
			);
		});//end .each
		
		return this;
	};//end .trigonsAnimInit

	//method for immediate calling of an animation, if previos was 'in' the next will be 'out' and vise versa
	d3.selection.prototype.trigonsAnimNext = function(force) {
		if (typeof force === 'undefined') {
			this.each(function () {
				d3.select(this).select('rect').on('Next')();
			});
		} else if (force) {
			this.each(function () {
				d3.select(this).select('rect').on('forceNext')();
			});
		};
		return this;
	};//end .trigonsAnimNext

	//method for calling of immediate 'In' animation
	d3.selection.prototype.trigonsAnimIn = function(force) {
		if (typeof force === 'undefined') {
			this.each(function () {
				d3.select(this).select('rect').on('In')();
			});
		} else if (force) {
			this.each(function () {
				d3.select(this).select('rect').on('forceIn')();
			});
		};
		return this;
	};//end .trigonsAnimIn

	//method for calling of immediate 'Out' animation
	d3.selection.prototype.trigonsAnimOut = function(force) {
		if (typeof force === 'undefined') {
			this.each(function () {
				d3.select(this).select('rect').on('Out')();
			});
		} else if (force) {
			this.each(function () {
				d3.select(this).select('rect').on('forceOut')();
			});
		};
		return this;
	};//end .trigonsAnimOut

	//method for converting from svg to png
	d3.selection.prototype.trigonsPng = function() {
		this.each(function () {
			var container = d3.select(this), w, h;
			if ( container.select('svg').empty() ) {
				return this;
			};
			container.classed('tgs-responsive', false);
			container.selectAll('path').attr('transform',null).style('opacity', 1);
			container.each(function(d) { w = d.width; h = d.height});
			var svg = container.select('svg');
			svg.attr({width:w, height:h});
			var svg_node = svg.node(),
				svg_data = new XMLSerializer().serializeToString(svg_node);
			container.selectAll('*').remove();
			var canvas = container.append('canvas').attr({width:w, height:h}).style('visibility','hidden').node();
			canvg(canvas, svg_data, { ignoreMouse: true, ignoreDimensions: true });
			container.append('img').attr('src', canvas.toDataURL('image/png'));
			container.select('canvas').remove()
			if (svg.attr('viewBox')) {
				container.style('padding-bottom', null);
			};
		});
		return this;
	};//end .trigonsPng

	//method for making ready trigons as background image as svg
	d3.selection.prototype.trigonsBackground = function() {
		this.each(function () {
			var container = d3.select(this), resp, w, h;
			if ( container.select('svg').empty() ) {
				return this;
			};
			container.classed('tgs-responsive', false);
			container.selectAll('path').attr('transform',null).style('opacity', 1);
			container.each(function(d) { w = d.width; h = d.height});
			var svg = container.select('svg');
			svg .attr({'width':w, 'height':h, 'style':null})
				.style('overflow','hidden','important');
			if (!window.btoa) {
				window.btoa = base64();
			};
			var svg_data = new XMLSerializer().serializeToString(svg.node()),
				uri = 'data:image/svg+xml;base64,' + btoa(svg_data),
				url = 'url(' + uri + ')';
			container.attr('style', null);
			container.style('background-image', url);
			svg.remove();
		});
		return this;
	};//end .trigonsBackground

	//animation data
	var anim_data =	{
		effect1:{
			d_s: 0.3,//duration shift, from 0 to 1.
			f_d: 0.2,//divide of frames time, from 0 to 1.
			fr:[//frames (animation steps)
				{
					t:[0,0],//translate(the multiplier for 'size' option) [x,y]
					s:[.96,.96],//scale [x,y]
					r:0,//rotate
					r_p:'c',//rotate point
					o:1//opacity
				},
				{
					t:[0.2,-0.2],
					s:[.96,.96],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect2:{
			d_s: 0.7,
			f_d: 0.5,
			fr:[
				{
					t:[2,0],
					s:[-1,1],
					r:40,
					r_p:'tl',
					o:0.7
				},
				{
					t:[-2,0],
					s:[-1,1],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect3:{
			d_s: 0.3,
			f_d: 0.99,
			fr:[
				{
					t:[0,0],
					s:[0,0],
					r:'rnd',//random
					r_rnd:[-360,360],//random from deg1 to deg2
					r_p:'c',
					o:1
				},
				{
					t:[0,0],
					s:[0,0],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect4:{
			d_s: 0.3,
			f_d: 0.2,
			fr:[
				{
					t:[0,0],
					s:[0.8,0.8],
					r:45,
					r_p:'tr',
					o:0.8
				},
				{
					t:[1,-1],
					s:[2,2],
					r:220,
					r_p:'bl',
					o:0
				}
			]
		},
		effect5:{
			d_s: 0.6,
			f_d: 0.7,
			fr:[
				{
					t:[0,0],
					s:[0.8,0.8],
					r:-45,
					r_p:'tl',
					o:0.7
				},
				{
					t:[-.5,-.5],
					s:[.6,.6],
					r:180,
					r_p:'c',
					o:0
				}
			]
		},
		effect6:{
			d_s: 0.3,
			f_d: 0.9,
			fr:[
				{
					t:[1,0],
					s:[-1,-1],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[1,0],
					s:[-1,-1],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect7:{
			d_s: 0.3,
			f_d: 0.9,
			fr:[
				{
					t:[0,0],
					s:[-1,1],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[0,0],
					s:[-0.2,0.2],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect8:{
			d_s: 0.3,
			f_d: 0.9,
			fr:[
				{
					t:[1,0],
					s:[-1,1],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[1,0],
					s:[1,1],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect9:{
			d_s: 0.3,
			f_d: 1,
			fr:[
				{
					t:[0,1],
					s:[0.9,0.9],
					r:-360,
					r_p:'br',
					o:0
				}
			]
		},
		effect10:{
			d_s: 0.3,
			f_d: 1,
			fr:[
				{
					t:[0,0],
					s:[0.9,0.9],
					r:360,
					r_p:'bl',
					o:0
				}
			]
		},
		effect11:{
			d_s: 0.5,
			f_d: 0.4,
			fr:[
				{
					t:[0,0],
					s:[.94,.94],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[0,1.4],
					s:[.94,.94],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect12:{
			d_s: 0.5,
			f_d: 0.5,
			fr:[
				{
					t:[1,1],
					s:[.94,.94],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[.2,-.2],
					s:[.8,.8],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect13:{
			d_s: 0.3,
			f_d: 0.5,
			fr:[
				{
					t:[-2,0],
					s:[-1,1],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[2,0],
					s:[1,1],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect14:{
			d_s: 0.3,
			f_d: 0.5,
			fr:[
				{
					t:[0,-2],
					s:[1,-1],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[0,2],
					s:[1,-1],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect15:{
			d_s: 0.1,
			f_d: 0.5,
			fr:[
				{
					t:[0,0],
					s:[0.8,0.8],
					r:100,
					r_p:'bl',
					o:0.8
				},
				{
					t:[-1,1],
					s:[0.4,0.4],
					r:270,
					r_p:'bl',
					o:0
				}
			]
		},
		effect16:{
			d_s: 0.1,
			f_d: 0.6,
			fr:[
				{
					t:[0,-0.2],
					s:[0.96,0.96],
					r:0,
					r_p:'tl',
					o:1
				},
				{
					t:[0,-1.4],
					s:[0.1,0.7],
					r:0,
					r_p:'tl',
					o:0
				}
			]
		},
		effect17:{
			d_s: 0.1,
			f_d: 0.2,
			fr:[
				{
					t:[0,0],
					s:[0.9,0.9],
					r:10,
					r_p:'tl',
					o:1
				},
				{
					t:[0,0],
					s:[0.9,0.9],
					r:-100,
					r_p:'tl',
					o:0
				}
			]
		},
		effect18:{
			d_s: 0.2,
			f_d: 0.4,
			fr:[
				{
					t:[0,0],
					s:[1,1],
					r:-90,
					r_p:'tl',
					o:1
				},
				{
					t:[1,1],
					s:[0.5,0.5],
					r:760,
					r_p:'br',
					o:0
				}
			]
		},
		effect19:{
			d_s: 0.2,
			f_d: 0.5,
			fr:[
				{
					t:[0,0],
					s:[0.6,0.6],
					r:'rnd',
					r_rnd:[-180,180],
					r_p:'c',
					o:1
				},
				{
					t:[10,0],
					s:[0.6,0.6],
					r:0,
					r_p:'bl',
					o:0
				}
			]
		},
		effect20:{
			d_s: 0.2,
			f_d: 0.5,
			fr:[
				{
					t:[0,0],
					s:[-1,1],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[0,-2],
					s:[1,1],
					r:0,
					r_p:'bl',
					o:0
				}
			]
		},
		effect21:{
			d_s: 0.6,
			f_d: 0.3,
			fr:[
				{
					t:[0,0],
					s:[0.95,0.95],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[0,0],
					s:[3,0],
					r:0,
					r_p:'bl',
					o:0
				}
			]
		},
		effect22:{
			d_s: 0.1,
			f_d: 0.4,
			fr:[
				{
					t:[0,0],
					s:[0.95,0.95],
					r:45,
					r_p:'c',
					o:1
				},
				{
					t:[0,0],
					s:[-1,0],
					r:0,
					r_p:'bl',
					o:0
				}
			]
		},
		effect23:{
			d_s: 0.2,
			f_d: 0.5,
			fr:[
				{
					t:[0,0],
					s:[0.95,0.95],
					r:45,
					r_p:'tr',
					o:1
				},
				{
					t:[0,0],
					s:[0,0],
					r:-360,
					r_p:'bl',
					o:0
				}
			]
		},
		effect24:{
			d_s: 0.5,
			f_d: 0.5,
			fr:[
				{
					t:[0,0],
					s:[.96,.96],
					r:0,
					r_p:'c',
					o:0.8
				},
				{
					t:[0,-1],
					s:[3,3],
					r:0,
					r_p:'c',
					o:0
				}
			]
		},
		effect25:{
			d_s: 0.4,
			f_d: 0.5,
			fr:[
				{
					t:[0,-1],
					s:[1,1],
					r:'rnd',
					r_rnd:[-90,90],
					r_p:'c',
					o:0.5
				},
				{
					t:[0,0], 
					s:[-1,3],
					r:160,
					r_p:'c',
					o:0
				}
			]
		},
		effect26:{
			d_s: 0,
			f_d: 0.5,
			fr:[
				{
					t:[0,0],
					s:[2,2],
					r:'rnd',
					r_rnd:[-45,45],
					r_p:'c',
					o:0.8
				},
				{
					t:[0,-2],
					s:[0,0],
					r:0,
					r_rnd:[-180,180],
					r_p:'c',
					o:0
				}
			]
		},
		effect27:{
			d_s: 0.1,
			f_d: 1,
			fr:[
				{
					t:[0,-2],
					s:[1,1],
					r:'rnd',
					r_rnd:[-90,90],
					r_p:'c',
					o:0
				}
			]
		},
		effect28:{
			d_s: 0.7,
			f_d: 1,
			fr:[
				{
					t:[0,-2],
					s:[1,1],
					r:'rnd',
					r_rnd:[-90,90],
					r_p:'c',
					o:0
				}
			]
		},
		effect29:{
			d_s: 0.5,
			f_d: 1,
			fr:[
				{
					t:[0,2],
					s:[1,1],
					r:'rnd',
					r_rnd:[-90,90],
					r_p:'c',
					o:0
				}
			]
		},
		effect30:{
			d_s: 0.2,
			f_d: 0.3,
			fr:[
				{
					t:[0,0],
					s:[0.94,0.94],
					r:0,
					r_p:'c',
					o:1
				},
				{
					t:[0,0],
					s:[0.0001,0.0001],
					r:-360,
					r_p:'bl',
					o:0
				}
			]
		}
	};

	//func for drawing of trigons
	function create (container, unique, width, height, size, offset, colors, color_mode, color_space, color_way, light_dark, responsive, start_visible) {
		var svg = container.append('svg')
				.attr('xmlns', 'http://www.w3.org/2000/svg')
				.attr('version', '1.1');
		
		if (responsive) {
			svg .attr('preserveAspectRatio', 'xMinYMin meet')
				.attr('viewBox', '0 0 ' + width +' ' + height);
			container.style('padding-bottom', (height/width*100).toFixed(2) + '%');
		} else {
			svg .attr('width', width)
				.attr('height', height);
		};
		
		var defs = svg.append('defs'),
			group = svg.append('g').attr('transform', 'translate(' + -size +' '+ -size +')');
		
		//helper rect for force animation methods
		defs.append('rect');

		//creating all triangles
		draw(group);
		
		if (!start_visible) {
			group.selectAll('path').style('opacity', 0);  
		};
		
		//all magic is in d3.geom.voronoi().triangles()
		function draw(selection) {
			var col = -1,
				row = 0,
				count = -size,
				max_row = 0,
				max_col = 0;
			if (color_mode == 'gradient') {
				gradients(colors);
			};
			var clean = function (path) {
				var bbox = path.node().getBBox();
				if (bbox.x > width+size || bbox.y > height+size || bbox.x+bbox.width < size || bbox.y+bbox.height < size) {
					path.remove();
					return true;
				};
				return false;
			};
			d3.geom.voronoi()
				.triangles(vertices())
				.forEach(function(d,i) {
					if (color_mode == 'gradient') {
						var path = selection.append('path').attr('d', 'M' + d.join('L') + 'Z');
						if ( !clean(path) ) {
							var bbox = path.node().getBBox();
							var mid_x = bbox.x + bbox.width/2,
								mid_y = bbox.y + bbox.height/2;
							if (mid_x - count > -(width-size)) {
								col = col + 1;
								count = mid_x;
								if (col>max_col) {
									max_col = col;
								};
							} else {
								col = 0;
								row = row +1;
								count = -size;
								if (row>max_row) {
									max_row = row;
								};
							};
							var data_to_store ={w_h: [Math.round(bbox.width), Math.round(bbox.height)],
												c: [Math.round(mid_x), Math.round(mid_y)],//center
												tl: [Math.round(bbox.x), Math.round(bbox.y)],//top-left
												tr: [Math.round(bbox.x + bbox.width), Math.round(bbox.y)],//top_right
												bl: [Math.round(bbox.x), Math.round(bbox.y + bbox.height)],//bottom_left
												br: [Math.round(bbox.x + bbox.width), Math.round(bbox.y + bbox.height)],//bottom_right
												col: col,
												row: row},
								grad_url = 'url(#gradient-' + unique + getRandomInt(1, 16) + ')';
							
							path.datum(data_to_store)
								.attr('fill', grad_url)
								.attr('stroke', grad_url)
								.attr('class', 'row-'+row + ' ' + 'col-'+col);
						};
					} else {//if color_mode is 'build' or 'simple'
						var path = selection.append('path').attr('d', 'M' + d.join('L') + 'Z');
						if ( !clean(path) ) {
							var bbox = path.node().getBBox();
							var mid_x = bbox.x + bbox.width/2,
								mid_y = bbox.y + bbox.height/2;
							if (mid_x - count > -(width-size)) {
								col = col + 1;
								count = mid_x;
								if (col>max_col) {
									max_col = col;
								};
							} else {
								col = 0;
								row = row +1;
								count = -size;
								if (row>max_row) {
									max_row = row;
								};
							};
							var color = calculateColor(Math.round(bbox.x)-size, Math.round(bbox.y)-size, colors),
								data_to_store ={w_h: [Math.round(bbox.width), Math.round(bbox.height)],
												c: [Math.round(mid_x), Math.round(mid_y)],//center
												tl: [Math.round(bbox.x), Math.round(bbox.y)],//top-left
												tr: [Math.round(bbox.x + bbox.width), Math.round(bbox.y)],//top_right
												bl: [Math.round(bbox.x), Math.round(bbox.y + bbox.height)],//bottom_left
												br: [Math.round(bbox.x + bbox.width), Math.round(bbox.y + bbox.height)],//bottom_right
												col: col,
												row: row};
							path.datum(data_to_store)
								.attr('fill', color)
								.attr('stroke', color)
								.attr('class', 'row-'+row + ' ' + 'col-'+col);
						};
					}; 
				});
			selection.datum({'rows':(max_row+1), 'cols':(max_col+1)});
		};

		//creating vertices
		function vertices() {
			var horiz_sections = Math.ceil((width + size*2) / size),
				vert_sections = Math.ceil((height + size*2) / size),
				vertices = d3.range(horiz_sections * vert_sections).map(function(d) {
					var col = d % horiz_sections,
						row = Math.floor(d / horiz_sections),
						x = parseFloat( (size*col + Math.random()*offset).toFixed(4) ),
						y = parseFloat( (size*row + Math.random()*offset).toFixed(4) );
					return [x, y];
				});
			return vertices;
		};

		//get x and y coordinates, array of colors and return interpolated color for one triangle
		function calculateColor(x, y, colors) {
			function colorScale(coord, side, colors) {
				var scale = d3.scale.linear()
					.range(colors)
					.domain( d3.range(0, side, side/colors.length) );
				return scale(coord);
			};
			switch (color_space) {
				case 'lab': {
					return d3.interpolateLab(
						colorScale(x, width, colors),
						colorScale(y, height,colors.map(function(value){return d3.lab(value).brighter(0.6);}))
					)(color_way);
					break;
				}
				case 'hsl': {
					return d3.interpolateHsl(
						colorScale(x, width+size, colors),
						colorScale(y, height+size,colors.map(function(value){return d3.hsl(value).brighter(0.6);}))
					)(color_way);
					break;
				}
				case 'hcl': {
					return d3.interpolateHcl(
						colorScale(x, width+size, colors),
						colorScale(y, height+size,colors.map(function(value){return d3.hcl(value).brighter(0.6);}))
					)(color_way);
					break;
				}
				default: { //rgb
					return d3.interpolateRgb(
						colorScale(x, width+size, colors),
						colorScale(y, height+size,colors.map(function(value){return d3.rgb(value).brighter(0.6);}))
					)(color_way);
					break;
				}
			};
		};

		//if color mode is 'gradient', this func create gradients in <defs> 
		function gradients (colors) {
			for (var j = 1; j < 17; j++) {
				var gradient = defs.append( 'svg:linearGradient' )
					.attr( 'id', 'gradient-'+ unique + j )
					.attr( 'gradientUnits', 'objectBoundingBox');
				gradient.append('stop')
					.attr('class', 'stop1')
					.attr('stop-color', colors[0])
					.attr('offset', '0%');
				gradient.append('stop')
					.attr('class', 'stop2')
					.attr('offset', '100%')
					.attr('stop-color', function () {
						if (typeof colors[1] === 'undefined') {
							switch (color_space) {
								case 'lab': {
									return d3.lab(colors[0]).darker(light_dark);
									break;
								}
								case 'hsl': {
									return d3.hsl(colors[0]).darker(light_dark);
									break;
								}
								case 'hcl': {
									return d3.hcl(colors[0]).darker(light_dark);
									break;
								}
								default: { //rgb
									return d3.rgb(colors[0]).darker(light_dark);
									break;
								}
							};
						} else {
							return colors[1];
						};
					});
			};
			svg.select('#gradient-' + unique + '1').attr({'x1': '0%', 'y1': '0%', 'x2': '100%', 'y2': '100%'});
			svg.select('#gradient-' + unique + '2').attr({'x1': '25%', 'y1': '0%', 'x2': '75%', 'y2': '100%'});
			svg.select('#gradient-' + unique + '3').attr({'x1': '50%', 'y1': '0%', 'x2': '50%', 'y2': '100%'});
			svg.select('#gradient-' + unique + '4').attr({'x1': '75%', 'y1': '0%', 'x2': '25%', 'y2': '100%'});
			svg.select('#gradient-' + unique + '5').attr({'x1': '100%', 'y1': '0%', 'x2': '0%', 'y2': '100%'});
			svg.select('#gradient-' + unique + '6').attr({'x1': '100%', 'y1': '25%', 'x2': '0%', 'y2': '75%'});
			svg.select('#gradient-' + unique + '7').attr({'x1': '100%', 'y1': '50%', 'x2': '0%', 'y2': '50%'});
			svg.select('#gradient-' + unique + '8').attr({'x1': '100%', 'y1': '75%', 'x2': '0%', 'y2': '25%'});
			svg.select('#gradient-' + unique + '9').attr({'x1': '100%', 'y1': '100%', 'x2': '0%', 'y2': '0%'});
			svg.select('#gradient-' + unique +'10').attr({'x1': '75%', 'y1': '100%', 'x2': '25%', 'y2': '0%'});
			svg.select('#gradient-' + unique +'11').attr({'x1': '50%', 'y1': '100%', 'x2': '50%', 'y2': '0%'});
			svg.select('#gradient-' + unique +'12').attr({'x1': '25%', 'y1': '100%', 'x2': '75%', 'y2': '0%'});
			svg.select('#gradient-' + unique +'13').attr({'x1': '0%', 'y1': '100%', 'x2': '100%', 'y2': '0%'});
			svg.select('#gradient-' + unique +'14').attr({'x1': '0%', 'y1': '75%', 'x2': '100%', 'y2': '25%'});
			svg.select('#gradient-' + unique +'15').attr({'x1': '0%', 'y1': '50%', 'x2': '100%', 'y2': '50%'});
			svg.select('#gradient-' + unique +'16').attr({'x1': '0%', 'y1': '25%', 'x2': '100%', 'y2': '75%'});
		};
	};//end create

	//func for animation init (not immediately animate)
	function initAnimation (container, anim_order, anim_in, delay_in, duration_in, easy_in, anim_out, delay_out, duration_out, easy_out, event_on, event_type, event_repeat, viewport_shift, beforeAnim, afterAnim) {
		var svg = container.selectAll('svg'),
			group = svg.selectAll('g'),
			rect = svg.selectAll('rect'),
			height,
			size,
			done_once_in = false,
			done_once_out = false,
			in_progress = false;
		
		container.each(function(d) { height = d.height; size = d.size;});

		if (anim_order == 'in-out') {
			var finished_out = true;
		} else if (anim_order == 'out-in') {
			var finished_out = false;
		};
		
		//creating pseudo events on invisible rectangle in <defs> for force animating methods
		//.trigonsAnimNext(), .trigonsAnimIn() and .trigonsAnimOut()
		rect.on('Next', function() {
			if (finished_out) {
				if (!in_progress) {
					animate('in', anim_in, delay_in, duration_in, easy_in);
				};
			} else {
				if (!in_progress) {
					animate('out', anim_out, delay_out, duration_out, easy_out);
				};
			};
		});
		rect.on('forceNext', function() {
			if (finished_out) {
				animate('in', anim_in, delay_in, duration_in, easy_in);
			} else {
				animate('out', anim_out, delay_out, duration_out, easy_out);
			};
		});
		rect.on('In', function() {
			if (!in_progress) {
				animate('in', anim_in, delay_in, duration_in, easy_in);
			};
		});
		rect.on('forceIn', function() {
			animate('in', anim_in, delay_in, duration_in, easy_in);
		});
		rect.on('Out', function() {
			if (!in_progress) {
				animate('out', anim_out, delay_out, duration_out, easy_out);
			};
		});
		rect.on('forceOut', function() {
			animate('out', anim_out, delay_out, duration_out, easy_out);
		});

		//reset events
		svg.on('click', null);
		svg.on('mouseenter', null);

		//click, hover and viewport events can be bind to another html elem, not container itself only
		if (event_on === 'self') {
			var elem = svg;
		} else {
			var elem = d3.selectAll(event_on);
			height = elem.style('height').replace(/[A-Za-z$-]/g, '');
		};

		if (event_type == 'hover') {
			bindEvent ('mouseenter', elem);
		} else if (event_type == 'click') {
			bindEvent ('click', elem);
		} else if (event_type == 'viewport') {
			switch (viewport_shift) {
				case 'none': {
					var shift = 0;
					break;
				}
				case 'one-fourth': {
					var shift = height/4;
					break;
				}
				case 'one-third': {
					var shift = height/3;
					break;
				}
				case 'one-half': {
					var shift = height/2;
					break;
				}
				case 'full': {
					var shift = height;
					break;
				}
				default: {
					break;
				}
			};
			var elem_node = elem.node(),
				handler = viewportEvent(elem_node);
			if (window.addEventListener) {
				addEventListener('DOMContentLoaded', handler, false); 
				addEventListener('load', handler, false); 
				addEventListener('scroll', handler, false); 
				addEventListener('resize', handler, false); 
			} else if (window.attachEvent)  {
				attachEvent('onDOMContentLoaded', handler);// IE
				attachEvent('onload', handler);
				attachEvent('onscroll', handler);
				attachEvent('onresize', handler);
			};
		};

		function bindEvent (event_type, elem) {
			elem.on(event_type, function() {
				if (anim_in && !anim_out) {
					if (!in_progress) {
						if (!done_once_in) {
							animate('in', anim_in, delay_in, duration_in, easy_in);
						};
					};
				} else if (!anim_in && anim_out) {
					if (!in_progress) {
						if (!done_once_out) {
							animate('out', anim_out, delay_out, duration_out, easy_out);
						};
					};
				} else if (anim_in && anim_out) {
					if (!in_progress) {
						if (finished_out) {
							if (!done_once_in) {
							animate('in', anim_in, delay_in, duration_in, easy_in);
							};
						} else {
							if (!done_once_out) {
							animate('out', anim_out, delay_out, duration_out, easy_out);
							};
						};
					};
				};
			});
		};
		//'viewport' event occurs only once
		function viewportEvent(elem_node) {
			return function () {
				var in_viewport = verge.inViewport(elem_node, -shift);
				if (anim_in || anim_out) {
					if (anim_order === 'in-out') {
						if (anim_in && !in_progress) {
							if (finished_out) {
								if (!done_once_in) {
									if (in_viewport) {
										animate('in', anim_in, delay_in, duration_in, easy_in);
										done_once_in = true;
									};
								};
							};
						};
					} else if (anim_order === 'out-in') {
						if (anim_out && !in_progress) {
							if (!finished_out) {
								if (!done_once_out) {
									if (in_viewport) {
										animate('out', anim_out, delay_out, duration_out, easy_out);
										done_once_out = true;
									};
								};
							};
						};
					};
				};
			};
		};
			
		//and now proceed animation
		function animate(order, effect_name, delay, duration, easy){
			//getting effect name (all chars untill first "-"), and cloning object
			var temp = effect_name.match(/[^-]*/i)[0],
				rows, cols;
			
			if (temp in anim_data) {
				var a = cloneObj(anim_data[temp]);
			} else {
				var a = cloneObj(anim_data['effect1']);
			};
			
			//creating 2 dimensional array of all paths
			if (effect_name.match(/bottom/)) {
				var paths = [];
				group.each(function(d) { 
					rows = d.rows; cols = d.cols;
					for (var r = 0; r < rows; r++) {
						paths[r] = [];
						for (var c = 0; c < cols; c++) {
							var temp = group.selectAll('.row-'+ r +'.col-' + c);
							if (!temp.empty()) {
								paths[r].push(temp);
							};
						};
					};
					for (var i = 0; i < a.fr.length; i++) {
						a.fr[i].t[0] = a.fr[i].t[0]*-1;
						a.fr[i].t[1] = a.fr[i].t[1]*-1;
					};
				});
				paths.reverse();
			} else if (effect_name.match(/left/)) {
				var paths = [];
				group.each(function(d) { 
					rows = d.rows; cols = d.cols;
					for (var c = 0; c < cols; c++) {
						paths[c] = [];
						for (var r = 0; r < rows; r++) {
							var temp = group.selectAll('.row-'+ r +'.col-' + c);
							if (!temp.empty()) {
								paths[c].push(temp);
							};
						};
					};
					for (var i = 0; i < a.fr.length; i++) {
						a.fr[i].t.reverse();
					};
				});
			} else if (effect_name.match(/right/)) {
				var paths = [];
				group.each(function(d) { 
					rows = d.rows; cols = d.cols;
					for (var c = 0; c < cols; c++) {
						paths[c] = [];
						for (var r = 0; r < rows; r++) {
							var temp = group.selectAll('.row-'+ r +'.col-' + c);
							if (!temp.empty()) {
								paths[c].push(temp);
							};
						};
					};
					for (var i = 0; i < a.fr.length; i++) {
						a.fr[i].t.reverse();
						a.fr[i].t[0] = a.fr[i].t[0]*-1;
						a.fr[i].t[1] = a.fr[i].t[1]*-1;
					};
				});
				paths.reverse();
			} else {//top by default
				var paths = [];
				group.each(function(d) { 
					rows = d.rows; cols = d.cols;
					for (var r = 0; r < rows; r++) {
						paths[r] = [];
						for (var c = 0; c < cols; c++) {
							var temp = group.selectAll('.row-'+ r +'.col-' + c);
							if (!temp.empty()) {
								paths[r].push(temp);
							};
						};
					};
				});
			};
			
			switch (order) {
				case 'out': {
					var dur = duration / paths.length * (paths.length - paths.length * a.d_s);
					var del = (duration - dur) / (paths.length - 1);
					group.transition()
						.duration(delay + duration)
						.ease(easy)
						.each('start', function() {
							if (typeof(beforeAnim) === 'function') {
								beforeAnim();
							};
							in_progress = true;
							group.selectAll('path')
								.attr('transform', 'translate(0,0) translate(0,0) scale(1,1) rotate(0)')
								.style('opacity', 1);
						})
						.each(function() {
							var frame0 = a.fr[0],
								frame1 = a.fr[1];
							for (var r = 0; r < paths.length; r++) {
								for (var c = 0; c < paths[r].length; c++) {
									
									var t0 = paths[r][c].transition()
										.delay(function (){ return delay + del * r; })
										.duration(dur * a.f_d)
										.attrTween('transform', function (d) {
											var tr, trS, scale, rot;
											tr = 'translate('+ frame0.t[0]*size +','+ frame0.t[1]*size +') ';
											trS = 'translate('+ d.c[0]*(1-frame0.s[0]) +' '+ d.c[1]*(1-frame0.s[1]) +') ';
											scale = 'scale('+ frame0.s[0] +','+ frame0.s[1] +') ';
											if (frame0.r === 'rnd') {
												rot = 'rotate('+ getRandomInt(frame0.r_rnd[0],frame0.r_rnd[1]) +','
											} else {
												rot = 'rotate('+ frame0.r +','  
											};
											if (frame0.r_p === 'tl') {
												rot += d.tl[0] +','+ d.tl[1] +')';
											} else if (frame0.r_p === 'tr') {
												rot += d.tr[0] +','+ d.tr[1] +')';
											} else if (frame0.r_p === 'bl') {
												rot += d.bl[0] +','+ d.bl[1] +')';
											} else if (frame0.r_p === 'br') {
												rot += d.br[0] +','+ d.br[1] +')';
											} else {
												rot += d.c[0] +','+ d.c[1] +')';
											};
											var res = tr + trS + scale + rot;
											
											return d3.interpolateString('translate(0,0) translate(0,0) scale(1,1) rotate(0)', res);
										})
										.style('opacity', function (d) {
											return frame0.o;
										});
									if (typeof frame1 !== 'undefined') {
										var t1 = t0.transition()
										.duration(dur * (1 - a.f_d))
										.attrTween('transform', function (d) {
											var tr, trS, scale, rot;
											tr = 'translate('+ frame0.t[0]*size +','+ frame0.t[1]*size +') ';
											trS = 'translate('+ d.c[0]*(1-frame0.s[0]) +' '+ d.c[1]*(1-frame0.s[1]) +') ';
											scale = 'scale('+ frame0.s[0] +','+ frame0.s[1] +') ';
											if (frame0.r === 'rnd') {
												rot = 'rotate('+ getRandomInt(frame0.r_rnd[0],frame0.r_rnd[1]) +','
											} else {
												rot = 'rotate('+ frame0.r +','  
											};
											if (frame0.r_p === 'tl') {
												rot += d.tl[0] +','+ d.tl[1] +')';
											} else if (frame0.r_p === 'tr') {
												rot += d.tr[0] +','+ d.tr[1] +')';
											} else if (frame0.r_p === 'bl') {
												rot += d.bl[0] +','+ d.bl[1] +')';
											} else if (frame0.r_p === 'br') {
												rot += d.br[0] +','+ d.br[1] +')';
											} else {
												rot += d.c[0] +','+ d.c[1] +')';
											};
											var res1 = tr + trS + scale + rot;

											var tr, trS, scale, rot;
											tr = 'translate('+ frame1.t[0]*size +','+ frame1.t[1]*size +') ';
											trS = 'translate('+ d.c[0]*(1-frame1.s[0]) +' '+ d.c[1]*(1-frame1.s[1]) +') ';
											scale = 'scale('+ frame1.s[0] +','+ frame1.s[1] +') ';
											if (frame1.r === 'rnd') {
												rot = 'rotate('+ getRandomInt(frame1.r_rnd[0],frame1.r_rnd[1]) +','
											} else {
												rot = 'rotate('+ frame1.r +','  
											};
											if (frame1.r_p === 'tl') {
												rot += d.tl[0] +','+ d.tl[1] +')';
											} else if (frame1.r_p === 'tr') {
												rot += d.tr[0] +','+ d.tr[1] +')';
											} else if (frame1.r_p === 'bl') {
												rot += d.bl[0] +','+ d.bl[1] +')';
											} else if (frame1.r_p === 'br') {
												rot += d.br[0] +','+ d.br[1] +')';
											} else {
												rot += d.c[0] +','+ d.c[1] +')';
											};
											
											var res2 = tr + trS + scale + rot;
											return d3.interpolateString(res1, res2);
										})
										.style('opacity', function (d) {
											return frame1.o;
										});
									};
										
								};
							};
						})
						.each('end', function () {
							if (typeof(afterAnim) === 'function') {
								afterAnim();
							};
							!event_repeat ? done_once_out = true : done_once_out = false;
							in_progress = false;
							finished_out = true;
						});
					break;
				}
				case 'in': {
					var dur = duration / paths.length * (paths.length - paths.length * a.d_s);
					var del = (duration - dur) / (paths.length - 1);

					group.transition()
						.duration(delay + duration)
						.ease(easy)
						.each('start', function() {
							if (typeof(beforeAnim) === 'function') {
								beforeAnim();
							};
							in_progress = true;
							
							if (a.fr.length === 2) {
								var frame0 = a.fr[1];
							} else {
								var frame0 = a.fr[0];
							};
							
							for (var r = 0; r < paths.length; r++) {
								for (var c = 0; c < paths[r].length; c++) {
									paths[r][c]
										.attr('transform', function (d) {
											var tr, trS, scale, rot;
											tr = 'translate('+ frame0.t[0]*size +','+ frame0.t[1]*size +') ';
											trS = 'translate('+ d.c[0]*(1-frame0.s[0]) +' '+ d.c[1]*(1-frame0.s[1]) +') ';
											scale = 'scale('+ frame0.s[0] +','+ frame0.s[1] +') ';
											if (frame0.r === 'rnd') {
												rot = 'rotate('+ getRandomInt(frame0.r_rnd[0],frame0.r_rnd[1]) +','
											} else {
												rot = 'rotate('+ frame0.r +','  
											};
											if (frame0.r_p === 'tl') {
												rot += d.tl[0] +','+ d.tl[1] +')';
											} else if (frame0.r_p === 'tr') {
												rot += d.tr[0] +','+ d.tr[1] +')';
											} else if (frame0.r_p === 'bl') {
												rot += d.bl[0] +','+ d.bl[1] +')';
											} else if (frame0.r_p === 'br') {
												rot += d.br[0] +','+ d.br[1] +')';
											} else {
												rot += d.c[0] +','+ d.c[1] +')';
											};
											return (tr + trS + scale + rot);
										})
										.style('opacity', function (d) {
											return frame0.o;
											//return 0;
										});
								};
							};
						})
						.each(function() {
							if (a.fr.length === 2) {
								var frame0 = a.fr[1];
								var frame1 = a.fr[0];
								for (var r = 0; r < paths.length; r++) {
									for (var c = 0; c < paths[r].length; c++) {
										var t0 = paths[r][c].transition()
											.delay(function (){ return delay + del * r; })
											.duration(dur * (1 - a.f_d))
											.attrTween('transform', function (d) {
												var tr, trS, scale, rot;
												tr = 'translate('+ frame0.t[0]*size +','+ frame0.t[1]*size +') ';
												trS = 'translate('+ d.c[0]*(1-frame0.s[0]) +' '+ d.c[1]*(1-frame0.s[1]) +') ';
												scale = 'scale('+ frame0.s[0] +','+ frame0.s[1] +') ';
												if (frame0.r === 'rnd') {
													rot = 'rotate('+ getRandomInt(frame0.r_rnd[0],frame0.r_rnd[1]) +','
												} else {
													rot = 'rotate('+ frame0.r +','  
												};
												if (frame0.r_p === 'tl') {
													rot += d.tl[0] +','+ d.tl[1] +')';
												} else if (frame0.r_p === 'tr') {
													rot += d.tr[0] +','+ d.tr[1] +')';
												} else if (frame0.r_p === 'bl') {
													rot += d.bl[0] +','+ d.bl[1] +')';
												} else if (frame0.r_p === 'br') {
													rot += d.br[0] +','+ d.br[1] +')';
												} else {
													rot += d.c[0] +','+ d.c[1] +')';
												};
												var res0 = tr + trS + scale + rot;
												
												tr = 'translate('+ frame1.t[0]*size +','+ frame1.t[1]*size +') ';
												trS = 'translate('+ d.c[0]*(1-frame1.s[0]) +' '+ d.c[1]*(1-frame1.s[1]) +') ';
												scale = 'scale('+ frame1.s[0] +','+ frame1.s[1] +') ';
												if (frame1.r === 'rnd') {
													rot = 'rotate('+ getRandomInt(frame1.r_rnd[0],frame1.r_rnd[1]) +','
												} else {
													rot = 'rotate('+ frame1.r +','  
												};
												if (frame1.r_p === 'tl') {
													rot += d.tl[0] +','+ d.tl[1] +')';
												} else if (frame1.r_p === 'tr') {
													rot += d.tr[0] +','+ d.tr[1] +')';
												} else if (frame1.r_p === 'bl') {
													rot += d.bl[0] +','+ d.bl[1] +')';
												} else if (frame1.r_p === 'br') {
													rot += d.br[0] +','+ d.br[1] +')';
												} else {
													rot += d.c[0] +','+ d.c[1] +')';
												};
												var res1 = tr + trS + scale + rot;
												return d3.interpolateString(res0, res1);
											})
											.style('opacity', function (d) {
												return frame1.o;
											});

										var t1 = t0.transition()
											.duration(dur * a.f_d)
											.attrTween('transform', function (d) {
												var tr, trS, scale, rot;
												tr = 'translate('+ frame1.t[0]*size +','+ frame1.t[1]*size +') ';
												trS = 'translate('+ d.c[0]*(1-frame1.s[0]) +' '+ d.c[1]*(1-frame1.s[1]) +') ';
												scale = 'scale('+ frame1.s[0] +','+ frame1.s[1] +') ';
												if (frame1.r === 'rnd') {
													rot = 'rotate('+ getRandomInt(frame1.r_rnd[0],frame1.r_rnd[1]) +','
												} else {
													rot = 'rotate('+ frame1.r +','  
												};
												if (frame1.r_p === 'tl') {
													rot += d.tl[0] +','+ d.tl[1] +')';
												} else if (frame1.r_p === 'tr') {
													rot += d.tr[0] +','+ d.tr[1] +')';
												} else if (frame1.r_p === 'bl') {
													rot += d.bl[0] +','+ d.bl[1] +')';
												} else if (frame1.r_p === 'br') {
													rot += d.br[0] +','+ d.br[1] +')';
												} else {
													rot += d.c[0] +','+ d.c[1] +')';
												};
												var res1 = tr + trS + scale + rot;
												tr = 'translate(0,0) ';
												trS = 'translate(0,0) ';
												scale = 'scale(1,1) ';
												rot = 'rotate(0,';
												if (frame1.r_p === 'tl') {
													rot += d.tl[0] +','+ d.tl[1] +')';
												} else if (frame1.r_p === 'tr') {
													rot += d.tr[0] +','+ d.tr[1] +')';
												} else if (frame1.r_p === 'bl') {
													rot += d.bl[0] +','+ d.bl[1] +')';
												} else if (frame1.r_p === 'br') {
													rot += d.br[0] +','+ d.br[1] +')';
												} else {
													rot += d.c[0] +','+ d.c[1] +')';
												};
												var res2 = tr + trS + scale + rot;

												return d3.interpolateString(res1, res2);
											})
											.style('opacity', 1);
									};
								};
							} else {
								var frame1 = a.fr[0];
								for (var r = 0; r < paths.length; r++) {
									for (var c = 0; c < paths[r].length; c++) {
										paths[r][c].transition()
											.delay(function (){ return delay + del * r; })
											.duration(dur)
											.attrTween('transform', function (d) {
												var tr, trS, scale, rot;
												tr = 'translate('+ frame1.t[0]*size +','+ frame1.t[1]*size +') ';
												trS = 'translate('+ d.c[0]*(1-frame1.s[0]) +' '+ d.c[1]*(1-frame1.s[1]) +') ';
												scale = 'scale('+ frame1.s[0] +','+ frame1.s[1] +') ';
												if (frame1.r === 'rnd') {
													rot = 'rotate('+ getRandomInt(frame1.r_rnd[0],frame1.r_rnd[1]) +','
												} else {
													rot = 'rotate('+ frame1.r +','  
												};
												if (frame1.r_p === 'tl') {
													rot += d.tl[0] +','+ d.tl[1] +')';
												} else if (frame1.r_p === 'tr') {
													rot += d.tr[0] +','+ d.tr[1] +')';
												} else if (frame1.r_p === 'bl') {
													rot += d.bl[0] +','+ d.bl[1] +')';
												} else if (frame1.r_p === 'br') {
													rot += d.br[0] +','+ d.br[1] +')';
												} else {
													rot += d.c[0] +','+ d.c[1] +')';
												};
												var res1 = tr + trS + scale + rot;
												tr = 'translate(0,0) ';
												trS = 'translate(0,0) ';
												scale = 'scale(1,1) ';
												rot = 'rotate(0,';
												if (frame1.r_p === 'tl') {
													rot += d.tl[0] +','+ d.tl[1] +')';
												} else if (frame1.r_p === 'tr') {
													rot += d.tr[0] +','+ d.tr[1] +')';
												} else if (frame1.r_p === 'bl') {
													rot += d.bl[0] +','+ d.bl[1] +')';
												} else if (frame1.r_p === 'br') {
													rot += d.br[0] +','+ d.br[1] +')';
												} else {
													rot += d.c[0] +','+ d.c[1] +')';
												};
												var res2 = tr + trS + scale + rot;

												return d3.interpolateString(res1, res2);
											})
											.style('opacity', 1);
									};
								};
							};
						})
						.each('end', function () {
							if (typeof(afterAnim) === 'function') {
								afterAnim();
							};
							!event_repeat ? done_once_in = true : done_once_in = false;
							in_progress = false;
							finished_out = false;
						});
					break;
				}
				default: {
					break;
				}
			};
		};//end animate
	};//end initAnimation


	//Help functions
	//check for undefined
	function checkDefaults(a,b) {
		return (typeof a !== 'undefined') ? a : b;
	};

	//unique number from 1
	uniqueNum.counter = 1;
	function uniqueNum () {
		return uniqueNum.counter++;
	};

	//random integer from range
	function getRandomInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	//http://stackoverflow.com/questions/171251/
	function mergeObjects(obj1, obj2) {
		if (typeof obj1 === 'undefined') {
			obj1 = {};
		};
		for (var p in obj2) {
			try {
				// Property in destination object is set; update its value.
				if ( obj2[p].constructor==Object ) {
				obj1[p] = mergeObjects(obj1[p], obj2[p]);
				} else {
					obj1[p] = obj2[p];
				};
			} catch(e) {
				// Property in destination object is not set; create it and set its value.
				obj1[p] = obj2[p];
			};
		}
		return obj1;
	};

	//function for cloning object's data
	function cloneObj(obj){
		if(obj == null || typeof(obj) != "object") {
			return obj;
		};
		var temp = new obj.constructor();
		for(var key in obj) {
			temp[key] = cloneObj(obj[key]);
		};
		return temp;
	};
})();//end call of anonymous func

//create and animate trigons in all elements with class 'trigons' when page is loaded
(function() {
	"use strict";
	d3.selectAll('.trigons').each(function () {
		var create = d3.select(this).attr('data-create'),
			animate = d3.select(this).attr('data-animate');
		if (create !== null && create !== '') {
			create = JSON.parse(create);
			d3.select(this).trigons(create);
		} else {
			d3.select(this).trigons();
		};

		if (animate !== null && animate !== '') {
			animate = JSON.parse(animate);
			d3.select(this).trigonsAnimInit(animate);
		} else if (animate === '') {
			d3.select(this).trigonsAnimInit();
		};
	});
})();//end call of anonymous func

/*!
 * verge 1.9.1+201402130803
 * https://github.com/ryanve/verge
 * MIT License 2013 Ryan Van Etten
 */
!function(a,b,c){"undefined"!=typeof module&&module.exports?module.exports=c():a[b]=c()}(this,"verge",function(){function a(){return{width:k(),height:l()}}function b(a,b){var c={};return b=+b||0,c.width=(c.right=a.right+b)-(c.left=a.left-b),c.height=(c.bottom=a.bottom+b)-(c.top=a.top-b),c}function c(a,c){return a=a&&!a.nodeType?a[0]:a,a&&1===a.nodeType?b(a.getBoundingClientRect(),c):!1}function d(b){b=null==b?a():1===b.nodeType?c(b):b;var d=b.height,e=b.width;return d="function"==typeof d?d.call(b):d,e="function"==typeof e?e.call(b):e,e/d}var e={},f="undefined"!=typeof window&&window,g="undefined"!=typeof document&&document,h=g&&g.documentElement,i=f.matchMedia||f.msMatchMedia,j=i?function(a){return!!i.call(f,a).matches}:function(){return!1},k=e.viewportW=function(){var a=h.clientWidth,b=f.innerWidth;return b>a?b:a},l=e.viewportH=function(){var a=h.clientHeight,b=f.innerHeight;return b>a?b:a};return e.mq=j,e.matchMedia=i?function(){return i.apply(f,arguments)}:function(){return{}},e.viewport=a,e.scrollX=function(){return f.pageXOffset||h.scrollLeft},e.scrollY=function(){return f.pageYOffset||h.scrollTop},e.rectangle=c,e.aspect=d,e.inX=function(a,b){var d=c(a,b);return!!d&&d.right>=0&&d.left<=k()},e.inY=function(a,b){var d=c(a,b);return!!d&&d.bottom>=0&&d.top<=l()},e.inViewport=function(a,b){var d=c(a,b);return!!d&&d.bottom>=0&&d.right>=0&&d.top<=l()&&d.left<=k()},e});

function base64 () {
	/*
	 * Copyright (c) 2010 Nick Galbreath
	 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/* modified by DeeThemes: removed base64.getbyte64, base64.decode and made minified*/
	
	var base64={};base64.PADCHAR="=";base64.ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";base64.makeDOMException=function(){var e,tmp;try{return new DOMException(DOMException.INVALID_CHARACTER_ERR)}catch(tmp){var ex=new Error("DOM Exception 5");ex.code=ex.number=5;ex.name=ex.description="INVALID_CHARACTER_ERR";ex.toString=function(){return"Error: "+ex.name+": "+ex.message};return ex}};base64.getbyte=function(s,i){var x=s.charCodeAt(i);if(x>255)throw base64.makeDOMException();return x};base64.encode=function(s){if(arguments.length!==1)throw new SyntaxError("Not enough arguments");var padchar=base64.PADCHAR;var alpha=base64.ALPHA;var getbyte=base64.getbyte;var i,b10;var x=[];s=""+s;var imax=s.length-s.length%3;if(s.length===0)return s;for(i=0;i<imax;i+=3){b10=getbyte(s,i)<<16|getbyte(s,i+1)<<8|getbyte(s,i+2);x.push(alpha.charAt(b10>>18));x.push(alpha.charAt(b10>>12&63));x.push(alpha.charAt(b10>>6&63));x.push(alpha.charAt(b10&63))}switch(s.length-imax){case 1:b10=getbyte(s,i)<<16;x.push(alpha.charAt(b10>>18)+alpha.charAt(b10>>12&63)+padchar+padchar);break;case 2:b10=getbyte(s,i)<<16|getbyte(s,i+1)<<8;x.push(alpha.charAt(b10>>18)+alpha.charAt(b10>>12&63)+alpha.charAt(b10>>6&63)+padchar);break}return x.join("")};return base64.encode;
};