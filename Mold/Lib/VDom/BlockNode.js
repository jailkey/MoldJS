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
			this.pointerList = [];
			this.pointer = [];
			this.renderDom = [];
			this.children = [];
			this.removeList = [];
			this.isNegative = config.isNegative || false;
			this.filter = config.filter || [];
			this.hide = false;
			this.protoChild = false;
			this.bindModel = false;
			this._id = Mold.getId();


			var _oldRenderLength = 0;
			var that = this;

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
				
				var selected =  this.children[0] || Mold.mixin({}, this.protoChild);

				for(var name in selected){
					var child = this.findChild(name, this.renderDom[index]);

					if(!this.children[index]){
						this.children[index] = {};
					}

					this.children[index][name] = child;
				}
			}

			this.addListItem = function(index, data){
				var bind = false;

				if(!this.renderDom[index]){
					this.createRenderDom(index);
				}
				
				if(!this.children[index]){
					this.createChildren(index);
					//this.bindChildren(data, index);
				}

				if(index === 0){
					//try to bind if index is 0
					//this.bindChildren(data, index);
				}

				if(!Mold.isArray(this.children)){
					this.children = [this.children];
				}

				

				//Handle pointers
				if(this.children[0]['.']){
					var y = 0, childLen = this.children.length;
					this.children[index]['.'].setData(data);
				}else{
					for(var name in data){
						var selected = this.children[index][name];
						if(selected){
							if(selected.isPointer){
								selected.setData(data);
							}else{
								selected.setData(data[name]);
							}
						}
					}
				}
			}

			this.initChildren = function(){
				if(!this.renderDom[0]){
					this.createRenderDom(0);
				}
				
				if(!this.children[0]){
					this.createChildren(0);
				}
			}

			this.removeListItem = function(index){
				if(index === 0){
					if(this.children[0]){
						this.protoChild = this.children[0];
					}
				}
				this.children.splice(index, 1);
				this.renderDom.splice(index, 1);
			}

			this.removeListItems = function(from, len){
				if(from === 0){
					if(this.children[0]){
						this.protoChild = this.children[0];
					}
				}
				this.children.splice(from, len);
				this.renderDom.splice(from, len);
			}

			this.removeAllListItems = function(){
				this.removeListItems(0, this.renderDom.length)
			}

			this.bind = function(model){
				/*
				this.bindModel = true;

				var that = this;

				var _initDataIfNotSet = function(){
				
					if(!that.rawData){
						that.rawData = {}
						that.rawData[that.name] = [];
					}else{
						if(!Mold.isArray(that.rawData[that.name])){
							that.rawData[that.name] = [that.rawData[that.name]]
						}
					}

				}

				model.on("list.splice", function(e){
					_initDataIfNotSet();

					var args = [e.data.from, e.data.len].concat(e.data.data);
					Array.prototype.splice.apply(that.rawData[that.name], args);
					that.parent.setNodeData(that.name, Mold.mixin({}, that.rawData));
					that.renderParentDom();
				});

				model.on("list.item.add", function(e){
					_initDataIfNotSet();
					that.rawData[that.name][e.data.index] = e.data.value;
					var newData = Mold.mixin({}, that.rawData);
					that.parent.setNodeData(that.name, newData);
					that.renderParentDom();
				});

				model.on("list.item.remove", function(e){
					_initDataIfNotSet();
					that.rawData[that.name].splice(e.data.index, 1);
					that.parent.setNodeData(that.name, Mold.mixin({}, that.rawData))
					that.renderParentDom();
				});

				this.hasBinding = true;
				*/
			}
/*
			this.bindChildren = function(model, index){
				var undefined;
				if(index !== undefined){

					for(var name in this.children[index]){
						console.log("bind", name, model)
						if(
							model && model && model[name]
							&& !this.children[index][name].hasBinding
						){
							
							this.children[index][name].bind(model)
						}
					}
				}
			}*/

			this.onSetData = function(data){
				console.log("SET DATA", this._id)
				for(var filterName in this.filter){
					var filter = Mold.Lib.Filter.get(filterName);
					if(filter){
						this.data[this.name] = filter(this.data[this.name], this.filter[filterName]);
					}
				}

				if(this.isNegative && data[this.name]){
					
					if(!data[this.name].length){
						data[this.name] = "show";
					}else{
						data = false;
					}
		
				}else if(this.isNegative && (!data || !data[this.name])){
					this.hide = false;
					
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
						this.addListItem(i, data[i])
					}
					
					if(_oldData && _oldData[this.name] &&  (_oldData[this.name].length > data.length)){
						var dif =  _oldData[this.name].length - data.length;

						this.removeListItems(data.length, dif);
					}

				}else if((!data || !data[this.name]) && data[this.name] !== 0){
					
					this.removeAllListItems();

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
									if(selected){
										if(selected.hasParentValue){
											
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

				if(this.pointer[index]){
					var i = 0, len =  this.pointer[index].length;
					for(; i < len; i++){
						if(this.pointer[index][i].parentNode){
							this.pointer[index][i].parentNode.removeChild(this.pointer[index][i]);
						}
					}

					this.pointer[index] = null;
					if(!this.pointer){
						this.pointer = [];
					}
				}

			}


			this.render = function(){
				console.log("RENDER")
				//remove unused
				var i = 0, len = this.renderDom.length;
				var y = 0, removeLen = this.removeList.length;

				//remove end of pointerlist
				var y = len, pointerLen = this.pointer.length;
				for(; y < pointerLen; y++){
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
				_oldRenderLength = len;

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