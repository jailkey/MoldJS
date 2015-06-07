Seed({
		name : "Mold.Lib.VDom.TextNode",
		dna : "static",
	},
	function(){

		return function TextNode(config){
			//°include Mold.Lib.VDom.ProtoNode
			
			this.type = TEXT_NODE;
			this.domPointer = false;

			

			this.clone = function(){

				var newNode =  new TextNode({
					name : this.name,
					data : this.data
				});

				return newNode;
			}

			this.render = function(){

				if(!this.domPointer ){
					this.domPointer = _doc.createTextNode(this.data);
				}
				this.state = STATE_NO_CHANGES;
				return this.domPointer;
			}

			
		}
	
	}
	
)