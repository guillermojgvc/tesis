var valueColor = 1,nameactivelayer="MapeoDemanda",key,fieldD,whereD,creaServO=true,creaServRS=true,colNumOfer;
var valueBBOX,fieldRS,valueRS,indexCol,titlePopup,nameTitlePoupup,itemSelDemanda,itemSelOferta;
var styleZoomUniTer = new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"]),popup; 
var RSLayer,filterIni,filterforStrategy,filterStrategy,featureGridRS,itemFicha,servFicha;
function inicializarComponentes(){
    try{
        $('#selectItems').multiselect({
            nonSelectedText: "",
            nSelectedText: "seleccionadas",
            numberDisplayed: 1,
            buttonText: function(options, select) {
              if (options.length == 0) {
                return this.nonSelectedText + ' <b class="caret"></b>';
              }
              else {
                if (options.length > this.numberDisplayed) {
                  return options.length + ' columnas ' + this.nSelectedText + ' <b class="caret"></b>';
                }
                else {
                  var selected = '';
                  options.each(function() {
                    var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).html();
       
                    selected += label + ', ';
                  });
                  return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
                }
              }
            },
            onChange: function(option, checked) {
                if(ServO.resultPanel){
                    var columnIndex = ServO.resultPanel.sm.grid.colModel.getIndexById(option.val());
                    if (columnIndex>0){
                        if (checked === false)
                            ServO.resultPanel.sm.grid.colModel.setHidden(columnIndex,true);
                        else
                            ServO.resultPanel.sm.grid.colModel.setHidden(columnIndex,false);                        
                    }
                }
                if(colNumOfer.indexOf(option.val()) < 0)
                    colNumOfer+=option.val();
            }
          });
        $("#selectItems").multiselect('disable');

        /*$("#panelbar_servicios").kendoPanelBar({
                        expandMode: "single"
                    });*/

        /*$("#tabstrip").kendoTabStrip({
                    animation:  {
                        open: {
                            effects: "fadeIn"
                        }
                    }
                });  */          

        $("#p_dpa_provincia").kendoDropDownList({
            optionLabel: "Seleccione una provincia ...",
            dataTextField: "dpa_despro",
            dataValueField: "dpa_provin",
            select:clickItemUniTerr,
            change:onChangeDPA,
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"provincias",
                    }
                },
                sort: { field: "dpa_despro", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#p_dpa_canton").kendoDropDownList({
            autoBind: false,
            cascadeFrom: "p_dpa_provincia",
            optionLabel: "Seleccione un cantón ...",
            dataTextField: "dpa_descan",
            dataValueField: "dpa_canton",
            select:clickItemUniTerr,
            change:onChangeDPA,
            dataBound: onActivaControles,
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"cantones"
                    }
                    /*read: function(options) {
                        $.ajax({
                            dataType: "jsonp",
                            url: urlServerRest+"cantones",
                            success: function(result) {
                              // notify the data source that the request succeeded
                              options.success(result);
                            },
                            error: function(result) {
                              // notify the data source that the request failed
                              options.error(result);
                            },
                            complete:function(){
                                onChangeDPA();
                            }
                        });
                    }*/
                },
                sort: { field: "dpa_descan", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#p_dpa_parroquia").kendoDropDownList({
            autoBind: false,
            cascadeFrom: "p_dpa_canton",
            optionLabel: "Seleccione una parroquia ...",
            dataTextField: "dpa_despar",
            dataValueField: "dpa_parroq",
            select:clickItemUniTerr,
            change:onChangeDPA,
            dataBound: onActivaControles,
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"parroquias"
                    }
                },
                sort: { field: "dpa_despar", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#p_nmg_zona").kendoDropDownList({
            optionLabel: "Seleccione una zona ...",
            dataTextField: "des_zona",
            dataValueField: "zona",
            select:clickItemUniTerr,
            change:onChangeNMG,
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"zonas",
                    }
                },
                sort: { field: "des_zona", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#p_nmg_distrito").kendoDropDownList({
            autoBind: false,
            cascadeFrom: "p_nmg_zona",
            optionLabel: "Seleccione un distrito ...",
            dataTextField: "des_distri",
            dataValueField: "cod_distri",
            select:clickItemUniTerr,
            change:onChangeNMG,
            dataBound: onActivaControles,
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"distritos",
                    }
                },
                sort: { field: "des_distri", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#p_nmg_circuito").kendoDropDownList({
            autoBind: false,
            cascadeFrom: "p_nmg_distrito",
            optionLabel: "Seleccione un circuito ...",
            dataTextField: "des_circ",
            dataValueField: "cod_circ_1",
            select:clickItemUniTerr,
            change:onChangeNMG,
            dataBound: onActivaControles,
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"circuitos",
                    }
                },
                sort: { field: "des_circ", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#sel_sector").kendoDropDownList({
            optionLabel: "Seleccione un sector ...",
            dataTextField: "nombre_sct",
            dataValueField: "serial_sct",
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"sectores",
                    }
                },
                sort: { field: "serial_sct", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#sel_demanda").kendoDropDownList({
            autoBind: false,
            cascadeFrom: "sel_sector",
            optionLabel: "Seleccione un indicador de demanda ...",
            dataTextField: "nombre_cin",
            dataValueField: "codigo_cin",
            select: function(e) {
                        itemSelDemanda = this.dataItem(e.item.index());                        
                    },
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"catalogoInd/D",
                    }
                },
                sort: { field: "serial_cin", dir: "asc" }
            }
        }).data("kendoDropDownList");

        $("#sel_oferta").kendoDropDownList({
            optionLabel: "Seleccione un servicio ...",
            dataTextField: "nombre_cin",
            dataValueField: "codigo_cin",
            select: function(e) {
                        colNumOfer = "";
                        itemSelOferta = this.dataItem(e.item.index());
                        itemSelOferta.columnas = JSON.parse(itemSelOferta.columns);
                        var dataColOfer=[];
                        $.each(itemSelOferta.columnas, function(index, data) {
                            if(data.isoption) 
                                dataColOfer.push(data);  
                        });
                        $("#selectItems").multiselect('dataprovider', dataColOfer);
                        //$("#selectItems").multiselect('rebuild');
                        $("#selectItems").multiselect('enable');
                    },
            dataSource: {
                transport: {
                    read: {
                        dataType: "jsonp",
                        url: urlServerRest+"catalogoInd/O",
                    }
                },
                sort: { field: "serial_cin", dir: "asc" }
            }
        }).data("kendoDropDownList");

        /*$.getJSON(urlServerRest+"catalogoInd/O?callback=?").done(function( jsonData ) {         
          $.each(jsonData, function(index, data) {                                
             $("#div_chkOferta").prepend("<p><label><input type='checkbox' name='chkoferta' value='"+data.nombre_cin+"'> "+ data.nombre_cin +" </label></p>");             
          });
          $(":checkbox[name=chkoferta]").on("click",activarChecked);
        });

        $("#selFuente").kendoComboBox();

        $("#selanio").kendoComboBox();

        $("#filtroA").click(function(event) {
            // Act on the event 
            filterWin.show();
        });*/
    }
    catch(e){        
         console.log(e);
    }

    
}

