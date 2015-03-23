Seed({
		name : "Mold.Lib.Sanitize",
		dna : "class",
		include : [
			"Mold.Tools.Test.Unit",
			"Mold.Lib.Encode"
		],
		test : "Mold.Test.Lib.Sanitize"
	},
	function(){

		var _standardChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
			_standardNumbers = "0123456789",
			_urlChars = "\/\?\#\-\_\:&\.",
			_emailChars = "@\_\-\.";

		var _exploitsEntrys = [
			"javascript:",
			"vbscript:",
			"livescript:",
			"expression",
			"behavior:"
		]

		var _eventHandler = [
			"onmouseover", "onError", "FSCommand", "onAbort", "onActivate", "onAfterPrint", "onAfterUpdate", "onBeforeActivate", "onBeforeCopy", "onBeforeCut",
			"onBeforeDeactivate", "onBeforeEditFocus", "onBeforePaste", "onBeforePrint", "onBeforeUnload", "onBeforeUpdate", "onBegin", "onBlur", "onBounce", "onCellChange",
			"onChange", "onClick", "onContextMenu", "onControlSelect", "onCopy", "onCut", "onDataAvailable", "onDataSetChanged", "onDataSetComplete", "onDblClick",
			"onDeactivate", "onDrag", "onDragEnd", "onDragLeave", "onDragEnter", "onDragOver", "onDragDrop", "onDragStart", "onDrop", "onEnd", "onErrorUpdate",
			"onFilterChange", "onFinish", "onFocus", "onFocusIn", "onFocusOut", "onHashChange", "onHelp", "onInput", "onKeyDown", "onKeyPress", "onKeyUp", "onLayoutComplete",
			"onLoad", "onLoseCapture", "onMediaComplete", "onMediaError", "onMessage", "onMouseDown", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseOut",
			"onMouseOver", "onMouseUp", "onMouseWheel", "onMove", "onMoveEnd", "onMoveStart", "onOffline", "onOnline", "onOutOfSync", "onPaste", "onPause",
			"onPopState", "onProgress", "onPropertyChange", "onReadyStateChange", "onRedo", "onRepeat", "onReset", "onResize", "onResizeEnd", "onResizeStart",
			"onResume", "onReverse", "onRowsEnter", "onRowExit", "onRowDelete", "onRowInserted", "onScroll", "onSeek", "onSelect", "onSelectionChange", "onSelectStart",
			"onStart", "onStop", "onStorage", "onSyncRestored", "onSubmit", "onTimeError", "onTrackChange", "onUndo", "onUnload", "onURLFlip", "seekSegmentTime"
		]

		var _maskRegExp = function(str){
			 return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}

		var _removeNonWhitlistedChars = function(str, list){
			list = _maskRegExp(list);
			return str.replace(new RegExp('[^' + list + ']+', 'g'), '');
		}

		var _removeBlacklistedChars = function(str, list){
			list = _maskRegExp(list);
			return str.replace(new RegExp('[' + list + ']+', 'g'), '');
		}

		var _removeXSSExploits = function(html){

		}

		var _removeEventhandler = function(html){

		}

		var _sanitzeAttributeUrls = function(){

		}

		var _removeAllLineBreaks = function(value){
			return value.replace(/(\r|\n|&#x0A;)/gi, '');
		}

		var _removeScriptTags = function(markup){
			return markup.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
		}

		var _removeExploidEntrys = function(value){
			for(var i = 0; i < _exploitsEntrys.length; i++){
				var regExp = new RegExp(_exploitsEntrys[i], "gi");
				value = value.replace(regExp, "");
			}
			return value;
		}

		var _filterURL = function(url){
			
			url = _removeNonWhitlistedChars(url, _standardChars + _standardNumbers + _urlChars);
			url = _removeExploidEntrys(url);
			return url;
		}

		var _filterLinkAttributes = function(markup){
			var attrs = ['src', 'href'];
			markup = markup.replace(/\<[\S]*[\s]*([\s\S]*)\>/gi, function(){
				var output = arguments[0];
				if(arguments[1]){

					var attributes = arguments[1].match(/([\S]+)[\s]*\=/gi),
						values = arguments[1].split(/[\S]+[\s]*\=/gi);

					for(var y = 0; y < attributes.length; y++){
						var selectedAttribute = Mold.trim(attributes[y].replace("=", "")).toLowerCase();
						if(Mold.contains(attrs, selectedAttribute)){
							var value = values[y + 1];
							if(Mold.trim(value)){
								output = output.replace(value, '"' + _filterURL(value) +'" ');
							}
						}
					}	
				}
				return output;
			});

			return markup;
		}



		return {

			whitelist : function(chars, list){
				return _removeNonWhitlistedChars(chars, list);
			},
			blacklist : function(chars, list){
				return _removeBlacklistedChars(chars, list);
			},
			url : function(url){
				return _filterURL(url);
			},
			email : function(){
				return _removeNonWhitlistedChars(url, _standardChars + _standardNumbers + _emailChars);
			},
			html : function(markup){

				markup = Mold.Lib.Encode.decodeHTMLEntities(markup);
				markup = _removeScriptTags(markup);
				markup = _removeExploidEntrys(markup);
				markup = _filterLinkAttributes(markup);

				for(var i = 0; i < _eventHandler.length; i++){
					var regExp = new RegExp(_eventHandler[i], "gi");
					markup = markup.replace(regExp, "");
				}

				return markup;
				//markup = _removeBlacklistedChars(markup)
			}

		}
	}
)