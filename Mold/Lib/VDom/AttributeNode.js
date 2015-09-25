Seed({
		name : "Mold.Lib.VDom.AttributeNode",
		dna : "static",
		include : [
			{ StringParser : "Mold.Lib.VDom.StringParser" }
		]
	},
	function(){

		return function AttributeNode(config){
			//°include Mold.Lib.VDom.ProtoNode
			
			this.type = ATTRIBUTE_NODE;
			this.domPointer = false;


			this.addData = function(data, bind){
				this.data = data;
				if(this.data){
					var parsed = StringParser(this.data);
					var i = 0, len = parsed.length;
					for(; i  < len; i++){
						this.addNode(parsed[i]);
					}
				}
			}

			this.clone = function(){

				var newNode =  new AttributeNode({
					name : this.name,
					services : this.services
				});

				var i = 0, len = this.vdom.length;
				for(; i < len; i++){
					var cloneNode = this.vdom[i].clone();
					newNode.addNode(cloneNode)
				}

				return newNode;
			}

			this.renderAttribute = function(){
				if(this.parent){
					this.parent.renderAttribute(this.name)
				}
			}

			this.render = function(){
				var output = "";
				var i = 0, len = this.vdom.length;

				for(; i < len; i++){
					var val =  this.vdom[i].renderString();
					if(val !== false){
						output += this.vdom[i].renderString();
					}
				}

				return output;
			}

			this.reRender = function(){
				var output = this.render();
				return output;
			}


			
		}
	}
)