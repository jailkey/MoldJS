Seed(
	{ 
		name : "Mold.Test",
		dna : "controller",
		include : [
			"external->Mold.DNA.Controller",
			"external->Mold.Lib.Template",
			"external->Mold.Lib.Model",
			"external->Mold.Lib.List"
		]
	},
	function(){
	
		var template = new Mold.Lib.Template(function(){
			/*|
				<div class="test">{{name}}</div>
				as{{hans}}{{peter}}<div class="test">{{vorname}}</div>
				{{#list}}
					<div class="test" style="background-color:{{background}};">{{test}}</div>
				{{/list}}
				<a href="{{link}}">Hier noch ein Link</a>
				{{#adress}}
					<div class="test">{{number}}</div>
					<div class="test">{{plz}}</div>

					{{#nocheineliste}}
						<div>
						{{valuelu}}
						</div>
					{{/nocheineliste}}
					sasdasd

					INHALT IN ADRESSE
					
					{{testzwei}}
				{{/adress}}
			|*/
		});


		var content = template.get();
		console.log(content);


		document.querySelector(".template-target").appendChild(content)
		window.template = template;

var userModel = new Mold.Lib.Model({
			propertys : {
				"name" : "string",
				"vorname" : "string",
				"list" : [
					{ "test" : "string", "background" : "string" }
				]
			}
		});

userModel.data.name = "Hans"

		
/*
		

		userModel.on("change", function(e){
			template.append(e.data.data);
		});


		userModel.data.name = "Hanswurdst";

		userModel.data.vorname = "vorname";
	
		userModel.data.list.push({ "test" : "irgendwas" })
		
*/

	//	window.model = userModel;

		this.actions = {
			"@setname" : function(e){
				//userModel.data.name = e.data.urlparameter.name;
				//userModel.data.vorname = e.data.urlparameter.vorname;
				//console.log("setname", e)
			}

		}
	}
);