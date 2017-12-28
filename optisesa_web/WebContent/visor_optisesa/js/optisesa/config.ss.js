var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf"; //key de Bing Map (se debe cambiar para ambientes de producción pagando una licencia)
var map,WMSBrowser, browserWindow, gridBuscadorAhi,jssor_slider1,browserOptions = {};
var map_currentMapProjection="EPSG:900913",onDeman=true, displayPanelSS=false;
var map_ctrls_projection_systemsArr=Array(Array('EPSG:32717'), Array('EPSG:4326'), Array('EPSG:900913'));
var fieldNt= 'nom_prov_1',nameNT,valueNT,nameCapa,filterWin,panelRS,panelOS,panelColCE,capasDemanda=[];//loadingPanel;
var etiquetaRaizCapaBase="CAPAS BASE";
var iconoRaizCapaBase= "iconoCapasBase" ;
var seleccionarPunto=false;


serverStore = new Ext.data.SimpleStore({
        fields: ['url'],
        data: [
        [urlGeoserver243 +"/wms"],
        ["http://www.geoportaligm.gob.ec/geoserver/mapabase/wms"]
        ]
    });
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/** api: example[googlemaps]
 *  Google Maps
 *  -----------
 *  Use Google Maps within a Heron app.
 */
Ext.namespace("Heron");
Ext.namespace("Heron.options");
Ext.namespace("Heron.options.map");
Ext.namespace("Heron.examples");

Heron.examples.searchPanelConfig = {
  xtype: 'hr_searchcenterpanel',
  hropts: {
    searchPanel: {
      xtype: 'hr_searchbydrawpanel',
      id: 'hr-searchbydrawpanel',
      header: false,
      border: false,
      style: {
        fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
        fontSize: '12px'
      }
    },
    resultPanel: {
      xtype: 'hr_featuregridpanel',
      id: 'hr-featuregridpanel',
      header: false,
      border: false,
      autoConfig: true,
      exportFormats: ['CSV', 'XLS','GeoJSON'],
      hropts: {
        zoomOnRowDoubleClick: true,
        zoomOnFeatureSelect: false,
        zoomLevelPointSelect: 10,
        zoomToDataExtent: false
      }
    }
  }
};

//OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
//OpenLayers.ProxyHost = urlServer+":8080/print-servlet-2.0-SNAPSHOT/visor_mcds/proxy.jsp?";
OpenLayers.ProxyHost = urlProxy;
//Heron.globals.serviceUrl = urlServer+':8895/ServicioREST/rest/mcds/descarga';
Heron.globals.serviceUrl = serviceUrl;

Heron.options.map.settings = {
	projection: 'EPSG:900913',
	//displayProjection: new OpenLayers.Projection("EPSG:4326"),
	units: 'm',
	//maxExtent: '-9145843.3071048,-386771.36306915,-8460356.0375388,-10701.183958431',
	maxExtent: '-20037508.34,-20037508.34,20037508.34,20037508.34',
	center: '-8736714.1132653,-25224.219330598',
	maxResolution: 'auto',//0.1492910708375
	xy_precision: 3,
	zoom: 11,
	theme: null,
	formatX: function (lon, precision) {
      var s = '';
      if (precision > 0)
          s = ',' + '000000000000000000'.slice(0, precision);
      return 'x: ' + Ext.util.Format.number(lon, '0.000' + s + '/i');
  },
  // Custom formatting of y coordinate text.
  formatY: function (lat, precision) {
      var s = '';
      if (precision > 0)
          s = ',' + '000000000000000000'.slice(0, precision);
      return 'y: ' + Ext.util.Format.number(lat, '0.000' + s + '/i');
  },
  /**
   * Useful to always have permalinks enabled. default is enabled with these settings.
   * MapPanel.getPermalink() returns current permalink
   *
   **/
  permalinks: {
      /** The prefix to be used for parameters, e.g. map_x, default is 'map' */
      paramPrefix: 'map',

      /** Encodes values of permalink parameters ? default false*/
      encodeType: false,
      /** Use Layer names i.s.o. OpenLayers-generated Layer Id's in Permalinks */
      prettyLayerNames: true
  }
};

Heron.options.map.layers = [
	new OpenLayers.Layer.Bing({
        name: "Calles",
        key: apiKey,
        type: "Road",
        visibility: true,
        displayInLayerSwitcher: true
    })
];

