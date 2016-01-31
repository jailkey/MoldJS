Seed({
		type : "static",
		include : [
			"Mold.Lib.VDom.ProtoNode"
		]
	},
	function(){

		return function RootNode(config){
			//!include seed=Mold.Lib.VDom.ProtoNode
			
			this.type = ROOT_NODE;
			this.domPointer = false;
			this.renderDom = this.vdom;
			this.referenceNode =  _doc.createTextNode("");

			this.moldModel = {
				model : null,
				path : null
			}


			this.clone = function(){
				throw new Error("RootNode has no clone method!")
			}

			this.render = function(){
				if(!this.domPointer){
					this.domPointer = _doc.createDocumentFragment();
					this.domPointer.appendChild(this.referenceNode);
					this.domPointer.moldModel = this.moldModel;
				}

				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					if(this.referenceNode.parentNode){
						this.renderDom[i].parentElement = this.referenceNode.parentNode;
						this.referenceNode.parentNode.insertBefore(this.renderDom[i].render(), this.referenceNode);
					}else{
						this.renderDom[i].parentElement = this.domPointer;
						this.domPointer.appendChild(this.renderDom[i].render());
					}
				}
				Mold.Lib.Observer.publish('element.created', { element : this.domPointer })
				return this.domPointer;
			}

			this.reRender = function(){
				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					//this.renderDom[i].parentElement = this.domPointer;
					if(this.referenceNode.parentNode){
						this.renderDom[i].parentElement = this.referenceNode.parentNode;
					}else{
						this.renderDom[i].parentElement = this.domPointer;
					}
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