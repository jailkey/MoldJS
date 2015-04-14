Seed({
		name : "Mold.Lib.DomNode",
		dna : "class",
		include : [
			"Mold.Lib.DomParser"
		],
		test : "Mold.Test.Lib.DomNode"
	},
	function(type, name){

		var that = this;

		/*Errors*/
		var ERROR;

		/*node typs*/
		var nodeTypes = {
			ELEMENT_NODE : 1,
			ATTRIBUTE_NODE : 2,
			TEXT_NODE : 3,
			DOCUMENT_NODE : 9,
			DOCUMENT_FRAGMENT_NODE : 11
		}

		var _checkNodeType = function(type){
			return Mold.find(nodeTypes, function(value, name){
				if(type === value || type === name){
					return true;
				}
			})
			return false;
		}
		
		if(!_checkNodeType(type)){
			throw new Error(type + " is not a valid node-type");
		}

		/*standard properties*/

		this.nodeValue = "",
		this.nodeName = (name) ? name.toLowerCase() : null,
		this.nodeType = type,
		this.parentNode = null,
		this.nextSibling = null,
		this.previousSibling = null,
		this.firstChild = null,
		this.lastChild = null,
		this.parentElement = null,
		this.attributes = [],
		this.nodeIdent = Mold.getId(),
		this.childNodes = [];
		this.parentNode = null;

		var _parentNode = false;
		
		Object.defineProperty(this, 'parentNode', {
			get : function() {
				return _parentNode
			},
			set : function(nodeValue) {
				_parentNode = nodeValue;
				this.parentElement = nodeValue;
				return _parentNode;
			}
		});



		switch(type){
			case 3:
				this.nodeName = "#text";
				break;
			case 9:
				this.nodeName = "#document";
				break;

		}


		var _getInnerHTML = function(startNode){
			var markup = "";
			Mold.each(startNode.childNodes, function(node){
				if(node.nodeType === 1){
					markup += "<" + node.nodeName;
					if(node.attributes.length > 0 ){
						Mold.each(node.attributes, function(attrNode){
							markup += " " + attrNode.nodeName + "=\"" + attrNode.nodeValue + "\"";
						});
					}
					markup += ">";
					if(node.hasChildNodes()){
						markup += _getInnerHTML(node);
					}
					markup += "</" + node.nodeName + ">";
				}
				if(node.nodeType === 3){
					markup += node.nodeValue;
				}		
			});
			return markup;
		}

		var _setInnerHTML = function(markup){
			var newDom = Mold.Lib.DomParser.parse(markup);
			that.childNodes = [];
			that.firstChild = newDom.firstChild;
			that.childNodes = newDom.childNodes;
			that.lastChild = newDom.lastChild;
		}
		
		Object.defineProperty(this, 'innerHTML', {
			get : function() {
				return _getInnerHTML(this);
			},
			set : function(markup) {
				return _setInnerHTML(markup);
			}
		});

		/*
		var _clone = function(node){
			var newNode = 
			for
		}*/
		


		this.publics = {
			/*node properties*/

			cloneNode : function(withChildNodes){
				
				var cloneNode =  new Mold.Lib.DomNode(this.nodeType, this.nodeName);
				cloneNode.nodeValue = this.nodeValue;
				var len = this.attributes.length, i = 0;
				for(; i < len; i++){
					
					cloneNode.setAttributeNode(this.attributes[i].cloneNode());
				
				};
				if(withChildNodes){
					var childLength = this.childNodes.length, y = 0;
		
					for(; y < childLength; y++){
						cloneNode.appendChild(this.childNodes[y].cloneNode(true));		
					}
				}
			

				return cloneNode;
			},
			appendChild : function(child){
				
				if(child === this || child.nodeIdent === this.nodeIdent){
					throw new Error("circular insert!");
				}
				if(!child){
					throw new Error("Can not append child of undefiend!");
				}
				if(child.parentNode){
					child.parentNode.removeChild(child)
				}
				child.parentNode = this;
				this.childNodes.push(child);
				if(this.childNodes[this.childNodes.length - 2]){
					this.childNodes[this.childNodes.length - 2].nextSibling = child;
					child.previousSibling = this.childNodes[this.childNodes.length - 2];
				}
				if(this.childNodes.length === 1){
					
					this.firstChild = child;
				}
				this.lastChild = child;
			},
			insertBefore : function(newChild, referenz){

				if(newChild === this){
					 throw new Error("circular insert!")
				}

				var child,
					index = 0, 
					len = this.childNodes.length;

				if(!referenz){
					this.appendChild(newChild);
					return true;
				}


				for(; index < len; index++){
					child =  this.childNodes[index];
					if(referenz === child){
						if(index === 0){
							that.firstChild = newChild;
						}else{
							that.childNodes[index - 1].nextSibling = newChild;
							newChild.previousSibling = that.childNodes[index - 1];
						}
						newChild.parentNode = that;
						newChild.nextSibling = that.childNodes[index];
						that.childNodes[index].previousSibling = newChild;
						that.childNodes.splice(index, 0, newChild);
						that.lastChild = that.childNodes[that.childNodes.length];
						break;
					}
				}
				return true;
			},
			removeChild : function(child){
				var i = 0, 
					len = this.childNodes.length;

				if(!child){
					throw "Can not remove child of undefiend!"
				}
			
				for(; i < len; i++){
					if(this.childNodes[i] === child){
						if(i === 0){
							
							if(this.childNodes.length > 1){
								this.firstChild = this.childNodes[ i + 1 ];
							}else{
								this.firstChild = null;
							}
						}
						if(this.childNodes[i - 1]){
							this.childNodes[i - 1].nextSibling = this.childNodes[i + 1] || null;

						}

						if(this.childNodes[i + 1]){
							this.childNodes[i + 1].previousSibling = this.childNodes[i - 1];
						}else{
							if(this.childNodes[i - 1]){
								this.lastChild = this.childNodes[i - 1];
							}else{
								this.lastChild = null;
							}
						}
						this.childNodes.splice(i, 1);
						child.nextSibling = null;
						child.previousSibling = null;
						child.parentNode = null;
						return child;
					}
				}
				return false;
			},
			replaceChild : function(newChild, child){
				if(child === this){
					throw new Error("circular insert!");
				}

				var i = 0, 
					len = this.childNodes.length;

				for(; i < len; i++){
					if(this.childNodes[i] === child){
						if(i === 0){
							this.firstChild = child;
						}
						if(this.childNodes[i - 1]){
							this.childNodes[i - 1].nextSibling = newChild;
							newChild.previousSibling = this.childNodes[i - 1];
						}
						if(this.childNodes[i + 1]){
							this.childNodes[i + 1].previousSibling = newChild;
							newChild.nextSibling = this.childNodes[i + 1].previousSibling;
						}else{
							this.lastChild = newChild;
						}
						this.childNodes.splice(i, 1, newChild);
						child.nextSibling = null;
						child.previousSibling = null;
						child.parentNode = null;
						return true;
					}
				}
				return false;
			},
			hasChildNodes : function(){
				if(this.childNodes.length > 0){
					return true;
				}else{
					return false;
				}
			},
		
			getAttributeNode : function(name){
				return Mold.find(this.attributes, function(attribute){
					if(attribute.nodeName === name.toLowerCase()){
						return true;
					}
				})
			},
			getAttribute : function(name){
				var attributeNode = this.getAttributeNode(name);
				if(attributeNode){
					return attributeNode.nodeValue;
				}
				return false;
			},
			setAttributeNode : function(attribute){
				this.attributes.push(attribute);
			},
			setAttribute : function(name, value){
				var attribute = this.getAttributeNode(name);
				if(!attribute){
					attribute = new Mold.Lib.DomNode(2, name);
					this.setAttributeNode(attribute);
				}
				attribute.nodeValue = value;
			},
			removeAttributeNode : function(attribute){
				var i = 0, 
					len = this.attributes.length;

				for(; i < len; i++){
					if(this.attributes[i] === attribute){
						this.attributes.splice(i, 1);
						attribute.parentNode = false;
						return true;
					}
				}
				return false;
			},
			removeAttribute : function(name){
				var attribute = this.getAttributeNode(name);
				if(attribute){
					this.removeAttributeNode(attribute);
				}
			}
		}
	}
)