Heron.options.map.toolbar = [
  /*
    create: function (mapPanel, options) {

      // A trivial handler
      options.handler = function () {
        Heron.App.map.controls.push(new OpenLayers.Control.WMSGetFeatureInfo({
            autoActivate: true,
            infoFormat: "application/vnd.ogc.gml",
            maxFeatures: 10,
            eventListeners: {
                "getfeatureinfo": function(e) {
                    var items = [];
                    Ext.each(e.features, function(feature) {
                        items.push({
                            xtype: "propertygrid",
                            title: feature.fid,
                            source: feature.attributes
                        });
                    });
                    new GeoExt.Popup({
                        title: "Feature Info",
                        width: 200,
                        height: 200,
                        layout: "accordion",
                        map: Heron.App.map,
                        location: e.xy,
                        items: items
                    }).show();
                }
            }
        }));
      };

      // Provide an ExtJS Action object
      // If you use an OpenLayers control, you need to provide a GeoExt Action object.
      return new Ext.Action(options);
    },

    /* Options to be passed to your create function. */
    /*options: {
      tooltip:__('Feature information'),
      iconCls:"icon-getfeatureinfo",
      enableToggle:false,
      pressed:false,
      id: "setFeatureInfo"
    }*/
  {type: "pan"},
	{type: "zoomin"},
	{type: "zoomout"},
	{
		// Instead of an internal "type", or using the "any" type
		// provide a create factory function.
		// MapPanel and options (see below) are always passed
		create: function (mapPanel, options) {

			// A trivial handler
			options.handler = function () {
				Heron.App.map.setCenter(new OpenLayers.LonLat(-8736714.1132653,-25224.219330598),11);
        Ext.getCmp('pan').focus();
        $("#pan").trigger("click");
			};

			// Provide an ExtJS Action object
			// If you use an OpenLayers control, you need to provide a GeoExt Action object.
			return new Ext.Action(options);
		},

		/* Options to be passed to your create function. */
		options: {
			tooltip:__('Zoom to full extent'),
			iconCls:"icon-zoom-visible",
			id: "setCenter"
		}
	},
	{type: "zoomprevious"},
	{type: "zoomnext"},
  {type: "any", options:{xtype: 'tbspacer', width: 42,height:37}},
  //{type: ' ',options: {width: 42,iconCls:"icon-separator"}},
  {type: "measurelength", options: {geodesic: true}},
	{type: "measurearea", options: {geodesic: true}},
	{type: "any",
    options: {
      text: '',
      iconCls: 'controls_map_getpointcoordinates',
      tooltip: map_Point_GetCoordinates_tooltip,
      enableToggle: true,
      toggleGroup: "toolGroup",
      toggleHandler: function(btn, pressed) {

          if (btn.pressed) {
              Heron.App.map.events.register("click", map, map_GetCoordinates);

              map_getcoordinates_window = new Ext.Window({
                  width: 240,
                  height: 100,
                  id: 'map_getcoordinates_region',
                  title: map_Point_GetCoordinates_title,
                  closeAction: 'hide'
              });


          } else {
              Heron.App.map.events.unregister("click", map, map_GetCoordinates);
              map_getcoordinates_window.close();
          }

      }
    }
  }, 
  /*{
    type: "any",
    options: {
      text: '',
      iconCls: 'controls_map_convertcoordinates',
      tooltip: map_Point_SetCoordinates_tooltip,
      enableToggle: true,
      toggleGroup: "toolGroup",
      toggleHandler: function(btn, pressed) {

          if (btn.pressed) {

              map_setcoordinates_window = new Ext.Window({
                  width: 240,
                  height: 160,
                  id: 'map_setcoordinates_region',
                  title: map_Point_SetCoordinates_title,
                  items: [{
                      xtype: 'panel',
                      layout: 'form',
                      height: 160,
                      margin: 10,
                      items: [{
                          xtype: 'textfield',
                          width: 200,
                          anchor: '90%',
                          fieldLabel: map_Point_SetCoordinates_lon,
                          id: 'map_setCoordinates_lon'
                      }, {
                          xtype: 'textfield',
                          anchor: '90%',
                          width: 200,
                          fieldLabel: map_Point_SetCoordinates_lat,
                          id: 'map_setCoordinates_lat'
                      }, {
                          xtype: 'combo',
                          anchor: '90%',
                          width: 200,
                          fieldLabel: map_Point_SetCoordinates_Projection,
                          id: 'map_setCoordinates_projection',
                          emptyText: map_Point_SetCoordinates_Combo_EmptyText,
                          store: new Ext.data.SimpleStore({
                              fields: ['value', 'value'],
                              data: map_ctrls_projection_systemsArr
                          }),
                          displayField: 'value',
                          valueField: 'value',
                          forceSelection: true,
                          triggerAction: 'all',
                          selectOnFocus: false,
                          mode: 'local',
                          editable: false
                      }]
                  }],
                  bbar: ['->', {
                      xtype: 'button',
                      text: map_Point_SetCoordinates_Clear,
                      handler: function() {
                          removeMarkersFromMap("SetCoordinatesMarker");
                      }
                  }, {
                      xtype: 'button',
                      text: map_Point_SetCoordinates_Show,
                      handler: function() {

                          var markers = new OpenLayers.Layer.Markers("SetCoordinatesMarker");

                          Heron.App.map.addLayer(markers);

                          var size = new OpenLayers.Size(21, 25);

                          var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);

                          var icon = new OpenLayers.Icon('img/marker-green.png', size, offset);

                          var lon = Ext.get('map_setCoordinates_lon').getValue();

                          var lat = Ext.get('map_setCoordinates_lat').getValue();

                          var lonLat = new OpenLayers.LonLat(lon, lat);

                          if (map_currentMapProjection != Ext.getCmp("map_setCoordinates_projection").value) {
                              lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection(Ext.getCmp("map_setCoordinates_projection").value), new OpenLayers.Projection(map_currentMapProjection));
                          }

                          markers.addMarker(new OpenLayers.Marker(lonLat, icon));

                          Heron.App.map.setCenter(lonLat, 10);

                      }
                  }]
              });

              map_SetCoordinates();
          } else {
              map_setcoordinates_window.close();
          }
      }
    }
  },*/
  
  {type: "coordinatesearch", 
    options: {

    // === Full demo configuration ===

        // see ToolbarBuilder.js
            formWidth: 320
          , formPageX: 105
          , formPageY: 120
          //, title: 'My title'
          , titleDescription: 'Por favor, elija su sistema de coordenadas...<br>Luego ingrese los valores para la Lon/Lat o las<br>coordenadas X/Y segun lo solicitado.<br>&nbsp;<br>'
          , titleDescriptionStyle: 'font-size:11px; color:dimgrey;'
          , bodyBaseCls: 'x-form-back'
          , bodyItemCls: 'hr-html-panel-font-size-11'
          , bodyCls: 'hr-html-panel-font-size-11'
          , fieldMaxWidth: 200
          , fieldLabelWidth: 80
          , fieldStyle: 'color: #702;'
          , fieldLabelStyle: 'color: darkblue'
          , onProjectionIndex: 0
          , onZoomLevel: 11
          , showProjection: true
          , showZoom: true
          , showAddMarkers: true
          , checkAddMarkers: true
          , showHideMarkers: true
          , checkHideMarkers: false
          , showResultMarker: false
          , fieldResultMarkerStyle: 'color: green;'
          , fieldResultMarkerText: 'Marker position: '
          , fieldResultMarkerSeparator: ' | '
          , fieldResultMarkerPrecision: 4
          , removeMarkersOnClose: true
          , showRemoveMarkersBtn: true
          , buttonAlign: 'center'   // left, center, right
            /*
              http://spatialreference.org/ref/epsg/4326/
              EPSG:4326
              WGS 84
                WGS84 Bounds: -180.0000, -90.0000, 180.0000, 90.0000
                Projected Bounds: -180.0000, -90.0000, 180.0000, 90.0000

              http://spatialreference.org/ref/epsg/28992/    
              EPSG:28992
              Amersfoort / RD New
                WGS84 Bounds: 3.3700, 50.7500, 7.2100, 53.4700
                Projected Bounds: 12628.0541, 308179.0423, 283594.4779, 611063.1429
            */
          , hropts: [
            {
                projEpsg: 'EPSG:4326'
              , projDesc: 'EPSG:4326 - WGS 84'
              , fieldLabelX: 'Lon [Grad]'
              , fieldLabelY: 'Lat [Grad]'
              , fieldEmptyTextX: 'Por favor, ingrese el valor de la longitud...'
              , fieldEmptyTextY: 'Por favor, ingrese el valor de la latitud...'
              , fieldMinX: -180
              , fieldMinY: -90
              , fieldMaxX: 180
              , fieldMaxY: 90
              , fieldDecPrecision: 6
              , iconWidth: 32
              , iconHeight: 32
              , localIconFile: 'bluepin.png'
              , iconUrl: null
            }
            ,
            {
                projEpsg: 'EPSG:900913'
              , projDesc: 'Google Mercator'
              , fieldLabelX: 'X [m]'
              , fieldLabelY: 'Y [m]'
              , fieldEmptyTextX: 'Por favor, ingrese la coordenada X...'
              , fieldEmptyTextY: 'Por favor, ingrese la coordenada Y...'
              , fieldMinX: -20037508.34
              , fieldMinY: -20037508.34
              , fieldMaxX: 20037508.34
              , fieldMaxY: 20037508.34
              , fieldDecPrecision: 2
              , iconWidth: 32
              , iconHeight: 32
              , localIconFile: 'redpin.png'
              , iconUrl: null
            },
            {
                projEpsg: 'EPSG:32717'
              , projDesc: 'WGS 84 / UTM zone 17S'
              , fieldLabelX: 'X [m]'
              , fieldLabelY: 'Y [m]'
              , fieldEmptyTextX: 'Por favor, ingrese la coordenada X...'
              , fieldEmptyTextY: 'Por favor, ingrese la coordenada Y...'
              , fieldMinX: -20037508.34
              , fieldMinY: -20037508.34
              , fieldMaxX: 20037508.34
              , fieldMaxY: 20037508.34
              , fieldDecPrecision: 2
              , iconWidth: 32
              , iconHeight: 32
              , localIconFile: 'yellowpin.png'
              , iconUrl: null
            }
          ]

    // ====================================
    }
  },
  {type: "searchcenter",
    // Options for SearchPanel window
    options: {
            show: false,
      searchWindow: {
        title: __('Search by Drawing'),
        x: 320  ,
        y: undefined,
        id: 'searchByDraw',
        width: 450,
        height: 380,
        items: [
          Heron.examples.searchPanelConfig
        ]
      }
    }
  },
  {type: "any", options:{xtype: 'tbspacer', width: 42}},
  {type: "featureinfo", options: {
      popupWindow: {
          width: 460,
          height: 422,
          featureInfoPanel: {
              showTopToolbar: true,
              displayPanels: ['Table'],

              // Should column-names be capitalized? Default true.
              columnCapitalize: true,

              // Export to download file. Option values are 'CSV', 'XLS', default is no export (results in no export menu).
              exportFormats: ['CSV', 'XLS', 'GeoJSON'],
              // Export to download file. Option values are 'CSV', 'XLS', default is no export (results in no export menu).
              // exportFormats: ['CSV', 'XLS'],
              maxFeatures: 10
          }
      },
     /* listeners: {
          'click': function(fid) {
              if(Heron.App.map.getControlsBy("displayClass","olControlWMSGetFeatureInfo")[0].active){
                $(".x-btn .icon-getfeatureinfo").css("background-image","url('images/silk/information_sel.png')");
              }else{
                Ext.getCmp('featureinfo').blur();
                $(".x-btn .icon-getfeatureinfo").css("background-image","url('images/silk/information.png')");
              }                
          },
          scope: this
      },*/
    }
  },
  {
    // Instead of an internal "type", or using the "any" type
    // provide a create factory function.
    // MapPanel and options (see below) are always passed
    create: function (mapPanel, options) {

      // A trivial handler
      options.handler = openWindow;

      // Provide an ExtJS Action object
      // If you use an OpenLayers control, you need to provide a GeoExt Action object.
      return new Ext.Action(options);
    },

    /* Options to be passed to your create function. */
    options: {
      tooltip:"Agregar mapas WMS",
      iconCls:"icon-wms",
      enableToggle:false,
      pressed:false,
      id: "setWMS"
    }
  },
  {
    // Instead of an internal "type", or using the "any" type
    // provide a create factory function.
    // MapPanel and options (see below) are always passed
    create: function (mapPanel, options) {

      // A trivial handler
      options.handler = function () {
        if(layerPanel.collapsed){ 
          layerPanel.expand();
          layerPanel.show();
        }else{
          layerPanel.hide();
          layerPanel.collapse();
          $(".icon-layers").blur();
          $('#hr-panel-layer-xcollapsed').css('left','-1000px');
          $('#hr-panel-layer-xcollapsed').css('top','-1000px');
        }       
      }

      // Provide an ExtJS Action object
      // If you use an OpenLayers control, you need to provide a GeoExt Action object.
      return new Ext.Action(options);
    },

    /* Options to be passed to your create function. */
    options: {
      tooltip:"Gestión de capas",
      iconCls:"icon-layers",
      enableToggle: false,
      pressed: false,
      id: "setLayers"
    }
  },
	{type: "printdialog", 
   options: {
	  url: urlMapfishPrint,
      mapPreviewAutoHeight: true
    }
  },
  {type: "->"},
  /*{type: "any", options:{xtype: 'tbtext', text: 'Coordenadas'}},*/
  {
    /* Options to be passed to your create function. */
    create: function (mapPanel, options) {

      // A trivial handler
      options.handler = function () {
        //if(Ext.getCmp('hr-busquedas').collapsed){
          $(".k-animation-container").hide();
          Ext.getCmp('pan').focus();
          $("#pan").trigger("click");
          Ext.getCmp('hr-busquedas').show();
          Ext.getCmp('hr-busquedas').expand();
          setTimeout(function(){
            $('#hr-busquedas').show(1000);
          },500);
          
        /*}else{
          Ext.getCmp('hr-busquedas').hide();
          Ext.getCmp('hr-busquedas').collapse();
        } */ 
      }

      // Provide an ExtJS Action object
      // If you use an OpenLayers control, you need to provide a GeoExt Action object.
      return new Ext.Action(options);
    },
    options: {
      xtype: 'tbtext',
      id: 'actServSoc', 
      text: 'Registro de emergencias',
      listeners: {
          click:{
                  fn: function(b) {
                	  var vector = new OpenLayers.Layer.Vector("punto", {
                		  styleMap: new OpenLayers.StyleMap({
                	  		strokeWidth: 1,
                	  		strokeColor: '#072cff',
                	  		fillColor: '#072cff',
                	  		fillOpacity: 0.4,
                	  		cursor: 'texto'
                	      }),
                	      displayInLayerSwitcher:false
                	  });
                	  click = new OpenLayers.Control.Click();
                	  Heron.App.map.addControl(click);
                	  Heron.App.map.addLayer(vector);
                	  click.activate();
                  },
                  scope:this                    
                }
      },
      /*listeners: {
            /*click:{
                    fn: function(b) {

                    },
                    scope:this                    
                  },
            mouseover : {
                        fn: function(b) {
                          $('#hr-busquedas .x-panel-header').css('display','none');
                            if(!displayPanelSS){ 
                              Ext.getCmp('hr-busquedas').show();
                              Ext.getCmp('hr-busquedas').expand();
                              Ext.getCmp('hr-busquedas').collapse();
                              displayPanelSS = true;
                            }
                            $('#hr-busquedas').show(850);
                            $('#hr-busquedas').css('top','128px');
                        },
                        scope:this
                    },
            mouseout : {
                        fn: function(b) {
                            $('#hr-busquedas').hide(200);
                            $('#hr-busquedas').css('top','87px');
                            $('#hr-busquedas').css('left','856px');
                            $('#hr-busquedas .x-panel-header').css('display','');
                        },
                        scope:this
                    }
        },*/
      style: {
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold'
            },
      enableToggle: false,
      pressed: false
    }
  },
  {type: "any", options:{xtype: 'tbspacer', width: 10,height:24}}
  //{type: "printdirect", options: {url:'http://kademo.nl/print/pdf28992', mapTitle: 'Mapa de prueba'}},
];

