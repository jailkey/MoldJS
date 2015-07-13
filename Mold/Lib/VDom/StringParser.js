
Seed({
		name : "Mold.Lib.VDom.StringParser",
		dna : "static",
		test : "Mold.Test.Lib.VDom.StringParser",
		include : [
			{ NodeBuilder : "Mold.Lib.VDom.NodeBuilder" }
		]
	},
	function(){
		"use strict";

		var VALUE_NODE = 1;
		var BLOCK_NODE = 2;
		var NEGATIVE_BLOCK_NODE = 3;

		var BLOCK = "#";
		var NEGATIVE_BLOCK = "^";
		var BLOCK_END = "/";

		return function(markup){

			var length = markup.length,
				i = 0,
				actChar = false, 
				lastChar = false,
				nextChar = false,
				lastWriteState = false,
				previousChar = false,
				writeState =  "COLLECT",
				twoBeforeChar = false,
				twoAfterChar = false,
				COLLECT = "COLLECT",
				WRITE_VAR = "WRITE_VAR",
				WRITE_MARKUP = "WRITE_MARKUP",
				NOTHING = "NOTHING",
				WRITE_BLOCK = "WRITE_BLOCK",
				COLLECT_BLOCK = "COLLECT_BLOCK",
				COLLECT_ELEMENT = "COLLECT_ELEMENT",
				collected = "",
				START_BRACKEDS = "{{",
				END_BRACKEDS = "}}",
				START_ELEMENT = "<",
				END_ELEMENT = "<",
				parts = [],
				blockCounter = 0,
				nodeType = false,
				blockName = false;

			for(; i < length; i++){

				actChar = markup[i];
				nextChar = markup[i + 1];
				twoAfterChar = markup[i + 2];

				if(writeState !== COLLECT_BLOCK){
					if(
						actChar === START_BRACKEDS[0] || actChar === START_BRACKEDS[1]
						|| actChar === END_BRACKEDS[0] || actChar === END_BRACKEDS[1]
					){
						writeState = NOTHING;
					}else{
						writeState = COLLECT;
					}


					if(actChar === START_BRACKEDS[0] &&  nextChar === START_BRACKEDS[1]){
						writeState = WRITE_MARKUP;
					}
				}


				if(actChar === END_BRACKEDS[0] &&  nextChar === END_BRACKEDS[1]){

					if(Mold.startsWith(collected, BLOCK)){
						writeState = COLLECT_BLOCK;
						blockName = collected.replace("#", "");
						nodeType = BLOCK_NODE; 
						collected = "";
						blockCounter++;

					}else if(Mold.startsWith(collected, NEGATIVE_BLOCK)){
						writeState = COLLECT_BLOCK;
						blockName = collected.replace("^", "");
						nodeType = NEGATIVE_BLOCK_NODE; 
						collected = "";
						blockCounter++;

					}else if(Mold.endsWith(collected, BLOCK_END + blockName)){
						if(blockCounter - 1 === 0){
							writeState = WRITE_BLOCK;
							collected = collected.substring(2, collected.length);
							collected = collected.substring(0, collected.length - (START_BRACKEDS + BLOCK_END + blockName).length);
						}
						blockCounter--;

					}else{
						if(writeState !== COLLECT_BLOCK){
							writeState = WRITE_VAR;
						}
					}
					
				}



				if(writeState === COLLECT || writeState ===  COLLECT_BLOCK){
					collected += actChar;
				}

				if(writeState === WRITE_VAR){
					parts.push({
						type : "node",
						name : collected,
						nodeType : VALUE_NODE
					});
					collected = "";
				}

				if(writeState === WRITE_BLOCK){
					parts.push({
						type : "node",
						value : collected,
						name : blockName,
						nodeType : nodeType
					});
					collected = "";
					blockName = "";
				}

				if(writeState === WRITE_MARKUP){
					parts.push({
						type : "markup",
						value : collected
					})
					collected = "";
				}

				lastChar = actChar;
				twoBeforeChar = lastChar;
				lastWriteState = writeState;
			}

			if(collected !== ""){
				parts.push({
					type : "markup",
					value : collected
				})
			}

			if(blockCounter > 0){
				throw new Error("Block validation error, some block maybe unclosed!");
			}

	
			return new NodeBuilder(parts, true, false, true);
		}
	}
)