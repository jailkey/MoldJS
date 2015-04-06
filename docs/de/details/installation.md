#Installations Details


## Installation (manuell clientseitig)
Um Mold zu installieren, https://github.com/jailkey/MoldJS/archive/master.zip runterlanden, im root Verzeichnis der Anwendung z.B. in den Ordner shared entpacken und folgendermaßen einbinden:

```html
	<script type="text/javascript" 
			src="app/Mold.js"
			data-mold-main="Mold.Main"
			data-mold-repository="app/"
	></script>
```

Die angegebenen Attribute konfigurieren Mold so das alle Seeds (Module) im Ordner app/ gesucht werden.  
data-mold-main weist MoldJS an als erstes die Datei /app/Mold/Main.js zu laden, diese hat in den meisten Fällen die dna 'action', 'app', oder 'urlrouter' so das sie gleich ausgeführt wird.
Mehr dazu später.


### Mit zwei Repositories arbeiten
Mold bietet die Möglichkeit mit zwei repositories zu arbeiten, so kann wiederverwendbarer Code in einem repositiory und anwendungspezifischer Code in einem anderen abgelegt werden.

```html
	<script type="text/javascript" 
			src="Mold.js"
			data-mold-main="Mold.App.Main"
			data-mold-cache="off" 
			data-mold-external-repository="shared/" 
			data-mold-repository="app/"
	></script>
```

Seeds aus dem externen repository können innerhalb der app per '->' geladen werden.
