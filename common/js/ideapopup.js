function ideaviewShield ()
{
	var elt = jQuery('#ideapopupshield');
	elt.css({
		width: ideadocumentWidth(),
		height: ideadocumentHeight()
	});
	jQuery('#ideapopup').css('top', jQuery(document).scrollTop() + 50);
	elt.fadeIn(250, function(){
		jQuery('#ideapopup').fadeIn(250,ideaend());
	});
	var block = jQuery('#ideapopup');
	block.css('display','block');

}

function ideaend()
{
	jQuery('#ideapopupshield').css({
		top:0,
		"opacity":"0.7",
		position:"absolute",
		"z-index":"995"
	});
	jQuery('#ideapopup').css({
		position:"absolute",
		"z-index":"996"
	});

	jQuery(document).resize(function(){	elt.css({
		width: ideadocumentWidth(),
		height: ideadocumentHeight()
	});});
}

function ideahideShield()
{
	jQuery('#ideapopupshield').fadeOut(function(){
		jQuery('#ideapopupshield').css('opacity', 0);
		jQuery('#ideapopupshield').fadeOut(250);
	});
	var block = jQuery('#ideapopup');
	block.css('display','none');
}

function ideadocumentHeight()
{
	// handle IE 6
	if (jQuery.browser.msie && jQuery.browser.version < 7) {
		var doc = document.documentElement;
		var body = document.body;
		var scrollHeight = Math.max(doc.scrollHeight,body.scrollHeight);
		var offsetHeight = Math.max(doc.offsetHeight,body.offsetHeight);

		if (scrollHeight < offsetHeight) {
			return jQuery(window).height() + 'px';
		} else {
			return scrollHeight + 'px';
		}
	// handle "good" browsers
	} else {
		return jQuery(document).height() + 'px';
	}
}

function ideadocumentWidth()
{
	// handle IE 6
	if (jQuery.browser.msie && jQuery.browser.version < 7) {
		var doc = document.documentElement;
		var body = document.body;
		var scrollWidth = Math.max(doc.scrollWidth,body.scrollWidth);
		var offsetWidth = Math.max(doc.offsetWidth,body.offsetWidth);

		if (scrollWidth < offsetWidth) {
			return jQuery(window).width() + 'px';
		} else {
			return scrollWidth + 'px';
		}
	// handle "good" browsers
	} else {
		return jQuery(document).width() + 'px';
	}
}