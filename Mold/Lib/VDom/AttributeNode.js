Seed({
		name : "Mold.Lib.VDom.AttributeNode",
		dna : "static"
	},
	function(){

		var TEXT_VALUE = 1;
		var ITERATOR_VALUE = 2;
		var PARENT_POINTER = 3;

		var STATE_RENDER = "render";
		var STATE_NEW = "new";


		var VALUE_NODE = 1;
		var BLOCK_NODE = 2;
		var NEGATIVE_BLOCK_NODE = 3;
		var ROOT_NODE = 4;
		var STRING_NODE = 8;


		var _renderDom = function(elements){
			var stringOutput = "", i = 0, len = elements.length;
			for(; i < len; i++){
				var selected = elements[i];

				if(
					selected.nodeType === VALUE_NODE
					|| selected.nodeType === BLOCK_NODE
					|| selected.nodeType === NEGATIVE_BLOCK_NODE
					|| selected.nodeType === STRING_NODE
				){

					stringOutput += selected.renderString();
				}
			}
			return stringOutput;
		}

		var _initChildrenFromProtoDom = function(protoDom){
			var i = 0, len = protoDom.length, children = {};
			for(; i < len; i++){
				var selected = protoDom[i];
				if(selected.nodeType === 1 || selected.nodeType === 2 || selected.nodeType === 3){
					children[selected.name] = selected;
				}
			}

			return children;
		}

		return function AttributeNode(config){

			config = config || {}

			var _that = this;

			this.nodeType = 7;
			this.testId = Mold.getId();
			this.name = config.name || "attr" + Mold.getId();
			this.nodeValue = config.nodeValue || "";
			this.valueType = config.valueType || TEXT_VALUE;
			this.pointer = config.pointer;
			this.data = config.data || false;
			this.protoDom = config.protoDom || [];
			this.children = config.children || {};
			this.parent = config.parent || false;
			this.attributeName = config.attributeName;

			this.state = STATE_NEW;

			this.children = _initChildrenFromProtoDom(this.protoDom);

			this.clone = function(){

				var len = _that.protoDom.length, i = 0, newProtoDom = [];

				for(; i < len; i++){
					newProtoDom.push(_that.protoDom[i].clone());
				}

				var newAttr =  new Mold.Lib.VDom.AttributeNode({
					name : _that.name,
					valueType : _that.valueType,
					nodeValue : _that.nodeValue,
					valueType : _that.valueType,
					data : _that.data,
					protoDom : newProtoDom,
					attributeName : this.attributeName
				});


				return newAttr;
			}

			this.setData = function(data){

				_that.data = data;
				var len = _that.children.length, i = 0;
				for(; i < len; i++){
					var child = _that.children[i];
					if(child.nodeType === 1 || child.nodeType === 2 || child.nodeType === 3){
						if(data[child.name]){
							child.setData(data[child.name]);
						}
					}
				}
			}

			this.render = function(){
				_that.nodeValue = _that.data;
				var value = _renderDom(_that.protoDom);
				_that.pointer.nodeValue = value;
				return _that.pointer;
			}

			this.update = function(){
				_that.nodeValue = _that.data;
				var value = _renderDom(_that.protoDom);
				_that.pointer.nodeValue = value;
			}
			
		}
	}
)