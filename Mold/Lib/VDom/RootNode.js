Seed({
		name : "Mold.Lib.VDom.RootNode",
		dna : "static",
		test : "Mold.Test.Lib.VDom.RootNode",
		include : [
			{ DomParser : "Mold.Lib.VDom.DomParser" },
			{ StringParser : "Mold.Lib.VDom.StringParser" },
			{ NodeBuilder : "Mold.Lib.VDom.NodeBuilder" }
		]
	},
	function(){

		var STATE_RENDER = "render";

		return function RootNode (config){
		

			if(!config.content){
				throw new Error("You can't init a RootNode without content!");
			}

			config = config || {};
			var _that = this;
			this.nodeType = 4;
			this.name = "root";
			this.children = {};

			this.content = config.content;
			this.shadowDom = false;
			this.state = STATE_RENDER;

			var _data = {};


			//Parse content and created children
			var _parseContent = function(content){
				var parts = StringParser(content);
				var vDom = NodeBuilder(parts);
			
				_that.children = vDom;
			}

			_parseContent(this.content);

			this.setData = function(data){
				_data = data;
				 
				Mold.each(_data, function(value, name){
					if(_that.children[name]){
						_that.children[name].setData(value);
					}
				});

				_that.state = STATE_RENDER;
			}

			this.render = function(){
				var fragment = document.createDocumentFragment();
				Mold.each(_that.children, function(child){
					fragment.appendChild(child.render());
				})
				return fragment;
			}

			this.clone = function(){

			}

			this.renderString = function(){
				return; 
			}

		}
	}
)