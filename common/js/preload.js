// Устранение мигания фоновых картинок в IE6
try { document.execCommand( 'BackgroundImageCache', false, true ) } catch ( e ) { }

function preloadImages(urls)	{
	var img = new Array();
	for (var i=0; i<urls.length; i++)	{
		img[img.length]=new Image();
		img[img.length - 1].src=urls[i];
		}

}

function preload()	{
	var img = new Array('common/img/head/nn.png', 'common/img/menu2/fon_tab2s.jpg');
		preloadImages(img);
}

// Снятие специфического обработчика событий
function removeListener( oObj, sEvent, oFunc )
{
	try {
		if ( document.detachEvent )
			oObj.detachEvent( 'on' + sEvent, oFunc );
		else if ( document.removeEventListener )
			oObj.removeEventListener( sEvent, oFunc, true );
		else
			eval( oObj + '.on' + sEvent + ' = function() { return false }' );
	 } catch ( e ) { }
}