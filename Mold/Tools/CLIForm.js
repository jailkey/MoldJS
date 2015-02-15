Seed({
		name : "Mold.Tools.CLIForm",
		dna : "class",
		include : [
			"Mold.Lib.Event",
			{ Validation : "Mold.Lib.Validation" },
			"Mold.Lib.Promise"
		]
	},
	function(cli, formFields){

		var _cli = cli,
			_fields = formFields || [],
			_collected = [],
			_that = this,
			_count = 0;

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _executeField = function(field){
			var readFunc = function(data, reader){
		
				data = Mold.trim(data);
				
				_collected[field.input.name] = data;
				if(field.input.validate){

					var validation = Validation.get(field.input.validate);
					if(validation && validation(data)){
						
						if(field.input.messages.success){
							if(typeof field.input.messages.success === "function"){
								_cli.write(field.input.messages.success(data) + "\n");
							}else{
								_cli.write(field.input.messages.success + "\n");
							}

						}
						if(field.input.onsuccess){
							field.input.onsuccess.call(_that, data, reader)
						}
					
					}else{
						
						if(field.input.messages.error){
							if(typeof field.input.messages.error === "function"){
								_cli.showError(field.input.messages.error(data));
							}else{
								_cli.showError(field.input.messages.error);
							}
						}
						
						_that.repeat();
						
					}
				}else{
					if(field.input.onsuccess){
						field.input.onsuccess.call(_that, data, reader);
					}
					success(data);
				}
				_that.trigger("input", { data : data} );
			}
			_cli.write("\n");
			_cli.read(field.label + " ", function(data, reader){
				readFunc(data, reader);
			}, _cli.completer[field.input.type] || _cli.completer.default);
		
		}

		this.publics = {
			addField : function(field){
				_fields.push(field);
			},
			getData : function(){
				return _collected;
			},
			exit : _cli.exit,
			start : function(){
				_count = -1;
				return this.next();
			},
			repeat : function(){
				var field = _fields[_count];
				_executeField(field);
			},
			previous : function(){
				_count--;
				if(_count >= 0){
					var field = _fields[_count];
					_executeField(field);
					return true;
				}else{
					this.trigger("start");
					return false;
				}
			},
			next : function(pos){
				_count = (pos) ? _count + pos : _count + 1;
				if(_fields.length > _count){
					var field = _fields[_count];
					_executeField(field);
					return true;
				}else{
					this.trigger("end");
					return false;
				}
			}
		}
	}
)