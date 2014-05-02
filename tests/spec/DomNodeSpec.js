describe("Mold.Lib.DomNode Tests", function () {
	describe("Load and create DomNode, Test methodes", function(){
		
		var flag = false;
		var isMoldReady = false;
		var testNode = false;
		var childNode = false;
		var secondChildNode = false;
		var thirdChildNode = false;
		var attributNode = false;

		it("Load Seed", function(){

			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "external->Mold.Lib.DomNode" });

			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});

		it("create DomNode", function(){
			 testNode = new Mold.Lib.DomNode(1, 'div');
		});

		it("test if all properties have the right value", function(){
			expect(testNode.nodeType).toEqual(1);
			expect(testNode.nodeValue).toEqual("");
			expect(testNode.nodeName).toEqual("div");
			expect(testNode.parentNode).toEqual(false);
			expect(testNode.nextSibling).toEqual(false);
			expect(testNode.previousSibling).toEqual(false);
			expect(testNode.firstChild).toEqual(false);
			expect(testNode.attributes.length).toEqual(0);
			expect(testNode.childNodes.length).toEqual(0);
			console.log("testNode", testNode);
		})

		it("create child node and append to node", function(){
			childNode = new Mold.Lib.DomNode(1, 'span');
			secondChildNode  = new Mold.Lib.DomNode(1, 'a');
			thirdChildNode = new Mold.Lib.DomNode(1, 'table')
			testNode.appendChild(childNode);
			testNode.appendChild(secondChildNode);
			testNode.appendChild(thirdChildNode);
		});

		it("test if after .appendChild all properties have the right value", function(){
			expect(testNode.parentNode).toEqual(false);
			expect(testNode.nextSibling).toEqual(false);
			expect(testNode.previousSibling).toEqual(false);
			expect(testNode.firstChild).toEqual(childNode);
			expect(testNode.lastChild).toEqual(thirdChildNode);
			expect(testNode.attributes.length).toEqual(0);
			expect(testNode.childNodes.length).toEqual(3);

		});

		it("test if childNode properties are correct", function(){
			expect(secondChildNode.nodeType).toEqual(1);
			expect(secondChildNode.nodeValue).toEqual("");
			expect(secondChildNode.nodeName).toEqual("a");
			expect(secondChildNode.parentNode).toEqual(testNode);
			expect(secondChildNode.nextSibling).toEqual(thirdChildNode);
			expect(secondChildNode.previousSibling).toEqual(childNode);
			expect(secondChildNode.firstChild).toEqual(false);
			expect(secondChildNode.attributes.length).toEqual(0);
			expect(secondChildNode.childNodes.length).toEqual(0);
		});

		it("test .removeChild", function(){
			testNode.removeChild(secondChildNode);
		})

		it("test node properties after removeChild", function(){
			expect(testNode.parentNode).toEqual(false);
			expect(testNode.nextSibling).toEqual(false);
			expect(testNode.previousSibling).toEqual(false);
			expect(testNode.firstChild).toEqual(childNode);
			expect(testNode.lastChild).toEqual(thirdChildNode);
			expect(testNode.hasChildNodes()).toEqual(true);
			expect(testNode.childNodes.length).toEqual(2);
		});

		it("test childNode properties after removeChild", function(){
			expect(thirdChildNode.parentNode).toEqual(testNode);
			expect(thirdChildNode.nextSibling).toEqual(false);
			expect(thirdChildNode.previousSibling).toEqual(childNode);
			expect(childNode.parentNode).toEqual(testNode);
			expect(childNode.nextSibling).toEqual(thirdChildNode);
			expect(childNode.previousSibling).toEqual(false);
		});

		it("test .cloneNode", function(){
			var clone = testNode.cloneNode(true);
			clone.nodeValue = "TEST";
			expect(clone.nodeValue).toEqual("TEST");
			expect(testNode.nodeValue).toEqual("");
		})

		it("add a attribute node", function(){
			attributNode = new Mold.Lib.DomNode(2, "style")
			attributNode.nodeValue = "color:#fff000;";
			testNode.setAttributeNode(attributNode);
		});

		it("test properties after adding attribute node", function(){
			expect(testNode.attributes.length).toEqual(1);
		});

		it("test .getAtttribute", function(){
			expect(testNode.getAttribute('style')).toEqual("color:#fff000;");
		});

		it("test .getAtttributeNode", function(){
			expect(testNode.getAttributeNode('style')).toEqual(attributNode);
		});

		it("test .setAttribute", function(){
			testNode.setAttribute('height', '20');
			expect(testNode.getAttribute('height')).toEqual('20');
			expect(testNode.attributes.length).toEqual(2);
		});

		it("test .removeAttributeNode", function(){
			testNode.removeAttributeNode(attributNode);
			expect(testNode.getAttribute('style')).toEqual(false);
			expect(testNode.attributes.length).toEqual(1);
		});

		it("test .removeAttribute", function(){
			testNode.removeAttribute('height');
			expect(testNode.getAttribute('height')).toEqual(false);
			expect(testNode.attributes.length).toEqual(0);
		});

		it("get .innerHTML ", function(){
			console.log("innerHTML", testNode.innerHTML);
		});

		it("set .innerHTML", function(){
			testNode.innerHTML = '<div name="irgendwas"><span class="hans">Text</span></div><div id="test-1"></div><div id="test-2">lalla</div>';
			expect(testNode.childNodes[0].attributes[0].nodeName).toEqual("name");
		});


		it("set .insertBefore", function(){
			
			var test = testNode.childNodes[1];
			var insertNode = new Mold.Lib.DomNode(1, "span");
			insertNode.setAttribute("id", "hans");
			testNode.insertBefore(insertNode, test);
			//console.log("INSERT BERFORE", testNode);
			expect(testNode.childNodes[1].getAttribute('id')).toEqual("hans")
		});

		it("test remove all elements from one and append to another", function(){
			var newNode = new Mold.Lib.DomNode(11);
		
			while(testNode.hasChildNodes()){
				var removed = testNode.removeChild(testNode.firstChild);
				newNode.appendChild(removed);
			}
			expect(testNode.hasChildNodes()).toEqual(false);
			expect(newNode.childNodes.length).toEqual(4);
		});
		
		
	});


});