var urlGeoserverWfs= urlGeoserver243 + '/wfs';
var openLayersExcoUtil = {	
		activarCapaTematica:function(nombreCapa,activa){
			var mLayers = Heron.App.map.layers;
			for(var a = 0; a < mLayers.length; a++ ){
				if(mLayers[a].name == nombreCapa){
					mLayers[a].setVisibility(activa);
					mLayers[a].setZIndex(1000);
					break;
				}
			};
		},

		addWFSLayer:function (nombreCapa,featureType,filtroField,filtroValue){
			OpenLayers.ProxyHost = urlProxy;
			var demandaLayer = Heron.App.map.getLayersByName(nombreCapa);
			if(demandaLayer[0])
				Heron.App.map.removeLayer(demandaLayer[0]);
			var layerWFS = new OpenLayers.Layer.Vector(nombreCapa, {
					strategies: [new OpenLayers.Strategy.BBOX()],
					visibility : true,
					displayInLayerSwitcher:true,
					protocol: new OpenLayers.Protocol.WFS({
						url:  urlGeoserverWfs,
        				featureType: featureType,
        				geometryName: 'geom',
					}),
					filter: new OpenLayers.Filter.Logical({
	                    type: OpenLayers.Filter.Logical.AND,
	                    filters: [
	                        new OpenLayers.Filter.Comparison({
	                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
	                            property: filtroField,
	                            value: filtroValue
	                        })
	                    ]
	                })
				});

			Heron.App.map.addLayer(layerWFS);

			layerWFS.events.on({
				   featuresadded: function(e) {
				   	layerWFS.setZIndex(100);
				    recuperaDatosMapeoDemanda();
			   		}
			});		
		},

		addWFSfromWMSLayer:function(nombreCapa,filtroField,filtroValue){
			OpenLayers.ProxyHost = urlProxy;
			var layerWMS = new OpenLayers.Layer.WMS( nombreCapa,
                    urlGeoserver243 + '/wms',
                    {layers: 'ahiss:geo_cantones',transparent: true,format: 'image/png'},
            		{isBaseLayer: false, visibility:true});
			
            var select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
                new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
            });
            
            var hover = new OpenLayers.Layer.Vector("Hover");
            
            Heron.App.map.addLayers([layerWMS,hover, select]);
            
            var control = new OpenLayers.Control.GetFeature({
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(layerWMS,{
                	filter: new OpenLayers.Filter.Logical({
	                    type: OpenLayers.Filter.Logical.AND,
	                    filters: [
	                        new OpenLayers.Filter.Comparison({
	                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
	                            property: filtroField,
	                            value: filtroValue
	                        })
	                    ]
	                })
                }),
                box: true,
                hover: true,
                multipleKey: "shiftKey",
                toggleKey: "ctrlKey"               
            });

            control.events.register("featureselected", this, function(e) {
                select.addFeatures([e.feature]);
            });
            control.events.register("featureunselected", this, function(e) {
                select.removeFeatures([e.feature]);
            });
            control.events.register("hoverfeature", this, function(e) {
                hover.addFeatures([e.feature]);
            });
            control.events.register("outfeature", this, function(e) {
                hover.removeFeatures([e.feature]);
            });
            
            Heron.App.map.addControl(control);
            control.activate();
		},

		fadeHex:function(hex, hex2, ratio){
			var r = hex>>16;
			var g = hex>>8&0xFF;
			var b = hex&0xFF;
			r += ((hex2>>16)-r)*ratio;
			g += ((hex2>>8&0xFF)-g)*ratio;
			b += ((hex2&0xFF)-b)*ratio;
			return(r<<16 | g<<8 | b);
		}
			
}

