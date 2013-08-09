$(document).ready(function() {	
	$( '.cycle-slideshow-my:first').cycle();
	
	
	
	$("div.slider_chooser a").click(function(){
		$(this).closest("div.sbol_atm_cases").find("div.slider_chooser a").removeClass("active");
		$(this).closest("div.sbol_atm_cases").find('div.sbol_atm_slider_wrapper').hide();
		$(this).closest("div.sbol_atm_cases").find('div.sbol_atm_slider_wrapper .cycle-slideshow-my').cycle('destroy');
		var idx = $(this).closest("div.slider_chooser").find('a').index(this);
		$(this).closest("div.sbol_atm_cases").find("div.sbol_atm_slider_wrapper").eq(idx).show();
		$(this).closest("div.sbol_atm_cases").find("div.sbol_atm_slider_wrapper").eq(idx).find('.cycle-slideshow-my').cycle();
		$(this).addClass('active');
	});
	
		
	
	
})


$(window).scroll(function() {
		var scrolltop = $(window).scrollTop();
		var offsetsideBlock = $("div.sbol_atm_cases").offset().top-255;
		var offsetsideBlockLeft = $("div.sideBlock:visible").offset().left;
		

		var dheight = $(document).height(); 
		var wheight = $(window).height(); 
		var sbh = $("div.sideBlockIn").height();
		
		if (scrolltop > offsetsideBlock)  {
			$("div.sideBlockIn").addClass("sticky"); 
			$("div.sideBlockIn").css("left",offsetsideBlockLeft);
			
			if (scrolltop > (dheight-660-sbh)) { 
				$("div.sideBlockIn").addClass("sidebottom"); $("div.sideBlockIn").css("top",(dheight-660-sbh-200));
			} else {$("div.sideBlockIn").removeClass("sidebottom");$("div.sideBlockIn").css("top",91); }
			
			
		} else {$("div.sideBlockIn").removeClass("sticky");$("div.sideBlockIn").css("left",0);$("div.sideBlockIn").css("top",0); }
		
		
		
		
});