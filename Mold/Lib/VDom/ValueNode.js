Seed({
		name : "Mold.Lib.VDom.ValueNode",
		dna : "static"
	},
	function(){

		return function ValueNode(config){
			//°include Mold.Lib.VDom.ProtoNode
			
			this.type = VALUE_NODE;
			this.domPointer = false;

			this.clone = function(){
				var newNode =  new ValueNode({
					name : this.name,
					data : this.data,
					isString : this.isString
				});

				return newNode;
			}

			this.render = function(){
				if(!this.domPointer){
					this.domPointer = _doc.createTextNode(this.data);
				}else{
					this.domPointer.nodeValue = this.data;
				}
				this.state = STATE_NO_CHANGES;
				return this.domPointer;
			}

			this.renderString = function(){
				return this.data;
			}

			this.setDataAndRender = function(data){
				if(data){
					this.setData(data);
				}
				if(this.isString){
					//console.log("this is string", this.parent)
					if(this.parent.type === ATTRIBUTE_NODE){
						this.parent.renderAttribute();
					}else{
						this.parent.render();
					}
				}else{
					this.render();
					this.domPointer.nodeValue = this.data;
				}
				//this.parent.render();

			}
		}
	}
)