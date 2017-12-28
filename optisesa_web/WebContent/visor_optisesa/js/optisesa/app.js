/**
Core script to handle the entire theme and core functions
**/
//url del servidor de aplicaciones
var urlServer= "http://186.101.170.100";
//url del servidor de mapas en internet
var urlServidorGeoServer= "http://186.101.170.100";
//proxy para acceso crossdomain en jsp
var urlProxy= "proxy.jsp?";//"proxy.php?url="; //
//url del servidor de mapas en internet
var urlGeoserver243= urlServidorGeoServer + ":8895/geoserver";
//url para la impresión de mapas
var urlMapfishPrint=urlServer+':8081/ahiss/print/pdf';
//url para los servicios rest
var urlServerRest = urlServer+":8081/optisesa_ws/rest/ws_optisesa/";
//url para los servicios rest de descarga
var serviceUrl=urlServerRest+'descarga';
//url para los websockets
var ipWS = "186.101.170.100";
//puerto websockets
var puertoWS = "8081";
//uri para los websockets
var wsUri =  "ws://" + ipWS + ":" + puertoWS + "/optisesa_ws/wss_optisesa"; 
//variable para asignar la conexión del websocket
var websocket;
//variable para asignar el objeto json usuario producto del login.
var usuario;
//Inicio de la configuración inicial (requerimientos básicos para iniciar la aplicación)
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
            defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },

            initialize: function(options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                ); 
                this.handler = new OpenLayers.Handler.Click(
                    this, {
                        'click': this.onClick
                    }, this.handlerOptions
                );
            }, 

            onClick: function(evt) {
            	var vectorLayer=Heron.App.map.getLayersByName('punto');
                vectorLayer[0].removeAllFeatures();
                var lonlat = Heron.App.map.getLonLatFromPixel(evt.xy);
                var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                var numBuffer =  10*(19-Heron.App.map.getZoom());
                var mycircle = OpenLayers.Geometry.Polygon.createRegularPolygon
                (
                    point,
                    numBuffer,
                    40,
                    0
                );
                var datapoint = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                var proj_1 = new OpenLayers.Projection(Heron.App.map.getProjection());
                var proj_2 = new OpenLayers.Projection("EPSG:4326");
                datapoint.transform(proj_1, proj_2);
                $("#er_lon").val(datapoint.x);
                $("#er_lat").val(datapoint.y);
                var featurecircle = new OpenLayers.Feature.Vector(mycircle);
                vectorLayer[0].addFeatures([featurecircle]);
                //vectorLayer[0].redraw();
                //map.addLayer(vectorLayer);
            }
        });
var App = function () {
    //* END:CORE HANDLERS *//
    return {
        //main function to initiate the theme
        init: function () {
			//Inicia la llamada a los componentes (capas y configuración del mapa)
            inicializarComponentes();
            // handles full screen
        }
    };
}();