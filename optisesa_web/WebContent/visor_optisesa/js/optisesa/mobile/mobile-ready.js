$(document).ready(function() {
	$.mobile.changePage('#inicio');
	$('#formulario').submit(function() { 
		// recolecta los valores que inserto el usuario
		var datosUsuario = $("#nombredeusuario").val();
		var datosPassword = $("#clave").val();
		
	  	archivoValidacion = restUri + "/login" + "?callback=?"

		$.getJSON( archivoValidacion, { user:datosUsuario ,pass:datosPassword})
		.done(function(respuestaServer) {
			//alert(respuestaServer.mensaje + "\nGenerado en: " + respuestaServer.hora + "\n" +respuestaServer.generador)
			if(respuestaServer[0].acceso == true ){
				if(respuestaServer[0].disponible == false){
					//si la validacion es correcta, muestra la pantalla "mappage"
					usuario = respuestaServer[0];
					verificarConexion();
					getUbicacionActual();
					$.mobile.changePage("#mappage");
				}else{
					document.getElementById("error").innerHTML = "El usuario se encuentra logeado actualmente";
					$.mobile.changePage('#dialog', 'flip', true, true);
				}
			}else{
				//Lo sentimos el usuario o password ingresado no es correcto, por favor intente nuevamente.
				// ejecutar una conducta cuando la validacion falla
				document.getElementById("error").innerHTML = "Lo sentimos el usuario o password ingresado no es correcto, por favor intente nuevamente.";
				$.mobile.changePage('#dialog', 'flip', true, true);
			}
		})
		return false;
	});
});