/*function activarChecked(){
     if ($(this).is(":checked")){
        $("#colCE").show();
        panelOS.hide();
     }
}*/

function startLoading(){
    //loadingPanel.maximizeControl();
    $('#ajaxLoading').css('display','inline-block');
    $('html, body').css('cursor', 'wait');
    Heron.App.map.div.style.cursor = 'wait';
}

function stopLoading(){
    //loadingPanel.minimizeControl();
    $('#ajaxLoading').css('display','none');
    $('html, body').css('cursor', 'auto');
    Heron.App.map.div.style.cursor = 'auto';
}

function clickItemUniTerr(e) {
    onActivaControles();
    var layerZoomUniTerr = Heron.App.map.getLayersByName('zoomUniTerr'),vectorLayerZUT;
    if(layerZoomUniTerr[0]){
        vectorLayerZUT = layerZoomUniTerr[0];
        vectorLayerZUT.removeAllFeatures();
    }else{
        vectorLayerZUT = new OpenLayers.Layer.Vector("zoomUniTerr",{styleMap: new OpenLayers.StyleMap(styleZoomUniTer),displayInLayerSwitcher:false});
        Heron.App.map.addLayer(vectorLayerZUT);
    } 
    var dataItem = this.dataItem(e.item.index());   
    var auxExt = dataItem.extent;
    auxExt = auxExt.substring(4,auxExt.length-1);
    var auxExt1 = auxExt.split(",");
    var extentItem1 = auxExt1[0].split(" ");
    var extentItem2 = auxExt1[1].split(" ");
    var bounds = new OpenLayers.Bounds(extentItem1[0],extentItem1[1],extentItem2[0],extentItem2[1]);
    Heron.App.map.zoomToExtent(bounds);
    valueBBOX = bounds;
      if(!dataItem.ering){
            if($("#tabstrip").data("kendoTabStrip").select().index()===0){
                startLoading();
                switch ($("#seldpa").val()) {
                    case 'provincia':
                        fieldRS="idprovinci";
                        valueRS=(dataItem.dpa_provin).charAt(0)==='0'?(dataItem.dpa_provin).substr(1,dataItem.dpa_provin):dataItem.dpa_provin;
                        itemFicha = dataItem.dpa_provin;
                        servFicha = "ringprov/";
                        break;
                    case 'canton':
                        fieldRS="idcanton";
                        valueRS=(dataItem.dpa_canton).charAt(0)==='0'?(dataItem.dpa_canton).substr(1,dataItem.dpa_canton):dataItem.dpa_canton;
                        itemFicha = dataItem.dpa_canton;
                        servFicha = "ringcanton/";
                        break;
                    case 'parroquia':
                        fieldRS="idparroqui";
                        valueRS=(dataItem.dpa_parroq).charAt(0)==='0'?(dataItem.dpa_parroq).substr(1,dataItem.dpa_parroq):dataItem.dpa_parroq;
                        itemFicha = dataItem.dpa_parroq;
                        servFicha = "ringparroquia/";
                        break;
                }
            }
            else{
                switch ($("#selnmg").val()) {
                    case 'zona':
                        itemFicha = dataItem.zona;
                        servFicha = "ringzonas/";
                        break;
                    case 'distrito':
                        itemFicha = dataItem.cod_distri;
                        servFicha = "ringdistritos/";
                        break;
                    case 'circuito':
                        itemFicha = dataItem.cod_circ_1;
                        servFicha = "ringcircuitos/";
                        break;
                }
            }
            $.getJSON(urlServerRest + servFicha + itemFicha + "?callback=?").done(function( jsonData ) {         
                $.each(jsonData, function(index, data) {                                
                    dataItem.ering = data.extring;
                    vectorLayerZUT.addFeatures(new OpenLayers.Format.WKT().read(dataItem.ering));
                    stopLoading();
                });
            });
            dataItem.itemFicha =  itemFicha;
            dataItem.servFicha =  servFicha;
        }else{
            vectorLayerZUT.addFeatures(new OpenLayers.Format.WKT().read(dataItem.ering));
            itemFicha =  dataItem.itemFicha;
            servFicha =  dataItem.servFicha;
        }  
    }
    //$("#panelbar_servicios").data("kendoPanelBar").enable($("#tipoServD"), true);

