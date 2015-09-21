Seed({
		name : "Mold.Tools.Doc.MarkDownReporter",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Template"
		]
	},
	function(){

		var template = new Mold.Lib.Template(function(){/*|
			
			#{{name}}
			---------------------------------------

			__file__: {{url}}  
			__dna__: {{dna}}  
			{{#author}}__author__: {{author}}  {{/author}}
			{{#version}}__version__: {{version}}  {{/version}}
	
			{{#test}}
			__test__: [{{name}}]({{path}}.md) 
			{{/test}}

			{{#description}}
				{{description}}
			{{/description}}
			
			###Dependencies
			--------------
			{{#include}}
			* [{{name}}]({{path}}.md) {{/include}}
			
			{{#example}}
			###Example
			--------------
			*{{path}}*

			```
			{{code}}
			```
			

			{{/example}}
			   
			###Methods
			--------------
			{{#methods}}
			#####{{name}}
				{{description}}  
			Defined in row: {{line}}   
			Arguments: {{^parameter}}no{{/parameter}}
			{{#parameter}}
			* __{{paraname}}__ (_{{type}}_) - {{description}} {{/parameter}}
			{{#return}}returns: {{return}}{{/return}}
			{{#example}}
			__Example:__  
			``{{example}}`
			{{/example}}
			{{/methods}}
			   
			###Properties
			-------------
			{{#properties}}
			#####{{name}}
				{{description}}  
			Defined in row: {{line}}  
			{{#return}}returns: {{return}}{{/return}}
			{{/properties}}
			 
			
			###Objects
			------------
			{{#objects}}
			#####{{name}}
			Defined in row: {{line}}  
			Parameter: {{^parameter}}no{{/parameter}}
			{{#parameter}}
			* __{{paraname}}__ (_{{type}}_) - description: {{description}}
			{{/parameter}}
			returns: {{return}}
			{{/objects}}

		|*/}, { parseAsString : true});



		
		this.publics = {
			report : function(data){
				return template.getString(data)
			},
			getFileExtension : function(){
				return ".md";
			}

		}
	}
)