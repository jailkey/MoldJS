Seed({
		name : "Mold.Lib.ModelOrder",
		dna : "class",
		author : "Jan Kaufmann"
	},
	function(type, parameter){

		var _orderByList = function(items, orderlist){
			
			var itemsList = [];
			for(var i = 0; i < orderlist.length; i++){
				for(var y = 0; y < items.length; y++){
					if(items[y].name === orderlist[i]){
						itemsList.push(items[y]);
						items.splice(y, 1);
						break;
					}
				}
			}
			
			for(var x = 0; x < items.length; x++){
				itemsList.push(items[x]);
			}

			return itemsList;
		}


		this.publics = {
			execute : function(item, callback){
				var items = [];
				if(item.type === "collection"){
					for(var i = 0; i < item.length; i++){
						items.push(item.get(i));
					}
				}else{
					for(var prop in item.value){
						items.push(item.get(prop));
					}
				}

				switch(type){
					case "orderByList":
						var itemList = _orderByList(items, parameter);
						break;

				}

				for(var i = 0; i < itemList.length; i++){
					callback(itemList[i]);
				}
				
			}

		}
	}
);