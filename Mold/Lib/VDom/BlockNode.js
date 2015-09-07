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
			this.changedItems = [];
			this._id = Mold.getId();
			this.referenceNode = _doc.createTextNode("");

			var _oldRenderLength = 0;
			var _oldDataLength = 0;
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

			this.findChild = function(name, dom, all){
				var result = (all) ? [] : false;

				if(Mold.isArray(dom)){
					var i = 0, len = dom.length;

					for(; i < len; i++){
						var selectedName = dom[i].name;

						if(selectedName === name){
							if(all){
								result.push(dom[i]);
							}else{
								return dom[i];
							}
						}else{
							var subResult = this.findChild(name, dom[i].vdom, all);

							if((!subResult || all)  && dom[i].attributes){
								subResult = (all) ? subResult.concat(this.findChild(name, dom[i].attributes, all)) : this.findChild(name, dom[i].attributes, all);
							}
							if(subResult){
								if(all){
									result = result.concat(subResult)
								}else{
									return subResult;
								}
							}
						}
					}
				}else{

					for(var selected in dom){
						var selectedName = dom[selected].name;
						if(selectedName === name){
							if(all){
								result.push(dom[selected])
							}else{
								return dom[selected];
							}
						}else{

							var subResult = this.findChild(name, dom[selected].vdom, all);
							if((!subResult || all) && dom[selected].attributes){
								subResult = (all) ? subResult.concat(this.findChild(name, dom[selected].attributes, all)) : this.findChild(name, dom[selected].attributes, all);
							}
							if(subResult){
								if(all){
									result = result.concat(subResult)
								}else{
									return subResult;
								}
							}
						}
					}
				}
			
				return result; 
			}

			this.createChildren = function(index){
			
				var selected =  this.children[0] || Mold.mixin({}, this.protoChild);
			
				for(var name in selected){
					if(!this.children[index]){
						this.children[index] = {};
					}

					//create an array if there is more then one child with the same name
					if(Mold.isArray(selected[name])){
						var child = this.findChild(name, this.renderDom[index], true);
						this.children[index][name] = child;
					}else{
						var child = this.findChild(name, this.renderDom[index]);
						this.children[index][name] = child;
					}
				}
			}

			this.addListItem = function(index, data){

				//if negativ block, remove all items
				if(this.isNegative && this.renderDom.length){
					this.changedItems = [];
					var from = 0, len = this.renderDom.length;
					this.children.splice(from, len);
					this.renderDom.splice(from, len);
					var i = from;
					var removeLen = from + len;
					for(; i < removeLen; i++){
						this.removeList.push(i);
					}
					return;
				}

				
				var bind = false;

				if(!this.renderDom[index]){
					this.createRenderDom(index);
				}
				
				if(!this.children[index]){
					this.createChildren(index);
					//this.bindChildren(data, index);
				}

				if(index === 0){
					//if index is 0 find all children
					for(var name in this.children[0]){
						var child = this.findChild(name, this.renderDom[index], true);
						if(child.length > 1){
							this.children[index][name] = child;
						}else{
							this.children[index][name] = child[0]
						}
					}
					//this.children[index][name] = child;
					
				}

				if(!Mold.isArray(this.children)){
					this.children = [this.children];
				}

				var specialData = {
					'.' : data,
					'+' : index
				}
				
				this.setListItems(data, index);
				this.setListItems(specialData, index);

				this.changedItems.push(index);

			}

			this.setListItems = function(data, index){
				for(var name in data){
					var selected = (that.children[index]) ? that.children[index][name] : false;
					if(selected){
						if(Mold.isArray(selected)){
							var i = 0, len = selected.length;
							for(; i < len; i++){
								that.setListItemValue(selected[i], index, data, name);
							}
						}else{
							that.setListItemValue(selected, index, data, name);
						}
					}
					
				}
			}

			this.setListItemValue = function(selected, index, data, name){

				if(selected){
					//Handle pointers
					if(selected.isPointer){
						selected.setData(data);
					}else if(selected.hasIndexValue){
						selected.setData(index);
					}else{
						selected.setData(data[name]);
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
				this.removeList.push(index);
				if(!this.isNegative && !this.children.length){
					this.addListItem(0, "show")
				}
			}

			this.removeListItems = function(from, len){
				if(from === 0){
					if(this.children[0]){
						this.protoChild = this.children[0];
					}
				}
				this.children.splice(from, len);
				this.renderDom.splice(from, len);
				var i = from;
				var removeLen = from + len;



				for(; i < removeLen; i++){
					this.removeList.push(i);
				}

				if(this.isNegative && !this.children.length){
					this.addListItem(0, "show")
				}
			}

			this.removeAllListItems = function(force){
				this.removeListItems(0, this.renderDom.length, force);
			}

			this.changeListItem = function(index, data){
				this.addListItem(index, data)
			}


			this.onSetData = function(data){
				
				for(var filterName in this.filter){
					var filter = Mold.Lib.Filter.get(filterName);
					if(filter){
						this.data[this.name] = filter(this.data[this.name], this.filter[filterName]);
					}
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
					
					if(_oldDataLength > data.length){
						var dif =  _oldDataLength - data.length;

						this.removeListItems(data.length, dif);
					}
					_oldDataLength = data.length;
				}else if((!data || !data[this.name]) && data[this.name] !== 0){
					this.removeAllListItems(true);
				}else{

					//data from object
					if(Mold.isObject(data)){

						if(!this.renderDom[0]){
							this.createRenderDom(0);
						}
						
						if(!this.children[0]){
							this.createChildren(0);
						}
						
						this.addListItem(0, data[this.name], true)
						
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
					data : this.data,
					services : this.services
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

					this.pointer.splice(index, 1);
					if(!this.pointer){
						this.pointer = [];
					}

				}

			}


			this.render = function(){

				//remove pointers
				var y = 0, removeLen = this.removeList.length;
				for(; y < removeLen; y++){
					this.removePointer(this.removeList[removeLen - y - 1]);
				}
				this.removeList = [];

				//add changed
				var i = 0, len = this.renderDom.length;
				this.domPointer.appendChild(this.referenceNode);
				for(; i < len; i++){
					//if items does not change, copy pointer
					if(!~this.changedItems.indexOf(i)){
						if(this.pointer[i]){
				
							for(; y < subLen; y++){
								this.domPointer.appendChild(this.pointer[i][y]);
							}
						}

					//if items has changed, render new
					}else{
						var selected = this.renderDom[i];
						var y = 0, subLen = selected.length;
						this.pointer[i] = [];
						for(; y < subLen; y++){
							var item = selected[y].render();
							this.domPointer.appendChild(item);
							this.pointer[i][y] = item;
						}
					}
				}
				this.changedItems = [];
		
				this.state = STATE_NO_CHANGES;
				_oldRenderLength = len;

				return this.domPointer;
			}

			this.reRender = function(){

				//remove pointers
				var y = 0, removeLen = this.removeList.length;
				for(; y < removeLen; y++){
					this.removePointer(this.removeList[removeLen - y - 1]);
				}
				this.removeList = [];

				//add changed
				var i = 0, len = this.renderDom.length;
				var lastElement = false;

				

				for(; i < len; i++){
					//if items does not change, copy pointer
					if(!~this.changedItems.indexOf(i)){

						if(this.children[i]){
							//do nothing
							lastElement = this.pointer[i][this.pointer[i].length - 1];
							this.setListItems({ "+" : i }, i);

							for(var name in this.children[i]){
								if(Mold.isArray(this.children[i][name])){
									var y = 0, renderLen = this.children[i][name].length;
									for(; y < renderLen; y++){
										this.children[i][name][y].reRender();
									}
								}else{
									this.children[i][name].reRender();
								}	
							}
							
						}

					//if items has changed, render new
					}else{
						var selected = this.renderDom[i];
						var y = 0, subLen = selected.length;
						this.pointer[i] = [];
						for(; y < subLen; y++){
							selected.parentElement = this.parentElement;
							var item = selected[y].render();
							item.stopDirective = false;

							if(lastElement){
								lastElement.parentNode.insertBefore(item, lastElement.nextSibling);
							}else{

								this.parentElement.insertBefore(item, this.referenceNode);
							}
							this.pointer[i][y] = item;
							lastElement = item;
						}
					}
				}
				this.changedItems = [];
		
				this.state = STATE_NO_CHANGES;
				_oldRenderLength = len;
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