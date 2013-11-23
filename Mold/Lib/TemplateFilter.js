Seed({
		name : "Mold.Lib.TemplateFilter",
		dna : "static"
	},
	function(){
		var _filter = {}

		var _add = function(filter){
			_filter[filter.name] = filter;
		}


		_add({
			name : "max",
			select : "child",
			type : "visibility",
			action : function(template, data){
				//var filterModel = 
				//console.log(element, element.visibleChildLength())
		

				if(data.element.isChildHidden(data.child.getIndex())){
					return false;
				}
				if(data.element.visibleChildLength() > data.parameter){
					if(data.rowcount < data.parameter){
						return true;
					}else{
						return "exit";
					}
				}else{

					return true;
				}
			}
		});

		_add({
			name : "search",
			select : "child",
			type : "visibility",
			action : function(template, data){
				if(data.viewModel.search &&  data.viewModel.search.q){
					if(data.child.getValues() == data.viewModel.search.q){
						return true;
					}else{
						return false;
					}
				}
				return true;
			}
		})

		return {
			add : function(filter){
				_add(filter);
			},
			get : function(name){

				return _filter[name];
			},
			use : function(data, viewModel, template, element){
				var output = false;
				Mold.each(element.filter, function(filter){
					if(_filter[filter]){
						output = _filter[filter].action.call(this, data, viewModel, template, element);
					}
				});
				return output;
			}
		}
	}
)