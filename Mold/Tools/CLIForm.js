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
			return new Mold.Lib.Promise(function(success, error){
				_cli.write(field.label);
				_cli.read(function(data){
					console.log("readed", data)
					if(field.input.validate){

						var validation = Validation.get(field.input.validate)
						if(validation && validation(data)){
							_collected[field.input.name] = data;
							if(field.input.message.success){
								if(typeof field.input.message.success === "function"){
									_cli.write(field.input.message.success(data));
								}else{
									_cli.write(field.input.message.success);
								}

								
							}
							if(field.input.onsuccess){
								field.input.onsuccess(_that, data);
							}
							success(data);
						}else{
							if(field.input.message.error){
								if(typeof field.input.message.error === "function"){
									_cli.write(field.input.message.error(data));
								}else{
									_cli.write(field.input.message.error);
								}
							}
							if(field.input.onsuccess){
								field.input.onsuccess(_that, data);
							}
							error(data)
						}
					}else{
						if(field.input.onsuccess){
							field.input.onsuccess(_that, data);
						}
						success(data);
					}
					_that.trigger("input", { data : data} );
				});
			})
		}

		this.publics = {
			addField : function(field){
				_fields.push(field);
			},
			getData : function(){
				return _collected;
			},
			start : function(){
				_count = -1;
				return this.next();
			},
			previous : function(){
				_count--;
				if(_count >= 0){
					var field = _fields[_count];
					return _executeField(field);
				}else{
					this.trigger("start");
					return false;
				}
			},
			next : function(pos){
				_count = (pos) ? _count + pos : _count + 1;
				if(_fields.length > _count){
					var field = _fields[_count];
					return _executeField(field);
				}else{
					this.trigger("end");
					return false;
				}
			}
		}
	}
)