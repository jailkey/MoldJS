Seed({
		name : "Mold.Lib.Worker",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(workerFunction){
		
		Mold.mixing(this, new Mold.Lib.Event(this));
		var that = this;

		if(Mold.isSupported("blob") && Mold.isSupported("url")){
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
					throw "NO WORKER DEIFNED"
				}
			}
		}

	}
)