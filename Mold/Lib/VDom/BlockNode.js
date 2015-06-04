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
			this.renderDom = [];
			this.children = [];

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

			this.removeBlockItem =  function(){

			}

			this.onSetData = function(data){


				//handle array
				if(Mold.isArray(data)){
					/*
					if(this.state !== STATE_NEW){
						if(_oldData.length === data.length){
							this.state = STATE_NO_CHANGES;
						}else{
							this.state = STATE_UPDATE
						}
					}*/

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
						
						for(var name in data[i]){
							var selected = this.children[i][name];
							if(selected){
								selected.setData(data[i][name]);
							}
						}
					

					}
				}else{
					//implement data from object
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

			this.render = function(){
			
				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					var selected = this.renderDom[i];
					var y = 0, subLen = selected.length;
					for(; y < subLen; y++){
						//if(this.state !== STATE_NO_CHANGES){
							this.domPointer.appendChild(selected[y].render());
						//}else{
						//	selected[y].render();
						//}
							
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