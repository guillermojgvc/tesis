var ipRest = "186.101.170.100";
var puertoRest = "8081";
var ipWS = "186.101.170.100";
var puertoWS = "8081";
var wsUri =  "ws://" + ipWS + ":" + puertoWS + "/optisesa_ws/wss_optisesa";
var restUri = "http://" + ipRest + ":" + puertoRest + "/optisesa_ws/rest/ws_optisesa"; 
var websocket;
var usuario;
var ruta;
var asignado=false;
var lonAsignada;
var latAsignada;

/*function getRootUri() {
	return "ws://" + (document.location.hostname == "" ? "localhost"
					: document.location.hostname) + ":"
			+ (document.location.port == "" ? "8081" : document.location.port);
}*/