function get_data($qid,$par) {
	if (document.getElementById($qid)!=undefined)
	document.getElementById($qid).options.length=0;
	var data ={
		data:$qid,
		par:(($par==0)?"":$par),
		ajax:1,
		nochache:0
	}
	$.get(location.pathname+'../../../../../index.php',data,function(html){
		$("#"+"container_"+$qid).html(html);
	})
}

function form_enable($id) {
	document.getElementById('contaner_form').style.display="";
	document.getElementById('submit').disabled=false;
	$('#atm_result').show();
}

function form_disable($id) {
	document.getElementById('contaner_form').style.display="none";
	document.getElementById('cid').selectedIndex=0;
	document.getElementById('submit').disabled=true;
	$('#atm_result').hide();
}

function fsubmit(page_num, callback)
{
	$('#atm_loading').css({'top':($(document).scrollTop() + ($(window).height()/2)), 'left': ($(window).width()/2)}).fadeIn();
	document.getElementById('atm_result').style.display="none";
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
			$('#atm_loading').fadeOut();
			document.getElementById('atm_result').style.display="";
		}
	});
	},1000);
	return false;
}
