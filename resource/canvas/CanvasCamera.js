resource.define(
	"CanvasCamera",
	
	[
		
	],
	
	function() {
		
		"use strict";
		
		return resource.class(
			function(canvas,x,y,angle,zoom) {
				this.canvas = canvas;
				this.x = x;
				this.y = y;
				this.angle = angle;
				this.zoom = zoom;
				this.matrix = new Float32Array(16);
				this.s = 0.0;
				this.c = 0.0;
			},{
				isInViewport: function(x,y) {
					x = x - this.x;
					y = y - this.y;
					
					var hWidth = this.canvas.hWidth;
					var hHeight = this.canvas.hHeight;
					var s = this.s;
					var c = this.c;
					var _x = (x * c - y * s) * this.zoom;
					var _y = (x * s + y * c) * this.zoom;
					
					return _x > -hWidth && _x < hWidth
						&& _y > -hHeight && _y < hHeight;
				},
				
				updateMatrix: function() {
					var x = this.x;
					
					var y = this.y;
					var matrix = this.matrix;
					var s = this.s = Math.sin(this.angle);
					var c = this.c = Math.cos(this.angle);
					var _2z = 2.0 * this.zoom;
					var _2sz = _2z * s;
					var _2cz = _2z * c;
					var invWidth = 1.0 / this.canvas.width;
					var invHeight = 1.0 / this.canvas.height;
					
					matrix[0] = _2cz * invWidth;
					matrix[1] = _2sz * invHeight;
					matrix[2] = 0.0;
					matrix[3] = 0.0;
					matrix[4] = _2sz * invWidth;
					matrix[5] = -_2cz * invHeight;
					matrix[6] = 0.0;
					matrix[7] = 0.0;
					matrix[8] = 0.0;
					matrix[9] = 0.0;
					matrix[10] = 1.0;
					matrix[11] = 0.0;
					matrix[12] = _2z * (-x * c - y * s) * invWidth;
					matrix[13] = -_2z * (x * s - y * c) * invHeight;
					matrix[14] = -1.0;
					matrix[15] = 1.0;
				}
			}
		);
		
	}
);