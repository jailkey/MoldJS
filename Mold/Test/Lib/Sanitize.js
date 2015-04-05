Seed({
		name : "Mold.Test.Lib.Sanitize",
		dna : "test"
	},
	function(Sanitize){
		
		describe("Test Mold.Lib.Sanitize" , function(){
			var san = false;

			it("create instace", function(){
				san  = new Sanitize();
			})

			it(".whitelist()", function(){
				var result = san.whitelist("abcde", "aed");
				expect(result).toBe("ade");
			})
			

			it(".blacklist()", function(){
				var result = san.blacklist("abcde", "aed");
				expect(result).toBe("bc");
			})

			it(".url()", function(){
				var result = san.url('/hans/"testmann/?@asd/.)(&)%$nas');
				expect(result).toBe("/hans/testmann/?asd/.&nas");
			})

			describe(".html()", function(){

				it("remove script injection", function(){
					var markup = '<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>';
					var result = san.html(markup);
					
					expect(result).toBe("");
				});

				it("remove image XSS javascript directive", function(){
					var markup = '<IMG SRC="javascript:alert(\'XSS\');">';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				});

				it("remove non qoute XSS directive", function(){
					var markup = '<IMG SRC=javascript:alert(\'XSS\')>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				});

				it("remove case insnsitive directive", function(){
					var markup = '<IMG SRC=JaVaScRiPt:alert(\'XSS\')>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				});

				it("remove case insnsitive directive", function(){
					var markup = '<IMG SRC=JaVaScRiPt:alert(\'XSS\')>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				});


				it("remove html entitys", function(){
					var markup = '<IMG SRC=javascript:alert(\"XSS\")>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				});

				it("remove grave accent obfuscation", function(){
					var markup = '<IMG SRC=`javascript:alert("RSnake says, \'XSS\'")`>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertRSnakesaysXSS" >');
				});

				it("remove grave accent obfuscation", function(){
					var markup = '<IMG SRC=`javascript:alert("RSnake says, \'XSS\'")`>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertRSnakesaysXSS" >');
				});

				it("remove event handler", function(){
				
					var markup = '<a onmouSeoVer="alert(document.cookie)">xxs link</a>';
					var result = san.html(markup);
					expect(result).toBe('<a ="alert(document.cookie)">xxs link</a>');
				})


				it("remove src attribute by leaving it empty", function(){
				
					var markup = '<IMG SRC= onmouseover="alert(\'xxs\')">';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC= ="alert(\'xxs\')">');
				})

				it("remove decimal html character references", function(){
				
					var markup = '<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove decimal html character references without trailing semicolon", function(){
				
					var markup = '<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove decimal html character references without trailing semicolon", function(){
				
					var markup = '<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove hexadecimal html character references without trailing semicolon", function(){
				
					var markup = '<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove break up xss", function(){
				
					var markup = '<IMG SRC="jav	ascript:alert(\'XSS\');">';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove embeded encode xss", function(){
				
					var markup = '<IMG SRC="jav&#x09;ascript:alert(\'XSS\');">';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove embeded newline", function(){
				
					var markup = '<IMG SRC="jav&#x0A;ascript:alert(\'XSS\');">';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove embeded carriage return", function(){
					var markup = '<IMG SRC="jav&#x0D;ascript:alert(\'XSS\');">';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove spaces and meta chars", function(){
					var markup = '<IMG SRC=" &#14;  javascript:alert(\'XSS\');">';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alertXSS" >');
				})

				it("remove extra braked xss", function(){
					var markup = '<<SCRIPT>alert("XSS");//<</SCRIPT>';
					var result = san.html(markup);
					expect(result).toBe('<');
				})

				it("remove xss from none unclosed tags", function(){
					var markup = '<IMG SRC="javascript:alert(\'XSS\')"';
					var result = san.html(markup);
					expect(result).toBe('<IMG SRC="alert(\'XSS\')"');
				})



			});
			
		});	
		
	}
)