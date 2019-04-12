L.DistortableImage = L.DistortableImage || {};

var EditOverlayAction = LeafletToolbar.ToolbarAction.extend({
		initialize: function(map, overlay, options) {
			this._overlay = overlay;
			this._map = map;

			LeafletToolbar.ToolbarAction.prototype.initialize.call(this, options);
		}
	}),

	ToggleTransparency = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-adjust"></span>',
			tooltip: 'Toggle Image Transparency',
			title: 'Toggle Image Transparency'
		}},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleTransparency();
			this.disable();
		}
	}),

	ToggleOutline = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-square-o"></span>',
			tooltip: 'Toggle Image Outline',
			title: 'Toggle Image Outline'
		}},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleOutline();
			this.disable();
		}
	}),

	RemoveOverlay = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-trash"></span>',
			tooltip: 'Delete image',
			title: 'Delete image'
		}},

		addHooks: function() {
			var map = this._map;

			map.removeLayer(this._overlay);
			this._overlay.fire('delete');
			this.disable();
		}
	}),

	ToggleEditable = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-lock"></span>',
			tooltip: 'Lock / Unlock editing',
			title: 'Lock / Unlock editing'
		}},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleLock();
			this.disable();
		}
	}),

	ToggleRotateDistort = EditOverlayAction.extend({
		initialize: function(map, overlay, options) {
			var icon = overlay.editing._mode === 'rotate' ? 'image' : 'rotate-left';

			options = options || {};
			options.toolbarIcon = {
				html: '<span class="fa fa-' + icon + '"></span>',
				tooltip: 'Rotate',
				title: 'Rotate'
			};

			EditOverlayAction.prototype.initialize.call(this, map, overlay, options);
		},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleRotateDistort();
			editing._hideToolbar();
			editing._showToolbar();
			this.disable();
		}
	}),


	ToggleExport = EditOverlayAction.extend({
		options: {
			toolbarIcon: {
				html: '<span class="fa fa-download"></span>',
				tooltip: 'Export Image',
				title: 'Export Image'
			}
		},

		addHooks: function ()
		{
			var editing = this._overlay.editing;

			editing._toggleExport();
			this.disable();
		}
	}),

	ToggleOrder = EditOverlayAction.extend({
		options: {
			toolbarIcon: {
				html: '<span class="fa fa-sort"></span>',
				tooltip: 'Change order',
				title: 'Toggle order'
			}
		},

		addHooks: function ()
		{
			var editing = this._overlay.editing;

			editing._toggleOrder();
			this.disable();
		}
	}),

  EnableEXIF = EditOverlayAction.extend({
  options: {
    toolbarIcon: {
      html: '<span class="fa fa-compass"></span>',
      tooltip: "Enable EXIF",
      title: "Geocode Image"
    }
  },

  addHooks: function() {
    var image = this._overlay._image;
    EXIF.getData(image, L.EXIF(image));
  }
  });

  var defaults = [
    ToggleTransparency,
    RemoveOverlay,
    ToggleOutline,
    ToggleEditable,
    ToggleRotateDistort,
    ToggleExport,
    EnableEXIF,
		ToggleOrder

  ];
  
  L.DistortableImage.EditToolbarDefaults = defaults;
  
  L.DistortableImage.EditToolbar = LeafletToolbar.Popup.extend({
    options: {
      actions: defaults
    }
  });