function onChangeDPA() {
    var filter = this.value();
    $.each(capasDemanda, function(index, capadata) {
        var layer = Heron.App.map.getLayersByName(capadata.layer)[0];
        if(layer){
            if(capadata.layer.indexOf("14")>0){
                var valFilter =  Number(filter);
                switch (valFilter.toString().length){
                    case 1:
                    case 2:
                        layer.mergeNewParams({'CQL_FILTER': "idprovinci ="+ valFilter });    
                        break;
                    case 3:
                    case 4:
                        layer.mergeNewParams({'CQL_FILTER': "idcanton ="+ valFilter });    
                        break;
                    default:
                        layer.mergeNewParams({'CQL_FILTER': layer.idfields + "="+ valFilter });
                        break;
                }
            }
            else 
                layer.mergeNewParams({'CQL_FILTER': layer.idfields + " LIKE '"+ filter +"%' "});
            layer.setVisibility(false);
        }
    });
    onActivaControles();
};

function onActivaControles(){
    if($("#tabstrip").data("kendoTabStrip").select().index()===0){
        switch ($("#seldpa").val()) {
            case 'provincia':
                $('#p_dpa_canton').data("kendoDropDownList").enable(false);
                $('#p_dpa_parroquia').data("kendoDropDownList").enable(false);
                $('#b_dpa_provincia').data("kendoButton").enable(true);
                $('#b_dpa_canton').data("kendoButton").enable(false);
                $('#b_dpa_parroquia').data("kendoButton").enable(false);
                break;
            case 'canton':
                $('#p_dpa_parroquia').data("kendoDropDownList").enable(false);
                $('#b_dpa_provincia').data("kendoButton").enable(false);
                $('#b_dpa_canton').data("kendoButton").enable(true);
                $('#b_dpa_parroquia').data("kendoButton").enable(false);
                break;
            case 'parroquia':
                $('#b_dpa_provincia').data("kendoButton").enable(false);
                $('#b_dpa_canton').data("kendoButton").enable(false);
                $('#b_dpa_parroquia').data("kendoButton").enable(true);
                break;
        }
    }else{
        switch ($("#selnmg").val()) {
            case 'zona':
                $('#p_nmg_distrito').data("kendoDropDownList").enable(false);
                $('#p_nmg_circuito').data("kendoDropDownList").enable(false);
                $('#b_nmg_zona').data("kendoButton").enable(true);
                $('#b_nmg_distrito').data("kendoButton").enable(false);
                $('#b_nmg_circuito').data("kendoButton").enable(false);
                break;
            case 'distrito':
                $('#p_nmg_circuito').data("kendoDropDownList").enable(false);
                $('#b_nmg_zona').data("kendoButton").enable(false);
                $('#b_nmg_distrito').data("kendoButton").enable(true);
                $('#b_nmg_circuito').data("kendoButton").enable(false);
                break;
            case 'circuito':
                $('#b_nmg_zona').data("kendoButton").enable(false);
                $('#b_nmg_distrito').data("kendoButton").enable(false);
                $('#b_nmg_circuito').data("kendoButton").enable(true);
                break;
        }
    }
    
}

