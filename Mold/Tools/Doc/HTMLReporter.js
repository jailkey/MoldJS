Seed({
		name : "Mold.Tools.Doc.HTMLReporter",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Template"
		]
	},
	function(){

		var template = new Mold.Lib.Template(function(){/*|
		<!doctype html>
		<html>
			<head>
		 		<meta charset="utf-8">
				<title>Lawn CSS</title>
				<link rel="stylesheet" type="text/css" href="http://localhost/lawn-css/css/mobile.css" media="screen">
				<script data-mold-main="Mold.GUI.Lawn.Main"
					data-mold-repository="http://localhost/lawn-css/"
					data-mold-external-repository="http://localhost/Mold Git Checkout/MoldJS/"
					data-mold-cache="off"
					data-mold-debug="on"
					src="http://localhost/Mold Git Checkout/MoldJS/Mold.js" type="text/javascript"
				></script>
			</head>
			<body>
				<h1>{{name}}</h1>
				<div class="meta-description">
					<span>file: {{url}}</span>  
					<span>dna :{{dna}}</span>
					{{#author}}<span>author: {{author}}</span>{{/author}}
					{{#version}}<span>version: {{version}}</span>{{/version}}
				</div>
				{{#test}}
				<div class="test">test:<a href="path">{{name}}</a></div>
				{{/test}}

				{{#extend}}
				<div class="extends">extends: {{$parent.extend}}</div>
				{{/extend}}

				{{#description}}
				<div class="description">{{description}}</div>
				{{/description}}
				
				<h2>Dependencies</h2>
				<ul>
				{{#include}}
					<li><a href="{{path}}">{{name}}</a></li>
				{{/include}}
				</ul>
				
				{{#trigger|exists}}
				<h2>Events</h2>
				{{/trigger}}
				
				<ul>
				{{#trigger}}
					<li><em>{{name}}</em> {{description}} </li>
				{{/trigger}}
				</ul>
				
				{{#example}}
				<h2>Example</h2>
				
				<i>{{path}}</i>
				<code>
				{{code}}
				</code>
				
				{{/example}}

				{{#methods|exists}}   
				<h2>Methods</h2>
				{{/methods}}

				{{#methods}}
				<div class="method">

					<h3>{{name}}</h3>
					{{#public}}<span is="keyword">public</span>{{/public}}
					{{#private}}<span is="keyword">private </span>{{/private}}
					{{#asyc}}<span is="keyword">async</span>{{/async}}
					<span>Defined in row: {{line}}</span> 
					<div>{{description}}</div> 

					{{#parameter|exists}}
						<h4>Arguments:</h4>
					{{/parameter}}
					<dl>
					{{#parameter}} 
						<dt>{{paraname}}<em>{{type}}</em></dt>
						<dd>{{description}}</dd>
					{{/parameter}}
					</dl>

					{{#return}}
						<div class="returns"><em>returns:</em> {{return}}</div>
					{{/return}}
					
					{{#example}}
						<div class="example">
							<h4>Example:</h4>  
							<div class="path">{{path}}</div>
							<code>
							{{code}}
							</code>
						</div> 
					{{/example}}
				</div>

				{{/methods}}
				 
				{{#properties|exists}}  
					<h3>Properties</h3>
				{{/properties}}
				
				{{#properties}}
					<div class="property">
						<h4>{{name}}</h4>
						<span>Defined in row: {{line}}</span> 
						<div class="description>{{description}}</div>
					</div>
				{{/properties}}
				 
				{{#objects|exists}}
					<h4>Objects</h4>
				{{/objects}}

				{{#objects}}
					<h4>{{name}}</h4>
					<span>Defined in row: {{line}}</span>
				{{/objects}}
			</div>
		|*/});


		var overview = new Mold.Lib.Template(function(){/*|
			{{#overview|sort:value=name:asc}}
			__[{{name}}]({{path}}.md)__  
			{{/overview}}

		|*/}, { parseAsString : true});
		
		this.publics = {
			
		/**
		 * @method report 
		 * @description returns a markdown document genereated by the given data
		 * @param  {object} data 
		 * @return {promise}    
		 */
			report : function(data){
				return template.getString(data);
			},
			overview : function(data){
				return overview.getString(data);
			},
			getFileExtension : function(){
				return ".html";
			}

		}
	}
)