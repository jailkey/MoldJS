Seed (
	{ 
		name : "Mold.Data.ErrorCodes.German",
		dna : "data",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	{
		1 : function(error) {
			return "Ladefehler: Die Datei "+ error.filename + " konnte nicht geladen werden!";
		},
		2 : function(error) {
			return "Es wurde versucht einen Seed ohnen Namen hinzuzufügen";
		},
		3 : function(error){
			return "DNA create() für '"+error.dnaname+"' fehlgeschlagen. " + error.error;
		},
		4 : function(error){
			return "Der DNAhandler für das DNA '"+error.dnaname+" fehlt!";
		},
		5 : function(error){
			return "Interface Fehler: Die Eigenschaft " +error.property + " der Klasse " + error.instance.className + " muss vom Typ " + typeof error.interface[property] + " sein!";
		},
		6 : function(error){
			return "Interface Fehler: Der Klasse " +error.instance.className+ " fehlt die Eigenschaft " +error.property + " vom Typ "+(typeof error.interface[error.property])
		},
		7 : function(error){
			return "Interface Fehler: Als Rückgabewert der Methode " +error.property+ ", der Klasse "+ error.instance.className +", wird ein Wert vom Typ " + error.valuetype + " erwartet!"
		},
		8 : function(error){
			return "Ladefehler: Seed "+error.seedname+" wurde geladen aber nicht initialisiert, vermutlich stimmen Seedname und Dateiname nicht ueberein!"
		},
		9 : function(error){
			return "Code "+error.inject+" konnte nicht injiziert werden! Funktionsobjekt:"+error.func; 
		}
	}
);