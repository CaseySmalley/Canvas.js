resource.define(
	"CanvasRectanglePrimitive",
	
	[
		resource.MODULE,"resource/canvas/CanvasPrimitive.js"
	],
	
	function() {
		
		"use strict";
		
		// Classes
		var RectanglePrimitive = resource.class(
			function(x,y,width,height,r,g,b) {
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.r = r;
				this.g = g;
				this.b = b;
			},{
				
			}
		);
		
		// Static variables
		var vertexCode = `
			precision lowp float;
			
			attribute vec2 aPosition;
			attribute vec3 aColour;
			
			varying vec3 vColour;
			
			uniform mat4 uCamera;
			
			void main() {
				vColour = aColour;
				gl_Position = uCamera * vec4(aPosition,0.0,1.0);
			}
		`;
		
		var fragmentCode = `
			precision lowp float;
			
			varying vec3 vColour;
			
			void main() {
				gl_FragColor = vec4(vColour,1.0);
			}
		`;
		
		// Handles
		var CanvasPrimitive = this.CanvasPrimitive;
		
		// Export class
		return resource.class_extends(CanvasPrimitive,
			function(canvas) {
				this.program = this.sgl.createProgram(vertexCode,fragmentCode);
				this.primitiveVertexSize = 5;
				this.primitiveVertexPerInstance = 6;
			},{
				create: function(x,y,width,height,r,g,b) {
					var primitive = new RectanglePrimitive(x,y,width,height,r,g,b);
					
					this.primitives.push(primitive);
					
					return primitive;
				},
				
				generateVertexData: function(data,primitiveBatch) {
					var primitive = null;
					var i = 0;
					
					while(primitive = primitiveBatch.pop()) {
						var hWidth = primitive.width >> 1;
						var hHeight = primitive.height >> 1;
						var minX = primitive.x - hWidth;
						var maxX = primitive.x + hWidth;
						var minY = primitive.y - hHeight;
						var maxY = primitive.y + hHeight;
						var r = primitive.r;
						var g = primitive.g;
						var b = primitive.b;
						
						data[i++] = maxX;
						data[i++] = minY;
						data[i++] = r;
						data[i++] = g;
						data[i++] = b;
						
						data[i++] = minX;
						data[i++] = minY;
						data[i++] = r;
						data[i++] = g;
						data[i++] = b;
						
						data[i++] = minX;
						data[i++] = maxY;
						data[i++] = r;
						data[i++] = g;
						data[i++] = b;
						
						data[i++] = maxX;
						data[i++] = minY;
						data[i++] = r;
						data[i++] = g;
						data[i++] = b;
						
						data[i++] = minX;
						data[i++] = maxY;
						data[i++] = r;
						data[i++] = g;
						data[i++] = b;
						
						data[i++] = maxX;
						data[i++] = maxY;
						data[i++] = r;
						data[i++] = g;
						data[i++] = b;
					}
					
					return i;
				}
			}
		);
	}
);