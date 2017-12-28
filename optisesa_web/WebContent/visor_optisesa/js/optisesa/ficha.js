var map,itemFicha,servFicha,urlServer= "http://127.0.0.1";
var urlServerRest = urlServer + ":8080/optisesa_ws/rest/ws_optisesa/";
var varTabla, varCodigo;
    
    jQuery(document).ready(function() {
        itemFicha = $.getURLParam("itemFicha");
        servFicha = $.getURLParam("servFicha");
        $("#btn_pdf").kendoButton({
            imageUrl: "img/pdf_icon.png"
        });
        

        switch (servFicha) {
            case 'ringprov/':
                $("#titUT").html("Provincia");
                $("#trprov").hide();
                $("#trcan").hide();
                varTabla = 'provincia';
                varCodigo = 'pro';
                break;
            case 'ringcanton/':
                $("#titUT").html("Cantón");
                $("#tdprov").html("Provincia");
                $("#trprov").show();
                $("#trcan").hide();
                varTabla = 'canton';
                varCodigo = 'can';
                break;
            case 'ringparroquia/':
                $("#titUT").html("Parroquia");
                $("#tdprov").html("Provincia");
                $("#tdcant").html("Cantón");
                $("#trprov").show();
                $("#trcan").show();
                varTabla = 'parroquia';
                varCodigo = 'par';
                break;
            case 'ringzonas/':
                $("#titUT").html("Zona");
                $("#trprov").hide();
                $("#trcan").hide();
                varTabla = 'zona';
                varCodigo = 'zon';
                break;
            case 'ringdistritos/':
                $("#titUT").html("Distrito");
                $("#tdprov").html("Zona");
                $("#trprov").show();
                $("#trcan").hide();
                varTabla = 'distrito';
                varCodigo = 'dis';
                break;
            case 'ringcircuitos/':
                $("#titUT").html("Circuito");
                $("#tdprov").html("Zona");
                $("#tdcant").html("Distrito");
                $("#trprov").show();
                $("#trcan").show();
                varTabla = 'circuito';
                varCodigo = 'cir';
                break;
        } 
        var projection = new ol.proj.Projection({
		  code: 'EPSG:900913',
		  units: 'm'
		});
		
		var format = new ol.format.WKT();
		
		var map = new ol.Map({
		  layers: [
			new ol.layer.Tile({
			  source: new ol.source.OSM()
			})
		  ],
		  target: 'map',
		  controls: ol.control.defaults({
			attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			  collapsible: false
			})
		  }),
		  view: new ol.View({
			center: [-8817825.1926873, -164182.19543897],
			projection: projection,
			zoom: 7
		  })
		});
		

		$.getJSON(urlServerRest + servFicha + itemFicha +"?callback=?").done(function( jsonData ) {         
            $.each(jsonData, function(index, data) {
				var feature = format.readFeature(data.extring);
				var vectorLayerZUT = new ol.layer.Vector({
				  source: new ol.source.Vector({
					features: [feature]
				  }),
				  style: new ol.style.Style({
							stroke: new ol.style.Stroke({
							  color: 'blue',
							  width: 3
							})
						  })
				});
				map.addLayer(vectorLayerZUT);
				var zoom = vectorLayerZUT.getSource().getExtent();
				map.getView().fitExtent(zoom,map.getSize());
				for (var prop in data) {
                  if(prop!='extring' && data.hasOwnProperty(prop))
                    $("#"+prop).html(data[prop]);
                }
            });
        });

        $.getJSON(urlServerRest + "indicadoresfm/" + varTabla + "/" + varCodigo + "/" + itemFicha + "?callback=?").done(function( jsonData ) {         
           if(jsonData.length>0){
                var numreg = Math.floor(jsonData.length/2),grupo=jsonData[0].ordengrp_geo;
                var rem = jsonData.length % 2;
                if(numreg>1){
                    while (jsonData[numreg-1].ordengrp_geo==jsonData[numreg].ordengrp_geo){
                        numreg++;
                        if((numreg)==jsonData.length)
                            break;
                    }
                }
                var fuente = jsonData[0].fuente_pte;
                $('#tableizq').append('<thead><tr><th colspan="4">'+jsonData[0].grupo_geo+'<hr class="linetitulo"></th></tr></thead><tbody>');
                $.each(jsonData, function(index, data) {
                    if(index<=numreg-rem){
                        if(grupo!=data.ordengrp_geo){
                            $('#tableizq').append('<tr><th colspan="4">'+data.grupo_geo+'<hr class="linetitulo"></th></tr>');
                            grupo=data.ordengrp_geo;
                        }
                        $('#tableizq').append('<tr><td colspan="3">'+data.descripcion_pte+'</td><td>'+data.resultado+'</td></tr>');
                        if(index==numreg-rem){
                            if(numreg<jsonData.length){
                                $('#tableder').append('<thead><tr><th colspan="4">'+jsonData[numreg].grupo_geo+'<hr class="linetitulo"></th></tr></thead>');
                                grupo=jsonData[numreg].ordengrp_geo;
                            }
                        }
                    }else{
                        if(grupo!=data.ordengrp_geo){
                            $('#tableder').append('<tr><th colspan="4">'+data.grupo_geo+'<hr class="linetitulo"></th></tr>');
                            grupo=data.ordengrp_geo;
                        }
                        $('#tableder').append('<tr><td colspan="3">'+data.descripcion_pte+'</td><td>'+data.resultado+'</td></tr>');
                        if(index==jsonData.length-1)
                            $('#tableder').append('</tbody>');
                    }

                });
           }
        });
  });

function demoFromHTML() {
    var pdf = new jsPDF('p','pt','a4');
    $('#btn_pdf').css('display','none');
    pdf.addHTML(document.body,function() {
        var string = pdf.output('datauristring');
        pdf.save('Ficha.pdf');
        $('#btn_pdf').css('display','inline-block');
    });
}