// global variables //
var TIMER = 5;
var SPEED = 10;
var WRAPPER = 'podskazka_b';

// calculate the current window width //
function pageWidth() {
  return window.innerWidth != null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;
}

// calculate the position starting at the left of the window //
function leftPosition() {
  return typeof window.pageXOffset != 'undefined' ? window.pageXOffset : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ? document.body.scrollLeft : 0;
}

// build/show the dialog box, populate the data and call the fadeDialog function //
function showDialog(title,message,type) {
  if(!type) {
	type = 'error';  
  }
  var dialog;
  var dialogheader;
  var dialogclose;
  var dialogtitle;
  var dialogcontent;
  var dialogmask;
  if(!document.getElementById('dialog2')) {
    dialog = document.createElement('div');
    dialog.id = 'dialog2';
    dialogheader = document.createElement('div');
    dialogheader.id = 'dialog-header';
    dialogtitle = document.createElement('div');
    dialogtitle.id = 'dialog-title';
    dialogclose = document.createElement('div');
    dialogclose.id = 'dialog-close';
    dialogcontent = document.createElement('div');
    dialogcontent.id = 'dialog-content';
    dialogmask = document.createElement('div');
    dialogmask.id = 'dialog-mask';     
    
    iframemask = document.createElement('iframe');    
    iframemask.className = 'iframe_mask';
	
	
    document.body.appendChild(dialogmask);    
    document.body.appendChild(dialog);    
    dialog.appendChild(iframemask);
    
    dialog.appendChild(dialogheader);
	dialogheader.appendChild(dialogtitle);
    dialogheader.appendChild(dialogclose);
    dialog.appendChild(dialogcontent);
	dialogclose.setAttribute('onclick','hideDialog()');
	dialogclose.onclick = hideDialog;
  } else {
    dialog = document.getElementById('dialog2');
    dialogheader = document.getElementById('dialog-header');
    dialogtitle = document.getElementById('dialog-title');
    dialogcontent = document.getElementById('dialog-content');
	dialogmask = document.getElementById('dialog-mask');
    dialogmask.style.visibility = "visible";
    dialog.style.visibility = "visible";
  }
  dialog.style.opacity = .00;
  dialog.style.filter = 'alpha(opacity=0)';
  dialog.alpha = 0;
  var width = pageWidth();
  var left = leftPosition();
  var dialogwidth = dialog.offsetWidth;
  var position = left + (width / 2) - (dialogwidth / 2);
  dialog.style.left = position + "px";
  dialogheader.className = type + "header";
  dialogtitle.innerHTML = title;
  dialogcontent.className = type;
  dialogcontent.innerHTML = message;
  var content = document.getElementById(WRAPPER);
  dialogmask.style.height = content.offsetHeight + 'px';  
  
  iframemask.style.height = $('#dialog2').height() + 'px';
  iframemask.style.width = $('#dialog2').width() + 'px';
  
  dialog.timer = setInterval("fadeDialog(1)", TIMER);
}

// hide the dialog box //
function hideDialog() {
  var dialog = document.getElementById('dialog2');
  dialog.timer = setInterval("fadeDialog(0)", TIMER);
}

// fade-in the dialog box //
function fadeDialog(flag) {
  if(flag == null) {
	flag = 1;
  }
  var dialog = document.getElementById('dialog2');
  var value;
  if(flag == 1) {
    value = dialog.alpha + SPEED;
  } else {
    value = dialog.alpha - SPEED;
  }
  dialog.alpha = value;
  dialog.style.opacity = (value / 100);
  dialog.style.filter = 'alpha(opacity=' + value + ')';
  if(value >= 99) {
    clearInterval(dialog.timer);
  } else if(value <= 1) {
    dialog.style.visibility = "hidden";
    document.getElementById('dialog-mask').style.visibility = "hidden";
	clearInterval(dialog.timer);
  }
}
 