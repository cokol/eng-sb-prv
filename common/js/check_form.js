var prefixes = {
	'_nonempty_':validate_nonempty,
	'_email_':validate_email,
	'_date_':validate_date,
	'_time_':validate_time,
	'_datetime_':validate_datetime,
	'_number_':validate_number,
	'_int_':validate_int,
	'_select_':validate_select,
	'_radio_':validate_radio,
	'_alphastring_':validate_alphastring,
	'_login_':validate_login,
	'_dirname_':validate_dirname,
	'_nonemptyalt_':validate_nonemptyalt,
	'_phone_':validate_phone
};

var warnings = {
	'_nonempty_':'Не заполнено обязательное поле',
	'_email_':'Неверный формат e-mail',
	'_date_':'Неверный формат даты (DD.MM.YYYY)',
	'_time_':'Неверный формат времени (HH:MM)',
	'_datetime_':'Неверный формат даты и времени (DD.MM.YYYY HH:MM)',
	'_number_':'Неверный формат числа',
	'_int_':'Неверный формат числа',
	'_select_':'Не выбрано поле',
	'_radio_':'Не выбрано поле',
	'_alphastring_':'Неверный формат (строка из латинских букв)',
	'_login_':'Неверный формат (строка из цифр или латинских букв без пробелов)',
	'_dirname_':'Неверный формат названия каталога (строка из латинских букв без пробелов)',
	'_nonemptyalt_':'Не заполнено обязательное поле',
	'_phone_':'В номере телефона должно быть 10 цифр'
};

var checked_fields=new Array();
var GetPrefixPos=0;
var f;

function isFieldEnabled(parent) {
	do {
		if (parent.disabled) return false;
		parent = parent.parentNode;
	} while (parent);
	return true;
}

function CheckMandatoryFields(form) {
	f = typeof form === 'string' ? document.forms[form] : form;
	var prefix;
	var c;
	var i;
	var flag=true;
	var element_name;
	var item;
	var form_length=f.elements.length;

	for(c=0;c<form_length;c++) {
		item=f.elements[c];
		element_name=item.name;
		GetPrefixPos=0;
                if(item.name != undefined)
		while ((prefix = getNextPrefix(element_name)) != '' && isFieldEnabled(item)) {
			if(!(prefixes[prefix](item))) {
				alert(warnings[prefix]);
				var digits=f.elements[c].name.match("\\d+$");
				if(!f.elements.check_form_langs)
					f.elements[c].focus();
				else
					{
					if(f.elements.check_form_langs.value=="" || (!f.elements.check_form_langs.value.match("_"+digits+"_")))
						f.elements[c].focus();
					}
				//
				return false;
			}
		}
	}

	while(flag) {
		flag=false;
		for(c=0;c<form_length;c++) {
			element_name=f.elements[c].name;
                        if(element_name != undefined)
			for(prefix in prefixes) {
				if(element_name.substring(0,prefix.length)==prefix) {
					f.elements[c].orig_name=f.elements[c].name;
					f.elements[c].name=element_name.substring(prefix.length,element_name.length);
					flag=true;
				}
			}
		}
	}

	return true;
}

function restoreMandatoryFieldNames(form) {
	var f = typeof form === 'string' ? document.forms[form] : form;
	for (var i = 0, l = f.elements.length; i < l; i++) {
		var on = f.elements[i].orig_name;
		if (on) f.elements[i].name = on;
	}
}

function getNextPrefix(name) {
	var prefix;
	for(prefix in prefixes) {
		if(name.substring(GetPrefixPos,GetPrefixPos+prefix.length)==prefix) {
			GetPrefixPos+=prefix.length;
			return prefix;
		}
	}
	GetPrefixPos=0;
	prefix="";
	return prefix;
}

function validate_nonemptyalt(obj) {
	var name=obj.name;
	var new_name,i;
	new_name='f'+name.match(/\d+a\d+$/);
	for(i=0;i<f.elements.length;i++)
		if(f.elements[i].name==new_name || f.elements[i].name=="_radio_"+new_name)
			if(f.elements[i].value=='alt' && f.elements[i].checked=='1' && obj.value=='')
				return false;
	return true;
}

function validate_email(obj) {
	var i;
	var val=obj.value;
	var state=0;
	if(val=="") return true;

	var re;
	re = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
	if ( !obj.value.match(re) ) return false;
	return true;
}

