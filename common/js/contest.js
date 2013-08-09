function showContestPage(page){
	jQuery('#contest_search_page').val(page);
	document.forms['contest_search'].submit();
}
function showContestAnnouncePage(page){
	jQuery('#contest_search_page_announce').val(page);
	document.forms['contest_search'].submit();
}
function changeContestPageSize(size){
	jQuery('#contest_search_page').val(1);
	jQuery('#contest_search_page_size').val(size);
	document.forms['contest_search'].submit();
}
function changeContestAnnouncePageSize(size){
	jQuery('#contest_search_page_announce').val(1);
	jQuery('#contest_search_page_announce_size').val(size);
	document.forms['contest_search'].submit();
}
