Seed({
		name : "Mold.Lib.VDom.RootNode",
		dna : "static",
	},
	function(){

		return function RootNode(config){
			//°include Mold.Lib.VDom.ProtoNode
			
			this.type = ROOT_NODE;
			this.domPointer = false;
			this.renderDom = this.vdom;


			this.clone = function(){
				throw new Error("RootNode has no clone method!")
			}



			this.render = function(){
				if(!this.domPointer){
					this.domPointer = _doc.createElement(this.name);
				}

				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					this.domPointer.appendChild(this.renderDom[i].render());
				}

				return this.domPointer;
			}

			this.renderString = function(){

				var output = "";
				var i = 0, len = this.renderDom.length;

				for(; i < len; i++){
					output += this.renderDom[i].renderString();
				}

				return output;
			}

			
		}
	
	}
	
)