Heron.options.map.statusbar = [
    {type: "any", options:{xtype: 'tbtext', text: 'Localizar ubicación:'}},
    {type: "geocoder", options:{width:130}},
    {type: "any", options:{xtype: 'tbspacer', width: 8}},
    {type: "any", options:{xtype: 'tbtext', text: 'Sistema de coordenadas:'}},
    {
    	create: function (mapPanel, options) {
			var map = mapPanel.getMap();

			return new GeoExt.ux.DisplayProjectionSelectorCombo({
		        map: map,
		        controls: new OpenLayers.Control.MousePosition(),
		        updateMapDisplayProjection: true,
		        projections: ['EPSG:4326','EPSG:32717','EPSG:900913'],
		        width: 130
		    });
		}
	},
	{type: "any", options:{xtype: 'tbspacer', width: 8}},
	{type:"measurepanel"},
  {type: "->"} ,
  {type: "any", options:{xtype: 'tbtext', text: 'Coordenadas'}},
  {type: "xcoord"},
  {type: "any", options:{xtype: 'tbspacer', width: 12,height:34}},
  {type: "ycoord"},
  {type: "any", options:{xtype: 'tbspacer', width: 8}},
  {
    // Instead of an internal "type", or using the "any" type
    // provide a create factory function.
    // MapPanel and options (see below) are always passed
    create: function (mapPanel, options) {

      // A trivial handler
      options.handler = function () {
        window.open("https://es-la.facebook.com/ECU911","_blank");
      }
      return new Ext.Action(options);
    },

    /* Options to be passed to your create function. */
    options: {
      tooltip:"Facebook",
      iconCls:"icon-face",
      enableToggle: false,
      pressed: false,
      id: "btnface",
    }
  },
  {type: "any", options:{xtype: 'tbspacer', width: 4}}
];