function validate_date(obj) {
	var i,state=0;
	var val=obj.value;
	var dd="",mm="",yyyy="";
	if(val=="") return true;
	for(i=0;i<val.length;i++) {
		switch(state) {
			case 0:
				if(val.charAt(i)==".") state=1;
				else if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else dd+=val.charAt(i);
				break;
			case 1:
				if(val.charAt(i)==".") state=2;
				else if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else mm+=val.charAt(i);
				break;
			case 2:
				if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else yyyy+=val.charAt(i);
		}
	}
	if(state!=2) return false;
	if(isNaN(parseInt(dd)) || isNaN(parseInt(mm)) || isNaN(parseInt(yyyy))) return false;
	if(dd.length != 2 || mm.length !=2 || yyyy.length != 4) return false;
	if(parseInt(dd) < 0 || parseInt(mm) < 0 || parseInt(dd) > 31 || parseInt(mm) > 12) return false;
	return true;
}

function validate_time(obj) {
	var i,state=0;
	var val=obj.value;
	var hh="",mi="";
	if(val=="") return true;
	for(i=0;i<val.length;i++) {
		switch(state) {
			case 0:
				if(val.charAt(i)==":") state=1;
				else if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else hh+=val.charAt(i);
				break;
			case 1:
				if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else mi+=val.charAt(i);
		}
	}
	if(state!=1) return false;
	if(isNaN(parseInt(hh)) || isNaN(parseInt(mi))) return false;
//marhipov
	if(hh.length != 2 || mi.length !=2) return false;
//
	if(parseInt(hh)>23 || parseInt(mi)<0 || parseInt(mi)>59 || parseInt(mi)<0) return false;
	return true;
}


function validate_datetime(obj) {
	var i,state=0;
	var val=obj.value;
	var dd="",mm="",yyyy="",hh="",mi="";
	if(val=="") return true;
	for(i=0;i<val.length;i++) {
		switch(state) {
			case 0:
				if(val.charAt(i)==".") state=1;
				else if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else dd+=val.charAt(i);
				break;
			case 1:
				if(val.charAt(i)==".") state=2;
				else if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else mm+=val.charAt(i);
				break;
			case 2:
				if(val.charAt(i)==" ") state=3;
				else if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else yyyy+=val.charAt(i);
				break;
			case 3:
				if(val.charAt(i)==":") state=4;
				else if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else hh+=val.charAt(i);
				break;
			case 4:
				if("0123456789".indexOf(val.charAt(i))==-1) return false;
				else mi+=val.charAt(i);
		}
	}
	if(state!=4) return false;

	if(isNaN(parseInt(dd)) || isNaN(parseInt(mm)) || isNaN(parseInt(yyyy))) return false;
	if(parseInt(dd) < 0 || parseInt(mm) < 0 || parseInt(dd) > 31 || parseInt(mm) > 12) return false;
	if(isNaN(parseInt(hh)) || isNaN(parseInt(mi))) return false;
	if(hh.length != 2 || mi.length !=2) return false;
	if(parseInt(hh)>23 || parseInt(mi)<0 || parseInt(mi)>59 || parseInt(mi)<0) return false;
	return true;
}

function validate_nonempty(obj) {
	return !obj.value.match(/^\s*$/);
}

function validate_number(obj) {
	return obj.value.match(/^\s*-?\d*([\.,]\d+)?\s*$/);
}

function validate_int(obj) {
	return obj.value.match(/^\s*(-?\d+\s*)?$/);
}

function validate_select(obj) {
	var val=obj.options[obj.selectedIndex].value;
	if(val==-1 || val=="") return false;
	return true;
}

function validate_radio(obj) {
	var obj_name=obj.name;
	obj = f[obj.name];
	if(checked_fields[obj_name]==true){
		return true;
	}
	var status=false;
	var obj_length=obj.length;
	if (!obj_length)
		if (obj.checked)
			status=true;

	for (var i = 0;i<obj_length; i++){
   		if (obj[i].checked){
			status=true;
		}
	}
	if(status){
		checked_fields[obj_name]=true;
	}
	return status;
}

function validate_alphastring(obj) {
	var val=obj.value;
	for(i=0;i<val.length;i++) {
		if(!is_alpha(val.charAt(i))&&!is_number(val.charAt(i))&&!is_addsymb(val.charAt(i))) return false;
	}
	return true;
}

function validate_login(obj) {
	return obj.value.match(/^\w+$/);
}

function validate_dirname(obj) {
	var val = obj.value;
	for (var i = 0, l = val.length; i < l; i++)
		if (!is_alnum2(val.charAt(i))) return false;
	return true;
}

function validate_phone(obj) {
	return obj.value.replace(/[^\d]/, '').match(/^\d{10}$/);
}

function is_alpha(c) {
	return 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.indexOf(c)!=-1;
}

function is_number(c) {
	return '0123456789'.indexOf(c)!=-1;
}

function is_alnum(c) {
	return is_alpha(c) || is_number(c);
}

function is_alnum2(c) {
	return is_alnum(c) || c == '_' || c == '-' || c == '.';
}

function is_addsymb(c) {
	return '_-\.\ '.indexOf(c) != -1;
}