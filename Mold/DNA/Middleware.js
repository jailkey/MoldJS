Seed({
		name : "Mold.DNA.Middleware",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Server.Middleware"
		]
	},
	{
		name :  "middleware",
		createBy : "new",
		create : function(seed) {
			return function(){
				return new  Mold.Server.Middleware(seed.name, seed.func.apply(Mold, arguments));
			};
		}
	}
);