function onChangeNMG() {
    var filter = this.value();
    $.each(capasDemanda, function(index, capadata) {
        var layer = Heron.App.map.getLayersByName(capadata.layer)[0];
        if(layer){
            if(capadata.layer.indexOf("14")>0)
                layer.mergeNewParams({'CQL_FILTER': layer.idfields + "="+ filter });
            else 
                layer.mergeNewParams({'CQL_FILTER': layer.idfields + " LIKE '"+ filter +"%' "});
            layer.setVisibility(false);
        }
    });
    onActivaControles();
};


function recuperaDatosMapeoDemanda(){
    var urlDemanda = urlServerRest+"demanda/"+ itemSelDemanda.campovalor +"/"+fieldD+"/"+ itemSelDemanda.tabla +"/"+ whereD +"?callback=?";
    //startLoading();
    $.getJSON(urlDemanda).done(function( jsonDatos ) {
        if(jsonDatos.length>0)
            graficaIndicador(jsonDatos);
        else
            alert("No hay información disponible");              
        //stopLoading();
    })
    .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ', ' + error;
        console.log( "Request Failed: " + err);
        //stopLoading();
    });
}

function graficaIndicador(indData){
    var minValue=indData[indData.length-1].ind;
    var maxValue=indData[0].ind;
    var rango=5;
    var intervalo=(maxValue-minValue)/rango;
    var factor= minValue,color,color2,gridData=[];

    switch (valueColor) {
        case 1:
            color = "0xFFF200";
            color2 = "0xED1C24";
            break;
        case 2:
            color = "0xFFF200";
            color2 = "0x28903B";
            break;
        case 3:
            color = "0xFFFFFF";
            color2 = "0xF78E1E";
            break;
    }

    for (var i=1;i<=rango;i++)
    {
        var obj=new Object();
        if(i==rango)
            obj.max=maxValue;
        else
            obj.max=factor+intervalo;
        obj.min=factor;
        obj.ind= (obj.min) + " - " + (obj.max);
        factor+=intervalo;
        if(i==1)
            obj.color = color.replace("0x","#");
        else
            obj.color = "#" + openLayersExcoUtil.fadeHex(color,color2,i/rango).toString(16);
        gridData.push(obj);
    }
    //$('#infoFeature').css('display','inline-block');
    $('#legendMapear').css('display','inline-block');
    var theme = new OpenLayers.Style({},{fillColor: "#ffffff", fillOpacity: 1,strokeColor: "#000000",strokeWidth:0.8,cursor: "pointer"});
    var layerActive = Heron.App.map.getLayersByName(nameactivelayer);
    if(layerActive[0].features.length>0){
        var highlightCtrl = new OpenLayers.Control.SelectFeature(layerActive[0], {
                hover: true,
                highlightOnly: true,
                renderIntent: "temporary",
                selectStyle: {
                    fillOpacity: 0.3,
                    fillColor: "#EE9900",
                    strokeColor: "#EE9900",
                    strokeOpacity: 0.7,
                    cursor: "pointer"
                },
                eventListeners: {
                    featurehighlighted: mapearOverFeature,
                    featureunhighlighted: mapearOutFeature
                }
            });

        $.each(layerActive[0].features, function( index, featureGra ) {
            featureGra.style= theme;
            featureGra.attributes.ind="no disponible";            
            for(var k=0;k<indData.length;k++){
                if(indData[k].codigo==featureGra.attributes[key]){
                  for(var m=0;m<gridData.length;m++)
                    {
                        var max=gridData[m]["max"];
                        var min=gridData[m]["min"];
                        if(indData[k].ind>=min && indData[k].ind<=max)
                        {
                            //indData[k].intervalo=m+1;
                            featureGra.attributes.ind=indData[k].ind;
                            var theme1 = new OpenLayers.Style({},{fillColor: gridData[m]["color"],fillOpacity: 0.75,strokeColor: "#000000",strokeWidth:0.8,cursor: "pointer"});
                            featureGra.style= theme1;
                            break;
                        }
                    }
                    break;  
                }   
                    
            }
        });
    
    layerActive[0].redraw(true);
    Heron.App.map.addControl(highlightCtrl);
    highlightCtrl.activate();
    var labels = []
    $.each(gridData,function(index,dataColor){
        labels.push('<tr><td><i style="background-color:' + dataColor.color + '"></i></td><td style="text-align: right;">' +
                    $.number(dataColor.min,0) + '</td><td>&nbsp;&nbsp;&nbsp;&ndash;&nbsp;</td><td style="text-align: right;">' + $.number(dataColor.max,0)+'</td><td style="width:10%">&nbsp;</td></tr>');
        });
    legendMapear.innerHTML = '<h4 style="font-weight: bold;text-align: center;">' + $("#sel_demanda").data("kendoDropDownList").text() + '<br>(hab.)</h4><table style="margin: auto;width:78%">' + labels.join('<tr>') + '</table>';      
    }
    layerPanel.setHeight(Heron.App.mapPanel.getHeight()-(Ext.get("legendMapear").dom.clientHeight+45));    
}

function mapearOverFeature(e) {
    var popupOpts = Ext.apply({
            title: nameTitlePoupup + e.feature.attributes[titlePopup],
            location: e.feature,
            width:200,
            html: "<div style='padding:7px;'><b>Valor : "+$.number(e.feature.attributes.ind,0)+"</b></div>",
            maximizable: false,
            collapsible: false,
            closable:false,
            unpinnable:false,
            anchorPosition: 'auto'
        });

    if (popup) {
        popup.close();
    }

    popup = new GeoExt.Popup(popupOpts);
    // unselect feature when the popup
    // is closed
    /*popup.on({
        close: function() {
            if(OpenLayers.Util.indexOf(e.feature.layer.selectedFeatures,this.feature) > -1) {
                //selectCtrl.unselect(this.feature);
            }
        }
    });*/
    popup.show();
}

function mapearOutFeature(e){
   if (popup) {
        popup.close();
    } 
}

function onClickGetFicha(e) {
    showAlert('Ficha Metodológica','ficha.ss.html?itemFicha='+itemFicha+'&servFicha='+this.element[0].dataset.key+'/');
	
};