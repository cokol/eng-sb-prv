

window.onload = function() {
	$("div.sbol_apps_platforms_content div.sbol_apps_platrom").not("div.sbol_apps_platforms_content div.sbol_apps_platrom:first").css({"left":0,"display":"none"});
	$("div.sbol_apps_platforms_content div.sbol_apps_platrom div.sideBlockIn").css("display","block");
	$("div.platform_chooser").fadeIn(150);
}


$(document).ready(function() {	
	$( '.cycle-slideshow-my:first').cycle();
	
	
	
	$("div.slider_chooser a").click(function(){
		$(this).closest("div.sbol_apps_platrom").find("div.slider_chooser a").removeClass("active");
		$(this).closest("div.sbol_apps_platrom").find('div.sbol_apps_slider_wrapper').hide();
		$(this).closest("div.sbol_apps_platrom").find('div.sbol_apps_slider_wrapper .cycle-slideshow-my').cycle('destroy');
		var idx = $(this).closest("div.slider_chooser").find('a').index(this);
		$(this).closest("div.sbol_apps_platrom").find("div.sbol_apps_slider_wrapper").eq(idx).show();
		$(this).closest("div.sbol_apps_platrom").find("div.sbol_apps_slider_wrapper").eq(idx).find('.cycle-slideshow-my').cycle();
		$(this).addClass('active');
	});
	
	$("div.platform_chooser a:first").addClass("active");
		
	$("div.platform_chooser a").click(function(){
		if ($(this).hasClass("active")) { return false;}
		$("div.platform_chooser a").removeClass("active");
		var idx = $(this).closest("div.platform_chooser").find('a').index(this);
			var heightnow = $("div.sbol_apps_platforms_content div.sbol_apps_platrom:visible").height();
			var heightwill = (parseInt($("div.sbol_apps_platforms_content div.sbol_apps_platrom").eq(idx).find("div.sbol_apps_slider_wrapper").css("height"),10)+175);
			
			$("div.sbol_apps_platforms_content").animate({
				height: heightwill
			},100);
			
			 
		$('div.sbol_apps_slider_wrapper div.sbol_apps_platrom:visible .cycle-slideshow-my').cycle('destroy');
		$("div.sbol_apps_platforms_content div.sbol_apps_platrom:visible").fadeOut(150);
		
		$(this).closest("div.sbol_apps_platforms_wrapper").find("div.sbol_apps_platforms_content div.sbol_apps_platrom").eq(idx).fadeIn(150);
		$(this).closest("div.sbol_apps_platforms_wrapper").find("div.sbol_apps_platforms_content div.sbol_apps_platrom").eq(idx).find('.cycle-slideshow-my:first').cycle();
		
		var whclass = $(this).attr("data-whclass");
		$("div.whatsnewapp").hide();
		if (whclass) { $("#"+whclass).show() };
		
		$(this).addClass('active');
		
		
	});
	
	
})


$(window).scroll(function() {
		var scrolltop = $(window).scrollTop();
		var offsetsideBlock = $("div.sbol_apps_platforms_wrapper").offset().top-255;
		var offsetsideBlockLeft = $("div.sideBlock:visible").offset().left;
						
		var dheight = $(document).height(); 
		var wheight = $(window).height(); 
		var sbh = $("div.sideBlockIn:visible").height();
		
		if (scrolltop > offsetsideBlock)  {
			$("div.sideBlockIn").addClass("sticky"); 
			$("div.sideBlockIn").css("left",offsetsideBlockLeft);
			
			if (scrolltop > (dheight-650-sbh)) { 
				$("div.sideBlockIn").addClass("sidebottom"); $("div.sideBlockIn").css("top",(dheight-650-sbh-200));
			} else {$("div.sideBlockIn").removeClass("sidebottom");$("div.sideBlockIn").css("top",91); }
			
			
		} else {$("div.sideBlockIn").removeClass("sticky");$("div.sideBlockIn").css("left",0);$("div.sideBlockIn").css("top",0); }
		
		
		
});