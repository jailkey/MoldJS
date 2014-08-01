Seed({
		name : "Mold.Lib.Ease",
		dna : "static"
	},
	function(){

		return {
			/* valueDif = valueDif startValue = startValue*/
			linear : function(time, startValue, valueDif, duration){
				return valueDif * (time / duration)+ startValue;
			},
			easeIn : function(time, startValue, valueDif, duration){
				time /= duration;
				return valueDif * time * time + startValue;
			},
			easeOut : function(time, startValue, valueDif, duration){
				time /= duration;
				return -valueDif * time * (time - 2) + startValue;
			},
			easeInOut : function(time, startValue, valueDif, duration){
				time /= duration/2;
				if (time < 1){
					return valueDif / 2 * time * time + startValue
				}
				time--;
				return - valueDif / 2 * (time * (time - 2) - 1) + startValue;
			},
			easeInCubic : function (time, startValue, valueDif, duration) {
				time /= duration;
				return valueDif * time * time * time + startValue;
			},
			easeOutCubic : function (time, startValue, valueDif, duration) {
				time /= duration;
				time--;
				return valueDif * ( time * time * time + 1) + startValue;
			},
			easeInOutCubic : function (time, startValue, valueDif, duration) {
				time /= duration/2;
				if (time < 1) return valueDif / 2 * time * time * time + startValue;
				time -= 2;
				return valueDif / 2 * ( time * time * time + 2) + startValue;
			},
			easeInQuart : function (time, startValue, valueDif, duration) {
				time /= duration;
				return valueDif * time * time * time * time + startValue;
			},
			easeOutQuart : function (time, startValue, valueDif, duration) {
				time /= duration;
				time--;
				return -c * ( time * time * time * time - 1) + startValue;
			},
			easeInOutQuart : function (time, startValue, valueDif, duration) {
				time /= duration/2;
				if (time < 1) {
					return valueDif / 2 * time * time * time * time + startValue;
				}
				time -= 2;
				return -c/2 * (time * time * time * time - 2) + startValue;
			},
			easeInQuint : function (time, startValue, valueDif, duration) {
				time /= duration;
				return valueDif * time * time * time * time * time + startValue;
			},
			easeOutQuint : function (time, startValue, valueDif, duration) {
				time /= duration;
				time--;
				return valueDif * ( time * time * time * time * time + 1) + startValue;
			},
			easeInElastic : function (time, startValue, valueDif, duration) {

				var s = 1.70158,
					p = 0,
					a = valueDif;
				
				if(time == 0){ 
					return startValue;
				}
				if ((time /= duration) == 1){
					return startValue + valueDif; 
				}
				if (!p){
				 	p = duration * .3 
				}
				if (a < Math.abs(valueDif)) {
					a = valueDif; 
					var s = p / 4; 
				}else{
					var s = p / (2 * Math.PI) * Math.asin (valueDif/a);
				}
				return -(a * Math.pow(2, 10 * (time -= 1)) * Math.sin( (time * duration - s) * (2 * Math.PI) /p )) + startValue;
			},
			easeOutElastic : function (time, startValue, valueDif, duration) {
				var s = 1.70158;
				var p = 0;
				var a = valueDif;
				if (time == 0){ 
					return startValue;
				}
				if ((time /= duration) == 1 ){ 
					return startValue + valueDif;
				}  
				if (!p) { 
					p = duration * .3;
				}
				if (a < Math.abs(valueDif)) {
					a = valueDif;
					var s = p / 4;
				}else{ 
					var s = p / (2*Math.PI) * Math.asin (valueDif/a); 
				}
				return a * Math.pow(2, -10 * time) * Math.sin( (time * duration - s) * (2 * Math.PI) / p ) + valueDif + startValue;
			},
			
			easeInBounce : function (time, startValue, valueDif, duration) {
				return valueDif - this.easeOutBounce( d - time, 0, valueDif, duration) + startValue;
			},
			easeOutBounce : function (time, startValue, valueDif, duration) {
				if (( time /= duration) < (1 / 2.75)) {
					return valueDif * (7.5625 * time * time) + startValue;
				} else if (time < (2 / 2.75)) {
					return valueDif * (7.5625 * (time -= (1.5 / 2.75)) * time + .75) + startValue;
				} else if (time < (2.5 / 2.75)) {
					return valueDif * (7.5625 * (time -= (2.25 / 2.75)) * time + .9375) + startValue;
				} else {
					return valueDif * (7.5625 * (time -= (2.625 / 2.75)) * time + .984375) + startValue;
				}
			},
			easeInOutBounce : function (time, startValue, valueDif, duration) {
				if (time < duration/2) { 
					return this.easeOutBounce(time * 2, 0, valueDif, duration) * .5 + startValue;
				}
				return this.easeOutBounce(time * 2 - duration, 0, valueDif, duration) * .5 + valueDif * .5 + startValue;
			}
		}
	}
)