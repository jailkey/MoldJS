Seed({
		name : "Mold.Test.Lib.VDom.RootNode",
		dna : "test"
	},
	function(RootNode){

		describe("Test Mold.Lib.VDom.RootNode", function(){
			var node;

			it("create node", function(){
				var start = performance.now();
				/*
				node = new RootNode({
					content : "<ul> {{#mylist}} <li> <div> {{#sublist}} {{test}} {{/sublist}} </div> </li>  {{/mylist}} </ul> asd"
				});
				*/
				node = new RootNode({
					content : "<ul> {{#mylist}} <li> <div> {{test}}  </div> </li>  {{/mylist}} </ul> asd"
				});
				console.log("parse time", performance.now() - start)
				console.log(node)
				
				/*expect(node.children.mylist).toBeDefined();
				expect(node.children.mylist.children.sublist).toBeDefined()
				expect(node.children.mylist.children.sublist.children.var).toBeDefined()*/
			})

			it("set node data", function(){
				
				var start = performance.now();
				var data = [];
				/*
				for(var i =0; i < 1000; i++){
					data.push({ sublist : { test : Math.random() }})
				}
				*/
				for(var i =0; i < 1000; i++){
					data.push({  test : Math.random() })
				}
				
				node.setData({
					mylist : data
				})
				console.log("set data", performance.now() - start)
			})


			it("render node", function(){
				var start = performance.now();
				var result = node.render();
				//console.log("result", result)
				console.log("render data", performance.now() - start)
				document.body.appendChild(result);
			});




		})
	}
)