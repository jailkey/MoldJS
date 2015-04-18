Seed({
		name : "Mold.Lib.VDom.ValueNode",
		dna : "static"
	},
	function(){

		var TEXT_VALUE = 1;
		var ITERATOR_VALUE = 2;
		var PARENT_POINTER = 3;

		return function(config){

			config = config || {}

			var _that = this;

			this.nodeType = 1;
			this.testId = Mold.getId();
			this.name = config.name || Mold.getId();
			this.nodeValue = config.nodeValue || "";
			this.valueType = config.valueType || TEXT_VALUE;
			this.protoDom = config.protoDom;
			this.data = config.data || false;


			this.clone = function(){
				return new Mold.Lib.VDom.ValueNode({
					name : _that.name,
					valueType : _that.valueType,
					nodeValue : _that.nodeValue,
					valueType : _that.valueType,
					data : _that.data,
					protoDom : _that.protoDom.cloneNode()
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
			
		}
	}
)