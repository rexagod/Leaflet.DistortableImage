function projector(utils, e, array, obj) { // jshint ignore:line
  var L_img_array = obj.L_images;
  var map = obj.map;
  document.querySelector("#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane").innerHTML = ""; // part of this is the toolbar
  if(document.querySelectorAll("#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path").length) {
    [].slice.call(document.querySelectorAll("#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path")).slice(0,3).map(function(x) {
      x.parentNode.removeChild(x);
    });
  }
    function addLine(line_coordinates, map) {
      return L.polyline(line_coordinates).addTo(map);
    }
    var match_points = utils.matches;
    var icon = L.icon({
      iconUrl: "dot.png",
      iconSize: [5, 5],
      iconAnchor: [0, 0],
      popupAnchor: [2, 2]
    });
    var dot = function(x, y, c){
      return L.marker([x, y], { icon: icon }).addTo(map).bindPopup(JSON.stringify(c));
    };
    array.push(e.target);
    if (array.length >= 2) {
      array = array.slice(-2);
      var A = array[0];
      var B = array[1];
      for (var p in L_img_array) {
        if (L_img_array[p]._image === A) {
          array[0] = L_img_array[p];
        }
        if (L_img_array[p]._image === B) {
          array[1] = L_img_array[p];
        }
      }
      var idx = 2;
      var processedPoints = {points: [], images: [], confidences: []};
      for (var i=0; i<array.length; i++) {
        var wA = A.clientWidth, hA = A.clientHeight;
        var h_diff = Math.abs(map.latLngToContainerPoint(array[i].getCorner(0)).x - map.latLngToContainerPoint(array[i].getCorner(1)).x);
        var rwA = h_diff / wA;
        var v_diff = Math.abs(map.latLngToContainerPoint(array[i].getCorner(0)).y - map.latLngToContainerPoint(array[i].getCorner(2)).y);
        var rhA = v_diff / hA;
        var temp = [];
        processedPoints.confidences[i] = [];
        for (var m in match_points) {
          var t1, t2, confidence;
          if(idx === 2){
            t1 = match_points[m].x2;
            t2 = match_points[m].y2;
            confidence = match_points[m].confidence.c2;
          } else {
            t1 = match_points[m].x1;
            t2 = match_points[m].y1;
            confidence = match_points[m].confidence.c1;
          }
          var x_off = t1 * rwA;
          var y_off = t2 * rhA;
          var x_plot = map.latLngToContainerPoint(array[i].getCorner(0)).x - x_off;
          var y_plot = map.latLngToContainerPoint(array[i].getCorner(0)).y + y_off;
          temp.push([x_plot, y_plot]);
          processedPoints.confidences[i].push(confidence);
        }
        processedPoints.points[i] = [];
        processedPoints.images.push(array[i]);
        for (var n in temp) {
          var k = map.containerPointToLatLng(temp[n]);
          processedPoints.points[i].push(k);
          dot(k.lat, k.lng, processedPoints.confidences[i][n]);
        }
        processedPoints.confidences[0].sort(function(a,b) {
          return b-a;
        }).slice(0,3).map(function(r) { // jshint ignore:line
          if(processedPoints.points[1]) {
            if(processedPoints.images[0]!==processedPoints.images[1]) {
              var line_coordinates = [processedPoints.points[0][processedPoints.confidences[0].indexOf(r)], processedPoints.points[1][processedPoints.confidences[0].indexOf(r)]];
              addLine(line_coordinates, map); 
            }
          }
        });
        A = B;
        idx--;
      }
      window.processedPoints = processedPoints;
    }
  }
