Seed({
		name : "Mold.Lib.Worker",
		dna : "class",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Info"
		]
	},
	function(workerFunction){
		
		Mold.mixing(this, new Mold.Lib.Event(this));
		var that = this;

		if(Mold.Lib.Info.isSupported("blob") && Mold.Lib.Info.isSupported("url")){
			var workerString = workerFunction.toString();
			workerString = "onmessage = "+workerString;
	 		var workerBlob = new Blob([workerString], { type : 'text/javascript' } );
			var workerURL = URL.createObjectURL(workerBlob);
			var worker = new Worker(workerURL);
			worker.onmessage = function(e) {

				that.trigger("message", e.data);
			};
		}
			
		this.publics = {
			post : function(message, id){
				if(worker){
					worker.postMessage(message);
				}else{
					/* if worker is not supported add post execute directly*/
					/*implement*/


					throw "NO WORKER DEIFNED"
				}
			}
		}

	}
)