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
					this.renderDom[i].parentElement = this.domPointer;
					
					this.domPointer.appendChild(this.renderDom[i].render());
				}
				Mold.Lib.Observer.publish('element.created', { element : this.domPointer })
				return this.domPointer;
			}

			this.reRender = function(){
				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					this.renderDom[i].parentElement = this.domPointer;
					this.renderDom[i].reRender();
				}
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