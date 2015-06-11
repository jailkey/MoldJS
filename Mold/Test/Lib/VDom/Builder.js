Seed({
		name : "Mold.Test.Lib.VDom.Builder",
		dna : "test"
	},
	function(Builder){
		describe("Test Mold.Lib.VDom.Builder", function(){
			var result = false;
			it("parse some value nodes", function(){
				result = new Builder(' <ul class="irgendwas" test="hasnwurs" height="asd">{{#block}} <li class="lalala"> {{irgendwas}} <span style="color:{{farbe}};" test="irgendw as">  {{wasanders}} </span> anders </li> {{/block}} </ul> -- {{#block}} {{farbe}} -- {{farbe}} <br> {{/block}}');
				
				expect(result.dom.children.block.length).toBe(2);
				expect(result.dom.children.block[1].children.length).toBe(1);
				expect(result.dom.children.block[1].children[0].farbe).toBeDefined(2);
			});

			it("add some data", function(){
				var start = performance.now();
				var data = { block : [] };
				for(var i = 0; i < 10; i++){
					data.block.push({
						irgendwas : i,
						wasanders : Math.random(),
						farbe : "#efe" + i
					})
				}
				result.dom.setData(data);
				expect(result.dom.children.block[1].children.length).toBe(10);
			});

			it("test rendering", function(){
				var insert = result.dom.render();
				var list = insert.getElementsByTagName("ul");
				var listItem = list[0].getElementsByTagName("li")
				expect(list.length).toBe(1);
				expect(listItem.length).toBe(10);
			});

			it("add more data use direct update", function(next){
				for(var i = 0; i < 10; i++){
					result.dom.children.block[0].children[i].wasanders.setDataAndRender(Math.random());
					result.dom.children.block[0].children[i].farbe.setDataAndRender("#000");
					result.dom.children.block[0].children[i].irgendwas.setDataAndRender(2 + "." +i);
				
				}
				next();
				expect(result.dom.children.block[0].children[2].farbe.data).toBe("#000");
			});

			var secondResult = false;
			it("create vdom with negative block", function(){
				secondResult = new Builder('{{#block}}<div> show if data is set</div>{{/block}} - {{^block}} show if data is not set {{/block}}');
				expect(secondResult.dom.children.block[1].isNegative).toBe(true);
			});

			it("add some blockdata", function(){
				var data = {
					block : "show"
				}
				secondResult.dom.setData(data);
				expect(secondResult.dom.children.block[0].renderDom.length).toBe(1);
				expect(secondResult.dom.children.block[1].renderDom.length).toBe(0);
			});

			it("render block", function(){
				var insert = secondResult.dom.render();
				expect(insert.getElementsByTagName("div").length).toBe(1);
			});

			it("remove blockdata", function(){
				secondResult.dom.setData(false);
				expect(secondResult.dom.children.block[0].renderDom.length).toBe(0);
				expect(secondResult.dom.children.block[1].renderDom.length).toBe(1);
			})

			it("render block", function(){
				var insert = secondResult.dom.render();
				expect(insert.getElementsByTagName("div").length).toBe(0);
			});

			var thirdResult = false;
			it("create array block with pointer value", function(){
				thirdResult = new Builder('{{#block}}<div> {{.}} </div>{{/block}}');
				expect(thirdResult.dom.children.block.children[0]['.'].isPointer).toBe(true);
			});

			it("set array data to block", function(){
				var data = {
					block : [
						"one", "two", "three"
					]
				}
				thirdResult.dom.setData(data);
				expect(thirdResult.dom.children.block.children[0]['.'].data).toBe("one");
				expect(thirdResult.dom.children.block.children[1]['.'].data).toBe("two");
				expect(thirdResult.dom.children.block.children[2]['.'].data).toBe("three");
			});

			it("render array data to block", function(){
				var insert = thirdResult.dom.render();
				expect(insert.getElementsByTagName('div').length).toBe(3);
			});

			var foursResult = false;
			it("create value nodes with parent pointer", function(){
				foursResult = new Builder('<div>{{block.name}} {{irgendwas.anderes}}</div>');
				expect(foursResult.dom.children['block.name'].hasParentValue).toBe(true);
			});

			it("parent data", function(){
				var data = {
					block : {
						name : "hans peter"
					},
					irgendwas : {
						anderes : "test"
					}
				}
				foursResult.dom.setData(data);
				expect(foursResult.dom.children['block.name'].data).toBe("hans peter");
				expect(foursResult.dom.children['irgendwas.anderes'].data).toBe("test");
			});


			var fivesResult = false;
			it("create a block with parent pointer value nodes", function(){
				fivesResult = new Builder('{{#block}} <div>{{block.name}} {{irgendwas.anderes}}</div> {{/block}}');
				expect(fivesResult.dom.children.block.children[0]['block.name'].hasParentValue).toBe(true);
			});

			it("parent data", function(){
				var data = {
					block : {
						name : "hans peter"
					},
					irgendwas : {
						anderes : "test"
					}
				}
				fivesResult.dom.setData(data);
				expect(fivesResult.dom.children.block.children[0]['block.name'].data).toBe("hans peter");
				expect(fivesResult.dom.children.block.children[0]['irgendwas.anderes'].data).toBe("test");
			});

		})
	}
)