var ServO = new Heron.widgets.search.SearchCenterPanel({
          id: 'hr-searchcenterpanelWFS',
          height: 300,
          border: true,
          hidden: true,
          hropts: {
              searchPanel: {
                  xtype: 'hr_formsearchpanel',
                  header: false,
                  border: false,
                  protocol: new OpenLayers.Protocol.WFS({
                      version: "1.1.0",
                      url: urlGeoserver243+'/wfs?',
                      srsName: "EPSG:900913",
                      featureType: 'ahiss:datos_generales_salud',
                      featureNS: ""
                  }),
                  downloadFormats: [],
                  items: [
                      {
                          xtype: "textfield",
                          name: fieldNt,
                          value: '',
                          fieldLabel: "  "+'Provincia'
                      }
                  ],
                  hropts: {
                      onSearchCompleteZoom: 10,
                      autoWildCardAttach: true,
                      caseInsensitiveMatch: true,
                      logicalOperator: OpenLayers.Filter.Logical.AND,
                      statusPanelOpts: {
                          html: '&nbsp;',
                          height: 'auto',
                          preventBodyReset: true,
                          bodyCfg: {
                              style: {
                                  padding: '6px',
                                  border: '0px'
                              }
                          },
                          style: {
                              marginTop: '2px',
                              paddingTop: '2px',
                              fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
                              fontSize: '11px',
                              color: '#0000C0'
                          }
                      }
                  }
              },
              resultPanel: {
                  xtype: 'hr_featuregridpanel',
                  id: 'hr-featuregridpanel',
                  header: false,
                  border: false,
                  cls: 'extra-alt',
                  exportFormats: ['CSV', 'XLS','GeoJSON'],
                  hropts: {
                      caseInsensitiveMatch: true, 
                      zoomOnRowDoubleClick: true,
                      zoomOnFeatureSelect: true,
                      zoomLevelPointSelect: 10
                  }
              }
          }
        });

