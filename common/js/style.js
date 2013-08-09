browserName = navigator.appName;
browserVer = parseInt(navigator.appVersion);
var agent = navigator.userAgent;

if (agent.indexOf("Opera") > -1) {
	document.writeln("<link rel=stylesheet type=text/css href=\"common/css/op.css\">");
}
else if ((browserVer >3) && (browserName == "Microsoft Internet Explorer")) {
	document.writeln("<link rel=stylesheet type=text/css href=\"common/css/ie.css\">");
}
else if ((browserVer >3) &&(browserName == "Netscape")) {
	document.writeln("<link rel=stylesheet type=text/css href=\"common/css/nn4.css\">");
}

// Задание специфического обработчика событий            
function addListener( oObj, sEvent, oFunc )
{
	try {
		if ( document.attachEvent )
			oObj.attachEvent( 'on' + sEvent, oFunc );
		else if ( document.addEventListener )
			oObj.addEventListener( sEvent, oFunc, true );
		else
			eval( oObj + '.on' + sEvent + '=' + oFunc );
	 } catch ( e ) { }
}
