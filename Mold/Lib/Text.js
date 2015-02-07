Seed({
		name : "Mold.Lib.Text",
		dna : "class",
		include : [
			{ Event : "Mold.Lib.Event" },
			{ Element : "Mold.Lib.Element" },
			{ Info : "Mold.Lib.Info" },
			{ TextFinder : "Mold.Lib.TextFinder" }
		]
	},
	function(text){

		var that = this,
			_isSelected = false,
			_INDENT = '--range---';
		
		Mold.mixin(this, new Event(this));

		/**
		 * @private
		 * @method _getSelection
		 * @description  get the current selection
		 * @return {object} returns current selection extend with rangeIdent property
		 */
		var _getSelection  = function(){
			var selection = (window.getSelection) ? window.getSelection() : document.selection.createRange();
			selection.rangeIdent = _rangeIdent(selection);
			return selection;
		}

		/**
		 * @private
		 * @method  _getFirstRelevantNode
		 * @description retruns the next childNode with the given nodeType
		 * @param  {object} node target node
		 * @param  {number} nodeType requested node type
		 * @return {mixed}  returns the requested Node if no node found it returns false
		 */
		var _getFirstRelevantNode = function(node, nodeType){
			if(!node){
				throw new Error("Node is not defined!")
			}
			if(nodeType === 1){
				return node;
			}
			var childs = node.childNodes;
			for(var i = 0; i < childs.length; i++){
				if(childs[i].nodeType === nodeType){
					return childs[i];
				}
			}
			return false;
		}

		var _createRange = function(startNode, start, endNode, end){
			rangeObject = document.createRange(); // new Range();
			
			if(endNode.nodeValue.length <= end){
				end = endNode.nodeValue.length;
			}

			if(startNode.nodeValue.length <= start){
				start = startNode.nodeValue.length;
			}

			rangeObject.setStart(
				startNode,
				start
			);

			rangeObject.setEnd(
				endNode,
				end
			)

			return rangeObject;
		}

		/**
		 * @private
		 * @method  _setSelection
		 * @description set a selection from a range object
		 * @param {object} range expects a range object
		 */
		var _setSelection = function(range){
			if(!Info.isSupported('range')){
				throw new Error('Range is not Supported!')
			}

			var selection = window.getSelection();

			if(
				(typeof range === 'string' 
				&& ~range.indexOf(_INDENT))
				|| typeof range === 'object'
				&& range.ident === _INDENT
			){
				
				var rangeData;

				if(typeof range === 'string'){
					rangeData = JSON.parse(range);
				}else{
					rangeData = range;
				}

				var selectedStartNode = document.querySelector(rangeData.startSelector),
					selectedEndNode = document.querySelector(rangeData.endSelector);
				
				
				if(!selectedStartNode || !selectedEndNode){
					return false;
				}

				
				var relevantStart = _getFirstRelevantNode(selectedStartNode, rangeData.startNodeType),
					relevantEnd = _getFirstRelevantNode(selectedEndNode, rangeData.endNodeType),
					rangeObject = _createRange(relevantStart, rangeData.start, relevantEnd, rangeData.end);

				selection.addRange(rangeObject);

				if(rangeData.text === selection.toString().replace(/\n/g, ' ')){
					return true;
				}else{
					return false;
				}
				
			}else if(range instanceof Range){
				selection.addRange(range);
				return true;
			}
			return false;
		}
		


		var _findRange = function(range){
			if(!Info.isSupported('range')){
				throw new Error('Your Browser does not support Range!')
			}
			if(
				(typeof range === 'string' 
				&& ~range.indexOf(_INDENT))
				|| typeof range === 'object'
				&& range.ident === _INDENT
			){
				
				var rangeData,
					result = [];

				if(typeof range === 'string'){
					rangeData = JSON.parse(range);
				}else{
					rangeData = range;
				}


				var textMap = new TextFinder(document.documentElement),
					mapResult = textMap.find(rangeData.text);

				
				Mold.each(mapResult, function(entry){
					result.push({
						startNode : entry.start.node.element,
						endNode :  entry.end.node.element,
						start :  entry.start.node.position,
						end :  entry.end.node.position,
						found : entry.found,
						errors : entry.errors
					});
				});

		
				
				if(result){
					return result;
				}else{
					return false;
				}
			}else{
				throw new Error("Range is not a valid RangeIdent");
			}
		}

		var _rangeIdent = function(selection){

			var range = selection.getRangeAt(0),
				startNodeType = range.startContainer.nodeType,
				endNodeType = range.endContainer.nodeType;


			var startNode = new Element(
				(startNodeType === 1) ? range.startContainer : range.startContainer.parentNode
			);

			var endNode = new Element(
				(endNodeType  === 1) ? range.endContainer : range.endContainer.parentNode
			);

			var output = {
				ident : _INDENT,
				text : selection.toString().replace(/\n/g, ' '),
				offset : _getRangeOffset(range),
				start : range.startOffset,
				end :  range.endOffset,
				startSelector : startNode.getSelector(),
				endSelector : endNode.getSelector(),
				startNodeType : startNodeType,
				endNodeType : endNodeType
			}

			return output;
		}

		var _expandRangeToFullWords = function(range){
			
			var startValue = range.startContainer.nodeValue,
				endValue = range.endContainer.nodeValue;


			if(!startValue || !endValue){
				return range;
			}

			if(
				range.startOffset !== 0
				&& startValue[range.startOffset] != " "
			){
				for(var i = range.startOffset; i  > 0; i--){
					if(startValue[i] == " "){
						break;
					}
				}
				range.setStart(range.startContainer, i + 1);
			}

			if(

				range.endOffset !== 0
				&& endValue[range.endOffset] != " "
			){
				for(var i = range.endOffset; i < endValue.length; i++){
					if(endValue[i] == " "){
						break;
					}
				}
				range.setEnd(range.endContainer, i);
			}

			return range;
		}


		var _triggerSelections = function(){
			if(document){
				var doc = new Element(document);
			
				doc.on("mouseup", function(e){
					var selection = _getSelection();
				
					if(selection.toString().length){
						var range = selection.getRangeAt(0);
						range = _expandRangeToFullWords(range);
						selection = _getSelection();
						that.trigger("select", { 
							selection : selection, 
							text : selection.toString(),
							offset : _getRangeOffset(range)
						});

						_isSelected = true;

					}else if(_isSelected){
						that.trigger("unselect");
					}
				});
					
			}else{
				throw new Error("Document is not defined!");
			}
		}

		var _getRangeOffset = function(range){

			var rects = range.getBoundingClientRect(),
				offset = {
					top : +rects.top,
					left : +rects.left,
					height : rects.height,
					width : rects.width
				},
				doc = new Element(document);

			offset.top = doc.scrolls().top + offset.top;
			offset.left = offset.left + doc.scrolls().left;
			return offset;
		}



		var _find = function(options){
			var doc = new Element(document.querySelector("body"));
			if(options.text){
				relevantStart, rangeData.start, relevantEnd, rangeData.end
			}
		}
		

		_triggerSelections();

		this.publics = {
		/**
		 * @method selection
		 * @description get / set a text selection
		 * @param  {mixed} range range ident object or range ident string, if not set method returns the current selection
		 * @return {object}   returns a range ident object
		 */
			selection : function(range){
				if(!range){
					return _getSelection();
				}else{
					var newRange = _findRange(range);
					if(newRange){
						console.log("RANGE FOUND")
					
						if(newRange){
							_setSelection(newRange)
						}
						return newRange;
					}else{
						console.log("no range found")
					}
				}
			},
			selectionsToRanges : function(selections){
				var ranges = [];
				Mold.each(selections, function(selection){
					ranges.push(_createRange(selection.startNode, selection.start, selection.endNode, selection.end));
				});
				return ranges;
			},
		/**
		 * @method find search rangeIdent
		 * @param  {mixed} range object or string
		 * @return {object} returns a list with all hits
		 */
			find : function(rangeIdent){
				return _findRange(rangeIdent);
			}
		}
	}
)