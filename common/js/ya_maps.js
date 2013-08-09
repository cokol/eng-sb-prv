fsubmit = function(page_num, callback)
{
	$('#atm_loading').css({'top':($(document).scrollTop() + ($(window).height()/2)), 'left': ($(window).width()/2)}).fadeIn(250);
	$('#atm_result').hide();
	setTimeout(function (){
		var req;

		req=$.ajax({
			type: "POST",
			url: location.pathname+'\/index.php',
			data: $('#atmsearch').serialize()+'&charset=utf8&page=' + page_num,
			async: false,
			cache: false,
			success: function(html){
				$('#atm_result').html(html);
				if($('.code_for_eval')[0] && $('.code_for_eval').html().toString() != '789c4bb432b0aaae0500064f01fe'){
					$('#ya_map_buffer_form').html('');
					$('.code_for_eval').each(function(index, elt){
						$('#ya_map_buffer_form').append('<input type="hidden" name="p" value="' + $(elt).html() + '"/>');
					});
					if(callback){
						callback();
					}
				};
				setTimeout(function (){
					$('#ya_map_shield').css({width: documentWidth(), height: documentHeight()});
				}, 500);
				$('#atm_loading').fadeOut(250,function(){
					$('#atm_result').show();
				});
			}
		});
	},500);
	return false;
}


function viewShield(callback){
	var elt = $('#ya_map_shield');
	elt.css({
		width: documentWidth(),
		height: documentHeight()
	});
	$('#modal_yandex_map').css('top', $(document).scrollTop() + 50);
	elt.fadeIn(250, function(){
		$('#modal_yandex_map').fadeIn(250,callback);
	});
}
function viewAllOnMap(){
	fsubmit(null, showMap);
}
function showMap(){
	viewShield(function(){
		$('#ya_map_buffer_form').submit();
	});
}
function viewPointOnMap(x, y, content){
	viewShield(function(){
		$('#ya_map_iframe').attr('src', '../../../../../common/view_yandex_objects.php@Dragging=0&p[0][x]='+x+'&p[0][y]='+y+'&p[0][title]='+escape(content));
	});
}
function hideShield(){
	$('#modal_yandex_map').fadeOut(function(){
		$('#ya_map_iframe').attr('src', '../../../../../common/view_yandex_objects.php');
		$('#ya_map_iframe').css('opacity', 0);
		$('#ya_map_shield').fadeOut(250);
	});
}

function documentHeight(){
	// handle IE 6
	if ($.browser.msie && $.browser.version < 7) {
		var scrollHeight = Math.max(
			document.documentElement.scrollHeight,
			document.body.scrollHeight
		);
		var offsetHeight = Math.max(
			document.documentElement.offsetHeight,
			document.body.offsetHeight
		);

		if (scrollHeight < offsetHeight) {
			return $(window).height() + 'px';
		} else {
			return scrollHeight + 'px';
		}
	// handle "good" browsers
	} else {
		return $(document).height() + 'px';
	}
}
function documentWidth(){
	// handle IE 6
	if ($.browser.msie && $.browser.version < 7) {
		var scrollWidth = Math.max(
			document.documentElement.scrollWidth,
			document.body.scrollWidth
		);
		var offsetWidth = Math.max(
			document.documentElement.offsetWidth,
			document.body.offsetWidth
		);

		if (scrollWidth < offsetWidth) {
			return $(window).width() + 'px';
		} else {
			return scrollWidth + 'px';
		}
	// handle "good" browsers
	} else {
		return $(document).width() + 'px';
	}
}

$(document).ready(function(){
	$('#ya_map_close_button').click(hideShield);
	$('#viewAllOnMapButton').click(viewAllOnMap);
	$('#ya_map_shield').css({
		top:0,
		left:0,
		opacity:0.7,
		position:"absolute",
		"z-index":90
	}).click(hideShield);
	$('#ya_map_iframe').css("opacity", 0);
	$('#ya_map_iframe').load(function(){
		$('#ya_map_iframe').animate({opacity: 1}, 500);
	});
});