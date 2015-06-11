"use strict";
Seed({
		name : "Mold.Lib.VDom.BlockNode",
		dna : "static"
	},
	function(){

		return function BlockNode(config){
			//°include Mold.Lib.VDom.ProtoNode
			
			this.type = BLOCK_NODE;
			this.domPointer = _doc.createDocumentFragment();
			this.pointer = [];
			this.renderDom = [];
			this.children = [];
			this.isNegative = config.isNegative || false;

			var _oldRenderLength = 0;

			this.createRenderDom = function(index){
				var i = 0, len = this.vdom.length;
				for(; i < len; i++){
					var selected = this.vdom[i];
					//if index 0 use pointer to vdom else create new
					
					if(index === 0){
						var newElement = selected;
					}else{
						var newElement = selected.clone();
					}
					
					if(!this.renderDom[index]){
						this.renderDom[index] = [];
					}

					this.renderDom[index].push(newElement)
				}
			}

			this.findChild = function(name, dom){
				var result = false;
				if(Mold.isArray(dom)){
					var i = 0, len = dom.length;

					for(; i < len; i++){
						var selectedName = dom[i].name;

						if(selectedName === name){
							return dom[i];
						}else{
							var subResult = this.findChild(name, dom[i].vdom);
							if(!subResult && dom[i].attributes){
								subResult = this.findChild(name, dom[i].attributes);
							}
							if(subResult){
								return subResult;
							}
						}
					}
				}else{

					for(var selected in dom){
						var selectedName = dom[selected].name;
						if(selectedName === name){
							return dom[selected];
						}else{
							var subResult = this.findChild(name, dom[selected].vdom);
							if(!subResult && dom[selected].attributes){
								subResult = this.findChild(name, dom[selected].attributes);
							}
							if(subResult){
								return subResult;
							}
						}
					}
				}
			
				return result; 
			}

			this.createChildren = function(index){
				var selected = this.children[0];
				for(var name in selected){
					var child = this.findChild(name, this.renderDom[index]);

					if(!this.children[index]){
						this.children[index] = {};
					}

					this.children[index][name] = child;
				}
			}

			this.onSetData = function(data){
				if(this.isNegative && data[this.name]){
					data = false;
				}else if(this.isNegative && (!data || !data[this.name])){
					
					if(!data){
						data = {};
					}else{
						data = Mold.mixin({}, data);
					}

					data[this.name] = "show";
				}

				_oldRenderLength = this.renderDom.length;
				//handle array
				if(Mold.isArray(data[this.name])){
					var data = data[this.name];
					if(!Mold.isArray(this.children)){
						this.children = [this.children];
					}

					var i = 0, len = data.length;
					for(; i < len; i++){

						if(!this.renderDom[i]){
							this.createRenderDom(i);
						}
						
						if(!this.children[i]){
							this.createChildren(i);
						}
						//Handle pointers
						if(this.children[0]['.']){
							var y = 0, childLen = this.children.length;
							this.children[i]['.'].setData(data[i]);
						}else{
							for(var name in data[i]){
								var selected = this.children[i][name];
							
								if(selected){
									if(selected.isPointer){
										selected.setData(data[i]);
									}else{
										selected.setData(data[i][name]);
									}
								}
							}
						}
					
					}
				
					if(_oldData.length > data.length){
						var dif =  _oldData.length - data.length;
						this.children.splice(data.length, dif);
						this.renderDom.splice(data.length, dif);
					}
				}else if((!data || !data[this.name]) && data[this.name] !== 0){

					this.renderDom = [];
					this.children = [];
				}else{

					//data from object
					if(Mold.isObject(data)){
						
						if(!this.renderDom[0]){
							this.createRenderDom(0);
						}
						
						if(!this.children[0]){
							this.createChildren(0);
						}
						if(this.children[0]){
							for(var name in this.children[0]){
						
								if(Mold.isArray(this.children[0][name])){
									var childLength = this.children[0][name].length, i = 0;
									for(; i < childLength; i++){
										var selected = this.children[0][name][i];
										if(selected){
											selected.setData(data[name]);
										}
									}
								}else{

									var selected = this.children[0][name];
									//console.log("this.children[0][name]", this.children[0][name], name)
									if(selected){
										if(selected.hasParentValue){
											console.log("set parent value")
											if(data[selected.parentName] && data[selected.parentName][selected.childName]){
												selected.setData(data[selected.parentName][selected.childName]);
											}
										}else{
											selected.setData(data[name]);
										}
									}
								}
							}


							//nested data
							for(var name in data[this.name]){
							
								if(Mold.isArray(this.children[0][name])){
									var childLength = this.children[0][name].length, i = 0;
									for(; i < childLength; i++){
										var selected = this.children[0][name][i];
										if(selected){
											if(selected.hasParentValue){
												selected.setData(data[selected.parentName][selected.childName]);
											}else{
												selected.setData(data[this.name]);
											}
										}
									}
								}else{
									var selected = this.children[0][name];

									if(selected){
										if(selected.hasParentValue){

											selected.setData(data[this.parentName][this.childName]);
										}else{
											selected.setData(data[this.name]);
										}
									}
								}
							}

							if(!Mold.is(data[this.name]) || data[this.name] === false){
						
								this.renderDom = [];
								this.children = [];
							}
						}
					}
				}

			}

			this.clone = function(){
				var newNode =  new BlockNode({
					name : this.name,
					data : this.data
				});

				for(var name in this.vdom){
					newNode.addNode(this.vdom[name].clone())
				}

				return newNode;
			}

			this.removePointer = function(index){
				var i = 0, len =  this.pointer[index].length;

				for(; i < len; i++){
					if(this.pointer[index][i].parentNode){
						this.pointer[index][i].parentNode.removeChild(this.pointer[index][i]);
					}

				}
				this.pointer[index] = null;
			}

			this.render = function(){
			
				//remove unused
				var i = 0, len = this.renderDom.length;
				var y = len;

				for(; y < _oldRenderLength; y++){
					this.removePointer(y);
				}

				//create new
				for(; i < len; i++){
					var selected = this.renderDom[i];
					var y = 0, subLen = selected.length;
					this.pointer[i] = [];
					for(; y < subLen; y++){
						var item = selected[y].render();
						this.domPointer.appendChild(item);
						this.pointer[i][y] = item;
					}
				}

				this.state = STATE_NO_CHANGES;
				return this.domPointer;
			}


			this.renderString = function(){

				var i = 0, len = this.renderDom.length;
				var output = "";

				for(; i < len; i++){
					var selected = this.renderDom[i];
					var y = 0, subLen = selected.length;
					for(; y < subLen; y++){
						output += selected[y].renderString();
					}
				}
				return output;
			}
		}

	}
)