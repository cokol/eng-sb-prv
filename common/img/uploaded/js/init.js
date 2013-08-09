$(document).ready(function() {	
	$("div.sbol_section div.text div.item").hoverIntent( function(){
		var idx = $(this).closest("div.sbol_section").find('div.text div.item').index(this);
		$(this).closest("div.sbol_section").find("div.pic").each(function(){
			$(this).find("img").css("z-index",200);
			$(this).find("img").eq(idx+1).css("z-index",300);
			$(this).find("img").eq(idx+1).fadeIn(200);
		});
	}, function(){
		var idx = $(this).closest("div.sbol_section").find('div.text div.item').index(this);
		$(this).closest("div.sbol_section").find("div.pic").each(function(){
			$(this).find("img").eq(idx+1).delay(400).fadeOut(200);
		});
	} );
	
	
	$("div.sbol_section a.showinstruction").click(function(){
		$(this).closest("div.sbol_section").find('div.instruction').slideToggle(300);
		$(this).toggleClass("active");
	});
	
	$("div.sbol_section div.instruction a.instrClose").click(function(){
		$(this).closest("div.sbol_section").find('div.instruction').slideToggle(300);
		$(this).closest("div.sbol_section").find('a.showinstruction').toggleClass("active");
	});
	
	$("div.sbol_mobileSelect_nav a").click(function(){
		if ($(this).hasClass("active")) { return false;}
		$("div.sbol_mobileSelect_nav a").removeClass("active");
		var idx = $(this).closest("div.sbol_mobileSelect_nav").find('a').index(this);
		$(this).addClass('active');
		$("div.sbol_mobileSelectItems div.sbol_mobile_item:visible").fadeOut(150);
		$("div.sbol_mobileSelect").find("div.sbol_mobileSelectItems div.sbol_mobile_item").eq(idx).fadeIn(150);
	});
	
	$("div.sbol_iconmenu p.col a,div#floatmenu.sbolindexfm p.links a.gotop,div#floatmenu p.gotop a").on('click', function(e){// прокрутка 
		e.preventDefault();
		var slide = $($(this).attr('href'));
		var postop = slide.offset().top-30;
		$(window)._scrollable().stop();
		$(window).scrollTo( {top:postop, left:'50%'}, 1000, { easing:'easeInOutExpo' } );
	});
	
	$("div.sbol_chooser a:last-child,table tbody tr:last").addClass("last");
	
	$("div.sbol_apps_else div.sbol_openening h4 u").click(function(){
		$(this).parent().parent().find("div.sbol_closed").slideToggle();
		$(this).toggleClass("active");
		
	});
	
	
});
	
$(window).scroll(function() {
	var scrolltop = $(window).scrollTop();
	if (scrolltop > 260) {$("div#floatmenu").fadeIn(100)};
	if (scrolltop < 200) {$("div#floatmenu").fadeOut(100)};
});
	