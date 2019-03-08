L.DistortableImage = L.DistortableImage || {};

var EditOverlayAction = LeafletToolbar.ToolbarAction.extend({
    initialize: function(map, overlay, options) {
      this._overlay = overlay;
      this._map = map;

      LeafletToolbar.ToolbarAction.prototype.initialize.call(this, options);
    }
  }),
  Stitcher = EditOverlayAction.extend({
    options: {
      toolbarIcon: {
        html: '<span class="fa fa-puzzle-piece"></span>',
        tooltip: "Enable stitcher",
        title: "Enable stitcher"
      }
    },

    addHooks: function() {
      var overlay = this._overlay;
      var map = this._map;

      if (overlay.Tracer) {
        overlay._corners = overlay.Tracer;
      }

      // For the "Road-connection" example
      // overlay._corners = [
      //   new L.latLng(51.511092905004745, -0.05982398986816407),
      //   new L.latLng(51.511092905004745, -0.09999275207519533),
      //   new L.latLng(51.49100336416198, -0.05982398986816407),
      //   new L.latLng(51.49100336416198, -0.09999275207519533)
      // ];

      var corners = overlay._corners;

      for (var i = 0; i < corners.length; i++) {
        map.project(corners[i]);
      }

      map.setView(overlay._corners[0], 12);
      this.disable();
    }
  });

var defaults = [Stitcher];

L.DistortableImage.EditToolbarDefaults = defaults;

L.DistortableImage.EditToolbar = LeafletToolbar.Popup.extend({
  options: {
    actions: defaults
  }
});
