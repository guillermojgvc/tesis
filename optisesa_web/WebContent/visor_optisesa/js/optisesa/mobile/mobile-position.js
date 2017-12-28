function getUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else {
        alert ("El API de geolocalización no es soportado por su navegador");
    }
}

function getUbicacionActual() {
    if (navigator.geolocation) {
    	navigator.geolocation.watchPosition(showPosition,showError,{
            enableHighAccuracy:true,
            maximumAge:30000,
            timeout:20000
        });
    } else {
        alert ("El API de geolocalización no es soportado por su navegador");
    }
}

function showPosition(position) {
	send_message(codificarUbicacionJson(position));
	if(asignado==true){
		$.getJSON(restUri + "/ruta/" + position.coords.longitude + "/"+ position.coords.latitude + "/" + lonAsignada + "/" + latAsignada + "/900913" + "?callback=?").done(function(capa){
			ruta = map.getLayersByName("Ruta");
			var geojson_format = new OpenLayers.Format.GeoJSON();
			ruta[0].removeAllFeatures();
			ruta[0].addFeatures(geojson_format.read(capa[0]));
		});
	}
}

function codificarUbicacionJson(position){
	var mensaje={};
	mensaje.accion='tracking';
	mensaje.usuario=usuario;
	mensaje.posicion={};	
	mensaje.posicion.latitud = position.coords.latitude;
	mensaje.posicion.longitud = position.coords.longitude;
	mensaje.posicion.precision = position.coords.accuracy;
	mensaje.posicion.altitud = position.coords.altitude;
	mensaje.posicion.precisionAltitud = position.coords.altitudeAccuracy;
	mensaje.posicion.angulo = position.coords.heading;
	mensaje.posicion.velocidad = position.coords.speed;
	mensaje.posicion.timestamp = position.timestamp;
	return JSON.stringify(mensaje);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuario denego la petición de geolocalización");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Ubicación temporalmente no disponible");
            break;
        case error.TIMEOUT:
            alert("Ha sobrepasado el tiempo de espera");
            break;
        case error.UNKNOWN_ERROR:
            alert("A ocurrido un error inesperado");
            break;
    }
}

//getUbicacionActual();