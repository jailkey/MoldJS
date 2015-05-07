Seed({
		name : "Mold.Lib.VDom.StringNode",
		dna : "static"
	},
	function(){

		var STATE_RENDER = "render";
		var STATE_NEW = "new";

		return function StringNode(config){

			config = config || {}

			var _that = this;

			this.nodeType = 8;
			this.name = config.name || Mold.getId();
			this.data = config.data || false;
			this.parent = config.parent || false;
			this.state = STATE_NEW;


			this.clone = function(){
				return new Mold.Lib.VDom.StringNode({
					name : _that.name,
					valueType : _that.valueType,
					data : _that.data
				})
			}

			this.setData = function(data){
				_that.data = data;
				_test = data;
			}

			this.render = function(){
				_that.nodeValue = _that.data;
				_that.protoDom.nodeValue = _that.data;
				return _that.protoDom;
			}

			this.renderString = function(){
				_that.nodeValue = _that.data;
				_that.protoString = _that.data;
				return _that.protoString;
			}

			this.update = function(){
				_that.nodeValue = _that.data;
				_that.protoDom.nodeValue = _that.data;
			}
			
		}
	}
)