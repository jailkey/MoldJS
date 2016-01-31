Seed({
		type : "static",
		include : [
			"Mold.Lib.VDom.ProtoNode"
		]
	},
	function(){

		return function StringNode(config){
			//!include seed=Mold.Lib.VDom.ProtoNode
			
			this.type = STRING_NODE;

			this.clone = function(){
				return new StringNode({
					name : this.name,
					data : this.data,
					services : this.services
				});
			}

			this.renderString = function(){
				this.state = STATE_NO_CHANGES;
				return this.data;
			}

			this.reRender = function(){
				this.state = STATE_NO_CHANGES;
				return this.data;
			}
		}
	}
)