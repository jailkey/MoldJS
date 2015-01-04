Seed({
		name : "Mold.Lib.Range",
		dna : "class",
		include : [
			"Mold.Lib.Info"
		]
	},
	function(rangeIdent){

		var _range = false;

		/*
			rangeIdent must have following values
			start
			startNode
			end
			endNode
		*/
	
		if(rangeIdent.endNode.nodeValue.length <= end){
			rangeIdent.end = rangeIdent.endNode.nodeValue.length;
		}

		if(rangeIdent.startNode.nodeValue.length <= start){
			rangeIdent.start = rangeIdent.startNode.nodeValue.length;
		}


		if(Info.isSupported('range')){
			_range = new Range();
	
			_range.setStart(
				rangeIdent.startNode,
				rangeIdent.start
			);

			_range.setEnd(
				rangeIdent.endNode,
				rangeIdent.end
			);

		}else{
			if(document.range){
				_range = document.createRange();
				_range.setStart(rangeIdent.startNode, rangeIdent.start);
				_range.setEnd(rangeIdent.endNode, rangeIdent.end);
			}
		}


		this.publics = {
			get : function(){
				return _range;
			},
			rect : function(){

			}
		}
	}
)