resource.define(
	"CanvasPrimitive",
	
	[
	
	],
	
	function() {
		
		"use strict";
		
		return resource.class(
			function(canvas) {
				this.canvas = canvas;
				this.sgl = canvas.sgl;
				this.gl = canvas.gl;
				this.program = null;
				this.buffer = this.sgl.createBuffer(null);
				this.primitiveVertexSize = 1.0;
				this.primitiveVertexPerInstance = 1.0;
				this.primitives = [];
				this.primitiveBatch = new resource.Stack();
				this.drawCount = 0;
			},{
				generateVertexData: function(data,primitiveBatch) {
					return 0;
				},
				
				generateBatch: function() {
					var camera = this.canvas.camera;
					var primitives = this.primitives;
					var primitiveBatch = this.primitiveBatch;
					
					primitiveBatch.clear();
					
					for (var i = 0; i < primitives.length; ++i) {
						var primitive = primitives[i];
						
						//if (camera.isInViewport(primitive.x,primitive.y)) {
							primitiveBatch.push(primitive);
						//}
					}
					
					var buffer = this.buffer;
					var primitiveVertexSize = this.primitiveVertexSize;
					var primitiveVertexPerInstance = this.primitiveVertexPerInstance;
					var primitive = null;
					var shouldReallocate = buffer.length / primitiveVertexSize < primitiveBatch.length;
					var data = shouldReallocate ? new Float32Array(primitiveBatch.length * primitiveVertexSize * primitiveVertexPerInstance) : buffer.data;
					
					this.drawCount = this.generateVertexData(data,primitiveBatch) / primitiveVertexSize;
					
					if (shouldReallocate) {
						buffer.reallocate(data);
					} else {
						buffer.upload();
					}
				},
				
				draw: function() {
					var gl = this.gl;
					var camera = this.canvas.camera;
					var program = this.program;
					var buffer = this.buffer;
					var drawCount = this.drawCount;
					
					if (drawCount) {
						program.bind();
						program.bindBuffer(buffer);
						program.uCamera.set(camera.matrix);
						program.uploadUniforms();
						program.draw(gl.TRIANGLES,0,drawCount);
					}
				}
			}
		);
		
	}
);