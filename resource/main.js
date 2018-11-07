void function() {
	
	"use strict";
	
	// Imports
	resource.import([
		resource.MODULE,"resource/canvas/Canvas.js"
	]);
	
	// Handles
	var Canvas = null;
	
	// Variables
	var canvas = null;
	var camera = null;
	var rect = null;
	var i = 0.0;
	var j = 0.0;
	
	// Functions
	function loop() {
		// Tick
		i += 0.02;
		j += 0.01;
		
		if (i > 2.0 * Math.PI) {
			i -= 2.0 * Math.PI;
		}
		
		if (j > 2.0 * Math.PI) {
			j -= 2.0 * Math.PI;
		}
		
		camera.x = canvas.hWidth + Math.cos(i) * 150;
		camera.y = canvas.hHeight + Math.sin(i) * 150;
		camera.zoom = 1.0 + 0.25 * Math.sin(j);
		
		// Render
		canvas.draw();
		
		//
		requestAnimationFrame(loop);
	}
	
	// Entry Point
	resource.onload = function() {
		Canvas = resource.getModule("Canvas");
		
		canvas = new Canvas(document.body,640,480);
		camera = canvas.camera;
		
		for (var i = 0; i < 100; ++i) {
			canvas.rectangle.create(
				Math.random() * canvas.width,
				Math.random() * canvas.height,
				Math.random() * 50.0 + 25.0,
				Math.random() * 50.0 + 25.0,
				Math.random() * 0.5,
				Math.random() * 0.5,
				Math.random() * 0.5
			);
		}
		
		loop();
	}
	
}();