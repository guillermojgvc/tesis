function conectar() {
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) {
		onOpen(evt)
	};
	websocket.onmessage = function(evt) {
		onMessage(evt)
	};
	websocket.onerror = function(evt) {
		onError(evt)
	};
}

function verificarConexion(){
	if (typeof websocket != 'undefined') {
		switch (websocket.readyState) {
		case 1:
			break;
		case 0:
		case 2:
		case 3:
			conectar();
			break;
		}

	} else {
		conectar();
	}
}

function send_message(mensaje) {
	verificarConexion();
	doSend(mensaje);
}

function onOpen(evt) {
	doSend(codificarAperturaJson('conexion'));

}

function codificarAperturaJson(tipoConexion){
	var mensaje={};
	mensaje.accion=tipoConexion;
	mensaje.usuario= usuario;
	return JSON.stringify(mensaje);
}

function onMessage(evt) {
	var mensaje = JSON.parse(evt.data);
	if (mensaje.accion=="asignar"){
		asignado=true;
		lonAsignada=mensaje.posicion.longitud;
		latAsignada=mensaje.posicion.latitud;
	}
	
	//writeToScreen("Mensaje Recibido: " + evt.data);
	/*$.getJSON(restUri + "/ruta" + '/-78.502/-0.213/' + position.coords.longitude + "/"+ position.coords.latitude + "/900913" + "?callback=?").done(function(capa){
		ruta = map.getLayersByName("Ruta");
		var geojson_format = new OpenLayers.Format.GeoJSON();
		ruta[0].removeAllFeatures();
		ruta[0].addFeatures(geojson_format.read(capa[0]));
	});*/
	/*ruta = map.getLayersByName("Ruta");
	var geojson_format = new OpenLayers.Format.GeoJSON();
	ruta[0].removeAllFeatures();
	ruta[0].addFeatures(geojson_format.read(evt.data));*/
}

function onError(evt) {
	//writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
	websocket.send(message);

}

//verificarConexion();