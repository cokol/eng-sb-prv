function parseGeoStack(){
	if(geoStackResult.stack.length > 0){
		try{
			var item = geoStackResult.stack.pop();
			regionGeocoder = new YMaps.Geocoder((item.region_query + ''), {'results': 1});
			YMaps.Events.observe(regionGeocoder, regionGeocoder.Events.Load, function () {
				if (regionGeocoder.length()) {
					targetGeocoder = new YMaps.Geocoder(
						(this.query + '')
						, {
							'results': 1
							, boundedBy: regionGeocoder.get(0).getBounds()
							, strictBounds: true
						}
					);
					YMaps.Events.observe(targetGeocoder, targetGeocoder.Events.Load, function () {
						var point = '';
						if (targetGeocoder.length()) {
							var result = targetGeocoder.get(0);
							point = result['_point'];
						};
						sendGeoStackResult(this.id, this.name, point);
					}, item);
				} else {
					sendGeoStackResult(this.id, this.name, '');
				};
			}, item);
			YMaps.Events.observe(regionGeocoder, regionGeocoder.Events.Fault, function (e) {
				sendGeoStackResult(this.id, this.name, '');
			}, item);
		} catch(e){};
	};
};

function sendGeoStackResult(id, table_name, point){
	$.post('../../../../common/js/collect_geocode_stack_data.php',{
		'id': id
		, 'table_name': table_name
		, 'point': point
	});
	parseGeoStack();
};

var geoStackResult = {
	'stack': []
};
var regionGeocoder = {};
var targetGeocoder = {};
$(document).ready(function(){
	$.post('../../../../common/js/get_geocode_stack_part.php', {}, function(result){
		if(result.length){
			geoStackResult.stack = result;
			parseGeoStack();
		}
	}, 'json');
});
