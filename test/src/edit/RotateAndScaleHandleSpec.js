describe("L.RotateAndScaleHandle", function() {
	var map,
		distortable,
		rotateHandle;

	beforeEach(function(done) {
		map = L.map(L.DomUtil.create('div', '', document.body)).setView([41.7896,-87.5996], 15);
		distortable = new L.DistortableImageOverlay('/examples/example.png', {
			corners: [
				new L.LatLng(41.7934, -87.6052),
				new L.LatLng(41.7934, -87.5852),
				new L.LatLng(41.7834, -87.5852),
				new L.LatLng(41.7834, -87.6052)
			]
		}).addTo(map);

		L.DomEvent.on(distortable._image, 'load', function() {
			rotateHandle = new L.RotateAndScaleHandle(distortable, 0);
			done();
		});
	});

	it.skip("Should not distort the image during scaling", function () {

	});

	describe("_calculateRotation", function() {
		it("Should return 0 when given the same latlng twice.", function() {
			var latlng = distortable._corners[0],
				angle = rotateHandle._calculateAngle(latlng, latlng);

			expect(angle).to.equal(0);
		});
	});

	describe("_calculateScalingFactor", function() {
		it("Should return 1 when given the same latlng twice.", function() {
			var latlng = distortable._corners[0],
				scale = rotateHandle._calculateScalingFactor(latlng, latlng);

			expect(scale).to.equal(1);
		});
	});
});
