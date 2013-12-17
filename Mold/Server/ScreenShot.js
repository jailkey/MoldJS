Seed(
	{ 
		name : "Mold.Server.ScreenShot",
		dna : "class",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	function(){
		var page = require('webpage').create(),
			system = require('system')
		
		var _config = _config || {
			viewPortWidth : 1200,
			viewPortHeight : 699
		}
			
		var _createScreenshot = function(url, target){
			page.viewportSize = { width: _config.viewPortWidth, height: _config.viewPortHeight };
			
		
			if (_config.zoomFactor) {
				page.zoomFactor = _config.zoomFactor;
			}
			page.open(url, function (status) {
				console.log("do screenshot");
				if (status !== 'success') {
					console.log('Unable to load the url!');
					phantom.exit();
				} else {
					window.setTimeout(function () {
						console.log("output", target);
						page.render(target);
						phantom.exit();
					}, 200);
				}
			});
			
		}
		
		console.log("create Screenshot modul");
		
		
		this.publics = {
			create : _createScreenshot
		}
	}
);