Ext.namespace("Heron.options.map.settings");

Heron.options.legendBase = urlGeoserver243 + '/wms?TRANSPARENT=TRUE&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=21&HEIGHT=21&LAYER=';

Ext.namespace("Heron.options.layertree");
Ext.namespace("Heron.options.layertreeDemanda");

cargarCapasIniciales();
		
var layerPanel = new Ext.Panel({
      id: 'hr-panel-layer',
      layout: 'accordion',
      region : "west",
      width: 240,
      boxMaxHeight: 'auto',
      collapsed: false,
      hidden: false,
      collapsible: true,
      title: 'Gestión de capas',
      plugins: [Ext.ux.PanelCollapsedTitle],
      split : true,
      border: false,
      listeners: {
        afterlayout: function(c) { 
          if(Ext.get("legendMapear").dom.clientHeight>0) 
            layerPanel.setHeight(Heron.App.mapPanel.getHeight()-(Ext.get("legendMapear").dom.clientHeight+45));
        }
      },
      items: [{
                xtype: 'hr_activethemespanel',
                height: 300,
                flex: 3,
                collapsed:true,
                hropts: {
                    // Defines the custom components added with the standard layer node.
                    showOpacity: true, // true - layer opacity icon / function
                    showTools: false, // true - layer tools icon / function (not jet completed)
                    showRemove: false        // true - layer remove icon / function
                }
          },{
          xtype: 'hr_layertreepanel',
          contextMenu: [
                        {
                            xtype: 'hr_layernodemenulayerinfo'
                        },
                        {
                            xtype: 'hr_layernodemenuzoomextent'
                        },
                        {
                            xtype: 'hr_layernodemenuopacityslider'
                        }
                    ],
					hropts: Heron.options.layertree
        }       
      ]
    });

var layerPanelDemanda = new Ext.Panel({
      id: 'hr-panel-layer-demanda',
      flex:1,
      boxMaxWidth: 'auto',
      title: '2.1 Si desea puede visualizar la siguiente información del registro social',
      cls: 'panelRegSoc',
      split : true,
      border: false,
      items: [{
          xtype: 'hr_layertreepanel',
          header: false,
          border: false,
          cls: 'treeRegsoc',
          contextMenu: [
                        {
                            xtype: 'hr_layernodemenulayerinfo'
                        },
                        {
                            xtype: 'hr_layernodemenuzoomextent'
                        },
                        {
                            xtype: 'hr_layernodemenuopacityslider'
                        }
                    ],
          hropts: Heron.options.layertreeDemanda
        }       
      ]
    });

