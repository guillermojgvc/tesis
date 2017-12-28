/*!
 * Ext JS FilterRow searchfield number range plugin v0.1
 *
 * Copyright 2014 Exelencia Corporativa
 * 
 */

//Definición del namespace del tipo Ext
Ext.ns('Ext.ux.form');
/* Campo de busqueda con dos botones uno de busqueda y otro de borrado de los filtros
 * Extiende de Ext.form.TwinTriggerField
 */
Ext.ux.form.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    //Inicialización del componente
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    //_menu espacio definido en el campo para la creacion posterior del menu en el evento onTrigger2Click
    _menu:null,
    //_timeout variable definida para la ejecución de la busqueda en el filtro después de  1 seg.
    _timeout:null,
    validationEvent:false,
    validateOnBlur:false,
    //css con el icono x de borrado
    trigger1Class:'x-form-clear-trigger',
    //css con el icono de busqueda
    trigger2Class:'x-form-search-trigger',
    //esconder el boton borrado al iniciar
    hideTrigger1:true,
    width:240,
    //flag que indica si el componente tiene elementos de busqueda o no
    hasSearch : false,
    paramName : 'query',

    //Función para el borrado del filtro.
    onTrigger1Click : function(){
        if(this.hasSearch){
            this.setValue('');
            this._menu.items.items[0].setValue('');
            this._menu.items.items[1].setValue('');
            this.el.dom.value = '';
            this.triggers[0].hide();
            this.hasSearch = false;
            this.fireEvent('keyup');
        }
        
    },
    //Función para la creacion del menu
    onTrigger2Click : function(){
        this.hasSearch = true;
        this.getMenu(true).show(this.el, "tl-bl?");
        this.triggers[0].show();
    },
    //Función para la creación del menú en el evento onTrigger2Click
    getMenu: function (reset) {
          if (this._menu === null) {
            if (reset && this._menu) {
                this._menu.destroy();
            }
            //Arreglo de items en el menú
            var mItems = [];
            //Agrega un item tipo menú en el arreglo
            mItems.push({
                //css icono mayor que
                iconCls: 'ux-rangemenu-gt',
                xtype:'textfield',
                emptyText: 'buscar mayor que',
                enableKeyEvents :true,
                listeners:{
                  keyup:function(obj){
                    var menorque = this.ownerCt.items.items[1].getValue();
                    if(menorque!=""&&menorque.length>0)
                    {
                      this.ownerCt._parent.setValue(">"+this.getValue()+" y <"+menorque);
                    }else{
                      this.ownerCt._parent.setValue(">"+this.getValue());
                    }
                    //cancelar la ejecucion tardia (delay) si no se ejecuto aún
                    clearTimeout(this._timeout);
                    var self=this;
                    //activar la ejecucion tardia (delay) una vez en 1 seg.
                    this._timeout=setTimeout(function() {
                      self.ownerCt._parent.fireEvent("keyup");
                    }, 1000);
                  }
                }
            });
            mItems.push({
                //css icono menor que
                iconCls: 'ux-rangemenu-lt',
                xtype:'textfield',
                emptyText: 'buscar menor que',
                enableKeyEvents : true,
                listeners:{
                  keyup:function(obj){
                    var mayorque = this.ownerCt.items.items[0].getValue();
                    if(mayorque!=""&&mayorque.length>0)
                    {
                      this.ownerCt._parent.setValue(">"+mayorque+" y <"+this.getValue());
                    }else{
                      this.ownerCt._parent.setValue("<"+this.getValue());
                    }
                    //cancelar la ejecucion tardia (delay) si no se ejecuto aún
                    clearTimeout(this._timeout);
                    var self=this;
                    //activar la ejecucion tardia (delay) una vez en 1 seg.
                    this._timeout=setTimeout(function() {
                      self.ownerCt._parent.fireEvent("keyup");
                    }, 1000);
                  }
                }
            });
            //Agrega un item de separación en el menú
            mItems.push('-');
            //Variable que contiene al padre de los elementos menú
            parent=this;
            //Variable que contiene al padre de los elementos menú
            this._menu = new Ext.menu.Menu({
                //Crear un menú con el padre que lo contiene
                _parent: parent,
                //Agrega los elementos del menú
                items: mItems
            });
        }
        return this._menu;
    }
});