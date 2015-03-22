Seed({
		name : "Mold.Lib.Sanitize",
		dna : "class",
		include : [
			"Mold.Tools.Test.Unit"
		],
		test : function(Sanitize){
			describe("Test Mold.Lib.Sanitize" , function(){
				var san = false;

				it("create instace", function(){
					console.log("test")
					san  = new Sanitize();
					//done();
				})

				it(".whitelist()", function(){
					var result = san.whitelist("abcde", "aed");
					expect(result).toBe("ade");
				})
				

				it(".blacklist()", function(){
					var result = san.blacklist("abcde", "aed");
					expect(result).toBe("bc");
				})

				it(".url()", function(){
					var result = san.url('/hans/"testmann/?@asd/.)(&)%$nas');
					expect(result).toBe("/hans/testmann/?asd/.&nas");
				})


				
			});
		}
	},
	function(){

		var _standardChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW",
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


		return {

			whitelist : function(chars, list){
				return _removeNonWhitlistedChars(chars, list);
			},
			blacklist : function(chars, list){
				return _removeBlacklistedChars(chars, list);
			},
			url : function(url){
				return _removeNonWhitlistedChars(url, _standardChars + _standardNumbers + _urlChars);
			},
			email : function(){
				return _removeNonWhitlistedChars(url, _standardChars + _standardNumbers + _emailChars);
			}

		}
	}
)