Heron.layout = {
	xtype: 'panel',
	id: 'hr-container-main',
	layout: 'border',
	items: [
		{
      xtype: 'panel',
      id: 'hr-map-and-info-container',
      layout: 'border',
      region: 'center',
      width: '100%',
      collapsible: false,
      split : false,
      border: false,
      margins: '5 15 0 15',
      items: [{
          xtype: 'hr_mappanel',
          id: 'hr-map',
          region: 'center',
          cls: 'mappanel-custom',
          collapsible : false,
          border: false,
          margins: '0 -10 0 0',
          hropts: Heron.options.map
        },{
          // Top panel.
          xtype: 'panel',
          region: "north",
          collapsible: false,
          plugins: [Ext.ux.PanelCollapsedTitle],
          height: 87,
          border: false,
          cls: 'header-north',
          layout: 'hbox',
          layoutConfig: {
              align:'middle'
          },
          items: [
              {
                contentEl: 'logo-header',border: false,flex:1
              },{
                contentEl: 'title-header',
                border: false,
                cls:'title-header-parent',
                flex:2,
                margins:'0'
              },{
                contentEl: 'logo-sistema',border: false, cls:'logo_sistema'
              }
          ]
        },layerPanel,{
      xtype: 'panel',
      id: 'hr-busquedas',
      region: "east",
      title: 'Registro de emergencias',
      plugins: [Ext.ux.PanelCollapsedTitle],
      split: true,
      border: false,
      width: 480,
      minWidth: 480,
      maxWidth: 500,
      boxMaxHeight: 'auto',
      collapsible: true,
      animCollapse: false,
      collapsed: true,
      hidden: true,
      margins: '0 0 0 0',
      items:[{contentEl: 'window_servicios'}]
    }
      ],
      listeners: {
        beforerender: cargarCapas
      }
    }
  ]
};

Ext.onReady(function () {
  $("#featureinfo").trigger("click");
  Ext.getCmp('pan').focus();
  $("#pan").trigger("click");
  $("#ajaxLoading").appendTo($("#gx-map-panel"));
  //panelRS.add(layerPanelDemanda);
  panelRS.doLayout();
  //$("#seldpa").data("kendoComboBox").text('');
  //$("#selnmg").data("kendoComboBox").text('');
  /*$("#actServSoc").kendoTooltip({
    content: kendo.template($("#templatePanelServ").html()),
    callout: false,
    width: 479,
    height: 535
  });*/        
});

function cargarCapas(){
      panelRS = new Ext.Panel({
        renderTo: "panelRegSoc",
        anchor: "100%",
        border: false
      });
      panelOS = new Ext.Panel({
        renderTo: "panelOfertaSoc",
        border: false,
        anchor: "100%",
        items:[ServO]
      });      
      panelOS.hide();
}

function cargarCapasIniciales(){
    //vector de capas
	var capas=[];
	//vector de capas base
    var capasBase=[];
	//vector de nodos capas
	var vectorCapasNodo;
    var vectorArbol=[];
    var vectorOfertas=[];
    var vectorDemandas=[];
    var vectorWMS=[];
    var vectorDinamicosRaiz=[];
    var vectorDinamicosNodo=[];
    var vectorAuxDinamicos=[];
    var booleanBase=false;
    var nombreCapa;
	//obtiene la data (JSON) proveniente de la consulta inicial en el head de la paágina index.html
    var data=capasIniciales;
    for (var i = 0; i < data.length; i++)
      {
		  //Actualiza el valor de bandera de capa base con los datos provistos en la consulta inicial
          booleanBase=data[i].isbaselayer;
		  //Actualiza el valor del nombre de la capa a cargar según los datos provistos de la consulta inicial
          nombreCapa=data[i].nombre;
          if(booleanBase)
          {
            //Compara el servicio si son capas base o si son capas agregadas para ser generadas dinámicamente, el orden de las capas se encuentra en la base de datos
            switch(data[i].servicio)
            {
				//agrega una capa base OpenStreetMap al árbol de capas del visor
                case 'OSM':
				  //asigna la capa base al vector de capas
                  capas.push(new OpenLayers.Layer.OSM());
				  //asigna la capa base al vector de capas base
                  capasBase.push({nodeType: 'gx_layer', layer: 'OpenStreetMap', text: nombreCapa });
                  break;
				//agrega una capa base Bing al árbol de capas del visor
                case 'Bing':
				  //asigna la capa base al vector de capas
                  capas.push(new OpenLayers.Layer.Bing({name:nombreCapa,key:data[i].url,type:data[i].layer,
                  visibility:data[i].visibility,opacity: data[i].opacity,isBaseLayer:booleanBase,
                  displayInLayerSwitcher:data[i].displayinlayer}));
                  //asigna la capa base al vector de capas base
				  capasBase.push({nodeType: 'gx_layer', layer: nombreCapa, text: nombreCapa });
                  break;
				//agrega una capa base WMS propia al árbol de capas del visor
                default:
                  caseSelectorWMS(data[i].etiquetaroot,capas,capasBase,null,nombreCapa,booleanBase,data[i]);
                  break;
            } 
          }else {
            if('nodo' in data[i])
            {
              caseSelectorWMS(data[i].etiquetaroot,capas,capasBase,vectorCapasNodo,nombreCapa,booleanBase,data[i],function() {
                callbackNodosDinamicosFunction(data[i].etiquetaroot,data[i].etiquetasubroot,data[i],nombreCapa,vectorDinamicosNodo,vectorDinamicosRaiz,data[i].iconsubroot,false);});
            }else{
              caseSelectorWMS(data[i].etiquetaroot,capas,capasBase,vectorCapasNodo,nombreCapa,booleanBase,data[i],function() {
                callbackNodosDinamicosFunction(data[i].etiquetaroot,data[i].etiquetaroot,data[i],nombreCapa,vectorDinamicosRaiz,null,data[i].iconroot,true);});
            }
          }
      }
      Heron.options.map.layers=capas;
      //funciones para generar los nodos y subnodos en el árbol de selección de capas
      
      generarNodos(etiquetaRaizCapaBase,iconoRaizCapaBase,capasBase,vectorArbol);
      //Bucle para generar los subnodos hijo del árbol de capas
      for (var i = 0; i < vectorDinamicosNodo.length; i++)
      {
        vectorAuxDinamicos=[];
        generarNodos((vectorDinamicosNodo[i])[1],(vectorDinamicosNodo[i])[3],window[(vectorDinamicosNodo[i])[2]],vectorAuxDinamicos);
        window["capas"+ (vectorDinamicosNodo[i])[4].replace(/\ /g, '')].push(vectorAuxDinamicos[0]);
      }
      //Bucle para generar los nodos padre y agregarlos a la raiz del árbol de capas
      for (var i = 0; i < vectorDinamicosRaiz.length; i++)
      {
        //variable para comparar que tipo de servicio es y a que árbol asignar
        var nombreSrvComparar = (vectorDinamicosRaiz[i])[0];
        switch(nombreSrvComparar){
          case "OFERTA":
            //en el caso de oferta asignar el árbol generado al vectorOfertas
            generarNodos((vectorDinamicosRaiz[i])[1],(vectorDinamicosRaiz[i])[3],window[(vectorDinamicosRaiz[i])[2]],vectorOfertas);  
            break;
          case "DEMANDA":
            //asigna la variable dinámica que contiene la estructura de las capas a la variable capasDemanda
            capasDemanda=window[(vectorDinamicosRaiz[i])[2]];
            //en el caso de demanda asignar el árbol generado al vectorDemandas
            generarNodos((vectorDinamicosRaiz[i])[1],(vectorDinamicosRaiz[i])[3],capasDemanda,vectorDemandas);  
            break;
          case "WMS":
            generarNodos((vectorDinamicosRaiz[i])[1],(vectorDinamicosRaiz[i])[3],window[(vectorDinamicosRaiz[i])[2]],vectorWMS);  
            break;
          default: 
            generarNodos((vectorDinamicosRaiz[i])[1],(vectorDinamicosRaiz[i])[3],window[(vectorDinamicosRaiz[i])[2]],vectorArbol);  
            break;

        }        
      }

      //vector con el árbol de capas demanda que serán creadas durante la carga del sitio por la lib Heron-mc.
      Heron.options.layertreeDemanda.tree = vectorDemandas;
      //vector con el árbol de capas que será creado durante la carga del sitio por la lib Heron-mc.
      Heron.options.layertree.tree= vectorArbol;
}

