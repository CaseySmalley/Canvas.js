resource.define(
	"Sgl",
	
	[
		
	],
	
	function() {
		
		"use strict";
		
		resource.title("Sgl.js V0.8");
		
		// Constants
		var SAMPLER_2D = 35678;
		
		var INT = 5124;
		var INT_VEC2 = 5124;
		var INT_VEC3 = 5124;
		var INT_VEC4 = 5124;
		
		var FLOAT = 5126;
		var FLOAT_VEC2 = 35664;
		var FLOAT_VEC3 = 35665;
		var FLOAT_VEC4 = 35666;
		var FLOAT_MAT2 = 35674;
		var FLOAT_MAT3 = 35675;
		var FLOAT_MAT4 = 35676;
		
		var typeSize = new resource.Map();
		
		typeSize.set(INT,1);
		typeSize.set(INT_VEC2,2);
		typeSize.set(INT_VEC3,3);
		typeSize.set(INT_VEC4,4);
		
		typeSize.set(FLOAT,1);
		typeSize.set(FLOAT_VEC2,2);
		typeSize.set(FLOAT_VEC3,3);
		typeSize.set(FLOAT_VEC4,4);
		typeSize.set(FLOAT_MAT2,4);
		typeSize.set(FLOAT_MAT3,9);
		typeSize.set(FLOAT_MAT4,16);
		
		// Helper functions
		function createShader(gl,type,code) {
			var shader = gl.createShader(type);
			
			gl.shaderSource(shader,code);
			gl.compileShader(shader);
			
			if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
				var log = gl.getShaderInfoLog(shader);
				
				gl.deleteShader(shader);
				resource.error("Shader Compilation Error\n" + log);
			}
			
			return shader;
		}
		
		var getPixels = function() {
			
			var canvas = null;
			var ctx = null;
			
			return function(image) {
				if (!canvas) {
					canvas = document.createElement("canvas");
					ctx = canvas.getContext("2d");
				}
				
				canvas.width = image.width;
				canvas.height = image.height;
				
				ctx.drawImage(image,0,0);
				
				return new Uint8Array(ctx.getImageData(0,0,image.width,image.height).data);
			}
			
		}();
		
		// Classes
		var Attribute = resource.class(
			function(name,type,location) {
				this.name = name;
				this.size = typeSize.get(type);
				this.sizeInBytes = this.size << 2;
				this.location = location;
			},{
				
			}
		);
		
		var Uniform = resource.class(
			function(type,location,key,stack) {
				this.type = type;
				this.location = location;
				this.key = key;
				this.stack = stack;
			},{
				
			}
		);
		
		var ValueUniform = resource.class_extends(Uniform,
			function(type,location,key,stack) {
				this._value_ = 0.0;
			},{
				set value(value) {
					this.stack.push(this.key,this);
					this._value_ = value;
				},
				
				get value() {
					return this._value_;
				}
			}
		);
		
		var Vec2Uniform = resource.class_extends(Uniform,
			function(type,location,key,stack) {
				this._x_ = 0.0;
				this._y_ = 0.0;
			},{
				set: function(x,y) {
					this.stack.push(this.key,this);
					this._x_ = x;
					this._y_ = y;
				},
				
				set x(value) {
					this.stack.push(this.key,this);
					this._x_ = value;
				},
				
				set y(value) {
					this.stack.push(this.key,this);
					this._y_ = value;
				},
				
				get x() {
					return this._x_;
				},
				
				get y() {
					return this._y_;
				}
			}
		);
		
		var Vec3Uniform = resource.class_extends(Uniform,
			function(type,location,key,stack) {
				this._x_ = 0.0;
				this._y_ = 0.0;
				this._z_ = 0.0;
			},{
				set: function(x,y,z) {
					this.stack.push(this.key,this);
					this._x_ = x;
					this._y_ = y;
					this._z_ = z;
				},
				
				set x(value) {
					this.stack.push(this.key,this);
					this._x_ = value;
				},
				
				set y(value) {
					this.stack.push(this.key,this);
					this._y_ = value;
				},
				
				set z(value) {
					this.stack.push(this.key,this);
					this._z_ = value;
				},
				
				get x() {
					return this._x_;
				},
				
				get y() {
					return this._y_;
				},
				
				get z() {
					return this._z_;
				}
			}
		);
		
		var Vec4Uniform = resource.class_extends(Uniform,
			function(type,location,key,stack) {
				this._x_ = 0.0;
				this._y_ = 0.0;
				this._z_ = 0.0;
				this._w_ = 0.0;
			},{
				set: function(x,y,z,w) {
					this.stack.push(this.key,this);
					this._x_ = x
					this._y_ = y;
					this._z_ = z;
					this._w_ = w;
				},
				
				set x(value) {
					this.stack.push(this.key,this);
					this._x_ = value;
				},
				
				set y(value) {
					this.stack.push(this.key,this);
					this._y_ = value;
				},
				
				set z(value) {
					this.stack.push(this.key,this);
					this._z_ = value;
				},
				
				set w(value) {
					this.stack.push(this.key,this);
					this._w_ = value;
				},
				
				get x() {
					return this._x_;
				},
				
				get y() {
					return this._y_;
				},
				
				get z() {
					return this._z_;
				},
				
				get w() {
					return this._w_;
				}
			}
		);
		
		var Mat2Uniform = resource.class_extends(Uniform,
			function(type,location,key,stack) {
				this._data_ = new Float32Array(4);
			},{
				set: function(data) {
					this.stack.push(this.key,this);
					
					var _data_ = this._data_;
					
					_data_[0] = data[0];
					_data_[1] = data[1];
					_data_[2] = data[2];
					_data_[3] = data[3];
				},
				
				set 0(value) {
					this.stack.push(this.key,this);
					this._data_[0] = value;
				},
				
				set 1(value) {
					this.stack.push(this.key,this);
					this._data_[1] = value;
				},
				
				set 2(value) {
					this.stack.push(this.key,this);
					this._data_[2] = value;
				},
				
				set 3(value) {
					this.stack.push(this.key,this);
					this._data_[3] = value;
				},
				
				get 0() {
					return this._data_[0];
				},
				
				get 1() {
					return this._data_[1];
				},
				
				get 2() {
					return this._data_[2];
				},
				
				get 3() {
					return this._data_[3];
				}
			}
		);
		
		var Mat3Uniform = resource.class_extends(Uniform,
			function(type,location,key,stack) {
				this._data_ = new Float32Array(9);
			},{
				set: function(data) {
					this.stack.push(this.key,this);
					
					var _data_ = this._data_;
					
					_data_[0] = data[0];
					_data_[1] = data[1];
					_data_[2] = data[2];
					_data_[3] = data[3];
					_data_[4] = data[4];
					_data_[5] = data[5];
					_data_[6] = data[6];
					_data_[7] = data[7];
					_data_[8] = data[8];
				},
				
				set 0(value) {
					this.stack.push(this.key,this);
					this._data_[0] = value;
				},
				
				set 1(value) {
					this.stack.push(this.key,this);
					this._data_[1] = value;
				},
				
				set 2(value) {
					this.stack.push(this.key,this);
					this._data_[2] = value;
				},
				
				set 3(value) {
					this.stack.push(this.key,this);
					this._data_[3] = value;
				},
				
				set 4(value) {
					this.stack.push(this.key,this);
					this._data_[4] = value;
				},
				
				set 5(value) {
					this.stack.push(this.key,this);
					this._data_[5] = value;
				},
				
				set 6(value) {
					this.stack.push(this.key,this);
					this._data_[6] = value;
				},
				
				set 7(value) {
					this.stack.push(this.key,this);
					this._data_[7] = value;
				},
				
				set 8(value) {
					this.stack.push(this.key,this);
					this._data_[8] = value;
				},
				
				get 0() {
					return this._data_[0];
				},
				
				get 1() {
					return this._data_[1];
				},
				
				get 2() {
					return this._data_[2];
				},
				
				get 3() {
					return this._data_[3];
				},
				
				get 3() {
					return this._data_[3];
				},
				
				get 4() {
					return this._data_[4];
				},
				
				get 5() {
					return this._data_[5];
				},
				
				get 6() {
					return this._data_[6];
				},
				
				get 7() {
					return this._data_[7];
				},
				
				get 8() {
					return this._data_[8];
				}
			}
		);
		
		var Mat4Uniform = resource.class_extends(Uniform,
			function(type,location,key,stack) {
				this._data_ = new Float32Array(16);
			},{
				set: function(data) {
					this.stack.push(this.key,this);
					
					var _data_ = this._data_;
					
					_data_[0] = data[0];
					_data_[1] = data[1];
					_data_[2] = data[2];
					_data_[3] = data[3];
					_data_[4] = data[4];
					_data_[5] = data[5];
					_data_[6] = data[6];
					_data_[7] = data[7];
					_data_[8] = data[8];
					_data_[9] = data[9];
					_data_[10] = data[10];
					_data_[11] = data[11];
					_data_[12] = data[12];
					_data_[13] = data[13];
					_data_[14] = data[14];
					_data_[15] = data[15];
				},
				
				set 0(value) {
					this.stack.push(this.key,this);
					this._data_[0] = value;
				},
				
				set 1(value) {
					this.stack.push(this.key,this);
					this._data_[1] = value;
				},
				
				set 2(value) {
					this.stack.push(this.key,this);
					this._data_[2] = value;
				},
				
				set 3(value) {
					this.stack.push(this.key,this);
					this._data_[3] = value;
				},
				
				set 4(value) {
					this.stack.push(this.key,this);
					this._data_[4] = value;
				},
				
				set 5(value) {
					this.stack.push(this.key,this);
					this._data_[5] = value;
				},
				
				set 6(value) {
					this.stack.push(this.key,this);
					this._data_[6] = value;
				},
				
				set 7(value) {
					this.stack.push(this.key,this);
					this._data_[7] = value;
				},
				
				set 8(value) {
					this.stack.push(this.key,this);
					this._data_[8] = value;
				},
				
				set 9(value) {
					this.stack.push(this.key,this);
					this._data_[9] = value;
				},
				
				set 10(value) {
					this.stack.push(this.key,this);
					this._data_[10] = value;
				},
				
				set 11(value) {
					this.stack.push(this.key,this);
					this._data_[11] = value;
				},
				
				set 12(value) {
					this.stack.push(this.key,this);
					this._data_[12] = value;
				},
				
				set 13(value) {
					this.stack.push(this.key,this);
					this._data_[13] = value;
				},
				
				set 14(value) {
					this.stack.push(this.key,this);
					this._data_[14] = value;
				},
				
				set 15(value) {
					this.stack.push(this.key,this);
					this._data_[15] = value;
				},
				
				get 0() {
					return this._data_[0];
				},
				
				get 1() {
					return this._data_[1];
				},
				
				get 2() {
					return this._data_[2];
				},
				
				get 3() {
					return this._data_[3];
				},
				
				get 3() {
					return this._data_[3];
				},
				
				get 4() {
					return this._data_[4];
				},
				
				get 5() {
					return this._data_[5];
				},
				
				get 6() {
					return this._data_[6];
				},
				
				get 7() {
					return this._data_[7];
				},
				
				get 8() {
					return this._data_[8];
				},
				
				get 9() {
					return this._data_[9];
				},
				
				get 10() {
					return this._data_[10];
				},
				
				get 11() {
					return this._data_[11];
				},
				
				get 12() {
					return this._data_[12];
				},
				
				get 13() {
					return this._data_[13];
				},
				
				get 14() {
					return this._data_[14];
				},
				
				get 15() {
					return this._data_[15];
				}
			}
		);
		
		var Program = resource.class(
			function(sgl,vertexCode,fragmentCode) {
				this.sgl = sgl;
				this.gl = sgl.gl;
				this.currentBuffer = null;
				this.currentBufferVertexCount = 0;
				this.vertexSize = 0;
				this.vertexSizeInBytes = 0;
				this.attributes = [];
				this.uniformStack = new resource.NonRepeatingStack();
				
				var gl = this.gl;
				
				// Build program
				var vertexShader = createShader(gl,gl.VERTEX_SHADER,vertexCode);
				var fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentCode);
				
				this.program = gl.createProgram();
				
				gl.attachShader(this.program,vertexShader);
				gl.attachShader(this.program,fragmentShader);
				gl.linkProgram(this.program);
				gl.deleteShader(vertexShader);
				gl.deleteShader(fragmentShader);
				
				if (!gl.getProgramParameter(this.program,gl.LINK_STATUS)) {
					var log = gl.getProgramInfoLog(this.program);
					
					gl.deleteProgram(this.program);
					resource.error("Program linking error\n" + log);
				}
				
				// Collect attributes
				var attributeCount = gl.getProgramParameter(this.program,gl.ACTIVE_ATTRIBUTES);
				var attributes = this.attributes;
				
				for (var i = 0; i < attributeCount; ++i) {
					var attribute = gl.getActiveAttrib(this.program,i);
					
					attributes.push(
						new Attribute(
							attribute.name,
							attribute.type,
							gl.getAttribLocation(this.program,attribute.name)
						)
					);
					
					this.vertexSize += typeSize.get(attribute.type);
				}
				
				this.vertexSizeInBytes = this.vertexSize << 2;
				
				// Collect uniforms
				var uniformStack = this.uniformStack;
				var uniformCount = gl.getProgramParameter(this.program,gl.ACTIVE_UNIFORMS);
				
				for (var i = 0; i < uniformCount; ++i) {
					var uniform = gl.getActiveUniform(this.program,i);
					var location = gl.getUniformLocation(this.program,uniform.name);
					var proxy = null;
					
					switch(uniform.type) {
						case SAMPLER_2D: proxy = new ValueUniform(SAMPLER_2D,location,uniform.name,uniformStack); break;
						
						case INT: proxy = new ValueUniform(INT,location,uniform.name,uniformStack); break;
						case INT_VEC2: proxy = new Vec2Uniform(INT_VEC2,location,uniform.name,uniformStack); break;
						case INT_VEC3: proxy = new Vec3Uniform(INT_VEC3,location,uniform.name,uniformStack); break;
						case INT_VEC4: proxy = new Vec4Uniform(INT_VEC4,location,uniform.name,uniformStack); break;
						
						case FLOAT: proxy = new ValueUniform(FLOAT,location,uniform.name,uniformStack); break;
						case FLOAT_VEC2: proxy = new Vec2Uniform(FLOAT_VEC2,location,uniform.name,uniformStack); break;
						case FLOAT_VEC3: proxy = new Vec3Uniform(FLOAT_VEC3,location,uniform.name,uniformStack); break;
						case FLOAT_VEC4: proxy = new Vec4Uniform(FLOAT_VEC4,location,uniform.name,uniformStack); break;
						case FLOAT_MAT2: proxy = new Mat2Uniform(FLOAT_MAT2,location,uniform.name,uniformStack); break;
						case FLOAT_MAT3: proxy = new Mat3Uniform(FLOAT_MAT3,location,uniform.name,uniformStack); break;
						case FLOAT_MAT4: proxy = new Mat4Uniform(FLOAT_MAT4,location,uniform.name,uniformStack); break;
					}
					
					this[uniform.name] = proxy;
				}
			},{
				release: function() {
					var gl = this.gl;
					var program = this.program;
					
					gl.deleteProgram(program);
				},
				
				bind: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					
					if (sgl.currentProgram !== this) {
						sgl.currentProgram = this;
						gl.useProgram(this.program);
					}
				},
				
				unbind: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					
					if (sgl.currentProgram === this) {
						sgl.currentProgram = null;
						gl.useProgram(null);
					}
				},
				
				bindBuffer: function(buffer) {
					var sgl = this.sgl;
					var gl = this.gl;
					var attributes = this.attributes;
					
					if (this.currentBuffer !== buffer) {
						this.currentBuffer = buffer;
						
						buffer.bind();
						
						var vertexSizeInBytes = this.vertexSizeInBytes;
						var offset = 0;
						
						for (var i = 0; i < attributes.length; ++i) {
							var attribute = attributes[i];
							
							gl.vertexAttribPointer(
								attribute.location,
								attribute.size,
								gl.FLOAT,
								false,
								vertexSizeInBytes,
								offset
							);
							
							offset += attribute.sizeInBytes;
						}
						
						while(sgl.currentVertexArray < attributes.length) {
							gl.enableVertexAttribArray(sgl.currentVertexArray++);
						}
						
						while(sgl.currentVertexArray > attributes.length) {
							gl.enableVertexAttribArray(--sgl.currentVertexArray);
						}
						
						this.currentBufferVertexCount = (buffer.data.length / this.vertexSize) | 0;
					}
				},
				
				unbindBuffer: function() {
					
				},
				
				uploadUniforms: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					var uniformStack = this.uniformStack;
					var proxy = null;
					var currentProgram = sgl.currentProgram;
					
					if (currentProgram !== this) {
						this.bind();
					}
					
					while(proxy = uniformStack.pop()) {
						switch(proxy.type) {
							case SAMPLER_2D: gl.uniform1i(proxy.location,proxy._value_); break;
							
							case INT: gl.uniform1i(proxy.location,proxy._value_); break;
							case INT_VEC2: gl.uniform2i(proxy.location,proxy._x_,proxy._y_); break;
							case INT_VEC3: gl.uniform3i(proxy.location,proxy._x_,proxy._y_,proxy._z_); break;
							case INT_VEC4: gl.uniform4i(proxy.location,proxy._x_,proxy._y_,proxy._z_,proxy._w_); break;
							
							case FLOAT: gl.uniform1f(proxy.location,proxy._value_); break;
							case FLOAT_VEC2: gl.uniform2f(proxy.location,proxy._x_,proxy._y_); break;
							case FLOAT_VEC3: gl.uniform3f(proxy.location,proxy._x_,proxy._y_,proxy._z_); break;
							case FLOAT_VEC4: gl.uniform4f(proxy.location,proxy._x_,proxy._y_,proxy._z_,proxy._w_); break;
							case FLOAT_MAT2: gl.uniformMatrix2fv(proxy.location,false,proxy._data_); break;
							case FLOAT_MAT3: gl.uniformMatrix3fv(proxy.location,false,proxy._data_); break;
							case FLOAT_MAT4: gl.uniformMatrix4fv(proxy.location,false,proxy._data_); break;
						}
					}
					
					if (currentProgram && currentProgram !== this) {
						currentProgram.bind();
					}
				},
				
				draw: function(type,start,count) {
					var sgl = this.sgl;
					var gl = this.gl;
					
					if (sgl.currentProgram !== this) {
						this.bind();
					}
					
					if (sgl.currentBuffer !== this.currentBuffer) {
						this.bindBuffer(sgl.currentBuffer);
					}
					
					if (this.uniformStack.length) {
						this.uploadUniforms();
					}
					
					gl.drawArrays(
						type,
						start || 0,
						count || this.currentBufferVertexCount
					);
				}
			}
		);
		
		var Buffer = resource.class(
			function(sgl,data) {
				this.sgl = sgl;
				this.gl = sgl.gl;
				this.data = new Float32Array(data);
				this.length = this.data.length;
				
				var gl = sgl.gl;
				
				this.buffer = gl.createBuffer();
				
				gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
				gl.bufferData(gl.ARRAY_BUFFER,this.data,gl.DYNAMIC_DRAW);
				gl.bindBuffer(gl.ARRAY_BUFFER,null);
			},{
				release: function() {
					var gl = this.gl;
					var buffer = this.buffer;
					
					gl.deleteBuffer(buffer);
				},
				
				bind: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					var buffer = this.buffer;
					
					if (sgl.currentBuffer !== this) {
						sgl.currentBuffer = this;
						gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
					}
				},
				
				unbind: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					
					if (sgl.currentBuffer === this) {
						sgl.currentBuffer = null;
						gl.bindBuffer(this.ARRAY_BUFFR,null);
					}
				},
				
				set: function(index,value) {
					var data = this.data;
					
					if (index > -1 && index < data.length) {
						data[index] = value;
					}
				},
				
				upload: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					var currentBuffer = sgl.currentBuffer;
					
					if (currentBuffer !== this) {
						this.bind();
					}
					
					gl.bufferSubData(gl.ARRAY_BUFFER,0,this.data);
					
					if (currentBuffer && currentBuffer !== this) {
						currentBuffer.bind();
					}
				},
				
				reallocate: function(data) {
					var sgl = this.sgl;
					var gl = this.gl;
					var currentBuffer = sgl.currentBuffer;
					
					if (currentBuffer !== this) {
						this.bind();
					}
					
					gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
					
					this.data = data;
					this.length = this.data.length;
					
					if (currentBuffer && currentBuffer !== this) {
						currentBuffer.bind();
					}
				}
			}
		);
		
		var Texture = resource.class(
			function(sgl,image,width,height) {
				this.sgl = sgl;
				this.gl = sgl.gl;
				this.image = image;
				this.width = width;
				this.height = height;
				this.pixels = null;
				this.index = -1;
				
				var gl = this.gl;
				var texture = this.texture = gl.createTexture();
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D,texture);
				gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
				
				if (this.width && this.height) {
					// Data texture
					if (this.image) {
						this.pixels = new Uint8Array(this.image);
					} else {
						this.pixels = new Uint8Array((this.width * this.height) << 2);
					}
					
					gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
					gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
					gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this.width,this.height,0,gl.RGBA,gl.UNSIGNED_BYTE,this.pixels);
				} else {
					// Image texture
					this.width = this.image.width;
					this.height = this.image.height;
					this.pixels = getPixels(this.image);
					
					gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
					gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.image);
				}
				
				gl.bindTexture(gl.TEXTURE_2D,null);
			},{
				release: function() {
					this.gl.deleteTexture(this.texture);
				},
				
				bind: function(index) {
					var sgl = this.sgl;
					var gl = this.gl;
					var texture = this.texture;
					var currentTexture = sgl.currentTextures.get(index);
					
					if (currentTexture !== this) {
						sgl.currentTextures.set(this.index = index,this);
						
						if (currentTexture) {
							currentTexture.index = -1;
						}
						
						gl.activeTexture(gl.TEXTURE0 + (index || 0));
						gl.bindTexture(gl.TEXTURE_2D,texture);
					}
				},
				
				unbind: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					var texture = this.texture;
					
					if (sgl.currentTextures.get(this.index) === this) {
						sgl.currentTextures.set(this.index,null);
					}
					
					this.index = -1;
				},
				
				upload: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					var texture = this.texture;
					var currentTexture = sgl.currentTextures.get(this.index);
					
					if (currentTexture !== this) {
						this.bind(0);
					}
					
					gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,this.width,this.height,gl.RGBA,gl.UNSIGNED_BYTE,this.pixels);
					
					if (currentTexture && currentTexture !== this) {
						currentTexture.bind();
					}
				},
			}
		);
		
		var Framebuffer = resource.class(
			function(sgl,width,height) {
				this.sgl = sgl;
				this.gl = sgl.gl;
				
				var gl = this.gl;
				var framebuffer = this.framebuffer = gl.createFramebuffer();
				var colourTexture = this.colourTexture = new Texture(sgl,null,width,height);
				var depthBuffer = this.depthBuffer = gl.createRenderbuffer();
				
				gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
				gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,colourTexture.texture,0);
				gl.bindRenderbuffer(gl.RENDERBUFFER,depthBuffer);
				gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,width,height);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthBuffer);
				
				if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
					resource.error("Incomplete framebuffer");
				}
				
				gl.bindFramebuffer(gl.FRAMEBUFFER,null);
				gl.bindTexture(gl.TEXTURE_2D,null);
				gl.bindRenderbuffer(gl.RENDERBUFFER,null);
			},{
				release: function() {
					var gl = this.gl;
					
					gl.deleteFramebuffer(this.framebuffer);
					gl.deleteTexture(this.colourTexture.texture);
					gl.deleteRenderbuffer(this.depthBuffer);
				},
				
				bind: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					var framebuffer = this.framebuffer;
					
					if (sgl.currentFramebuffer !== this) {
						sgl.currentFramebuffer = this;
						gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
					}
				},
				
				unbind: function() {
					var sgl = this.sgl;
					var gl = this.gl;
					
					if (sgl.currentFramebuffer === this) {
						sgl.currentFramebuffer = null;
						gl.bindFramebuffer(gl.FRAMEBUFFER,null);
					}
				}
			}
		);
		
		return resource.class(
			function(gl) {
				this.gl = gl;
				this.clearRed = 0.0;
				this.clearGreen = 0.0;
				this.clearBlue = 0.0;
				this.clearDepth = 1.0;
				this.currentProgram = null;
				this.currentBuffer = null;
				this.currentVertexArray = 0;
				this.currentTextures = new resource.Map();
				this.currentFramebuffer = null;
				this.programCache = new resource.Cache();
				this.bufferCache = new resource.Cache();
				this.textureCache = new resource.Cache();
				this.framebufferCache = new resource.Cache();
			},{
				release: function() {
					this.programCache.clear();
					this.bufferCache.clear();
					this.textureCache.clear();
					this.framebufferCache.clear();
				},
				
				clearColour: function(r,g,b) {
					var gl = this.gl;
					
					if (r !== this.clearRed
					||	g !== this.clearGreen
					||	b !== this.clearBlue)
					{
						this.clearRed = r;
						this.clearGreen = g;
						this.clearBlue = b;
						
						gl.clearColor(r,g,b,1.0);
					}
					
					gl.clear(gl.COLOR_BUFFER_BIT);
				},
				
				clearDepth: function(depth) {
					var gl = this.gl;
					
					if (depth !== this.clearDepth) {
						this.clearDepth = depth;
						
						gl.clearDepth(this.clearDepth);
					}
				},
				
				createProgram: function(vertexCode,fragmentCode) {
					return this.programCache.set(null,new Program(this,vertexCode,fragmentCode));
				},
				
				createBuffer: function(data) {
					return this.bufferCache.set(null,new Buffer(this,data));
				},
				
				createTexture: function(image,width,height) {
					return this.textureCache.set(null,new Texture(this,image,width,height));
				},
				
				createFramebuffer: function(width,height) {
					return this.framebufferCache.set(null,new Framebuffer(this,width,height));
				}
			}
		);
	}
);