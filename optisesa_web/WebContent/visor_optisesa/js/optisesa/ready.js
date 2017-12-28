$(document).ready(function() {
	//click = new OpenLayers.Control.Click();
	//Heron.App.map.addControl(click);
	//$.mobile.changePage('#inicio');
	$('#botonGuardar').click(function() {
		try {
			document.getElementById('panelUnidades').removeChild(document.getElementById('punidades'));
		}
		catch(err) {
		    
		}
		
		if($('#er_unidad').prop('checked')){
			$.getJSON( urlServerRest+'unidades/'+ $('#er_lon').val() + '/' + $('#er_lat').val() + '?callback=?')
			.done(function(respuestaServer) {
				var mostrarBoton = document.getElementById('panelUnidades');
				mostrarBoton.setAttribute('style','width:100%');
				var panelDinamico = document.createElement('div');
				panelDinamico.setAttribute('id','punidades');
				document.getElementById('panelUnidades').appendChild(panelDinamico);
				document.getElementById('punidades').appendChild(document.createElement('br'));
				for (var i=0; i<respuestaServer.length;i++) {        

				    var choiceSelection = document.createElement('input');
				    var choiceLabel = document.createElement('label');

				    choiceSelection.setAttribute('type', 'radio');

				    choiceSelection.setAttribute('name', 'ambulancias');
				    choiceSelection.setAttribute('value', respuestaServer[i].serial_usr);
				    choiceLabel.innerHTML=respuestaServer[i].nombre_usr + ' - ' + respuestaServer[i].distancia_km + ' km';
				    //choiceLabel.setAttribute('for', question.choices[choice]);

				    document.getElementById('punidades').appendChild(choiceSelection);
				    document.getElementById('punidades').appendChild(choiceLabel);
				    document.getElementById('punidades').appendChild(document.createElement('br'));
				    }
			});
			
		}
		// recolecta los valores que inserto el usuario
		/*var datosUsuario = $("#nombredeusuario").val();
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
		return false;*/
	});
	$('#asignarUnidad').click(function() {
		var id=$("input[type='radio'][name='ambulancias']:checked").val();
		var mensaje={};
		mensaje.accion='asignar';
		mensaje.usuarioId= id;
		mensaje.posicion={};	
		mensaje.posicion.latitud = $('#er_lat').val();
		mensaje.posicion.longitud = $('#er_lon').val();
		send_message(JSON.stringify(mensaje));
		
		document.getElementById('panelUnidades').removeChild(document.getElementById('punidades'));
		var mostrarBoton = document.getElementById('panelUnidades');
		mostrarBoton.setAttribute('style','width:100%;visibility:hidden;');
	});
});