function caseSelectorWMS(etiqueta,capas,capasBase,vectorNodoCapas,nombreCapa,booleanBase,data,callback) {
  capas.push(new OpenLayers.Layer.WMS( etiqueta +" "+nombreCapa,data.url,
                {layers: data.layer,transparent: data.transparent, format:data.format,'CQL_FILTER':  ('cql' in data) ? data.cql : null,
                RULE: ('rule' in data) ? data.rule : null},
                {opacity: data.opacity,visibility:data.visibility,displayInLayerSwitcher:data.displayinlayer,idfields:data.idfields,idnamefields:data.idnamefields,
                 isBaseLayer:booleanBase,maxResolution:(('maxresol' in data) ? data.maxresol : 'auto'),minResolution:(('minresol' in data) ? data.minresol : 'auto'),metadata:{wfs:{protocol:(data.fromwmslayer==true) ? "fromWMSLayer" : null}}}));
  if(booleanBase){
	//asigna la capa base al vector de capas base
    capasBase.push({nodeType: 'gx_layer', iconCls: ('icon' in data) ? data.icon:null, layer: nombreCapa, text: nombreCapa });
  } else {
    if (callback && typeof(callback) === "function") {  
        callback();  
    } else{
      vectorNodoCapas.push({nodeType: 'gx_layer', iconCls: ('icon' in data) ? data.icon:null, layer: etiqueta +" "+nombreCapa, text: (('rule' in data) ? createLegendIcon(data.layer,data.rule) : "") + (('urlficha' in data) ? createButtonFicha( etiqueta + " " + nombreCapa,data.urlficha) : "") + nombreCapa, legend: true });        
    } 
  }
}

function caseSelectorWFS(etiqueta,capas,capasBase,vectorNodoCapas,nombreCapa,booleanBase,data,callback) {
//Probar los WFS los cql y crear los RULE
  var filtro = null;
  if ('cql' in data){
    var parametrosCQL;
    parametrosCQL = data.cql.split(" ");
    filtro = new OpenLayers.Filter.Comparison({
      property: parametrosCQL[0].toString(),
      type: parametrosCQL[1].toString(),
      value: parametrosCQL[2].toString()
    });
  }
  capas.push(new OpenLayers.Layer.Vector(etiqueta+" "+nombreCapa,
    {strategies: [new OpenLayers.Strategy.BBOX()],opacity:data.opacity,visibility:data.visibility,
      displayInLayerSwitcher:data.displayinlayer,isBaseLayer:booleanBase,
      protocol: new OpenLayers.Protocol.WFS({url:data.url,featureType: data.layer}),filter: filtro
    }));
  if(booleanBase){
    capasBase.push({nodeType: 'gx_layer',iconCls: ('icon' in data) ? data.icon:null, layer: nombreCapa, text: nombreCapa });
  } else {
    if (callback && typeof(callback) === "function") {  
        callback();  
    } else{
      vectorNodoCapas.push({nodeType: 'gx_layer',iconCls: ('icon' in data) ? data.icon:null, layer: etiqueta +" "+nombreCapa, text: (('rule' in data) ? createLegendIcon(data.layer,data.rule) : "") + (('urlficha' in data) ? createButtonFicha( etiqueta + " " + nombreCapa,data.urlficha) : "") + nombreCapa, legend: true });  
    } 
  }
}

