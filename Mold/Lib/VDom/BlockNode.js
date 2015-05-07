Seed({
		name : "Mold.Lib.VDom.BlockNode",
		dna : "static"
	},
	function(){

		var STATE_RENDER = "render";
		var STATE_NEW = "new";

		var _doc = document;

		var _createBlockItem = function(block){
			var protoDom = {};

			if(Mold.isArray(block.protoDom)){
				var item = block.protoDom[0];
			}else{
				var item = block.protoDom;
			}

			for(var name in item){
				var entry = item[name];
				var clone = entry.clone();
				protoDom[clone.name] = clone;
			}

		
			return protoDom;
		}

		window.gesamtzeit = 0;

		return  function BlockNode(config){

			var _that = this;

			config = config || {};

			this.nodeType = 2;
			this.name = config.name || Mold.getId();
			this.protoDom = config.protoDom;
			this.content = config.content;
			this.children = config.children || {};
			this.state = STATE_RENDER;
			this.pointer = [];
			this.data = {};
			this.parent = config.parent || false;

			var _initChildrenFromProtoDom = function(protoDom, output){

				var output = output || {};
				for(var childName in protoDom){
					var child = protoDom[childName];
					if(child.nodeType === 1 || child.nodeType === 2 || child.nodeType === 3){
						output[child.name] = child;
					}else{
						if(Mold.isArray(child.children)){
							var i = 0, len = child.children.length;
							for(; i < len; i++){
								_initChildrenFromProtoDom(child.children[i], output);
							}
						}else{
							_initChildrenFromProtoDom(child.children, output);
						}
						if(child.attributes){
							_initChildrenFromProtoDom(child.attributes, output);
						}

					}
				};
				return output;
			}
		
			_that.children = _initChildrenFromProtoDom(this.protoDom);
		
			this.addPointer = function(pointers, index){
				var pointerList = [];
				Mold.each(pointers, function(pointer){
					pointerList.push(pointer);
				})
				if(index){
					this.pointer[index] = pointerList;
				}else{
					this.pointer.push(pointerList);
				}
			}

			this.clone = function(){

				var protoClone = {};

				for(var name in _that.protoDom){
					var entry = _that.protoDom[name];
					var cloneEntry = entry.clone();
					protoClone[cloneEntry.name] = cloneEntry;
				}

				var clondeNode =  new Mold.Lib.VDom.BlockNode({
					name : _that.name,
					content : _that.content,
					type : _that.nodeType,
					protoDom : protoClone,
				});
			

				clondeNode.children = _initChildrenFromProtoDom(protoClone);
			

				return clondeNode;
			}


			this.setData = function(data){
				var start = performance.now();
				_that.data = data;
				if(Mold.isArray(_that.data)){
					if(!Mold.isArray(_that.children)){
			
						_that.children = [_that.children];
						_that.protoDom = [_that.protoDom];
					}

				
					var index = 0, len = _that.data.length;
					for(; index < len; index++){
						
						var value = _that.data[index];

						if(!_that.children[index]){
							var protoDom =  _createBlockItem(_that);
							_that.protoDom[index] = protoDom;
							_that.children[index] = _initChildrenFromProtoDom(protoDom);
							
						}
					
						for(var name in _that.data[index]){
							if(Mold.is(_that.children[index][name])){
								_that.children[index][name].setData(_that.data[index][name]);
							}
						}
					}

				}else if(Mold.isObject(_that.data)){
					for(var name in _that.data){
						var value = _that.data[name];
						if(_that.children[name]){
							_that.children[name].setData(value);
						}
					};
				}else{
					throw new Error("BlockNodes can only handle object and array data!");
				}
				this.state = STATE_RENDER;
				window.gesamtzeit += performance.now() - start;
			}

		
			this.render = function(){
				var output = _doc.createDocumentFragment();

				if(Mold.isArray(_that.protoDom)){
					var i = 0, len = _that.protoDom.length;

					for(; i < len; i++){
						var item = _that.protoDom[i];

						for(var childName in item){
							var child = item[childName];
							output.appendChild(child.render());
						};
					}

				}else{

					for(var childName in _that.protoDom){
						var child = _that.protoDom[childName];
						output.appendChild(child.render());
					}
				}

				return  output;
			}

			this.renderString = function(){
				var output = "";

				if(Mold.isArray(_that.protoDom)){
					var i = 0, len = _that.protoDom.length;

					for(; i < len; i++){
						var item = _that.protoDom[i];

						for(var childName in item){
							var child = item[childName];
							output += child.renderString();
						};
					}

				}else{

					for(var childName in _that.protoDom){
						var child = _that.protoDom[childName];
						output += child.renderString();
					}
				}

				return  output;
			}

			this.update = function(){

				if(Mold.isArray(_that.protoDom)){
					var i = 0, len = _that.protoDom.length;
					for(; i < len; i++){
						var item = _that.protoDom[i];

						for(var childName in item){
							var child = item[childName];
							child.update();
						};
					}

				}else{

					for(var childName in _that.protoDom){
						var child = _that.protoDom[childName];
						child.update();
					}
				}
			}

		}
	}
)