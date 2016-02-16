Seed({
		type : "static",
		include : [
			"Mold.Lib.VDom.ProtoNode"
		]
	},
	function(){

		return function TextNode(config){
			//!include seed=Mold.Lib.VDom.ProtoNode
			
			this.type = TEXT_NODE;
			this.domPointer = false;

			this.clone = function(){

				var newNode =  new TextNode({
					name : this.name,
					data : this.data,
					services : this.services
				});

				return newNode;
			}

			this.onSetData = function(data){

				if(Mold.isObject(data)){
					this.data = data[this.name]
				}

				if(data === false || !Mold.is(data)){
					this.data = "";
				}
			}

			this.render = function(){

				if(!this.domPointer){
					this.domPointer = _doc.createTextNode(this.data);
				}
				this.state = STATE_NO_CHANGES;
				return this.domPointer;
			}

			this.reRender = function(){
				this.domPointer.nodeValue = this.data;
			}

			this.renderString = function(){
				this.state = STATE_NO_CHANGES;
				if(this.data === null || this.data === false){
					return "";
				}
				return this.data;
			}

			
		}
	
	}
	
)