function callbackNodosDinamicosFunction(etiqueta,nombreEtiquetaJS,data,nombreCapa,vectorNodoDinamico,vectorPadreNodoDinamico,iconcls,mostrarLeyenda){
    var nombreVarJS="capas"+ nombreEtiquetaJS.replace(/\ /g, '');
    var evaluador = "if(typeof " + nombreVarJS + " === 'undefined'){var " + nombreVarJS + " =[];}; ";
    var objNodo = [];
    
    jQuery.globalEval(evaluador);

    window[nombreVarJS].push({nodeType: 'gx_layer', iconCls: ('icon' in data) ? data.icon:null, layer: etiqueta +" "+nombreCapa, text: (('rule' in data) ? createLegendIcon(data.layer,data.rule) : "") + (('urlficha' in data) ? createButtonFicha( etiqueta + " " + nombreCapa,data.urlficha) : "") + nombreCapa, legend: mostrarLeyenda });
    
    objNodo=[data.servicio,nombreEtiquetaJS,nombreVarJS,iconcls,data.etiquetaroot];
    if(vectorPadreNodoDinamico != null && ('nodo' in data)){
      var nombreEtiquetaRootJS=data.etiquetaroot;
          var nombreVarRootJs="capas" + nombreEtiquetaRootJS.replace(/\ /g, '');
          var evaluadorRoot = "if(typeof " + nombreVarRootJs + " === 'undefined'){var " + nombreVarRootJs + " =[];}; ";
          var objNodoRoot = [];
          jQuery.globalEval(evaluadorRoot);
          objNodoRaiz=[data.servicio,nombreEtiquetaRootJS,nombreVarRootJs,data.iconroot,data.etiquetaroot];
      if((JSON.stringify(vectorPadreNodoDinamico).indexOf(JSON.stringify(objNodoRaiz))) === -1 )
        {
          vectorPadreNodoDinamico.push(objNodoRaiz);
        }
    }
    
    if((JSON.stringify(vectorNodoDinamico).indexOf(JSON.stringify(objNodo))) === -1 )
      {
        vectorNodoDinamico.push(objNodo);
      }
}

function generarNodos(etiqueta,icon,capasNodos,vector){
  if(capasNodos.length > 0){
    vector.push({text: etiqueta, nodeType: 'hr_cascader', iconCls: (icon === "") ? null: icon ,checked: false, expanded: (etiqueta === 'CAPAS BASE') ? true : false, children:capasNodos});
  }
}

function createLegendIcon(layer,regla){
  return '<img src="' + Heron.options.legendBase + layer + "&RULE=" + regla + '" style="vertical-align:middle" width="21px" height="21px"/>';
}

function createButtonFicha(titulo,urlficha){
  return '<img src="' + "../visor_optisesa/img/icon layer/url_ficha.png" + '" onclick="showAlert(\'' + titulo + '\',\'' + urlficha + '\');" style="vertical-align:middle" width="18" height="18"/>';
}

function showAlert(titulo,url){
  new Ext.Window({
    title: titulo,
    layout: 'fit',
    autoScroll: true,
    width: 792,
    height: 600,
    modal: true,
    closeAction: 'close',
    html:'<iframe src="' + url + '" height=561.5 width=773.5></iframe>'//'<iframe src="http://www.w3schools.com/" height=598 width=598></iframe>'//'<h1>Invocado</h1>'
  }).show();
}

var openWindow = function() {
    if (!browserWindow) {
        var myBrowserOptions = Ext.apply(browserOptions, {
            border: false,
            region: "east",
            zoomOnLayerAdded: false,
            closeOnLayerAdded: false,
            allowInvalidUrl: true,
            alertPopupTimeout: 2000,
            // === proxyHost === uncomment to use the local proxy
            proxyHost: urlProxy,
            serverStore: serverStore,
            mapPanelPreviewOptions: {
                height: 170,
                collapsed: false
            },
            layerStore: Heron.App
        });

        WMSBrowser = new GeoExt.ux.WMSBrowser(myBrowserOptions);

        browserWindow = new Ext.Window({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 550,
            height: 450,
            title: "Agregar mapas WMS",
            layout: 'fit',
            items: [WMSBrowser]
        });
    }

    browserWindow.show();
};

function map_SetCoordinates(evt) {
  map_setcoordinates_window.show();
}

function map_GetCoordinates(evt) {
    map_getcoordinates_window.show();

    var get_map_XY_wgs = Heron.App.map.getLonLatFromViewPortPx(evt.xy);

    if (Heron.App.map.getProjectionObject().toString() != "EPSG:4326") {
        get_map_XY_wgs = get_map_XY_wgs.transform(new OpenLayers.Projection(Heron.App.map.getProjectionObject().toString()), new OpenLayers.Projection("EPSG:4326"));
    }

    var get_map_XY_egsa = Heron.App.map.getLonLatFromViewPortPx(evt.xy);

    if (Heron.App.map.getProjectionObject().toString() != "EPSG:900913") {
        get_map_XY_egsa = get_map_XY_egsa.transform(new OpenLayers.Projection(Heron.App.map.getProjectionObject().toString()), new OpenLayers.Projection("EPSG:900913"));
    }

    var info_map_coordinates = map_Point_GetCoordinates_WGS + ":<br>" + Number(get_map_XY_wgs.lon.toString()).toFixed(6) + "," + Number(get_map_XY_wgs.lat.toString()).toFixed(6) + "<br><br>" + map_Point_GetCoordinates_EGSA + ":<br>" + Number(get_map_XY_egsa.lon.toString()).toFixed(3) + "," + Number(get_map_XY_egsa.lat.toString()).toFixed(3);

    Ext.getCmp('map_getcoordinates_region').update(info_map_coordinates);

}

/*function removeMarkersFromMap(marker_name) {
  Heron.App.map.getLayersByName("SetCoordinatesMarker").forEach(function(layer){
    Heron.App.map.removeLayer(layer);
  });
}*/