resource.define(
	"Canvas",
	
	[
		resource.MODULE,"resource/canvas/Sgl.js",
		resource.MODULE,"resource/canvas/CanvasCamera.js",
		resource.MODULE,"resource/canvas/CanvasRectanglePrimitive.js"
	],
	
	function() {
		
		"use strict";
		
		// Handles
		var Sgl = this.Sgl;
		var CanvasCamera = this.CanvasCamera;
		var CanvasRectanglePrimitive = this.CanvasRectanglePrimitive;
		
		// Static Variables
		
		// Static functions
		function release() {
			this.sgl.release();
		}
		
		var t = false;
		
		// Export class
		return resource.class(
			function(parent,width,height) {
				if (!(parent instanceof HTMLElement)) {
					resource.error("A canvas requires a valid parent");
				}
				
				if (typeof width !== "number") {
					resource.error("A canvas requires a valid width");
				}
				
				if (typeof height !== "number") {
					resource.error("A canvas requires a valid height");
				}
				
				this.canvas = document.createElement("canvas");
				this.canvas.width = this.width = width;
				this.canvas.height = this.height = height;
				this.hWidth = this.width >> 1;
				this.hHeight = this.height >> 1;
				
				this.colour = {r: 0.5,g: 0.5,b: 0.5};
				
				this.gl = this.canvas.getContext("webgl");
				this.sgl = new Sgl(this.gl);
				this.camera = new CanvasCamera(this,this.width >> 1,this.height >> 1,0.0,1.0);
				this.rectangle = new CanvasRectanglePrimitive(this);
				
				parent.appendChild(this.canvas);
				window.addEventListener("unload",release.bind(this));
			},{
				draw: function() {
					var colour = this.colour;
					var sgl = this.sgl;
					var camera = this.camera;
					var rectangle = this.rectangle;
					
					sgl.clearColour(colour.r,colour.g,colour.b);
					
					camera.updateMatrix();
					
					rectangle.generateBatch();
					rectangle.draw();
					
					camera._changed_ = false;
				}
			}
		);
		
	}
);