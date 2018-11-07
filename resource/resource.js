/*
	Resource.js V5.0
	ES5 Compliant Static Module/File Loader
*/

var resource = function() {
	
	"use strict";

	// Log styles
	var baseStyle = "display: inline-block;\
					width: 300px;\
					border: solid 1px white;\
					border-radius: 5px;\
					color: white;\
					font-size: 12px;\
					text-align: center;";
	
	var titleStyle = baseStyle + "background-color: black; font-weight: bold;";
	var logStyle = baseStyle + "background-color: #333333;";
	var warnStyle = baseStyle + "background-color: #EA9400;";
	var errorStyle = baseStyle + "background-color: darkred;";
	
	// Util Functions
	function title(msg) {
		console.log("%c " + msg + " ",titleStyle);
	}

	function log(msg) {
		console.log("%c " + msg + " ",logStyle);
	}

	function warn(msg) {
		console.warn("%c " + msg + " ",warnStyle);
	}

	function error(msg) {
		console.error("%c " + msg + " ",errorStyle);
		throw "Execution Terminated";
	}

	function _class(constructor,prototype) {
		constructor.prototype = prototype;
		return constructor;
	}

	function _class_extends(base,constructor,prototype) {
		for (var property in base.prototype) {
			if (!prototype[property]) {
				prototype[property] = base.prototype[property];
			}
		}
		
		function bundledConstructor() {
			base.apply(this,arguments);
			constructor.apply(this,arguments);
		}
		
		constructor.prototype = prototype;
		bundledConstructor.prototype = prototype;
		
		return bundledConstructor;
	}

	// Util Classes
	var Mask = _class(
		function() {
			this.map = {};
			
			for (var i = 0; i < arguments.length; ++i) {
				this.map[arguments[i]] = true;
			}
		},{
			set: function() {
				this.clear();
				
				for (var i = 0; i < arguments.length; ++i) {
					this.map[arguments[i]] = true;
				}
			},
			
			add: function(key) {
				this.map[key] = true;
			},
			
			remove: function(key) {
				delete this.map[key];
			},
			
			clear: function() {
				var map = this.map;
				
				for (var key in map) {
					delete map[key];
				}
			},
			
			append: function(mask) {
				var map = this.map;
				
				for (var key in mask.map) {
					map[key] = true;
				}
			},
			
			match: function(mask) {
				var map = this.map;
				var maskMap = mask.map;
				
				for (var key in map) {
					if (!maskMap[key]) {
						return false;
					}
				}
				
				return true;
			},
			
			toString: function() {
				var map = this.map;
				var out = "[";
				
				for (var key in map) {
					out += " " + key + " ";
				}
				
				return out + "]";
			}
		}
	);
	
	var Allocator = _class(
		function(constructor) {
			this.constructor = constructor || null;
			this.stack = [];
			this.top = 0;
		},{
			create: function() {
				var object = null;
				
				if (!this.top) {
					object = new this.constructor();
				} else {
					object = this.stack[--this.top];
				}
				
				if (object.init) {
					object.init.apply(object,arguments);
				}
				
				return object;
			},
			
			destroy: function(object) {
				this.stack[this.top++] = object;
			},
			
			release: function() {
				for (var i = 0; i < this.top; ++i) {
					var object = this.stack[i];
					
					this.stack[i] = null;
					
					if (object.release) {
						object.release();
					}
				}
				
				this.top = 0;
			}
		}
	);
	
	var Map = _class(
		function(map) {
			this.map = map || {};
		},{
			set: function(key,value) {
				this.map[key] = value;
			},
			
			get: function(key) {
				return this.map[key];
			},
			
			remove: function(key) {
				delete this.map[key];
			},
			
			clear: function() {
				for (var key in this.map) {
					delete this.map[key];
				}
			},
			
			iterate: function(callback) {
				if (callback) {
					for (var key in this.map) {
						callback(key,this.map[key]);
					}
				}
			}
		}
	);
	
	var Cache = _class(
		function(map) {
			this.map = map || {};
			this.nextID = 0;
		},{
			set: function(key,value) {
				key = key || this.nextID++;
				
				var object = this.map[key];
				
				if (object && object.release) {
					object.release();
				}
				
				return this.map[key] = value;
			},
			
			get: function(key) {
				return this.map[key];
			},
			
			remove: function(key) {
				var object = this.map[key];
				
				if (object.release) {
					object.release();
				}
				
				delete this.map[key];
			},
			
			clear: function() {
				for (var key in this.map) {
					var object = this.map[key];
					
					if (object.release) {
						object.release();
					}
					
					delete this.map[key];
				}
			},
			
			iterate: function(callback) {
				if (callback) {
					for (var key in this.map) {
						callback(key,this.map[key]);
					}
				}
			}
		}
	);
	
	var Stack = _class(
		function() {
			this.stack = [];
			this.length = 0;
		},{
			at: function(index) {
				if (index > -1 && index < this.length) {
					return this.stack[index];
				} else {
					return null;
				}
			},
			
			top: function() {
				if (this.length) {
					return this.stack[this.length - 1];
				} else {
					return null;
				}
			},
			
			bottom: function() {
				if (this.length) {
					return this.stack[0];
				} else {
					return null;
				}
			},
			
			clear: function() {
				for (var i = 0; i < this.length; ++i) {
					this.stack[i] = null;
				}
				
				this.length = 0;
			},
			
			push: function(object) {
				this.stack[this.length++] = object;
			},
			
			pop: function() {
				if (this.length) {
					var object = this.stack[--this.length];
					this.stack[this.length] = null;
					return object;
				} else {
					return null;
				}
			},
			
			iterate: function(callback) {
				if (callback) {
					for (var i = 0; i < this.length; ++i) {
						callback(this.stack[i]);
					}
				}
			}
		}
	);
	
	var NonRepeatingStackNode = _class(
		function() {
			this.key = null;
			this.object = null;
		},{
			init: function(key,object) {
				this.key = key;
				this.object = object;
			},
			
			release: function() {
				this.key = null;
				this.object = null;
			}
		}
	);
	
	var stackAllocator = new Allocator(NonRepeatingStackNode);
	
	var NonRepeatingStack = _class(
		function() {
			this.length = 0;
			this.stack = [];
			this.map = {};
		},{
			at: function(index) {
				if (index > - 1 && index < this.length) {
					return this.stack[index].object;
				} else {
					return null;
				}
			},
			
			top: function() {
				if (this.length) {
					return this.stack[this.length - 1].object;
				} else {
					return null;
				}
			},
			
			bottom: function() {
				if (this.length) {
					return this.stack[0].object;
				} else {
					return null;
				}
			},
			
			clear: function() {
				var stack = this.stack;
				var map = this.map;
				var node = null;
				
				for (var i = 0; i < this.length; ++i) {
					var node = this.stack[i];
					
					stack[i] = null;
					map[node.key] = null;
					
					stackAllocator.destroy(node);
				}
				
				this.length = 0;
			},
			
			push: function(key,object) {
				var stack = this.stack;
				var map = this.map;
				
				if (!map[key]) {
					var node = stackAllocator.create(key,object);
					
					map[key] = node;
					stack[this.length++] = node;
				}
			},
			
			pop: function() {
				var stack = this.stack;
				var map = this.map;
				
				if (this.length) {
					var node = stack[--this.length];
					var object = node.object;
					
					stack[this.length] = null;
					map[node.key] = null;
					
					stackAllocator.destroy(node);
					
					return object;
				} else {
					return null;
				}
			}
		}
	);
	
	var Queue = _class(
		function(size) {	
			this.queue = [];
			this.queue.length = size || 5;
			this.size = size || 5;
			this.start = 0;
			this.end = 0;
			this.length = 0;
			
			for (var i = 0; i < this.size; ++i) {
				this.queue[i] = null;
			}
		},{
			at: function(index) {
				if (index > -1 && index < this.length) {
					return this.queue[(this.start + index) % this.size];
				} else {
					return null;
				}
			},
			
			clear: function() {
				for (var i = this.start; i !== this.end; i = (i + 1) % this.size) {
					this.queue[i] = null;
				}
				
				this.start = 0;
				this.end = 0;
				this.length = 0;
			},
			
			push: function(object) {
				if (this.length >= this.size) {
					var newSize = this.size << 1;
					var newQueue = [];
					
					newQueue.length = newSize;
					
					for (var i = 0; i < newSize; ++i) {
						if (i < this.length) {
							newQueue[i] = this.queue[(this.start + i) % this.size];
						} else {
							newQueue[i] = null;
						}
					}
					
					this.size = newSize;
					this.queue = newQueue;
					this.start = 0;
					this.end = this.length
				}
				
				++this.length;
				this.queue[this.end] = object;
				this.end = (this.end + 1) % this.size;
			},
			
			pop: function() {
				if (this.length) {
					var object = this.queue[this.start];
					
					--this.length;
					this.queue[this.start] = null;
					this.start = (this.start + 1) % this.size;
					
					return object;
				} else {
					return null;
				}
			},
			
			iterate: function(callback) {
				if (callback) {
					for (var i = this.start; i != this.end; i = (i + 1) % this.size) {
						callback(this.queue[i]);
					}
				}
			}
		}
	);
	
	var ListNode = _class(
		function() {
			this.object = null;
			this.prev = null;
			this.next = null;
		},{
			init: function(prev,next,object) {
				this.object = object;
				this.prev = prev;
				this.next = next;
			},
			
			release: function() {
				this.object = null;
				this.prev = null;
				this.next = null;
			}
		}
	);
	
	var listAllocator = new Allocator(ListNode);
	
	var List = _class(
		function() {
			this.head = null;
			this.tail = null;
			this.length = 0;
		},{
			push_front: function(object) {
				var node = listAllocator.create(null,this.head,object);
				
				if (this.head) {
					this.head.prev = node;
				}
				
				if (!this.tail) {
					this.tail = node;
				}
				
				this.head = node;
				++this.length;
			},
			
			push_back: function(object) {
				var node = listAllocator.create(this.tail,null,object);
				
				if (this.tail) {
					this.tail.next = node;
				}
				
				if (!this.head) {
					this.head = node;
				}
				
				this.tail = node;
				++this.length;
			},
			
			pop_front: function() {
				var node = this.head;
				
				if (node) {
					if (node === this.head) {
						this.head = node.next;
					}
					
					if (node === this.tail) {
						this.tail = null;
					}
					
					if (node.prev) {
						node.prev.next = node.next;
					}
					
					if (node.next) {
						node.next.prev = node.prev;
					}
					
					var object = node.object;
					
					listAllocator.destroy(node);
					--this.length;
					
					return object;
				} else {
					return null;
				}
			},
			
			pop_back: function() {
				var node = this.tail;
				
				if (node) {
					if (node === this.head) {
						this.head = null;
					}
					
					if (node === this.tail) {
						this.tail = node.prev;
					}
					
					if (node.prev) {
						node.prev.next = node.next;
					}
					
					if (node.next) {
						node.next.prev = node.prev;
					}
					
					var object = node.object;
					
					listAllocator.destroy(node);
					--this.length;
					
					return object;
				} else {
					return null;
				}
			},
			
			remove: function(object) {
				var node = null;
				
				for (node = this.head; node; node = node.next) {
					if (object === node.object) {
						break;
					}
				}
				
				if (node) {
					if (node === this.head) {
						this.head = node.next;
					}
					
					if (node === this.tail) {
						this.tail = node.prev;
					}
					
					if (node.prev) {
						node.prev.next = node.next;
					}
					
					if (node.next) {
						node.next.prev = node.prev;
					}
					
					listAllocator.destroy(node);
					--this.length;
				}
			},
			
			clear: function() {
				var previous = null;
				var current = this.head;
				
				while(current || previous) {
					if (previous) {
						previous.prev = null;
						previous.next = null;
						previous.object = null;
						
						listAllocator.destroy(previous);
					}
					
					previous = current;
					
					if (current) {
						current = current.next;
					}
				}
			},
			
			iterate: function(callback) {
				if (callback) {
					for (var node = this.head; node; node = node.next) {
						callback(node.object);
					}
				}
			}
		}
	);
	
	var GraphNode = _class(
		function() {
			this.key = "";
			this.connections = 0;
			this.tempConnections = 0;
			this.object = null;
			this.neighbours = null;
		},{
			
		}
	);
	
	var graphAllocator = new Allocator(GraphNode);
	
	var Graph = _class(
		function() {
			this.nodes = new Map();
			this.visited = new Map();
			this.toVisit = new List();
			this.sortedObjects = new List();
		},{
			add: function(key,object,neighbours) {
				var nodes = this.nodes;
				var node = nodes.get(key);
				
				if (!node) {
					node = graphAllocator.create();
					node.key = key;
					node.connections = 0;
				}
				
				node.object = object;
				node.neighbours = neighbours || null;
				
				nodes.set(node.key,node);
				
				if (neighbours) {
					for (var i = 0; i < neighbours.length; ++i) {
						var _key = neighbours[i];
						var _node = nodes.get(_key);
						
						if (!_node) {
							_node = graphAllocator.create();
							_node.key = _key;
							_node.connections = 0;
							_node.object = null;
							_node.neighbours = null;
							
							nodes.set(_key,_node);
						}
						
						++_node.connections;
					}
				}
			},
			
			get: function(key) {
				var node = this.nodes.get(key);
				
				if (node) {
					return node.object;
				} else {
					return null;
				}
			},
			
			remove: function(key) {
				var node = this.nodes.get(key);
				
				if (node) {
					graphAllocator.destroy(node);
				}
				
				this.nodes.remove(key);
			},
			
			clear: function() {
				for (var key in this.nodes.map) {
					graphAllocator.destroy(this.nodes.get(key));
				}
				
				this.nodes.clear();
				this.sortedObjects.clear();
			},
			
			search: function(callback) {
				if (callback) {
					var nodes = this.nodes;
					var visited = this.visited;
					var toVisit = this.toVisit;
					
					for (var key in nodes.map) {
						var node = nodes.get(key);
						
						if (!node.connections) {
							toVisit.push_front(node);
						}
					}
					
					while(toVisit.length) {
						var node = toVisit.pop_back();
						var neighbours = node.neighbours;
						
						callback(node.object);
						visited.set(node.key,true);
						
						if (neighbours) {
							for (var i = 0; i < neighbours.length; ++i) {
								var key = neighbours[i];
								
								if (!visited.get(key)) {
									visited.set(key,true);
									toVisit.push_front(nodes.get(key));
								}
							}
						}
					}
					
					visited.clear();
				}
			},
			
			sort: function() {
				var nodes = this.nodes;
				var toVisit = this.toVisit;
				var sortedObjects = this.sortedObjects;
				var totalConnections = 0;
				
				for (var key in nodes.map) {
					var node = nodes.get(key);
					
					totalConnections += (node.tempConnections = node.connections);
					
					if (!node.connections) {
						toVisit.push_front(node);
					}
				}
				
				sortedObjects.clear();
				
				while(toVisit.length) {
					var node = toVisit.pop_back();
					var neighbours = node.neighbours;
					
					sortedObjects.push_front(node);
					
					if (neighbours) {
						for (var i = 0; i < neighbours.length; ++i) {
							var _node = nodes.get(neighbours[i]);
							
							if (!--_node.tempConnections) {
								totalConnections -= _node.connections;
								toVisit.push_front(_node);
							}
						}
					}
				}
				
				if (!totalConnections) {
					return sortedObjects;
				} else {
					return null;
				}
			}
		}
	);
	
	var ResourceRequest = _class(
		function(key,path,request) {
			this.key = key;
			this.path = path;
			this.request = request;
		},{
			
		}
	);
	
	// Variables
	var isRunning = false;
	var hasPageLoaded = false;
	
	var activeModuleRequests = 0;
	var activeTextRequests = 0;
	var activeJsonRequests = 0;
	var activeImageRequests = 0;
	
	var moduleRequests = new List();
	var textRequests = new List();
	var jsonRequests = new List();
	var imageRequests = new List();
	
	var graph = new Graph();
	var text = new Map();
	var json = new Map();
	var images = new Map();
	var modules = new Map();
	
	var onload = function() {}

	// Module Graph
	function getModuleExports() {
		var sortedModules = graph.sort();
		
		if (sortedModules) {
			title("Resource.js V5.0");
			
			for (var node = sortedModules.head; node; node = node.next) {
				var graphNode = node.object;
				var key = graphNode.key;
				var closure = graphNode.object;
				
				modules.set(key,closure.apply(modules.map));
			}
			
			graph.clear();
			
			return true;
		} else {
			return false;
		}
	}
	
	// Check if done
	function checkCanRun() {
		if (!isRunning
		&& hasPageLoaded
		&& !activeModuleRequests
		&& !activeTextRequests
		&& !activeJsonRequests
		&& !activeImageRequests)
		{
			isRunning = true;
			moduleRequests.clear();
			textRequests.clear();
			jsonRequests.clear();
			imageRequests.clear();
		
			if (getModuleExports()) {
				onload();
			} else {
				for (var node = graph.sortedObjects.head; node; node = node.next) {
					console.log(node.object.key,node.object.connections);
				}
				
				error("Cyclic dependancy detected");
			}
		}
	}
	
	addEventListener("load",function() {
		hasPageLoaded = true;
		checkCanRun();
	});

	// Module Import
	function onModuleLoad() {
		--activeModuleRequests;
		checkCanRun();
	}
	
	function onModuleError() {
		warn("Couldn't load module '" + this.path + "'");
		--activeModuleRequests;
		checkCanRun();
	}
	
	function importModule(path) {
		path = path.toLowerCase();
		
		for (var node = moduleRequests.head; node; node = node.next) {
			var moduleRequest = node.object;
			
			if (moduleRequest.path === path) {
				return;
			}
		}
		
		var tag = document.createElement("script");
		var request = new ResourceRequest("",path,tag);
		
		tag.async = false;
		tag.defer = true;
		tag.type = "application/javascript";
		tag.onload = onModuleLoad.bind(request);
		tag.onerror = onModuleError.bind(request);
		tag.src = path;
		
		document.body.appendChild(tag);
		
		moduleRequests.push_front(request);
		++activeModuleRequests;
	}

	// Text Import
	function onTextError() {
		warn("Couldn't load text resource '" + this.path + "'");
		--activeTextRequests;
		checkCanRun();
	}
	
	function onTextLoad() {
		--activeTextRequests;
		text.set(this.key,this.request.responseText);
		checkCanRun();
	}
	
	function importText(key,path) {
		path = path.toLowerCase();
		
		for (var node = textRequests.head; node; node = node.next) {
			var textRequest = node.object;
			
			if (textRequest.path === path) {
				return;
			}
		}
		
		var xml = new XMLHttpRequest();
		var request = new ResourceRequest(key,path,xml);
		
		xml.onerror = onTextError.bind(request);
		xml.onload = onTextLoad.bind(request);
		xml.overrideMimeType("text/plain");
		xml.open("GET",path,true);
		xml.send();
		
		textRequests.push_front(request);
		++activeTextRequests;
	}
	
	// JSON Import
	function onJsonError() {
		warn("Couldn't load json resource '" + this.path + "'");
		--activeJsonRequests;
		checkCanRun();
	}
	
	function onJsonLoad() {
		--activeJsonRequests;
		json.set(this.key,JSON.parse(this.request.responseText));
		checkCanRun();
	}
	
	function importJson(key,path) {
		path = path.toLowerCase();
		
		for (var node = textRequests.head; node; node = node.next) {
			var jsonRequest = node.object;
			
			if (jsonRequest.path === path) {
				return;
			}
		}
		
		var xml = new XMLHttpRequest();
		var request = new ResourceRequest(key,path,xml);
		
		xml.onerror = onJsonError.bind(request);
		xml.onload = onJsonLoad.bind(request);
		xml.overrideMimeType("text/plain");
		xml.open("GET",path,true);
		xml.send();
		
		jsonRequests.push_front(request);
		++activeJsonRequests;
	}
	
	// Image Import
	function onImageError() {
		warn("Couldn't load image resource '" + this.path + "'");
		--activeImageRequests;
		checkCanRun();
	}
	
	function onImageLoad() {
		--activeImageRequests;
		images.set(this.key,this.request);
		checkCanRun();
	}
	
	function importImage(key,path) {
		path = path.toLowerCase();
		
		for (var node = imageRequests.head; node; node = node.next) {
			var imageRequest = node.object;
			
			if (imageRequest.path === path) {
				return;
			}
		}
		
		var tag = document.createElement("img");
		var request = new ResourceRequest(key,path,tag);
		
		tag.onerror = onImageError.bind(request);
		tag.onload = onImageLoad.bind(request);
		tag.src = path;
		
		imageRequests.push_front(request);
		++activeImageRequests;
	}
	
	return {
		// Import Types
		TEXT: 0,
		JSON: 1,
		IMAGE: 2,
		MODULE: 3,
		
		// Util Functions
		title: title,
		log: log,
		warn: warn,
		error: error,
		class: _class,
		class_extends: _class_extends,
		
		// Util Classes
		Mask: Mask,
		Allocator: Allocator,
		Map: Map,
		Cache: Cache,
		Stack: Stack,
		NonRepeatingStack: NonRepeatingStack,
		Queue: Queue,
		List: List,
		Graph: Graph,
		
		// Create a module
		define: function(key,imports,closure) {
			if (!isRunning) {
				this.import(imports);
				
				var regex = /(?!.*[\\\/]).*(?=\.js)/i;
				var modules = [];
				
				for (var i = 0; i < imports.length; i += 3) {
					if (imports[i] === this.MODULE) {
						var _key = regex.exec(imports[i + 1])[0];
						
						if (_key) {
							modules.push(_key);
						}
						
						--i;
					}
				}
				
				graph.add(key,closure,modules);
			}
		},
		
		// Statically import resources
		import: function(imports) {
			if (!isRunning) {
				for (var i = 0; i < imports.length; i += 3) {
					switch(imports[i]) {
						case this.TEXT:
							importText(imports[i + 1],imports[i + 2]);
						break;
						
						case this.JSON:
							importJson(imports[i + 1],imports[i + 2]);
						break;
						
						case this.IMAGE:
							importImage(imports[i + 1],imports[i + 2]);
						break;
						
						case this.MODULE:
							importModule(imports[i + 1]);
							--i;
						break;
						
						default:
							error("Unsupported import type");
						break;
					}
				}
			}
		},
		
		// Get resource
		getText: function(key) {
			return text.get(key);
		},
		
		getJson: function(key) {
			return json.get(key);
		},
		
		getImage: function(key) {
			return images.get(key);
		},
		
		getModule: function(key) {
			return modules.get(key);
		},
		
		// Proxy function to set onload
		set onload(_onload) {
			onload = _onload;
		}
	};
	
}();