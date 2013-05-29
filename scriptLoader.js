var script;

function loadScript(path, url, fn){
    script = document.createElement("script")
    script.type = "text/javascript";
    script.src = path + url;
	document.getElementsByTagName("head")[0].appendChild(script);

	
	if (fn !== undefined) {
		
		script.onreadystatechange = function () {
		
			if (script.readyState == "complete") {
				fn();
			} else if (script.readyState == "loaded") {
				fn();
			}
		}

		script.onload = function() {fn();};
	}

	console.log("Loaded: " + url);
}
