/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt.ux
 *  class = DisplayProjectionSelectorCombo
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */

Ext.namespace("GeoExt.ux");

/**
 * @include OpenLayers/Projection.js
 */

GeoExt.ux.DisplayProjectionSelectorCombo = Ext.extend(Ext.form.ComboBox, {
    /** api: config[map]
     *  ``OpenLayers.Map or Object``  A configured map or a configuration object
     *  for the map constructor, required only if :attr:`zoom` is set to
     *  value greater than or equal to 0.
     */
    /** private: property[map]
     *  ``OpenLayers.Map``  The map object.
     */
    map: null,

    /** api: config[updateMapDisplayProjection]
     *  Boolean defining if the map displayProjection property is updated when the combo box value is changed. Default: true
     */
    /** private: property[updateMapDisplayProjection]
     *  Boolean defining if the map displayProjection property is updated when the combo box value is changed. Default: true
     */
    updateMapDisplayProjection: true,

    /** api: config[controls]
     *  Array of ``OpenLayers.Control`` Defines which OpenLayers controls are associated to the combo box. If no control is set, then all the map controls will be updated with the new displayProjection.
     */
    /** private: property[controls]
     *  Array of ``OpenLayers.Control`` Defines which OpenLayers controls are associated to the combo box. If no control is set, then all the map controls will be updated with the new displayProjection.
     */
    controls: null,

    /** api: config[projections]
     *  Array of EPSG codes, for example: ['EPSG:27200', 'EPSG:21781', 'EPSG:4326', 'EPSG:900913']
     */
    /** private: property[projections]
     *   Array of EPSG codes, for example: ['EPSG:27200', 'EPSG:21781', 'EPSG:4326', 'EPSG:900913']
     */
    projections: null,

    /** private: property[tpl]
     *  ``Ext.XTemplate``  Template of the combo box content
     */
    tpl: '<tpl for="."><div class="x-combo-list-item">{[values.title]} </div></tpl>',

    /** private: property[editable]
     * Default: false
     */
    editable: false,

    /** private: property[triggerAction]
     * Needed so that the combo box doesn't filter by its current content. Default: all
     */
    triggerAction: 'all',

    /** private: property[mode]
     * keep the combo box from forcing a lot of unneeded data refreshes. Default: local
     */
    mode: 'local',

    /** private: constructor
     */
    initComponent: function() {
        GeoExt.ux.DisplayProjectionSelectorCombo.superclass.initComponent.apply(this, arguments);

        this.store = new Ext.data.Store();

        var projectionRecord = Ext.data.Record.create([
            {
                name: 'title'
            },
            {
                name: 'projName'
            },
            {
                name: 'srsCode'
            }
        ]);

        // Fill the combo box with the projections
        var mapProjection = null;
        var mapProjectionRecord = null;

        // Projections from config objects
        if (this.projections) {
            for (var i = 0; i < this.projections.length; i++) {
                mapProjection = new OpenLayers.Projection(this.projections[i]);
                mapProjectionRecord = new projectionRecord({
                    title: mapProjection.proj.title,
                    projName: mapProjection.proj.projName,
                    srsCode: mapProjection.proj.srsCodeInput
                });
                this.store.add(mapProjectionRecord);

            }

        } else {
            // Add map projection
            mapProjection = new OpenLayers.Projection(this.map.getProjection());
            mapProjectionRecord = new projectionRecord({
                title: mapProjection.proj.title,
                projName: mapProjection.proj.projName,
                srsCode: mapProjection.proj.srsCodeInput
            });

            this.store.add(mapProjectionRecord);

            // Add display projection if existent and not equivalent to map projection 
            if (this.map.displayProjection && mapProjection.proj.title != this.map.displayProjection.proj.title) {
                var mapDisplayProjectionRecord = new projectionRecord({
                    title: this.map.displayProjection.proj.title,
                    projName: this.map.displayProjection.proj.projName,
                    srsCode: this.map.displayProjection.proj.srsCodeInput
                });
                this.store.add(mapDisplayProjectionRecord);
            }
        }

        if (this.map.displayProjection) {
            this.setValue(this.map.displayProjection.proj.title);
        } else {
            this.setValue(mapProjection.proj.title);
        }

        this.on('select',
                function(combo, record, index) {
                    var displayProjection = new OpenLayers.Projection(record.data.srsCode);
                    if (this.updateMapDisplayProjection) {
                        this.map.displayProjection = displayProjection;
                    }
                    var control = null;
                    if (this.controls) {
                        for (var k = 0; k < this.controls.length; k++) {
                            control = this.controls[k];
                            if (control.displayProjection) {
                                control.displayProjection = displayProjection;
                            }
                            if (control.redraw) {
                                control.redraw();
                            }
                        }

                    } else {
                        for (var i = 0; i < this.map.controls.length; i++) {
                            control = this.map.controls[i];
                            if (control.displayProjection) {
                                control.displayProjection = displayProjection;
                            }
                            if (control.redraw) {
                                control.redraw();
                            }
                        }

                    }
                    this.fireEvent('displayProjectionChanged', this);
                },
                this
                );

        this.on('displayProjectionChanged',
                function(combo) {
                    combo.setValue(this.map.displayProjection.proj.title);
                },
                this
                );

        this.addEvents(
            /** api: event[displayProjectionChanged]
             *  Fires when a displayProjection has been changed
             *
             *  Listener arguments:
             *  * comp - :class:`GeoExt.ux.DisplayProjectionSelectorCombo`` This component.
             */
                'displayProjectionChanged'
                );
    }
});


/** api: xtype = gxux_displayprojectionselectorcombo */
Ext.reg('gxux_displayprojectionselectorcombo', GeoExt.ux.DisplayProjectionSelectorCombo);
