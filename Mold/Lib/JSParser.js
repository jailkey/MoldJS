Seed({
		name : "Mold.Lib.JSParser",
		dna : "class",
		test : "Mold.Test.Lib.JSParser"
	},
	function(){

		function Block(){
			this.lines = [];
			this.parent = false;
			this.type = "block";
		}

		function Line(){
			this.type = "line";
			this.value = "";
			this.number = 0;
		}

		console.log("STARTS")

		//states
		var END = "end";
		var BLOCK_OPEN = "block_open";
		var BLOCK_CLOSE = "block_close";
		var COMMENT_OPEN = "comment_open";
		var COMMENT_CLOSED = "comment_closed";
		var SINGLE_COMMENT = "single_commend";
		var COLLECT = "collect";


		var _getLineType = function(state, lastState, collected, tree){
			if(lastState === COMMENT_OPEN || lastState === COMMENT_CLOSED || lastState === SINGLE_COMMENT){
				return "comment";
			}

			return "line";
		}

		var _getBlockType = function(state, lastState, collected, tree){
			console.log("get blocktype", tree.lines[tree.lines.length - 1])
			return "block";
		}
		
		var _parse = function(input){
			
			input = input.replace(/\r/g, "");

			var content = input.split("");
			var i = 0, len = content.length;
			var actChar = "";
			var tree = new Block();
			var parent = false;
			var collected = "";
			var lineCount = 1;

			var state = COLLECT;
			var comment = "";
			var lastState = false;

			for(; i < len; i++){
				actChar = content[i];
				nextChar = content[i + 1];
				previousChar = content[i + 1];
				lastState = state;
				switch(actChar){
					
					case "{":
						if(state !== SINGLE_COMMENT && state !== COMMENT_OPEN){
							state = BLOCK_OPEN;
						}
						break;

					case "}":
						if(state !== SINGLE_COMMENT && state !== COMMENT_OPEN){
							state = BLOCK_CLOSE;
						}
						break;

					case "\n":
						state = END;
						lineCount++;
						break;

					case ";":
						if(state !== SINGLE_COMMENT || state !== COMMENT_OPEN){
							state = END;
						}
						break;

					case "/":
						if(nextChar === "/"){
							state = SINGLE_COMMENT;
						}
						if(nextChar === "*"){
							state = COMMENT_OPEN;
						}
						break;

					default:
						state = COLLECT;
						break;
				}

				switch(state){

					case BLOCK_OPEN:
						var newLine = new Line();
						newLine.type = _getLineType(state, lastState, collected, tree);
						newLine.value = collected;
						newLine.number = lineCount;
						tree.lines.push(newLine);
						collected = "";

						var newBlock = new Block();
						newBlock.parent = tree;
						newBlock.number = lineCount;
						newBlock.type = _getBlockType(state, lastState, collected, tree);
						tree.lines.push(newBlock);
						parent = tree;
						tree = newBlock;
						break;

					case BLOCK_CLOSE:
						if(parent){
							tree = parent;
						}

						parent = tree.parent;
						break;

					case COMMENT_CLOSED:
					case END:
						//console.log("tree", tree)
						if(!tree.lines){
							console.log("tree", tree)
						}

						var newLine = new Line();
						newLine.type = _getLineType(state, lastState, collected);
						newLine.value = collected;
						newLine.number = lineCount;

						tree.lines.push(newLine);

						collected = "";
						break;

					case COLLECT:
						collected += actChar;
						break;

					case COMMENT_OPEN:
					case SINGLE_COMMENT:
						collected += actChar;
						break;


				}
			}

			return tree;
		}



		this.publics = {
			parse : function(input){
				console.log("tree", _parse(input));
			}
		}
	}
)