L.DomUtil = L.DomUtil || {};
L.DistortableImage = L.DistortableImage || {};

function disable() {
  document.getElementById("keymapper-wrapper").style.display = "none";
  var mini_button = document.createElement("button");
  mini_button.innerHTML = "<i class='fa fa-keyboard-o' aria-hidden='true'></i>";
  mini_button.setAttribute("id", "minimized-button");
  document.body.appendChild(mini_button);
  mini_button.addEventListener("click", function() {
    mini_button.style.display = "none";
    document.getElementById("keymapper-wrapper").style.display = "";
  });
}

L.DistortableImage.Keymapper = L.Handler.extend({
  initialize: function(map, image, params) {
    window.keymapper_instances = window.keymapper_instances + 1 || 1;
    if (window.keymapper_instances > 1) {
      throw Error("illegal declaration: more than one keymapper instances not allowed!");
    }
    this.disable = disable;
    this._map = map;
    this._image = image;
    this._params = params || {};
    this._position = this._params.position || "topright";
  },

  addHooks: function() {
    L.DomEvent.on(this._image, "load", this._setMapper, this);
  },

  removeHooks: function() {
    L.DomEvent.off(this._image, "load", this._setMapper, this);
  },

  _setMapper: function() {
    var keymapper = L.control({ position: this._position });
    keymapper.onAdd = function() {
      var el_wrapper = L.DomUtil.create("div", "l-container");
      el_wrapper.setAttribute("id", "keymapper-wrapper");
      el_wrapper.innerHTML =
        "<table><tbody>" +
        "<tr><td><center><span id='keymapper-heading'>Keymappings</span></center></td></tr>" +
        "<tr><td id='keymapper-hr'><hr></td></tr>" +
        "<tr><td><kbd>j</kbd>, <kbd>k</kbd>: <span>Send up / down (stacking order)</span></td></tr>" +
        "<tr><td><kbd>l</kbd>: <span>Lock</span></td></tr>" +
        "<tr><td><kbd>o</kbd>: <span>Outline</span></td></tr>" +
        "<tr><td><kbd>s</kbd>: <span>Scale</span></td></tr>" +
        "<tr><td><kbd>t</kbd>: <span>Transparency</span></td></tr>" +
        "<tr><td><kbd>d</kbd> , <kbd>r</kbd>: <span>RotateScale</span> </td></tr>" +
        "<tr><td><kbd>esc</kbd>: <span>Deselect All</span></td></tr>" +
        "<tr><td><kbd>delete</kbd> , <kbd>backspace</kbd>: <span>Delete</span></td></tr>" +
        "<tr><td><kbd>caps</kbd>: <span>Rotate</span></td></tr>" +
        "<tr><td><center><button id='close-keymapper-button'>" +
        "<kbd id='close-keymapper-kbd'>" +
        "<i class='fa fa-times-circle' aria-hidden='true'></i>" +
        "</kbd></button></center></td></tr>" +
        "</tbody></table>";
      return el_wrapper;
    };
    keymapper.addTo(this._map);
  }
});

window.onload = function() {
  if (document.getElementById("close-keymapper-button")) {
    document
      .getElementById("close-keymapper-button")
      .addEventListener("click", disable);
  }
};
