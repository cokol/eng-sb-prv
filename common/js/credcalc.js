function init_calc()
{
	var calcs_div = document.getElementById( 'calcs' );

	if ( !calcs_div ) return;

	var calc_forms = calcs_div.getElementsByTagName( 'form' );
	/*
	for ( var i = 0; i < calc_forms.length; i++ )
	{
		calc_forms[i]['vdate'].value = vdate;
		calc_forms[i]['vdoll'].value = vdoll;
		calc_forms[i]['veuro'].value = veuro;
	}
	*/
	var selects_table = document.getElementById( 'selects' );

	if ( !selects_table ) return;

	var calc_selects = selects_table.getElementsByTagName( 'select' );
	for ( var i = 0; i < calc_selects.length; i++ )
		calc_selects[i].selectedIndex = 0;
}

addListener( window, 'load', init_calc );

// Текущий калькулятор
var div_calc = null;

function show_calc( credit_value )
{
	div_calc = null;

	var calcs_div = document.getElementById( 'calcs' );
	for ( var i = 0; i < calcs_div.childNodes.length; i++ )
		if ( calcs_div.childNodes[i].style )
			calcs_div.childNodes[i].style.display = 'none';

	if ( credit_value == 'slit' )
	{
		stype_select = document.getElementById( 'stype' );
		stype_value = stype_select.options[stype_select.selectedIndex].value;

		if ( stype_value == '' ) return false;

		div_calc = document.getElementById( 'div_calc_' + stype_value );
		if ( div_calc )
			div_calc.style.display = 'block';

		return;
	}

	if ( credit_value == 'safe' )
	{
		safe_select = document.getElementById( 'safe' );
		safe_value = safe_select.options[safe_select.selectedIndex].value;

		document.getElementById( 'div_width' ).style.display = safe_value == '1' ? '' : 'none';

		if ( safe_value == '1' )
		{
			width_select = document.getElementById( 'width' );
			width_value = width_select.options[width_select.selectedIndex].value;

			div_calc = document.getElementById( 'div_calc_' + safe_value + '_' + width_value );
			if ( div_calc )
				div_calc.style.display = 'block';
		}
		else if ( safe_value == '2' )
		{
			div_calc = document.getElementById( 'div_calc_' + safe_value );
			if ( div_calc )
				div_calc.style.display = 'block';
		}

		return;
	}

	region_select = document.getElementById( 'region' );

	region_value = region_select.options[region_select.selectedIndex].value;

	if ( document.getElementById( 'div_income' ) )
		document.getElementById( 'div_income' ).style.display = credit_value == '2' ? '' : 'none';
	if ( document.getElementById( 'div_category' ) )
		document.getElementById( 'div_category' ).style.display = credit_value == '3' ? '' : 'none';
	if ( document.getElementById( 'div_history' ) )
		document.getElementById( 'div_history' ).style.display = 'none';
	if ( document.getElementById( 'div_kind' ) )
		document.getElementById( 'div_kind' ).style.display = credit_value == '5' ? '' : 'none';
	if ( document.getElementById( 'div_size' ) )
		document.getElementById( 'div_size' ).style.display = credit_value == '5' ? '' : 'none';
	if ( document.getElementById( 'div_type' ) )
		document.getElementById( 'div_type' ).style.display = credit_value == '9' ? '' : 'none';

	if ( credit_value == '' ) return;

	// Пенсионный кредит
	if ( credit_value == '2' )
	{
		income_select = document.getElementById( 'income' );

		income_value = income_select.options[income_select.selectedIndex].value;
		if ( income_value == '' ) return;

		div_calc = document.getElementById( 'div_calc_' + region_value + '_' + credit_value + '_' + income_value );
		if ( div_calc )
			div_calc.style.display = '';

		return;
	}

	// Доверительный
	if ( credit_value == '3' )
	{
		category_select = document.getElementById( 'category' );

		category_value = category_select.options[category_select.selectedIndex].value;
		if ( category_value == '' ) return;

		document.getElementById( 'div_history' ).style.display = category_value == '1' ? '' : 'none';

		if ( category_value == '0' )
		{
			set_salary( region_value, credit_value );

			div_calc = document.getElementById( 'div_calc_' + credit_value + '_s' );
			if ( div_calc )
				div_calc.style.display = 'block';

			return;
		}
		else if ( category_value == '1' )
		{
			history_select = document.getElementById( 'history' );

			history_value = history_select.options[history_select.selectedIndex].value;
			if ( history_value == '' ) return;

			set_history( region_value, credit_value, history_value );

			div_calc = document.getElementById( 'div_calc_' + credit_value + '_h' );
			if ( div_calc )
				div_calc.style.display = 'block';

			return;
		}
	}

	// Автокредит
	if ( credit_value == '5' )
	{
		kind_select = document.getElementById( 'kind' );
		size_select = document.getElementById( 'size' );

		kind_value = kind_select.options[kind_select.selectedIndex].value;
		if ( kind_value == '' ) return;

		size_value = size_select.options[size_select.selectedIndex].value;
		if ( size_value == '' ) return;

		set_auto( region_value, credit_value, kind_value, size_value );

		div_calc = document.getElementById( 'div_calc_' + credit_value );
		if ( div_calc )
			div_calc.style.display = 'block';

		return;
	}

	// Молодая семья
	if ( credit_value == '9' )
	{
		type_select = document.getElementById( 'type' );

		type_value = type_select.options[type_select.selectedIndex].value;
		if ( type_value == '' ) return;

		if ( type_value == '0' )
			credit_value = 6;
		else if ( type_value == '1' )
			credit_value = 7;
		else if ( type_value == '2' )
			credit_value = 8;
		else
			credit_value = '';
	}
	region_value = 1;
	div_calc = document.getElementById( 'div_calc_' + region_value + '_' + credit_value );
	if ( div_calc )
		div_calc.style.display = 'block';
}

function set_history( region_value, credit_value )
{
	form = document.forms['pro_' + credit_value + '_h'];

	if ( form )
	{
		if ( history_value == '0' )
			form.bd.value = 30000, form.bt.value = 12, form.bs.value = 163636, form.csn.value = 200000;
		else if ( history_value == '1' )
			form.bd.value = 30000, form.bt.value = 18, form.bs.value = 236842, form.csn.value = 400000;
		else if ( history_value == '2' )
			form.bd.value = 30000, form.bt.value = 24, form.bs.value = 302521, form.csn.value = 500000;

		if ( region_value == '1' )
			form.regchoice.value = 0;
		else if ( region_value == '2' )
			form.regchoice.value = 1;
		else if ( region_value == '3' )
			form.regchoice.value = 2;
		else if ( region_value == '4' )
			form.regchoice.value = 2;
	}
}

function set_salary( region_value, credit_value )
{
	form = document.forms['pro_' + credit_value + '_s'];

	if ( form )
	{
		form.bd.value = 30000, form.bt.value = 24, form.bs.value = 242017, form.csn.value = 300000;

		if ( region_value == '1' )
			form.regchoice.value = 0;
		else if ( region_value == '2' )
			form.regchoice.value = 1;
		else if ( region_value == '3' )
			form.regchoice.value = 2;
		else if ( region_value == '4' )
			form.regchoice.value = 2;
	}
}

function set_auto( region_value, credit_value, kind_value, size_value )
{
	values = {
		'1' : {
			'0' : {
				'0' : { 'bd' : 25000, 'bt' : 60, 'bs' : 744681, 'ct' : 60, 'ctn' : 60, 'cp' : 16.0,		'cp2' : 15.0, 	'cp3' : 0, 'dcp' : 9.5,		'dcp2' : 9.5, 'dcp3' : 0, 'ecp' : 9.5,	'ecp2' : 10,   'ecp3' : 0, 'regchoice' : 0 },
				'1' : { 'bd' : 25000, 'bt' : 60, 'bs' : 755396, 'ct' : 60, 'ctn' : 60, 'cp' : 15.5, 	'cp2' : 15.0, 	'cp3' : 0, 'dcp' : 9.25,	'dcp2' : 9.25,'dcp3' : 0, 'ecp' : 9.25,	'ecp2' : 9.75, 'ecp3' : 0, 'regchoice' : 0 },
				'2' : { 'bd' : 25000, 'bt' : 60, 'bs' : 760870, 'ct' : 60, 'ctn' : 60, 'cp' : 15.0, 		'cp2' : 15.0, 	'cp3' : 0, 'dcp' : 9, 		'dcp2' : 9,   'dcp3' : 0, 'ecp' : 9,	'ecp2' : 9.5,  'ecp3' : 0, 'regchoice' : 0 }
			},
			'1' : {
				'0' : { 'bd' : 25000, 'bt' : 60, 'bs' : 734266, 'ct' : 60, 'ctn' : 60, 'cp' : 17.0, 	'cp2' : 16, 	'cp3' : 0, 'dcp' : 10, 		'dcp2' : 10.5, 	'dcp3' : 0, 'ecp' : 10, 	'ecp2' : 10.5, 	'ecp3' : 0, 'regchoice' : 0 },
				'1' : { 'bd' : 25000, 'bt' : 60, 'bs' : 739437, 'ct' : 60, 'ctn' : 60, 'cp' : 16.5, 	'cp2' : 16, 	'cp3' : 0, 'dcp' : 9.75,	'dcp2' : 10.25, 'dcp3' : 0, 'ecp' : 9.75, 	'ecp2' : 10.25, 'ecp3' : 0, 'regchoice' : 0 },
				'2' : { 'bd' : 25000, 'bt' : 60, 'bs' : 744681, 'ct' : 60, 'ctn' : 60, 'cp' : 16.0, 		'cp2' : 16, 	'cp3' : 0, 'dcp' : 9.5, 	'dcp2' : 10, 	'dcp3' : 0, 'ecp' : 9.5, 	'ecp2' : 10, 	'ecp3' : 0, 'regchoice' : 0 }
			}
		}
	};

	values['2'] = values['3'] = values['1'];

	form = document.forms['pro_' + credit_value];

	if ( form )
	{
		fields = values[1][kind_value][size_value];
		for ( var field in fields )
			form[field].value = fields[field];
		form['bv'].selectedIndex = 0;
	}
}

function compare_credit( form )
{
	var bv = parseInt( form.bv.value );
	var bt = parseInt( form.bt.value );
	var br = parseInt( form.br.value );

	var credits = {
		1: { // Ипотечный
			1: [['13,5—14 *','13,75—14,25 *','14,0—14.5 *'], ['12','11,75','11,5'], ['12','11,75','11,5']], // Москва
			2: [['13—13,25 *','13,25—13,5 *','13,5—13.75 *'], ['12','11,75','11,5'], ['12','11,75','11,5']], // Московская область
			3: [['13—13,25 *','13,25—13,5 *','13,5—13.75 *'], ['12','11,75','11,5'], ['12','11,75','11,5']], // Санкт-Петербург
			4: [['13—13,25 *','13,25—13,5 *','13,5—13.75 *'], ['12,5','12,25','12'], ['12,5','12,25','12']] // Другие регионы
		},
		2: { // Ипотечный +
			1: [['13,25—13,75 *','13,5—14 *','13,75—14,25 *'], ['11,5','11,25','11'], ['11,5','11,25','11']], // Москва
			2: [['12,75—13 *','13—13,25 *','13,25—13,5 *'], ['11,5','11,25','11'], ['11,5','11,25','11']], // Московская область
			3: [['12,75—13 *','13—13,25 *','13,25—13,5 *'], ['11,5','11,25','11'], ['11,5','11,25','11']], // Санкт-Петербург
			4: [['12,75—13 *','13—13,25 *','13,25—13,5 *'], ['12','11,75','11,5'], ['12','11,75','11,5']] // Другие регионы
		},
		3: { // Кредит на недвижимость
			1: [['15,5','15,75','16,0'], ['12','11,75','11,5'], ['12','11,75','11,5']], // Москва
			2: [['15','15,25','15,5'], ['12','11,75','11,5'], ['12','11,75','11,5']], // Московская область
			3: [['15','15,25','15,5'], ['12','11,75','11,5'], ['12','11,75','11,5']], // Санкт-Петербург
			4: [['15','15,25','15,5'], ['12,5','12,25','12'], ['12,5','12,25','12']] // Другие регионы
		},

		4: { // Кредит «Молодая семья»
			1: [['13,25—15,5 **','13,5—15,75 **','13,75—16,0 **'], ['11,5-12','11,25-11,75','11-11,5'], ['11,5-12','11,25-11,75','11-11,5']], // Москва
			2: [['12,75—15 **','13—15,25 **','13,25—15,5 **'], ['11,5-12','11,25-11,75','11-11,5'], ['11,5-12','11,25-11,75','11-11,5']], // Московская область
			3: [['12,75—15 **','13—15,25 **','13,25—15,5 **'], ['11,5-12','11,25-11,75','11-11,5'], ['11,5-12','11,25-11,75','11-11,5']], // Санкт-Петербург
			4: [['12,75—15 **','13—15,25 **','13,25—15,5 **'], ['12-12,5','11,75-12,25','11,5-12'], ['12-12,5','11,75-12,25','11,5-12']] // Другие регионы
		}
	}

	for ( var credit in credits )
		$( '#per_' + credit ).text( credits[credit][br][bv][bt] );
}

function compare_deposit( form )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		alert( 'Ошибочное значение первоначального взноса!' ); return false;
	}



	var dt = parseInt( form.dt.value );

	var dv = parseInt( form.dv.value );

	var depresult1 = depresult2 = depresult3 = depresult4 = depresult5 = depresult6 = false;
	var depresult1_max = depresult2_max = depresult3_max = depresult4_max = depresult5_max = depresult6_max = false;

	if ( dt < 6 )
		depresult1 = depcalc1( { 'dp': { 'value': dp }, 'dv': { 'value': dv }, 'dt': { 'value': dt } }, true );
	if ( dt < 6 && dt > 2 )
		depresult2 = depcalc2( { 'dp': { 'value': dp }, 'dv': { 'value': dv }, 'dt': { 'value': dt - 2 } }, true );
	if ( dt < 6 && dt > 2 ) {
			var first_nesn = 30000;
			var nesns;
			if (dv==0)
			{
				nesns = new Array (30000, 100000, 1000000, 3000000, 50000000, 100000000, 200000000);
			}
			else {
				nesns = new Array (1000, 10000, 100000, 500000, 1000000, 3000000);
			}

			max_nesn = nesns[0];
			for (var i=1; i<nesns.length; i++)
			{
				if (dp>=nesns[i])
				{
					max_nesn = nesns[i];
				}
			}

		depresult3 = depcalc3( { 'dp': { 'value': dp }, 'dv': { 'value': dv }, 'dn': { 'value': 30000 }, 'dnv': { 'value': 1000 }, 'dt': { 'value': dt - 2 } }, true );
		depresult3_max = depcalc3( { 'dp': { 'value': dp }, 'dv': { 'value': dv }, 'dn': { 'value': max_nesn }, 'dnv': { 'value': max_nesn }, 'dt': { 'value': dt - 2 } }, true );
	}
	if ( dt == 6 )
		depresult4 = depcalc4( { 'dp': { 'value': dp }, 'dv': { 'value': dv } }, true );
	if ( dt == 6 && dv == 0)
		depresult5 = depcalc5( { 'dp': { 'value': dp } }, true );
	if (  dt < 6 && dt > 2 && dv==0)
		depresult6 = depcalc10( { 'dp': { 'value': dp }, 'dv': { 'value': dv }, 'dn': { 'value': 1 }, 'dnv': { 'value': 1 }, 'dt': { 'value': dt - 2 } }, true );

	for ( var i = 1; i <= 6; i++ )
	{
		eval( 'var depresult = depresult' + i + ';' );
		var deprow = document.getElementById( 'deprow' + i );

		deprow.className = ( depresult == false ) ? 'hidden' : '';
		deprow.cells[4].innerHTML = ( ( depresult == false ) ? '' : '' + depresult[0] ).replace( '.', ',' );
		deprow.cells[5].innerHTML = ( depresult == false ) ? '' : depresult[3];

		if (i==3)
		{
			var depresult_max = depresult3_max;
			if (depresult_max)
			{
				deprow.cells[4].innerHTML = '<nobr>'+deprow.cells[4].innerHTML+'—'+(''+depresult_max[0]).replace( '.', ',' )+'</nobr>';
				deprow.cells[5].innerHTML = '<nobr>'+deprow.cells[5].innerHTML+'—'+depresult_max[3]+'</nobr>';
			}

		}
	}

    var val_text = '';

    if ( dv == 1 )
        val_text = 'USD';
    else if ( dv == 2 )
        val_text = 'EUR';
    else
        val_text = 'руб.';

	$( "#dep_currency" ).text( val_text );
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function alert2(){
alert("Программа временно недоступна")
}

function round(n){
//alert("Округление до целого");
n2=(n-0.5)-((n-0.5)%1.0)+1;
return(n2);
}

function round2(n){
//alert("Округление до 2-х знаков после запятой");
n2=(n*100-0.5)-((n*100-0.5)%1.0)+1;
return(n2/100);
}

function check(s) {
//alert("Проверка данных целого типа");
var num="0123456789";
var rc=true;
for (var i=0;i<s.length;i++) {
	var ch=s.charAt(i);
	if (-1 == num.indexOf(ch)) rc=false;
}
if (s == "") rc=false;
return(rc);
}

function check2(s) {
//alert("Проверка данных с дробной частью");
var num="0123456789.";
var rc=true;
for (var i=0;i<s.length;i++) {
	var ch=s.charAt(i);
	if (-1 == num.indexOf(ch)) rc=false;
}
if (s == "") rc=false;
return(rc);
}

function power(a, b) {
s=1;
for (var i=0;i<b;i++) {
	s=s*a;
}
return(s);
}

function procent(a, b) {
s=a*10000%b;
s2=(a*10000-s)/b;
return (s2/100);
}

// Процентная ставка
var nbp = 0;

// Валюта кредита
var nbv = 0;

// Сумма кредита
var Kr = 0;

// Размер ежемесячного платежа
var Pl = 0;

// Полная сумма выплат
var Total = 0;

// График погашения
var Dk = new Array();

///////////////////////////////////////////////////////
// Расчет ежемесячного платежа и полной суммы выплат //
///////////////////////////////////////////////////////
function totalsum( pro )
{
	Kr = parseInt( pro.bs.value );
	T = parseInt( pro.bt.value );
	Ct = nbp / 12 / 100;

	// Размер ежемесячного платежа
	Pl = Kr * Ct / ( 1 - 1 / Math.pow( 1 + Ct, T ) );

	// Полная сумма выплат
	Total = T * Pl;

	// График погашения
	Dk = new Array();
	for ( var K = 1; K <= T; K++ )
		Dk[K] = ( Pl + ( Kr * Ct - Pl ) * Math.pow( 1 + Ct, K ) ) / Ct;
}

// Результат работы кредитных калькуляторов
function show_credit_result( div_calc )
{
	var oncalc = div_calc.getAttribute( 'oncalc' );

	eval( 'var result = ' + oncalc );

	if ( result == -1 ) return false;

	var mark1 = Math.round( Pl * 100 / Total );
	var mark2 = Math.round( Kr * 100 / Total );

	$( "#bg1" ).css( "width", mark1 + '%' );
	$( "#bg2" ).css( "width", mark2 + '%' );
	$( "#bg3" ).css( "width", mark1 + ( 100 - mark2 ) + '%' );

	$( "#bg1g" ).css( "width", mark1 + '%' );
	$( "#bg2g" ).css( "width", mark2 + '%' );
	$( "#bg3g" ).css( "width", mark1 + ( 100 - mark2 ) + '%' );

	$( "#bg1s" ).text( Math.round( Pl ) );
	$( "#bg2s" ).text( Math.round( Kr ) );
	$( "#bg3s" ).text( Math.round( Total ) );

	$( "#pl_text" ).text( Math.round( Pl ) );
	$( "#kr_text" ).text( Math.round( Kr ) );
	$( "#ct_text" ).text( nbp );

    var val_text = '';

    if ( nbv == 1 )
        val_text = 'USD';
    else if ( nbv == 2 )
        val_text = 'EUR';
    else if ( dep_currency == 3 )
        val_text = 'единиц';
    else
        val_text = 'руб.';

	$( "#val1" ).text( val_text );
	$( "#val2" ).text( val_text );

	return true;
}

// Результат работы депозитных калькуляторов
function show_deposit_result()
{
	var div_calc = document.getElementById( 'div_calc' );

	if ( !div_calc ) return;

	var oncalc = div_calc.getAttribute( 'oncalc' );

	eval( 'var result = ' + oncalc );

	if ( result == false ) return false;

	// Ставка депозита
	var dep_percent = result[0];

	// Сумма депозита
	var dep_deposit = result[1];

	// Сумма депозита, причитающихся к возврату
	var dep_total = result[2];

	// Сумма начисленных процентов
	var dep_result = result[3];

	// Валюта депозита
	var dep_currency = result[4];

	// Срок депозита
	var dep_period = result[5];

	var mark1 = Math.round( dep_deposit * 100 / dep_total );

	$( "#bg1" ).css( "width", mark1 + '%' );
	$( "#bg3" ).css( "width", ( 100 - mark1 ) + '%' );

	$( "#bg1s" ).text( dep_deposit );
	$( "#bg3s" ).text( dep_total );

	$( "#bg1g" ).css( "width", mark1 + '%' );
	$( "#bg3g" ).css( "width", ( 100 - mark1 ) + '%' );

	$( "#dep_percent" ).text( dep_percent );
	$( "#dep_deposit" ).text( dep_deposit );
	$( "#dep_result" ).text( dep_result );
	$( "#dep_period" ).text( dep_period );

    var val_text = '';

    if ( dep_currency == 1 )
        val_text = 'USD';
    else if ( dep_currency == 2 )
        val_text = 'EUR';
    else if ( dep_currency == 3 )
        val_text = 'единиц';
    else
        val_text = 'руб.';

	$( "#val1" ).text( val_text );
	$( "#val2" ).text( val_text );

	return true;
}

//////////////////////////////////////////////////////////
// Расчет кредита на неотложные нужды в рублях и валюте //
//////////////////////////////////////////////////////////

function credcalc8(pro) {

//Ввод и проверка ввода

// Скрытые поля - параметры кредита

smct=pro.mct.value;
nmct=parseInt(smct);
//alert("минимальный срок обеспеченного кредита = " + nmct);

smctmes=pro.mctmes.value;
//alert("сообщение о минимальном сроке обеспеченного кредита = " + smctmes);

sct=pro.ct.value;
nct=parseInt(sct);
//alert("максимальный срок обеспеченного кредита = " + nct);

sctn=pro.ctn.value;
nctn=parseInt(sctn);
//alert("максимальный срок необеспеченного кредита = " + nctn);

sctmes=pro.ctmes.value;
//alert("сообщение о максимальном сроке обеспеченного кредита = " + sctmes);

sctnmes=pro.ctnmes.value;
//alert("сообщение о максимальном сроке необеспеченного кредита = " + sctnmes);


// В рублях
scp=pro.cp.value;
ncp=parseFloat(scp);
//alert("процент в минимальном интервале срока обеспеченного кредита в рублях = " + ncp);

scp2=pro.cp2.value;
ncp2=parseFloat(scp2);
//alert("процент в среднем интервале срока обеспеченного кредита в рублях = " + ncp2);

scp3=pro.cp3.value;
ncp3=parseFloat(scp3);
//alert("процент в максимальном интервале срока обеспеченного кредита в рублях = " + ncp3);


// В долларах США
sdcp=pro.dcp.value;
ndcp=parseFloat(sdcp);
//alert("процент в минимальном интервале срока обеспеченного кредита в долларах США = " + ndcp);

sdcp2=pro.dcp2.value;
ndcp2=parseFloat(sdcp2);
//alert("процент в среднем интервале срока обеспеченного кредита в долларах США = " + ndcp2);

sdcp3=pro.dcp3.value;
ndcp3=parseFloat(sdcp3);
//alert("процент в максимальном интервале срока обеспеченного кредита в долларах США = " + ndcp3);


// В евро
secp=pro.ecp.value;
necp=parseFloat(secp);
//alert("процент в минимальном интервале срока обеспеченного кредита в евро = " + necp);

secp2=pro.ecp2.value;
necp2=parseFloat(secp2);
//alert("процент в среднем интервале срока обеспеченного кредита в евро = " + necp2);

secp3=pro.ecp3.value;
necp3=parseFloat(secp3);
//alert("процент в максимальном интервале срока обеспеченного кредита в евро = " + necp3);


scpt=pro.cpt.value;
ncpt=parseInt(scpt);
//alert("верхняя граница минимального интервала срока обеспеченного кредита = " + ncpt);

scpt2=pro.cpt2.value;
ncpt2=parseInt(scpt2);
//alert("верхняя граница среднего интервала срока обеспеченного кредита = " + ncpt2);

scpt3=pro.cpt3.value;
ncpt3=parseInt(scpt3);
//alert("верхняя граница максимального интервала срока обеспеченного кредита = " + ncpt3);


scpn=pro.cpn.value;
ncpn=parseFloat(scpn);
//alert("процент необеспеченного кредита в рублях = " + ncpn);

sdcpn=pro.dcpn.value;
ndcpn=parseFloat(sdcpn);
//alert("процент необеспеченного кредита в долларах США = " + ndcpn);

secpn=pro.ecpn.value;
necpn=parseFloat(secpn);
//alert("процент необеспеченного кредита в евро = " + necpn);

scsn=pro.csn.value;
ncsn=parseInt(scsn);
//alert("максимальная сумма необеспеченного кредита = " + ncsn);

scsnv=pro.csnv.value;
ncsnv=parseInt(scsnv);
//alert("валюта максимальной суммы необеспеченного кредита = " + ncsnv);

scs=pro.cs.value;
ncs=parseInt(scs);
//alert("максимальная сумма обеспеченного кредита = " + ncs);

scsv=pro.csv.value;
ncsv=parseInt(scsv);
//alert("валюта максимальной суммы обеспеченного кредита = " + ncsv);

scsnis=pro.csnis.value;
ncsnis=parseInt(scsnis);
//alert("наличие ограничения максимальной суммы необеспеченного кредита = " + ncsnis);

scsis=pro.csis.value;
ncsis=parseInt(scsis);
//alert("наличие ограничения максимальной суммы обеспеченного кредита = " + ncsis);

scvalro=pro.cvalro.value;
ncvalro=parseInt(scvalro);
//alert("валюта кредита только рубли = " + ncvalro);

sck=pro.ck.value;
nck=parseFloat(sck);
//alert("коэфициент в минимальном интервале суммы кредита = " + nck);

sck2=pro.ck2.value;
nck2=parseFloat(sck2);
//alert("коэфициент в максимальном интервале суммы кредита = " + nck2);


scd=pro.cd.value;
ncd=parseInt(scd);
//alert("граница минимального и максимального интервалов суммы кредита = " + ncd);

sminmsk=pro.minmsk.value;
nminmsk=parseInt(sminmsk);
//alert("минимальная сумма кредита для г.Москвы = " + nminmsk);

sminreg=pro.minreg.value;
nminreg=parseInt(sminreg);
//alert("минимальная сумма кредита для Московской области и регионов РФ  = " + nminreg);

sregchoice=pro.regchoice.value;
nregchoice=parseInt(sregchoice);
//alert("выбор региона получения кредита = " + nregchoice);


// Скрытые поля - текущие курсы валют Банка России

// Текущая дата
svdate=vdate;
//alert("текущая дата " + svdate);


// Доллар США
svdoll=vdoll;
nvdoll=parseFloat(svdoll);
//alert("текущий курс доллара США = " + nvdoll);

// Евро
sveuro=veuro;
nveuro=parseFloat(sveuro);
//alert("текущий курс евро - покупка = " + nveuro);



// Открытые поля (ввод пользователя)

// Среднемесячный чистый доход за 6 месяцев
sbd=pro.bd.value;
if (!check(sbd)) {
pro.bd.select();
if (sbd == "") alert("Введите среднемесячный чистый доход за 6 месяцев или пенсию");
else alert("Неверное значение " + sbd + ". Введите целое число");
return(-1);
}
nbd=parseInt(sbd);
//alert("Доход = " + sbd);

// Срок кредитования в месяцах
sbt=pro.bt.value;
if (!check(sbt)) {
pro.bt.select();
if (sbt == "") alert("Введите срок кредитования в месяцах");
else alert("Неверное значение " + sbt + ". Введите целое число");
return(-1);
}
nbt=parseInt(sbt);
//alert("Срок кредитования = " + sbt);

// Обеспечение (без обеспечения = 0; с обеспечением =1)
sbg=pro.bg.value;
nbg=parseInt(sbg);
//alert("Выбор обеспечения = " + sbg);

// Валюта кредита (рубли = 0; доллары США = 1; евро = 2)
sbv=pro.bv.value;
nbv=parseInt(sbv);
//alert("Выбор валюты = " + sbv);



// Проверка допустимых сроков сроков кредитования:

// с обеспечением по кредиту - минимум 60 мес.
// минимальный срок обеспеченного кредита = nct

if (nbg==1 & nbt<nmct) {
alert("Неверное значение - минимальный срок" + smctmes + smct + " мес.")
return(-1);
}


// без обеспечения по кредиту - максимум 18 мес.
// максимальный срок необеспеченного кредита = nctn

if (nbg==0 & nbt>nctn) {
alert("Неверное значение - максимальный срок" + sctnmes + sctn + " мес.")
return(-1);
}

// с обеспечением по кредиту - максимум 360 мес.
// максимальный срок обеспеченного кредита = nct

if (nbg==1 & nbt>nct) {
alert("Неверное значение - максимальный срок" + sctmes + sct + " мес.")
return(-1);
}



// Вычисление процента по кредиту - в рублях
if (nbv == 0) {

// без обеспечения - 19%
// процент необеспеченного кредита = ncpn

if (nbg==0) nbp=ncpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно

if (nbg==1 & nbt<ncpt+1) nbp=ncp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=ncp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=ncp;

//alert("Процент по кредиту в рублях = " + nbp);
}

// Вычисление процента по кредиту - в долларах США
if (nbv == 1) {

// без обеспечения - 19%
// процент необеспеченного кредита = ndcpn

if (nbg==0) nbp=ndcpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно

if (nbg==1 & nbt<ncpt+1) nbp=ndcp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=ndcp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=ndcp;

//alert("Процент по кредиту в долларах США = " + nbp);
}


// Вычисление процента по кредиту - в евро
if (nbv == 2) {

// без обеспечения - 19%
// процент необеспеченного кредита = necpn

if (nbg==0) nbp=necpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно

if (nbg==1 & nbt<ncpt+1) nbp=necp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=necp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=necp;

//alert("Процент по кредиту в евро = " + nbp);
}


// Вычисление коэфициента K=0.7||0.8 для суммы кредита <=45000 || >45000 руб. соответственно
// коэфициент в минимальном/максимальном интервале суммы кредита = nck/nck2 соответственно
// граница минимального и максимального интервалов суммы кредита = ncd

if (nbd>ncd) {
nbk = nck2
}
else {
nbk = nck
}
//alert("Коэфициент = " + nbk);



// Знаменатель = 1+((t+1)*p/2400)
nbz=1+((nbt+1)*nbp/2400);
//alert("Знаменатель = " + nbz);
// Округление знаменателя до 2-х знаков после запятой
nbz=round2(nbz);
//alert("Знаменатель с округлением = " + nbz);



// Числитель = d*k*t
nba = nbd*nbk*nbt
//alert("Числитель = " + nba);


// Вычисление суммы кредита в рублях
nbsr = nba/nbz;
//alert("Сумма кредита в рублях = " + nbsr);
// Округление суммы кредита до целого
nbsr=round(nbsr);

// Ограничение суммы необеспеченного кредита максимумом - ncsn
if (ncsnis==1) {
 // Вычисление максимально возможной суммы кредита без обеспечения в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsnv==1) ncsn = round(ncsn*nvdoll)
 if (ncsnv==2) ncsn = round(ncsn*nveuro)
 //alert ("максимальная сумма кредита без обеспечения в рублях = " + ncsn)

 if (nbg==0 & nbsr > ncsn) nbsr = ncsn;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Ограничение суммы обеспеченного кредита максимумом - ncs
if (ncsis==1) {
 // Вычисление максимально возможной суммы кредита с обеспечением в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsv==1) ncs = round(ncs*nvdoll)
 if (ncsv==2) ncs = round(ncs*nveuro)
 //alert ("максимальная сумма кредита с обеспечением в рублях = " + ncs)

 if (nbg==1 & nbsr > ncs) nbsr = ncs;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Вычисление суммы кредита в долларах
if (nbv==1){
//nbsd = nbsr/nqd;
nbsd = nbsr/nvdoll;
//alert("Сумма кредита в долларах = " + nbsd);

// Округление суммы кредита до целого
nbsd=round(nbsd);
//alert("Сумма кредита в долларах с округлением = " + nbsd);
}

// Вычисление суммы кредита в евро
if (nbv==2){
//ndse = nbsr/nqe;
nbse = nbsr/nveuro;
//alert("Сумма кредита в евро = " + nbse);

// Округление суммы кредита до целого
nbse=round(nbse);
//alert("Сумма кредита в евро с округлением = " + nbse);
}


// Вывод результата
// в рублях
if (nbv==0) {
pro.bs.value=eval(nbsr);
mess = "Расчет успешно завершен в рублях."
//alert(mess);
}

// в долларах
if (nbv==1) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbsd);
    mess = "Расчет успешно завершен в долларах США (курс ЦБ на " + svdate + " равен " + svdoll + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}



// в евро
if (nbv==2) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbse);
    mess = "Расчет успешно завершен в евро (курс ЦБ на " + svdate + " равен " + sveuro + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}

alert(mess);


// Вычисление минимально возможной суммы кредита, еслм он задан в иностранной валюте

// Вычисление минимальной суммы кредита в долларах

if (nbv==1){
nminmskd = nminmsk/nvdoll;
//alert("Минимальная сумма кредита в г.Москве в долларах = " + nminmskd);
nminregd = nminreg/nvdoll;
//alert("Минимальная сумма кредита в МО и регионах в долларах = " + nminregd);

// Округление минимальной суммы кредита до целого

nminmskd=round(nminmskd);
//alert("Минимальная сумма кредита в г.Москве в долларах с округлением = " + nminmskd);
nminregd=round(nminregd);
//alert("Минимальная сумма кредита в МО и регионах в долларах с округлением = " + nminregd);
}

// Вычисление минимальной суммы кредита в евро

if (nbv==2){
nminmske = nminmsk/nveuro;
//alert("Минимальная сумма кредита в г.Москве в евро = " + nminmske);
nminrege = nminreg/nveuro;
//alert("Минимальная сумма кредита в МО и регионах в евро = " + nminrege);

// Округление суммы кредита до целого

nminmske=round(nminmske);
//alert("Минимальная сумма кредита в г.Москве в евро с округлением = " + nminmske);
nminrege=round(nminrege);
//alert("Минимальная сумма кредита в МО и регионах в евро с округлением = " + nminrege);
}


// Проверка результата на допустимый минимум в зависимости от выбора региона

// г. Москва

minmskmess  = "Минимальная сумма предоставляемого кредита - 45 000 рублей";
minregmess  = "Минимальная сумма предоставляемого кредита - 15 000 - 45 000 рублей в зависимости от региона получения кредита. Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";
minregmess2 = "Территориальный банк Сбербанка России может установить для своих филиалов минимальную сумму предоставляемого кредита в рамках диапазона от 15 000 рублей до 45 000 рублей (или эквивалента этой суммы в иностранной валюте). Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";

if (nregchoice == 0) {
//alert("Выбор региона г.Москва")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminmsk) alert(minmskmess);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminmskd) alert(minmskmess);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminmske) alert(minmskmess);
        }
}

// Московская область и другие регионы РФ

if (nregchoice > 0) {
//alert("Выбор региона МО и другие регионы РФ")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminreg) alert(minregmess);
          if (nbsr > nminreg & nbsr < nminmsk) alert(minregmess2);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminregd) alert(minregmess);
          if (nbsd > nminregd & nbsd < nminmskd) alert(minregmess2);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminrege) alert(minregmess);
          if (nbse > nminrege & nbse < nminmske) alert(minregmess2);
        }
}

totalsum( pro );

}

//////////////////////////////////////////////////////////
// Расчет кредита кредита для неработающего пенсионера, //
// доверительного кредита и образовательного кредита    //
//////////////////////////////////////////////////////////

function credcalc2(pro) {

//Ввод и проверка ввода

// Скрытые поля - параметры кредита

sct=pro.ct.value;
nct=parseInt(sct);
//alert("максимальный срок обеспеченного кредита = " + nct);

sctn=pro.ctn.value;
nctn=parseInt(sctn);
//alert("максимальный срок необеспеченного кредита = " + nctn);

sctmes=pro.ctmes.value;
//alert("сообщение о максимальном сроке обеспеченного кредита = " + sctmes);

sctnmes=pro.ctnmes.value;
//alert("сообщение о максимальном сроке необеспеченного кредита = " + sctnmes);


scp=pro.cp.value;
ncp=parseFloat(scp);
//alert("процент в минимальном интервале срока обеспеченного кредита = " + ncp);

scp2=pro.cp2.value;
ncp2=parseFloat(scp2);
//alert("процент в среднем интервале срока обеспеченного кредита = " + ncp2);

scp3=pro.cp3.value;
ncp3=parseFloat(scp3);
//alert("процент в максимальном интервале срока обеспеченного кредита = " + ncp3);


scpt=pro.cpt.value;
ncpt=parseInt(scpt);
//alert("верхняя граница минимального интервала срока обеспеченного кредита = " + ncpt);

scpt2=pro.cpt2.value;
ncpt2=parseInt(scpt2);
//alert("верхняя граница среднего интервала срока обеспеченного кредита = " + ncpt2);

scpt3=pro.cpt3.value;
ncpt3=parseInt(scpt3);
//alert("верхняя граница максимального интервала срока обеспеченного кредита = " + ncpt3);


scpn=pro.cpn.value;
ncpn=parseInt(scpn);
//alert("процент необеспеченного кредита = " + ncpn);

scsn=pro.csn.value;
ncsn=parseInt(scsn);
//alert("максимальная сумма необеспеченного кредита = " + ncsn);

scsnv=pro.csnv.value;
ncsnv=parseInt(scsnv);
//alert("валюта максимальной суммы необеспеченного кредита = " + ncsnv);

scs=pro.cs.value;
ncs=parseInt(scs);
//alert("максимальная сумма обеспеченного кредита = " + ncs);

scsv=pro.csv.value;
ncsv=parseInt(scsv);
//alert("валюта максимальной суммы обеспеченного кредита = " + ncsv);

scsnis=pro.csnis.value;
ncsnis=parseInt(scsnis);
//alert("наличие ограничения максимальной суммы необеспеченного кредита = " + ncsnis);

scsis=pro.csis.value;
ncsis=parseInt(scsis);
//alert("наличие ограничения максимальной суммы обеспеченного кредита = " + ncsis);

scvalro=pro.cvalro.value;
ncvalro=parseInt(scvalro);
//alert("валюта кредита только рубли = " + ncvalro);

sck=pro.ck.value;
nck=parseFloat(sck);
//alert("коэфициент в минимальном интервале суммы кредита = " + nck);

sck2=pro.ck2.value;
nck2=parseFloat(sck2);
//alert("коэфициент в максимальном интервале суммы кредита = " + nck2);


scd=pro.cd.value;
ncd=parseInt(scd);
//alert("граница минимального и максимального интервалов суммы кредита = " + ncd);

sminmsk=pro.minmsk.value;
nminmsk=parseInt(sminmsk);
//alert("минимальная сумма кредита для г.Москвы = " + nminmsk);

sminreg=pro.minreg.value;
nminreg=parseInt(sminreg);
//alert("минимальная сумма кредита для Московской области и регионов РФ  = " + nminreg);

sregchoice=pro.regchoice.value;
nregchoice=parseInt(sregchoice);
//alert("выбор региона получения кредита = " + nregchoice);


// Скрытые поля - текущие курсы валют Банка России


// Текущая дата
svdate=vdate;
//alert("текущая дата " + svdate);


// Доллар США
svdoll=vdoll;
nvdoll=parseFloat(svdoll);
//alert("текущий курс доллара США = " + nvdoll);

// Евро
sveuro=veuro;
nveuro=parseFloat(sveuro);
//alert("текущий курс евро - покупка = " + nveuro);



// Открытые поля (ввод пользователя)

// Среднемесячный чистый доход за 6 месяцев
sbd=pro.bd.value;
if (!check(sbd)) {
pro.bd.select();
if (sbd == "") alert("Введите среднемесячный чистый доход за 6 месяцев или пенсию");
else alert("Неверное значение " + sbd + ". Введите целое число");
return(-1);
}
nbd=parseInt(sbd);
//alert("Доход = " + sbd);

// Срок кредитования в месяцах
sbt=pro.bt.value;
if (!check(sbt)) {
pro.bt.select();
if (sbt == "") alert("Введите срок кредитования в месяцах");
else alert("Неверное значение " + sbt + ". Введите целое число");
return(-1);
}
nbt=parseInt(sbt);
//alert("Срок кредитования = " + sbt);

// Обеспечение (без обеспечения = 0; с обеспечением =1)
sbg=pro.bg.value;
nbg=parseInt(sbg);
//alert("Выбор обеспечения = " + sbg);

// Валюта кредита (рубли = 0; доллары США = 1; евро = 2)
sbv=pro.bv.value;
nbv=parseInt(sbv);
//alert("Выбор валюты = " + sbv);



// Проверка допустимых сроков сроков кредитования:

// без обеспечения по кредиту - максимум 18 мес.
// максимальный срок необеспеченного кредита = nctn

if (nbg==0 & nbt>nctn) {
alert("Неверное значение - максимальный срок" + sctnmes + sctn + " мес.")
return(-1);
}

// с обеспечением по кредиту - максимум 60 мес.
// максимальный срок обеспеченного кредита = nct

if (nbg==1 & nbt>nct) {
alert("Неверное значение - максимальный срок" + sctmes + sct + " мес.")
return(-1);
}



// Вычисление процента по кредиту

// без обеспечения - 19%
// процент необеспеченного кредита = ncpn

if (nbg==0) nbp=ncpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно

if (nbg==1 & nbt<ncpt+1) nbp=ncp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=ncp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=ncp;
//alert("Процент по кредиту = " + nbp);



// Вычисление коэфициента K=0.7||0.8 для суммы кредита <=45000 || >45000 руб. соответственно
// коэфициент в минимальном/максимальном интервале суммы кредита = nck/nck2 соответственно
// граница минимального и максимального интервалов суммы кредита = ncd

if (nbd>ncd) {
nbk = nck2
}
else {
nbk = nck
}
//alert("Коэфициент = " + nbk);



// Знаменатель = 1+((t+1)*p/2400)
nbz=1+((nbt+1)*nbp/2400);
//alert("Знаменатель = " + nbz);
// Округление знаменателя до 2-х знаков после запятой
nbz=round2(nbz);
//alert("Знаменатель с округлением = " + nbz);



// Числитель = d*k*t
nba = nbd*nbk*nbt
//alert("Числитель = " + nba);


// Вычисление суммы кредита в рублях
nbsr = nba/nbz;
//alert("Сумма кредита в рублях = " + nbsr);
// Округление суммы кредита до целого
nbsr=round(nbsr);

// Ограничение суммы необеспеченного кредита максимумом - ncsn
if (ncsnis==1) {
 // Вычисление максимально возможной суммы кредита без обеспечения в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsnv==1) ncsn = round(ncsn*nvdoll)
 if (ncsnv==2) ncsn = round(ncsn*nveuro)
 //alert ("максимальная сумма кредита без обеспечения в рублях = " + ncsn)

 if (nbg==0 & nbsr > ncsn) nbsr = ncsn;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Ограничение суммы обеспеченного кредита максимумом - ncs
if (ncsis==1) {
 // Вычисление максимально возможной суммы кредита с обеспечением в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsv==1) ncs = round(ncs*nvdoll)
 if (ncsv==2) ncs = round(ncs*nveuro)
 //alert ("максимальная сумма кредита с обеспечением в рублях = " + ncs)

 if (nbg==1 & nbsr > ncs) nbsr = ncs;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Вычисление суммы кредита в долларах
if (nbv==1){
//nbsd = nbsr/nqd;
nbsd = nbsr/nvdoll;
//alert("Сумма кредита в долларах = " + nbsd);

// Округление суммы кредита до целого
nbsd=round(nbsd);
//alert("Сумма кредита в долларах с округлением = " + nbsd);
}

// Вычисление суммы кредита в евро
if (nbv==2){
//ndse = nbsr/nqe;
nbse = nbsr/nveuro;
//alert("Сумма кредита в евро = " + nbse);

// Округление суммы кредита до целого
nbse=round(nbse);
//alert("Сумма кредита в евро с округлением = " + nbse);
}


// Вывод результата
// в рублях
if (nbv==0) {
pro.bs.value=eval(nbsr);
mess = "Расчет успешно завершен в рублях."
//alert(mess);
}

// в долларах
if (nbv==1) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbsd);
    mess = "Расчет успешно завершен в долларах США (по курсу " + svdoll + " ЦБ на " + svdate + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}



// в евро
if (nbv==2) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbse);
    mess = "Расчет успешно завершен в евро (по курсу " + sveuro + " ЦБ на " + svdate + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}

alert(mess);


// Вычисление минимально возможной суммы кредита, еслм он задан в иностранной валюте

// Вычисление минимальной суммы кредита в долларах

if (nbv==1){
nminmskd = nminmsk/nvdoll;
//alert("Минимальная сумма кредита в г.Москве в долларах = " + nminmskd);
nminregd = nminreg/nvdoll;
//alert("Минимальная сумма кредита в МО и регионах в долларах = " + nminregd);

// Округление минимальной суммы кредита до целого

nminmskd=round(nminmskd);
//alert("Минимальная сумма кредита в г.Москве в долларах с округлением = " + nminmskd);
nminregd=round(nminregd);
//alert("Минимальная сумма кредита в МО и регионах в долларах с округлением = " + nminregd);
}

// Вычисление минимальной суммы кредита в евро

if (nbv==2){
nminmske = nminmsk/nveuro;
//alert("Минимальная сумма кредита в г.Москве в евро = " + nminmske);
nminrege = nminreg/nveuro;
//alert("Минимальная сумма кредита в МО и регионах в евро = " + nminrege);

// Округление суммы кредита до целого

nminmske=round(nminmske);
//alert("Минимальная сумма кредита в г.Москве в евро с округлением = " + nminmske);
nminrege=round(nminrege);
//alert("Минимальная сумма кредита в МО и регионах в евро с округлением = " + nminrege);
}


// Проверка результата на допустимый минимум в зависимости от выбора региона

// г. Москва

minmskmess  = "Минимальная сумма предоставляемого кредита - 45 000 рублей";
minregmess  = "Минимальная сумма предоставляемого кредита - 15 000 - 45 000 рублей в зависимости от региона получения кредита. Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";
minregmess2 = "Территориальный банк Сбербанка России может установить для своих филиалов минимальную сумму предоставляемого кредита в рамках диапазона от 15 000 рублей до 45 000 рублей (или эквивалента этой суммы в иностранной валюте). Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";

if (nregchoice == 0) {
//alert("Выбор региона г.Москва")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminmsk) alert(minmskmess);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminmskd) alert(minmskmess);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminmske) alert(minmskmess);
        }
}

// Московская область и другие регионы РФ

if (nregchoice > 0) {
//alert("Выбор региона МО и другие регионы РФ")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminreg) alert(minregmess);
          if (nbsr > nminreg & nbsr < nminmsk) alert(minregmess2);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminregd) alert(minregmess);
          if (nbsd > nminregd & nbsd < nminmskd) alert(minregmess2);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminrege) alert(minregmess);
          if (nbse > nminrege & nbse < nminmske) alert(minregmess2);
        }
}

totalsum( pro );

}

////////////////////////////////////////////////
// Расчет автокредита и кредитов недвижимости //
////////////////////////////////////////////////

function credcalc7(pro) {

//Ввод и проверка ввода

// Скрытые поля - параметры кредита

smct=pro.mct.value;
nmct=parseInt(smct);
//alert("минимальный срок обеспеченного кредита = " + nmct);

smctmes=pro.mctmes.value;
//alert("сообщение о минимальном сроке обеспеченного кредита = " + smctmes);

sct=pro.ct.value;
nct=parseInt(sct);
//alert("максимальный срок обеспеченного кредита = " + nct);

sctn=pro.ctn.value;
nctn=parseInt(sctn);
//alert("максимальный срок необеспеченного кредита = " + nctn);

sctmes=pro.ctmes.value;
//alert("сообщение о максимальном сроке обеспеченного кредита = " + sctmes);

sctnmes=pro.ctnmes.value;
//alert("сообщение о максимальном сроке необеспеченного кредита = " + sctnmes);


// В рублях
scp=pro.cp.value;
ncp=parseFloat(scp);
//alert("процент в минимальном интервале срока обеспеченного кредита в рублях = " + ncp);

scp2=pro.cp2.value;
ncp2=parseFloat(scp2);
//alert("процент в среднем интервале срока обеспеченного кредита в рублях = " + ncp2);

scp3=pro.cp3.value;
ncp3=parseFloat(scp3);
//alert("процент в максимальном интервале срока обеспеченного кредита в рублях = " + ncp3);


// В долларах США
sdcp=pro.dcp.value;
ndcp=parseFloat(sdcp);
//alert("процент в минимальном интервале срока обеспеченного кредита в долларах США = " + ndcp);

sdcp2=pro.dcp2.value;
ndcp2=parseFloat(sdcp2);
//alert("процент в среднем интервале срока обеспеченного кредита в долларах США = " + ndcp2);

sdcp3=pro.dcp3.value;
ndcp3=parseFloat(sdcp3);
//alert("процент в максимальном интервале срока обеспеченного кредита в долларах США = " + ndcp3);


// В евро
secp=pro.ecp.value;
necp=parseFloat(secp);
//alert("процент в минимальном интервале срока обеспеченного кредита в евро = " + necp);

secp2=pro.ecp2.value;
necp2=parseFloat(secp2);
//alert("процент в среднем интервале срока обеспеченного кредита в евро = " + necp2);

secp3=pro.ecp3.value;
necp3=parseFloat(secp3);
//alert("процент в максимальном интервале срока обеспеченного кредита в евро = " + necp3);


scpt=pro.cpt.value;
ncpt=parseInt(scpt);
//alert("верхняя граница минимального интервала срока обеспеченного кредита = " + ncpt);

scpt2=pro.cpt2.value;
ncpt2=parseInt(scpt2);
//alert("верхняя граница среднего интервала срока обеспеченного кредита = " + ncpt2);

scpt3=pro.cpt3.value;
ncpt3=parseInt(scpt3);
//alert("верхняя граница максимального интервала срока обеспеченного кредита = " + ncpt3);


scpn=pro.cpn.value;
ncpn=parseInt(scpn);
//alert("процент необеспеченного кредита = " + ncpn);

scsn=pro.csn.value;
ncsn=parseInt(scsn);
//alert("максимальная сумма необеспеченного кредита = " + ncsn);

scsnv=pro.csnv.value;
ncsnv=parseInt(scsnv);
//alert("валюта максимальной суммы необеспеченного кредита = " + ncsnv);

scs=pro.cs.value;
ncs=parseInt(scs);
//alert("максимальная сумма обеспеченного кредита = " + ncs);

scsv=pro.csv.value;
ncsv=parseInt(scsv);
//alert("валюта максимальной суммы обеспеченного кредита = " + ncsv);

scsnis=pro.csnis.value;
ncsnis=parseInt(scsnis);
//alert("наличие ограничения максимальной суммы необеспеченного кредита = " + ncsnis);

scsis=pro.csis.value;
ncsis=parseInt(scsis);
//alert("наличие ограничения максимальной суммы обеспеченного кредита = " + ncsis);

scvalro=pro.cvalro.value;
ncvalro=parseInt(scvalro);
//alert("валюта кредита только рубли = " + ncvalro);

sck=pro.ck.value;
nck=parseFloat(sck);
//alert("коэфициент в минимальном интервале суммы кредита = " + nck);

sck2=pro.ck2.value;
nck2=parseFloat(sck2);
//alert("коэфициент в максимальном интервале суммы кредита = " + nck2);


scd=pro.cd.value;
ncd=parseInt(scd);
//alert("граница минимального и максимального интервалов суммы кредита = " + ncd);

sminmsk=pro.minmsk.value;
nminmsk=parseInt(sminmsk);
//alert("минимальная сумма кредита для г.Москвы = " + nminmsk);

sminreg=pro.minreg.value;
nminreg=parseInt(sminreg);
//alert("минимальная сумма кредита для Московской области и регионов РФ  = " + nminreg);

sregchoice=pro.regchoice.value;
nregchoice=parseInt(sregchoice);
//alert("выбор региона получения кредита = " + nregchoice);


// Скрытые поля - текущие курсы валют Банка России

// Текущая дата
svdate=vdate;
//alert("текущая дата " + svdate);


// Доллар США
svdoll=vdoll;
nvdoll=parseFloat(svdoll);
//alert("текущий курс доллара США = " + nvdoll);

// Евро
sveuro=veuro;
nveuro=parseFloat(sveuro);
//alert("текущий курс евро - покупка = " + nveuro);



// Открытые поля (ввод пользователя)

// Среднемесячный чистый доход за 6 месяцев
sbd=pro.bd.value;
if (!check(sbd)) {
pro.bd.select();
if (sbd == "") alert("Введите среднемесячный чистый доход за 6 месяцев или пенсию");
else alert("Неверное значение " + sbd + ". Введите целое число");
return(-1);
}
nbd=parseInt(sbd);
//alert("Доход = " + sbd);

// Срок кредитования в месяцах
sbt=pro.bt.value;
if (!check(sbt)) {
pro.bt.select();
if (sbt == "") alert("Введите срок кредитования в месяцах");
else alert("Неверное значение " + sbt + ". Введите целое число");
return(-1);
}
nbt=parseInt(sbt);
//alert("Срок кредитования = " + sbt);

// Обеспечение (без обеспечения = 0; с обеспечением =1)
sbg=pro.bg.value;
nbg=parseInt(sbg);
//alert("Выбор обеспечения = " + sbg);

// Валюта кредита (рубли = 0; доллары США = 1; евро = 2)
sbv=pro.bv.value;
nbv=parseInt(sbv);
//alert("Выбор валюты = " + sbv);



// Проверка допустимых сроков сроков кредитования:

// с обеспечением по кредиту - минимум 60 мес.
// минимальный срок обеспеченного кредита = nct

if (nbg==1 & nbt<nmct) {
alert("Неверное значение - минимальный срок" + smctmes + smct + " мес.")
return(-1);
}


// без обеспечения по кредиту - максимум 18 мес.
// максимальный срок необеспеченного кредита = nctn

if (nbg==0 & nbt>nctn) {
alert("Неверное значение - максимальный срок" + sctnmes + sctn + " мес.")
return(-1);
}

// с обеспечением по кредиту - максимум 360 мес.
// максимальный срок обеспеченного кредита = nct

if (nbg==1 & nbt>nct) {
alert("Неверное значение - максимальный срок" + sctmes + sct + " мес.")
return(-1);
}



// Вычисление процента по кредиту - в рублях
if (nbv == 0) {

// без обеспечения - 19%
// процент необеспеченного кредита = ncpn

if (nbg==0) nbp=ncpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно
if (nbg==1 & nbt<ncpt+1) nbp=ncp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=ncp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=ncp;

// alert("Процент по кредиту в рублях = " + nbp);
}


// Вычисление процента по кредиту - в долларах США
if (nbv == 1) {

// без обеспечения - 19%
// процент необеспеченного кредита = ncpn

if (nbg==0) nbp=ncpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно


if (nbg==1 & nbt<ncpt+1) nbp=ndcp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=ndcp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=ndcp;

//alert("Процент по кредиту в долларах США = " + nbp);
}


// Вычисление процента по кредиту - в евро
if (nbv == 2) {

// без обеспечения - 19%
// процент необеспеченного кредита = ncpn

if (nbg==0) nbp=ncpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно

if (nbg==1 & nbt<ncpt+1) nbp=necp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=necp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=necp;

//alert("Процент по кредиту в евро = " + nbp);
}


// Вычисление коэфициента K=0.7||0.8 для суммы кредита <=45000 || >45000 руб. соответственно
// коэфициент в минимальном/максимальном интервале суммы кредита = nck/nck2 соответственно
// граница минимального и максимального интервалов суммы кредита = ncd

if (nbd>ncd) {
nbk = nck2
}
else {
nbk = nck
}
//alert("Коэфициент = " + nbk);



// Знаменатель = 1+((t+1)*p/2400)
nbz=1+((nbt+1)*nbp/2400);
//alert("Знаменатель = " + nbz);
// Округление знаменателя до 2-х знаков после запятой
nbz=round2(nbz);
//alert("Знаменатель с округлением = " + nbz);



// Числитель = d*k*t
nba = nbd*nbk*nbt
//alert("Числитель = " + nba);


// Вычисление суммы кредита в рублях
nbsr = nba/nbz;
//alert("Сумма кредита в рублях = " + nbsr);
// Округление суммы кредита до целого
nbsr=round(nbsr);

// Ограничение суммы необеспеченного кредита максимумом - ncsn
if (ncsnis==1) {
 // Вычисление максимально возможной суммы кредита без обеспечения в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsnv==1) ncsn = round(ncsn*nvdoll)
 if (ncsnv==2) ncsn = round(ncsn*nveuro)
 //alert ("максимальная сумма кредита без обеспечения в рублях = " + ncsn)

 if (nbg==0 & nbsr > ncsn) nbsr = ncsn;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Ограничение суммы обеспеченного кредита максимумом - ncs
if (ncsis==1) {
 // Вычисление максимально возможной суммы кредита с обеспечением в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsv==1) ncs = round(ncs*nvdoll)
 if (ncsv==2) ncs = round(ncs*nveuro)
 //alert ("максимальная сумма кредита с обеспечением в рублях = " + ncs)

 if (nbg==1 & nbsr > ncs) nbsr = ncs;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Вычисление суммы кредита в долларах
if (nbv==1){
//nbsd = nbsr/nqd;
nbsd = nbsr/nvdoll;
//alert("Сумма кредита в долларах = " + nbsd);

// Округление суммы кредита до целого
nbsd=round(nbsd);
//alert("Сумма кредита в долларах с округлением = " + nbsd);
}

// Вычисление суммы кредита в евро
if (nbv==2){
//ndse = nbsr/nqe;
nbse = nbsr/nveuro;
//alert("Сумма кредита в евро = " + nbse);

// Округление суммы кредита до целого
nbse=round(nbse);
//alert("Сумма кредита в евро с округлением = " + nbse);
}


// Вывод результата
// в рублях
if (nbv==0) {
	pro.bs.value=eval(nbsr);
	mess = "Расчет успешно завершен в рублях."
	//alert(mess);
}

// в долларах
if (nbv==1) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbsd);
    mess = "Расчет успешно завершен в долларах США (курс ЦБ на " + svdate + " равен " + svdoll + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}



// в евро
if (nbv==2) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbse);
    mess = "Расчет успешно завершен в евро (курс ЦБ на " + svdate + " равен " + sveuro + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}

alert(mess);


// Вычисление минимально возможной суммы кредита, еслм он задан в иностранной валюте

// Вычисление минимальной суммы кредита в долларах

if (nbv==1){
nminmskd = nminmsk/nvdoll;
//alert("Минимальная сумма кредита в г.Москве в долларах = " + nminmskd);
nminregd = nminreg/nvdoll;
//alert("Минимальная сумма кредита в МО и регионах в долларах = " + nminregd);

// Округление минимальной суммы кредита до целого

nminmskd=round(nminmskd);
//alert("Минимальная сумма кредита в г.Москве в долларах с округлением = " + nminmskd);
nminregd=round(nminregd);
//alert("Минимальная сумма кредита в МО и регионах в долларах с округлением = " + nminregd);
}

// Вычисление минимальной суммы кредита в евро

if (nbv==2){
nminmske = nminmsk/nveuro;
//alert("Минимальная сумма кредита в г.Москве в евро = " + nminmske);
nminrege = nminreg/nveuro;
//alert("Минимальная сумма кредита в МО и регионах в евро = " + nminrege);

// Округление суммы кредита до целого

nminmske=round(nminmske);
//alert("Минимальная сумма кредита в г.Москве в евро с округлением = " + nminmske);
nminrege=round(nminrege);
//alert("Минимальная сумма кредита в МО и регионах в евро с округлением = " + nminrege);
}


// Проверка результата на допустимый минимум в зависимости от выбора региона

// г. Москва

minmskmess  = "Минимальная сумма предоставляемого кредита - 45 000 рублей";
minregmess  = "Минимальная сумма предоставляемого кредита - 15 000 - 45 000 рублей в зависимости от региона получения кредита. Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";
minregmess2 = "Территориальный банк Сбербанка России может установить для своих филиалов минимальную сумму предоставляемого кредита в рамках диапазона от 15 000 рублей до 45 000 рублей (или эквивалента этой суммы в иностранной валюте). Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";

if (nregchoice == 0) {
//alert("Выбор региона г.Москва")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminmsk) alert(minmskmess);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminmskd) alert(minmskmess);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminmske) alert(minmskmess);
        }
}

// Московская область и другие регионы РФ

if (nregchoice > 0) {
//alert("Выбор региона МО и другие регионы РФ")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminreg) alert(minregmess);
          if (nbsr > nminreg & nbsr < nminmsk) alert(minregmess2);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminregd) alert(minregmess);
          if (nbsd > nminregd & nbsd < nminmskd) alert(minregmess2);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminrege) alert(minregmess);
          if (nbse > nminrege & nbse < nminmske) alert(minregmess2);
        }
}

totalsum( pro );

}

///////////////////////////////////////////////
// Расчет кредита для работающего пенсионера //
///////////////////////////////////////////////

function credcalc3(pro) {

//Ввод и проверка ввода

// Скрытые поля - параметры кредита

sct=pro.ct.value;
nct=parseInt(sct);
//alert("максимальный срок обеспеченного кредита = " + nct);

sctn=pro.ctn.value;
nctn=parseInt(sctn);
//alert("максимальный срок необеспеченного кредита = " + nctn);

sctmes=pro.ctmes.value;
//alert("сообщение о максимальном сроке обеспеченного кредита = " + sctmes);

sctnmes=pro.ctnmes.value;
//alert("сообщение о максимальном сроке необеспеченного кредита = " + sctnmes);


scp=pro.cp.value;
ncp=parseFloat(scp);
//alert("процент в минимальном интервале срока обеспеченного кредита = " + ncp);

scp2=pro.cp2.value;
ncp2=parseFloat(scp2);
//alert("процент в среднем интервале срока обеспеченного кредита = " + ncp2);

scp3=pro.cp3.value;
ncp3=parseFloat(scp3);
//alert("процент в максимальном интервале срока обеспеченного кредита = " + ncp3);


scpt=pro.cpt.value;
ncpt=parseInt(scpt);
//alert("верхняя граница минимального интервала срока обеспеченного кредита = " + ncpt);

scpt2=pro.cpt2.value;
ncpt2=parseInt(scpt2);
//alert("верхняя граница среднего интервала срока обеспеченного кредита = " + ncpt2);

scpt3=pro.cpt3.value;
ncpt3=parseInt(scpt3);
//alert("верхняя граница максимального интервала срока обеспеченного кредита = " + ncpt3);


scpn=pro.cpn.value;
ncpn=parseInt(scpn);
//alert("процент необеспеченного кредита = " + ncpn);

scsn=pro.csn.value;
ncsn=parseInt(scsn);
//alert("максимальная сумма необеспеченного кредита = " + ncsn);

scsnv=pro.csnv.value;
ncsnv=parseInt(scsnv);
//alert("валюта максимальной суммы необеспеченного кредита = " + ncsnv);

scs=pro.cs.value;
ncs=parseInt(scs);
//alert("максимальная сумма обеспеченного кредита = " + ncs);

scsv=pro.csv.value;
ncsv=parseInt(scsv);
//alert("валюта максимальной суммы обеспеченного кредита = " + ncsv);

scsnis=pro.csnis.value;
ncsnis=parseInt(scsnis);
//alert("наличие ограничения максимальной суммы необеспеченного кредита = " + ncsnis);

scsis=pro.csis.value;
ncsis=parseInt(scsis);
//alert("наличие ограничения максимальной суммы обеспеченного кредита = " + ncsis);

scvalro=pro.cvalro.value;
ncvalro=parseInt(scvalro);
//alert("валюта кредита только рубли = " + ncvalro);

sck=pro.ck.value;
nck=parseFloat(sck);
//alert("коэфициент в минимальном интервале суммы кредита = " + nck);

sck2=pro.ck2.value;
nck2=parseFloat(sck2);
//alert("коэфициент в максимальном интервале суммы кредита = " + nck2);


scd=pro.cd.value;
ncd=parseInt(scd);
//alert("граница минимального и максимального интервалов суммы кредита = " + ncd);

sminmsk=pro.minmsk.value;
nminmsk=parseInt(sminmsk);
//alert("минимальная сумма кредита для г.Москвы = " + nminmsk);

sminreg=pro.minreg.value;
nminreg=parseInt(sminreg);
//alert("минимальная сумма кредита для Московской области и регионов РФ  = " + nminreg);

sregchoice=pro.regchoice.value;
nregchoice=parseInt(sregchoice);
//alert("выбор региона получения кредита = " + nregchoice);

sdtype=pro.dtype.value;
ndtype=parseInt(sdtype);
//alert("вид дохода (по месту работы или по месту работы плюс пенсия) = " + ndtype);

// Скрытые поля - текущие курсы валют Банка России

// Текущая дата
svdate=vdate;
//alert("текущая дата " + svdate);


// Доллар США
svdoll=vdoll;
nvdoll=parseFloat(svdoll);
//alert("текущий курс доллара США = " + nvdoll);

// Евро
sveuro=veuro;
nveuro=parseFloat(sveuro);
//alert("текущий курс евро - покупка = " + nveuro);



// Открытые поля (ввод пользователя)

// Среднемесячный чистый доход за 6 месяцев
sbd=pro.bd.value;
if (!check(sbd)) {
pro.bd.select();
if (sbd == "") alert("Введите среднемесячный чистый доход за 6 месяцев или пенсию");
else alert("Неверное значение " + sbd + ". Введите целое число");
return(-1);
}
nbd=parseInt(sbd);
//alert("Доход = " + sbd);

// Размер пенсии в рублях
sbd2=pro.bd2.value;
if (!check(sbd2)) {
pro.bd2.select();
if (sbd2 == "") alert("Введите размер пенсии в рублях");
else alert("Неверное значение " + sbd2 + ". Введите целое число");
return(-1);
}
nbd2=parseInt(sbd2);
//alert("Размер пенсии = " + sbd2);

// Срок кредитования в месяцах
sbt=pro.bt.value;
if (!check(sbt)) {
pro.bt.select();
if (sbt == "") alert("Введите срок кредитования в месяцах");
else alert("Неверное значение " + sbt + ". Введите целое число");
return(-1);
}
nbt=parseInt(sbt);
//alert("Срок кредитования = " + sbt);

// Обеспечение (без обеспечения = 0; с обеспечением =1)
sbg=pro.bg.value;
nbg=parseInt(sbg);
//alert("Выбор обеспечения = " + sbg);

// Валюта кредита (рубли = 0; доллары США = 1; евро = 2)
sbv=pro.bv.value;
nbv=parseInt(sbv);
//alert("Выбор валюты = " + sbv);



// Проверка допустимых сроков сроков кредитования:

// без обеспечения по кредиту - максимум 18 мес.
// максимальный срок необеспеченного кредита = nctn

if (nbg==0 & nbt>nctn) {
alert("Неверное значение - максимальный срок" + sctnmes + sctn + " мес.")
return(-1);
}

// с обеспечением по кредиту - максимум 60 мес.
// максимальный срок обеспеченного кредита = nct

if (nbg==1 & nbt>nct) {
alert("Неверное значение - максимальный срок" + sctmes + sct + " мес.")
return(-1);
}



// Вычисление процента по кредиту

// без обеспечения - 19%
// процент необеспеченного кредита = ncpn

if (nbg==0) nbp=ncpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно

if (nbg==1 & nbt<ncpt+1) nbp=ncp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=ncp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=ncp;
//alert("Процент по кредиту = " + nbp);


// Вычисление коэфициента K для дохода по месту работы и пенсии (вместе)
// Вычисление коэфициента K=0.7||0.8 для суммы кредита <=45000 || >45000 руб. соответственно
// коэфициент в минимальном/максимальном интервале суммы кредита = nck/nck2 соответственно
// граница минимального и максимального интервалов суммы кредита = ncd

if (nbd+nbd2>ncd) {
nbk = nck2
}
else {
nbk = nck
}
//alert("Коэфициент = " + nbk);


// Вычисление коэфициента K2 для пенсии (только)
// Вычисление коэфициента K=0.7||0.8 для суммы кредита <=45000 || >45000 руб. соответственно
// коэфициент в минимальном/максимальном интервале суммы кредита = nck/nck2 соответственно
// граница минимального и максимального интервалов суммы кредита = ncd

if (nbd2>ncd) {
nbk2 = nck2
}
else {
nbk2 = nck
}
//alert("Коэфициент = " + nbk2);



// Знаменатель = 1+((t+1)*p/2400)
nbz=1+((nbt+1)*nbp/2400);
//alert("Знаменатель = " + nbz);
// Округление знаменателя до 2-х знаков после запятой
nbz=round2(nbz);
//alert("Знаменатель с округлением = " + nbz);


// Числитель = d*k*t или (d+d2)*k*t (при сроке до 2 лет) & (при виде дохода по месту работы плюс пенсия, т.е. ndtype=1)
if (nbt > 24) {
  nba = nbd*nbk*nbt
}
else {

  if (ndtype > 0) {
   nba = (nbd+nbd2)*nbk*nbt
  }
  else {
   nba = nbd*nbk*nbt
  }
}
//alert("Числитель = " + nba);


// Вычисление суммы кредита в рублях
nbsr = nba/nbz;
//alert("Сумма кредита в рублях = " + nbsr);




//Перерасчет пенсионного кредита при сроке более 2 лет для видов дохода "доход по месту работы" и "доход по месту работы и пенсия"

if (nbt > 24) {

// Первый знаменатель = 1+((24+1)*p/2400)
nbz=1+((24+1)*nbp/2400);
//alert("Знаменатель = " + nbz);
// Округление знаменателя до 2-х знаков после запятой
nbz=round2(nbz);
//alert("Знаменатель с округлением = " + nbz);

// Первый числитель = (d1+d3)*k1*24, где d3=if(dtype=1)then d2 else 0.
if (ndtype == 1) nbd3 = nbd2; else nbd3 = 0;
nba = (nbd+nbd3)*nbk*24
//alert("Числитель = " + nba);

// Первая часть суммы кредита
nbsr1 = nba/nbz;
//alert("Часть 1 суммы кредита в рублях = " + nbsr1);


// Второй  знаменатель = 1+(((t-24)+1)*p/2400)
nbz=1+((nbt-24+1)*nbp/2400);
//alert("Знаменатель = " + nbz);
// Округление знаменателя до 2-х знаков после запятой
nbz=round2(nbz);
//alert("Знаменатель с округлением = " + nbz);

// Второй числитель = d2*k2*(t-24)
nba = nbd2*nbk2*(nbt-24)
//alert("Числитель = " + nba);

// Вторая часть суммы кредита
nbsr2 = nba/nbz;
//alert("Часть 2 суммы кредита в рублях = " + nbsr2);


// Вычисление суммы кредита в рублях
nbsr = nbsr1 + nbsr2;
//alert("Сумма кредита в рублях = " + nbsr);

}
// Конец перерасчета пенсионного кредита при сроке более 2 лет


// Округление суммы кредита до целого
nbsr=round(nbsr);
//alert("Сумма кредита в рублях  с округлением = " + nbsr);

// Ограничение суммы необеспеченного кредита максимумом - ncsn
if (ncsnis==1) {
 // Вычисление максимально возможной суммы кредита без обеспечения в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsnv==1) ncsn = round(ncsn*nvdoll)
 if (ncsnv==2) ncsn = round(ncsn*nveuro)
 //alert ("максимальная сумма кредита без обеспечения в рублях = " + ncsn)

 if (nbg==0 & nbsr > ncsn) nbsr = ncsn;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Ограничение суммы обеспеченного кредита максимумом - ncs
if (ncsis==1) {
 // Вычисление максимально возможной суммы кредита с обеспечением в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsv==1) ncs = round(ncs*nvdoll)
 if (ncsv==2) ncs = round(ncs*nveuro)
 //alert ("максимальная сумма кредита с обеспечением в рублях = " + ncs)

 if (nbg==1 & nbsr > ncs) nbsr = ncs;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Вычисление суммы кредита в долларах
if (nbv==1){
//nbsd = nbsr/nqd;
nbsd = nbsr/nvdoll;
//alert("Сумма кредита в долларах = " + nbsd);

// Округление суммы кредита до целого
nbsd=round(nbsd);
//alert("Сумма кредита в долларах с округлением = " + nbsd);
}

// Вычисление суммы кредита в евро
if (nbv==2){
//ndse = nbsr/nqe;
nbse = nbsr/nveuro;
//alert("Сумма кредита в евро = " + nbse);

// Округление суммы кредита до целого
nbse=round(nbse);
//alert("Сумма кредита в евро с округлением = " + nbse);
}


// Вывод результата
// в рублях
if (nbv==0) {
pro.bs.value=eval(nbsr);
mess = "Расчет успешно завершен в рублях."
//alert(mess);
}

// в долларах
if (nbv==1) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbsd);
    mess = "Расчет успешно завершен в долларах США (по курсу " + svdoll + " ЦБ на " + svdate + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}



// в евро
if (nbv==2) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbse);
    mess = "Расчет успешно завершен в евро (по курсу " + sveuro + " ЦБ на " + svdate + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}

alert(mess);


// Вычисление минимально возможной суммы кредита, еслм он задан в иностранной валюте

// Вычисление минимальной суммы кредита в долларах

if (nbv==1){
nminmskd = nminmsk/nvdoll;
//alert("Минимальная сумма кредита в г.Москве в долларах = " + nminmskd);
nminregd = nminreg/nvdoll;
//alert("Минимальная сумма кредита в МО и регионах в долларах = " + nminregd);

// Округление минимальной суммы кредита до целого

nminmskd=round(nminmskd);
//alert("Минимальная сумма кредита в г.Москве в долларах с округлением = " + nminmskd);
nminregd=round(nminregd);
//alert("Минимальная сумма кредита в МО и регионах в долларах с округлением = " + nminregd);
}

// Вычисление минимальной суммы кредита в евро

if (nbv==2){
nminmske = nminmsk/nveuro;
//alert("Минимальная сумма кредита в г.Москве в евро = " + nminmske);
nminrege = nminreg/nveuro;
//alert("Минимальная сумма кредита в МО и регионах в евро = " + nminrege);

// Округление суммы кредита до целого

nminmske=round(nminmske);
//alert("Минимальная сумма кредита в г.Москве в евро с округлением = " + nminmske);
nminrege=round(nminrege);
//alert("Минимальная сумма кредита в МО и регионах в евро с округлением = " + nminrege);
}


// Проверка результата на допустимый минимум в зависимости от выбора региона

// г. Москва

minmskmess  = "Минимальная сумма предоставляемого кредита - 45 000 рублей";
minregmess  = "Минимальная сумма предоставляемого кредита - 15 000 - 45 000 рублей в зависимости от региона получения кредита. Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";
minregmess2 = "Территориальный банк Сбербанка России может установить для своих филиалов минимальную сумму предоставляемого кредита в рамках диапазона от 15 000 рублей до 45 000 рублей (или эквивалента этой суммы в иностранной валюте). Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";

if (nregchoice == 0) {
//alert("Выбор региона г.Москва")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminmsk) alert(minmskmess);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminmskd) alert(minmskmess);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminmske) alert(minmskmess);
        }
}

// Московская область и другие регионы РФ

if (nregchoice > 0) {
//alert("Выбор региона МО и другие регионы РФ")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminreg) alert(minregmess);
          if (nbsr > nminreg & nbsr < nminmsk) alert(minregmess2);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminregd) alert(minregmess);
          if (nbsd > nminregd & nbsd < nminmskd) alert(minregmess2);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminrege) alert(minregmess);
          if (nbse > nminrege & nbse < nminmske) alert(minregmess2);
        }
}

totalsum( pro );

}

////////////////////////////////////////////////////////
// Расчет доверительного кредита в категории заемщика //
//        "Участник "зарплатного" проекта"            //
////////////////////////////////////////////////////////

function credcalc4(pro) {

//Ввод и проверка ввода

// Скрытые поля - параметры кредита

sct=pro.ct.value;
nct=parseInt(sct);
//alert("максимальный срок обеспеченного кредита = " + nct);

sctn=pro.ctn.value;
nctn=parseInt(sctn);
//alert("максимальный срок необеспеченного кредита = " + nctn);

sctmes=pro.ctmes.value;
//alert("сообщение о максимальном сроке обеспеченного кредита = " + sctmes);

sctnmes=pro.ctnmes.value;
//alert("сообщение о максимальном сроке необеспеченного кредита = " + sctnmes);


scp=pro.cp.value;
ncp=parseFloat(scp);
//alert("процент в минимальном интервале срока обеспеченного кредита = " + ncp);

scp2=pro.cp2.value;
ncp2=parseFloat(scp2);
//alert("процент в среднем интервале срока обеспеченного кредита = " + ncp2);

scp3=pro.cp3.value;
ncp3=parseFloat(scp3);
//alert("процент в максимальном интервале срока обеспеченного кредита = " + ncp3);


scpt=pro.cpt.value;
ncpt=parseInt(scpt);
//alert("верхняя граница минимального интервала срока обеспеченного кредита = " + ncpt);

scpt2=pro.cpt2.value;
ncpt2=parseInt(scpt2);
//alert("верхняя граница среднего интервала срока обеспеченного кредита = " + ncpt2);

scpt3=pro.cpt3.value;
ncpt3=parseInt(scpt3);
//alert("верхняя граница максимального интервала срока обеспеченного кредита = " + ncpt3);


scpn=pro.cpn.value;
ncpn=parseInt(scpn);
//alert("процент необеспеченного кредита = " + ncpn);

scsn=pro.csn.value;
ncsn=parseInt(scsn);
//alert("максимальная сумма необеспеченного кредита = " + ncsn);

scsnv=pro.csnv.value;
ncsnv=parseInt(scsnv);
//alert("валюта максимальной суммы необеспеченного кредита = " + ncsnv);

scs=pro.cs.value;
ncs=parseInt(scs);
//alert("максимальная сумма обеспеченного кредита = " + ncs);

scsv=pro.csv.value;
ncsv=parseInt(scsv);
//alert("валюта максимальной суммы обеспеченного кредита = " + ncsv);

scsnis=pro.csnis.value;
ncsnis=parseInt(scsnis);
//alert("наличие ограничения максимальной суммы необеспеченного кредита = " + ncsnis);

scsis=pro.csis.value;
ncsis=parseInt(scsis);
//alert("наличие ограничения максимальной суммы обеспеченного кредита = " + ncsis);

scvalro=pro.cvalro.value;
ncvalro=parseInt(scvalro);
//alert("валюта кредита только рубли = " + ncvalro);

sck=pro.ck.value;
nck=parseFloat(sck);
//alert("коэфициент в минимальном интервале суммы кредита = " + nck);

sck2=pro.ck2.value;
nck2=parseFloat(sck2);
//alert("коэфициент в среднем интервале суммы кредита = " + nck2);

sck3=pro.ck3.value;
nck3=parseFloat(sck3);
//alert("коэфициент в максимальном интервале суммы кредита = " + nck3);


scd=pro.cd.value;
ncd=parseInt(scd);
//alert("граница минимального и среднего интервалов суммы кредита = " + ncd);

scd2=pro.cd2.value;
ncd2=parseInt(scd2);
//alert("граница среднего и максимального интервалов суммы кредита = " + ncd2);

sminmsk=pro.minmsk.value;
nminmsk=parseInt(sminmsk);
//alert("минимальная сумма кредита для г.Москвы = " + nminmsk);

sminreg=pro.minreg.value;
nminreg=parseInt(sminreg);
//alert("минимальная сумма кредита для Московской области и регионов РФ  = " + nminreg);

sregchoice=pro.regchoice.value;
nregchoice=parseInt(sregchoice);
//alert("выбор региона получения кредита = " + nregchoice);


// Скрытые поля - текущие курсы валют Банка России

// Текущая дата
svdate=vdate;
//alert("текущая дата " + svdate);


// Доллар США
svdoll=vdoll;
nvdoll=parseFloat(svdoll);
//alert("текущий курс доллара США = " + nvdoll);

// Евро
sveuro=veuro;
nveuro=parseFloat(sveuro);
//alert("текущий курс евро - покупка = " + nveuro);



// Открытые поля (ввод пользователя)

// Среднемесячный чистый доход за 6 месяцев
sbd=pro.bd.value;
if (!check(sbd)) {
pro.bd.select();
if (sbd == "") alert("Введите среднемесячный чистый доход за 6 месяцев или пенсию");
else alert("Неверное значение " + sbd + ". Введите целое число");
return(-1);
}
nbd=parseInt(sbd);
//alert("Доход = " + sbd);

// Срок кредитования в месяцах
sbt=pro.bt.value;
if (!check(sbt)) {
pro.bt.select();
if (sbt == "") alert("Введите срок кредитования в месяцах");
else alert("Неверное значение " + sbt + ". Введите целое число");
return(-1);
}
nbt=parseInt(sbt);
//alert("Срок кредитования = " + sbt);

// Обеспечение (без обеспечения = 0; с обеспечением =1)
sbg=pro.bg.value;
nbg=parseInt(sbg);
//alert("Выбор обеспечения = " + sbg);

// Валюта кредита (рубли = 0; доллары США = 1; евро = 2)
sbv=pro.bv.value;
nbv=parseInt(sbv);
//alert("Выбор валюты = " + sbv);



// Проверка допустимых сроков сроков кредитования:

// без обеспечения по кредиту - максимум 18 мес.
// максимальный срок необеспеченного кредита = nctn

if (nbg==0 & nbt>nctn) {
alert("Неверное значение - максимальный срок" + sctnmes + sctn + " мес.")
return(-1);
}

// с обеспечением по кредиту - максимум 60 мес.
// максимальный срок обеспеченного кредита = nct

if (nbg==1 & nbt>nct) {
alert("Неверное значение - максимальный срок" + sctmes + sct + " мес.")
return(-1);
}



// Вычисление процента по кредиту

// без обеспечения - 19%
// процент необеспеченного кредита = ncpn

if (nbg==0) nbp=ncpn;

// с обеспечением - при сроках кредита до 18/36/60 мес - 16/18/19% соответственно
// процент в минимальном/среднем/максимальном интервале срока обеспеченного кредита = ncp/ncp2/ncp3 процентов соответственно
// верхняя граница минимального/среднего/максимального интервала срока обеспеченного кредита = ncpt/ncpt2/ncpt3 месяцев соответственно

if (nbg==1 & nbt<ncpt+1) nbp=ncp3;
if (nbg==1 & nbt>ncpt & nbt<ncpt2+1) nbp=ncp2;
if (nbg==1 & nbt>ncpt2 & nbt<ncpt3+1) nbp=ncp;
//alert("Процент по кредиту = " + nbp);



// Вычисление коэфициента K=0.3||0.4||0.5 для суммы кредита <=25000 |>25000 & <=40000| >40000 руб. соответственно
// коэфициент в минимальном/максимальном интервале суммы кредита = nck/nck2/nsk3 соответственно
// граница минимального, среднего и максимального интервалов суммы кредита = ncd/ncd2

if (nbd<=ncd) {
nbk = nck
}

if (nbd>ncd & nbd<=ncd2) {
nbk = nck2
}

if (nbd>ncd2) {
nbk = nck3
}
//alert("Коэфициент = " + nbk);



// Знаменатель = 1+((t+1)*p/2400)
nbz=1+((nbt+1)*nbp/2400);
//alert("Знаменатель = " + nbz);
// Округление знаменателя до 2-х знаков после запятой
nbz=round2(nbz);
//alert("Знаменатель с округлением = " + nbz);



// Числитель = d*k*t
nba = nbd*nbk*nbt
//alert("Числитель = " + nba);


// Вычисление суммы кредита в рублях
nbsr = nba/nbz;
//alert("Сумма кредита в рублях = " + nbsr);
// Округление суммы кредита до целого
nbsr=round(nbsr);

// Ограничение суммы необеспеченного кредита максимумом - ncsn
if (ncsnis==1) {
 // Вычисление максимально возможной суммы кредита без обеспечения в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsnv==1) ncsn = round(ncsn*nvdoll)
 if (ncsnv==2) ncsn = round(ncsn*nveuro)
 //alert ("максимальная сумма кредита без обеспечения в рублях = " + ncsn)

 if (nbg==0 & nbsr > ncsn) nbsr = ncsn;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Ограничение суммы обеспеченного кредита максимумом - ncs
if (ncsis==1) {
 // Вычисление максимально возможной суммы кредита с обеспечением в рублях, если она задана в валюте (1 - доллары США, 2 - евро)
 if (ncsv==1) ncs = round(ncs*nvdoll)
 if (ncsv==2) ncs = round(ncs*nveuro)
 //alert ("максимальная сумма кредита с обеспечением в рублях = " + ncs)

 if (nbg==1 & nbsr > ncs) nbsr = ncs;
 //alert("Сумма кредита в рублях с округлением = " + nbsr);
}

// Вычисление суммы кредита в долларах
if (nbv==1){
//nbsd = nbsr/nqd;
nbsd = nbsr/nvdoll;
//alert("Сумма кредита в долларах = " + nbsd);

// Округление суммы кредита до целого
nbsd=round(nbsd);
//alert("Сумма кредита в долларах с округлением = " + nbsd);
}

// Вычисление суммы кредита в евро
if (nbv==2){
//ndse = nbsr/nqe;
nbse = nbsr/nveuro;
//alert("Сумма кредита в евро = " + nbse);

// Округление суммы кредита до целого
nbse=round(nbse);
//alert("Сумма кредита в евро с округлением = " + nbse);
}


// Вывод результата
// в рублях
if (nbv==0) {
pro.bs.value=eval(nbsr);
mess = "Расчет успешно завершен в рублях."
//alert(mess);
}

// в долларах
if (nbv==1) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbsd);
    mess = "Расчет успешно завершен в долларах США (по курсу " + svdoll + " ЦБ на " + svdate + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}



// в евро
if (nbv==2) {
  if (ncvalro==0) {
    pro.bs.value=eval(nbse);
    mess = "Расчет успешно завершен в евро (по курсу " + sveuro + " ЦБ на " + svdate + ")."
  }
  if (ncvalro==1) {
    mess = "Расчет успешно завершен в рублях."
    alert("Предупреждение: валюта кредита - только рубли");
  }
}

alert(mess);


// Вычисление минимально возможной суммы кредита, еслм он задан в иностранной валюте

// Вычисление минимальной суммы кредита в долларах

if (nbv==1){
nminmskd = nminmsk/nvdoll;
//alert("Минимальная сумма кредита в г.Москве в долларах = " + nminmskd);
nminregd = nminreg/nvdoll;
//alert("Минимальная сумма кредита в МО и регионах в долларах = " + nminregd);

// Округление минимальной суммы кредита до целого

nminmskd=round(nminmskd);
//alert("Минимальная сумма кредита в г.Москве в долларах с округлением = " + nminmskd);
nminregd=round(nminregd);
//alert("Минимальная сумма кредита в МО и регионах в долларах с округлением = " + nminregd);
}

// Вычисление минимальной суммы кредита в евро

if (nbv==2){
nminmske = nminmsk/nveuro;
//alert("Минимальная сумма кредита в г.Москве в евро = " + nminmske);
nminrege = nminreg/nveuro;
//alert("Минимальная сумма кредита в МО и регионах в евро = " + nminrege);

// Округление суммы кредита до целого

nminmske=round(nminmske);
//alert("Минимальная сумма кредита в г.Москве в евро с округлением = " + nminmske);
nminrege=round(nminrege);
//alert("Минимальная сумма кредита в МО и регионах в евро с округлением = " + nminrege);
}


// Проверка результата на допустимый минимум в зависимости от выбора региона

// г. Москва

minmskmess  = "Минимальная сумма предоставляемого кредита - 45 000 рублей";
minregmess  = "Минимальная сумма предоставляемого кредита - 15 000 - 45 000 рублей в зависимости от региона получения кредита. Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";
minregmess2 = "Территориальный банк Сбербанка России может установить для своих филиалов минимальную сумму предоставляемого кредита в рамках диапазона от 15 000 рублей до 45 000 рублей (или эквивалента этой суммы в иностранной валюте). Информацию о  минимальном размере предоставляемого кредита можно получить в филиале территориального банка Сбербанка России по месту получения кредита.";

if (nregchoice == 0) {
//alert("Выбор региона г.Москва")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminmsk) alert(minmskmess);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminmskd) alert(minmskmess);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminmske) alert(minmskmess);
        }
}

// Московская область и другие регионы РФ

if (nregchoice > 0) {
//alert("Выбор региона МО и другие регионы РФ")
        if (nbv==0){
          //alert("Выбор валюты рубли");
          if (nbsr < nminreg) alert(minregmess);
          if (nbsr > nminreg & nbsr < nminmsk) alert(minregmess2);
        }
        if (nbv==1){
          //alert("Выбор валюты доллары");
          if (nbsd < nminregd) alert(minregmess);
          if (nbsd > nminregd & nbsd < nminmskd) alert(minregmess2);
        }
        if (nbv==2){
          //alert("Выбор валюты евро");
          if (nbse < nminrege) alert(minregmess);
          if (nbse > nminrege & nbse < nminmske) alert(minregmess2);
        }
}

totalsum( pro );

}

//////////////////////////////////////////////////////////////
// Расчет платы за хранение слитков из драгоценных металлов //
//////////////////////////////////////////////////////////////

function slitcalc1( form )
{
	var nums = parseInt( form.nums.value );
	var days = parseInt( form.days.value );

	if ( isNaN( nums ) )
	{
		alert( 'Ошибочное количество слитков!' ); return false;
	}

	if ( isNaN( days ) )
	{
		alert( 'Ошибочный срок хранения!' ); return false;
	}

	if (days>1000)
	{
		alert( 'Максимальный срок аренды 1000 дней' ); return false;
	}

	var cost = 0;

	if ( days < 31 )
	{
		if ( nums == 1 ) cost = 33; else if ( nums == 2 ) cost = 25; else if ( nums < 11 ) cost = 22; else cost = 12;
	}
	else if ( days < 61 )
	{
		if ( nums == 1 ) cost = 21; else if ( nums == 2 ) cost = 15; else if ( nums < 11 ) cost = 13; else cost = 10;
	}
	else if ( days < 91 )
	{
		if ( nums == 1 ) cost = 15; else if ( nums == 2 ) cost = 11; else if ( nums < 11 ) cost = 9; else cost = 8;
	}
	else if ( days < 121 )
	{
		if ( nums == 1 ) cost = 13; else if ( nums == 2 ) cost = 9; else if ( nums < 11 ) cost = 8; else cost = 7;
	}
	else
	{
		if ( nums == 1 ) cost = 12; else if ( nums == 2 ) cost = 7; else if ( nums < 11 ) cost = 6; else cost = 5;
	}

	var min = 0;

	if ( nums == 1 ) min = 430;	else if ( nums == 2 ) min = 330; else if ( nums < 11 ) min = 310; else min = 270;

	form.pays.value = nums * Math.max( days * cost, min );
	form.pays_per_day.value = cost;
}

function slitcalc2( form )
{
	var nums = parseInt( form.nums2.value );
	var days = parseInt( form.days2.value );

	if ( isNaN( nums ) )
	{
		alert( 'Ошибочное количество слитков!' ); return false;
	}

	if ( isNaN( days ) )
	{
		alert( 'Ошибочный срок хранения!' ); return false;
	}

	var cost = 0;

	if ( days < 31 )
	{
		if ( nums == 1 ) cost = 24; else if ( nums == 2 ) cost = 17; else if ( nums < 11 ) cost = 13; else cost = 9;
	}
	else if ( days < 61 )
	{
		if ( nums == 1 ) cost = 17; else if ( nums == 2 ) cost = 11; else if ( nums < 11 ) cost = 9; else cost = 6;
	}
	else if ( days < 91 )
	{
		if ( nums == 1 ) cost = 14; else if ( nums == 2 ) cost = 9; else if ( nums < 11 ) cost = 7; else cost = 5;
	}
	else if ( days < 121 )
	{
		if ( nums == 1 ) cost = 12; else if ( nums == 2 ) cost = 7; else if ( nums < 11 ) cost = 6; else cost = 4;
	}
	else
	{
		if ( nums == 1 ) cost = 11; else if ( nums == 2 ) cost = 6; else if ( nums < 11 ) cost = 5; else cost = 3;
	}

	var min = 0;

	if ( nums == 1 ) min = 290;	else if ( nums == 2 ) min = 200; else if ( nums < 11 ) min = 160; else min = 120;

	form.pays2.value = nums * Math.max( days * cost, min );
	form.pays_per_day2.value = cost;
}

///////////////////////////////////
// Расчет платы за аренду сейфов //
///////////////////////////////////

function safecalc1_1( form )
{
	var days = parseInt( form.days.value );
	var height = parseInt( form.height.value );

	if ( isNaN( days ) )
	{
		alert( 'Ошибочный срок аренды!' ); return false;
	}

	if (days>1080)
	{
		alert( 'Максимальный срок аренды 1080 дней' ); return false;
	}
	var costs = {
		1 : { 1: 22, 2: 26, 3: 29, 4: 34, 5: 38, 6: 43, 7: 48, 8: 54, 9: 60, 10: 65 },
		2 : { 1: 21, 2: 25, 3: 28, 4: 31, 5: 35, 6: 39, 7: 45, 8: 50, 9: 56, 10: 62 },
		3 : { 1: 20, 2: 24, 3: 26, 4: 29, 5: 32, 6: 36, 7: 41, 8: 47, 9: 53, 10: 59 },
		4 : { 1: 19, 2: 22, 3: 24, 4: 27, 5: 30, 6: 33, 7: 38, 8: 44, 9: 49, 10: 56 },
		5 : { 1: 17, 2: 20, 3: 22, 4: 25, 5: 27, 6: 29, 7: 35, 8: 40, 9: 46, 10: 52 },
		6 : { 1: 16, 2: 18, 3: 20, 4: 22, 5: 24, 6: 27, 7: 31, 8: 36, 9: 41, 10: 47 },
		7 : { 1: 15, 2: 17, 3: 18, 4: 20, 5: 22, 6: 24, 7: 28, 8: 33, 9: 37, 10: 42 }
	};

	var cost = 0;

	if ( days < 16 )
		cost = costs[1][height];
	else if ( days < 31 )
		cost = costs[2][height];
	else if ( days < 61 )
		cost = costs[3][height];
	else if ( days < 91 )
		cost = costs[4][height];
	else if ( days < 181 )
		cost = costs[5][height];
	else if ( days < 361 )
		cost = costs[6][height];
	else
		cost = costs[7][height];

	var min = 450;

	form.pays.value = Math.max( days * cost, min );
	form.pays_per_day.value = cost;
}

function safecalc1_2( form )
{
	var days = parseInt( form.days.value );
	var height = parseInt( form.height.value );

	if ( isNaN( days ) )
	{
		alert( 'Ошибочный срок аренды!' ); return false;
	}

	var costs = {
		1 : { 1: 54, 2: 65, 3: 75, 4: 85, 5: 95 },
		2 : { 1: 50, 2: 60, 3: 70, 4: 80, 5: 90 },
		3 : { 1: 47, 2: 55, 3: 65, 4: 75, 5: 85 },
		4 : { 1: 44, 2: 50, 3: 60, 4: 70, 5: 80 },
		5 : { 1: 41, 2: 45, 3: 55, 4: 65, 5: 75 },
		6 : { 1: 37, 2: 40, 3: 50, 4: 60, 5: 70 },
		7 : { 1: 33, 2: 36, 3: 45, 4: 55, 5: 65 }
	};

	var cost = 0;

	if ( days < 16 )
		cost = costs[1][height];
	else if ( days < 31 )
		cost = costs[2][height];
	else if ( days < 61 )
		cost = costs[3][height];
	else if ( days < 91 )
		cost = costs[4][height];
	else if ( days < 181 )
		cost = costs[5][height];
	else if ( days < 361 )
		cost = costs[6][height];
	else
		cost = costs[7][height];

	var min = 450;

	form.pays.value = Math.max( days * cost, min );
	form.pays_per_day.value = cost;
}

function safecalc2( form )
{
	var days = parseInt( form.days2.value );
	var height = parseInt( form.height2.value );

	if ( isNaN( days ) )
	{
		alert( 'Ошибочный срок аренды!' ); return false;
	}

	var costs = {
		1 : { 1: 40, 2: 45, 3: 50, 4: 55 },
		2 : { 1: 37, 2: 42, 3: 47, 4: 52 },
		3 : { 1: 35, 2: 40, 3: 45, 4: 50 },
		4 : { 1: 33, 2: 38, 3: 43, 4: 48 },
		5 : { 1: 30, 2: 35, 3: 40, 4: 45 },
		6 : { 1: 27, 2: 32, 3: 37, 4: 42 },
		7 : { 1: 25, 2: 30, 3: 35, 4: 40 }
	};

	var cost = 0;

	if ( days < 16 )
		cost = costs[1][height];
	else if ( days < 31 )
		cost = costs[2][height];
	else if ( days < 61 )
		cost = costs[3][height];
	else if ( days < 91 )
		cost = costs[4][height];
	else if ( days < 181 )
		cost = costs[5][height];
	else if ( days < 361 )
		cost = costs[6][height];
	else
		cost = costs[7][height];

	var min = 350;

	form.pays2.value = Math.max( days * cost, min );
	form.pays_per_day2.value = cost;
}

/////////////////////////////
// Депозитные калькуляторы //
/////////////////////////////

// Вклад "Депозит"
function depcalc1( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	var dv = form.dv.value;

	if ( ( dv == '0' && dp < 1000 ) || ( dv == '1' && dp < 300 ) || ( dv == '2' && dp < 300 ) )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var percents = {
		0 : {
			1 : { 1: 5.25, 2: 5.5, 3: 7.75, 4: 9.75, 5: 11 },
			2 : { 1: 5.75, 2: 6, 3: 8.25, 4: 10, 5: 11.25 },
			3 : { 1: 6, 2: 6.25, 3: 8.5, 4: 10.25, 5: 12 }
		},
		1 : {
			1 : { 1: 2.00, 2: 2.50, 3: 3.25, 4: 4.00, 5: 4.50 },
			2 : { 1: 2.25, 2: 2.75, 3: 3.50, 4: 4.25, 5: 4.75 },
			3 : { 1: 2.50, 2: 3.00, 3: 3.75, 4: 4.50, 5: 5.00 }
		},
		2 : {
			1 : { 1: 2.50, 2: 3.00, 3: 4.00, 4: 4.75, 5: 5.25 },
			2 : { 1: 2.75, 2: 3.25, 3: 4.25, 4: 5.00, 5: 5.50 },
			3 : { 1: 3.00, 2: 3.50, 3: 4.50, 4: 5.25, 5: 5.75 }
		}
	};


	var dt = parseInt( form.dt.value );

	if ( isNaN( dt ) )
	{
		if ( !only_result )
			alert( 'Ошибочный срок депозита!' );
		return false;
	}

	var dtp = ( form.dt.options ) ? form.dt.options[form.dt.selectedIndex].innerHTML : '';

	var di = 0;

	if ( dv == '0' )
	{
		if ( dp < 100000 )
			di = percents[0][1][dt];
		else if ( dp < 1000000 )
			di = percents[0][2][dt];
		else
			di = percents[0][3][dt];
	}
	else if ( dv == '1' )
	{
		if ( dp < 10000 )
			di = percents[1][1][dt];
		else if ( dp < 100000 )
			di = percents[1][2][dt];
		else
			di = percents[1][3][dt];
	}
	else
	{
		if ( dp < 10000 )
			di = percents[2][1][dt];
		else if ( dp < 100000 )
			di = percents[2][2][dt];
		else
			di = percents[2][3][dt];
	}

	switch ( dt )
	{
		case 1: dt = 31; t = 31; n = 1; break;
		case 2: dt = 91; t = 91; n = 1; break;
		case 3: dt = 180; t = 90; n = 2; break;
		case 4: dt = 395; t = 90; n = 5; break;
		case 5: dt = 730; t = 90; n = 8; break;
	}

	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);


	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), dv, dtp ];
}

// Вклад "Пополняемый депозит"
function depcalc2( form, only_result )
{
	var dp = parseInt( form.dp.value );
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	var dv = form.dv.value;

	if ( ( dv == '0' && dp < 1000 ) || ( dv == '1' && dp < 300 ) || ( dv == '2' && dp < 300 ) )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var percents = {
		0 : {
			1 : { 1: 7.5, 2: 9, 3: 10 },
			2 : { 1: 8, 2: 9.5, 3: 10.5 },
			3 : { 1: 8.25, 2: 9.75, 3: 10.75 }
		},
		1 : {
			1 : { 1: 3.10, 2: 3.85, 3: 4.35 },
			2 : { 1: 3.35, 2: 4.10, 3: 4.60 },
			3 : { 1: 3.60, 2: 4.35, 3: 4.85 }
		},
		2 : {
			1 : { 1: 3.85, 2: 4.60, 3: 5.10 },
			2 : { 1: 4.10, 2: 4.85, 3: 5.35 },
			3 : { 1: 4.35, 2: 5.10, 3: 5.60 }
		}
	};

	var dt = parseInt( form.dt.value );

	var dtp = ( form.dt.options ) ? form.dt.options[form.dt.selectedIndex].innerHTML : '';

	if ( isNaN( dt ) )
	{
		if ( !only_result )
			alert( 'Ошибочный срок депозита!' );
		return false;
	}

	var di = 0;

	if ( dv == '0' )
	{
		if ( dp < 100000 )
			di = percents[0][1][dt];
		else if ( dp < 1000000 )
			di = percents[0][2][dt];
		else
			di = percents[0][3][dt];
	}
	else if ( dv == '1' )
	{
		if ( dp < 10000 )
			di = percents[1][1][dt];
		else if ( dp < 100000 )
			di = percents[1][2][dt];
		else
			di = percents[1][3][dt];
	}
	else
	{
		if ( dp < 10000 )
			di = percents[2][1][dt];
		else if ( dp < 100000 )
			di = percents[2][2][dt];
		else
			di = percents[2][3][dt];
	}

	switch ( dt )
	{
		case 1: dt = 180;  t = 90; n = 2; break;
		case 2: dt = 395;  t = 90; n = 5;  break;
		case 3: dt = 730;  t = 90; n = 8; break;
	}

	//var ds = dp * ( 1 + di * dt / 100 / 365 );

	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), dv, dtp ];
}

// Вклад "Особый"
function depcalc3( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	var dv = form.dv.value;

	if ( dv == 0 )
		var dn = parseInt( form.dn.value );
	else
		var dn = parseInt( form.dnv.value );

	if ( isNaN( dn ) )
	{
		if ( !only_result )
			alert( 'Ошибочное неснижаемого остатка!' );
		return false;
	}

	if ( ( dv == '0' && dp < 30000 ) || ( dv == '1' && dp < 1000 ) || ( dv == '2' && dp < 1000 ) )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var percents = {
		0 : {
			30000 : { 1: 6.75, 2: 8.25, 3: 9.25 },
			100000 : { 1: 7.25, 2: 8.75, 3: 9.75 },
			1000000 : { 1: 7.5, 2: 9, 3: 10 },
			3000000 : { 1: -1, 2: 10, 3: 11 },
			50000000 : { 1: -1, 2: 10.25, 3: 11.25 },
			100000000 : { 1: -1, 2: 10.5, 3: 11.5 },
			200000000 : { 1: -1, 2: 11, 3: 11.75 }
		},
		1 : {
			1000 : { 1: 3.00, 2: 3.75, 3: 4.25 },
			10000 : { 1: 3.25, 2: 4.00, 3: 4.50 },
			100000 : { 1: 3.50, 2: 4.25, 3: 4.75 },
			500000 : { 1: -1, 2: 4.60, 3: 5.00},
			1000000 : { 1: -1, 2: 4.75, 3: 5.10 },
			3000000 : { 1: -1, 2: 4.85, 3: 5.25 }

		},
		2 : {
			1000 : { 1: 3.75, 2: 4.50, 3: 5.00 },
			10000 : { 1: 4.00, 2: 4.75, 3: 5.25 },
			100000 : { 1: 4.25, 2: 5.00, 3: 5.50 },
			500000 : { 1: -1, 2: 5.50, 3: 5.85},
			1000000 : { 1: -1, 2: 5.60, 3: 6.00 },
			3000000 : { 1: -1, 2: 5.75, 3: 6.10 }
		}
	};

	var dt = parseInt( form.dt.value );

	var dtp = ( form.dt.options ) ? form.dt.options[form.dt.selectedIndex].innerHTML : '';

	if ( isNaN( dt ) )
	{
		if ( !only_result )
			alert( 'Ошибочный срок депозита!' );
		return false;
	}

	if (dp<dn)
	{
		if (!only_result)
		{
			alert('Сумма вклада меньше неснижаемого остатка');
		}
		return false;
	}


	var di = 0;
	if ( dv == '0' )
		di = percents[0][dn][dt];
	else if ( dv == '1' )
		di = percents[1][dn][dt];
	else
		di = percents[2][dn][dt];

	if ( di == -1 )
	{
		if ( !only_result )
			alert( 'Величина процентной ставки не утверждена для выбранного неснижаемого остатка и срока вклада' );
		return false;
	}
	if ( di == -2 )
	{
		if ( !only_result )
			alert( 'Величина процентной ставки не утверждена для выбранного неснижаемого остатка и срока вклада' );
		return false;
	}

	switch ( dt )
	{
		case 1: dt = 180;  t = 90; n = 2; break;
		case 2: dt = 395;  t = 90; n = 5;  break;
		case 3: dt = 730;  t = 90; n = 8; break;
	}

	//var ds = dp * ( 1 + di * dt / 100 / 365 );


	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), dv, dtp ];
}

// Вклад "Универсальный"
function depcalc4( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	var dv = form.dv.value;

	if ( ( dv == '0' && dp < 10 ) || ( dv == '1' && dp < 5 ) || ( dv == '2' && dp < 5 ) )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var dt = 1825;

	var dtp = '5 лет';

	var di = 0.01;

	var t = 90;
	var n= 20;
	//var ds = dp * ( 1 + di * dt / 100 / 365 );


	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), dv, dtp ];
}

// Вклад "Зарплатный"
function depcalc5( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	if ( dp < 10 )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var dt = 1825;

	var dtp = '5 лет';

	var di = 1;

	var t = 90;
	var n = 20;
	//var ds = dp * ( 1 + di * dt / 100 / 365 );


	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), 0, dtp ];
}

// Вклад "Пенсионный"
function depcalc6( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	if ( dp < 1000 )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var dt = 730;

	var dtp = '2 года';

	var di = 12;

	var t = 90;
	var n= 8;
	//var ds = dp * ( 1 + di * dt / 100 / 365 );

	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), 0, dtp ];
}

// Вклад "Пенсионный +"
function depcalc7( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	if ( dp < 1 )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var dt = 1095;

	var dtp = '3 года';

	var di = 4;

	var t = 90;
	var n= 12;
	//var ds = dp * ( 1 + di * dt / 100 / 365 );

	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), 0, dtp ];
}

// Вклад "Пенсионный пополняемый"
function depcalc8( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	if ( dp < 300 )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var percents = { 1: 6.25, 2: 8, 3: 9.5, 4: 10.5 };

	var dt = parseInt( form.dt.value );

	var dtp = ( form.dt.options ) ? form.dt.options[form.dt.selectedIndex].innerHTML : '';

	if ( isNaN( dt ) )
	{
		if ( !only_result )
			alert( 'Ошибочный срок депозита!' );
		return false;
	}

	var di = percents[dt];

	switch ( dt )
	{
		case 1: dt = 91;  t = 91; n = 1; break;
		case 2: dt = 180; t = 90; n = 2;break;
		case 3: dt = 395; t = 90; n = 5;break;
		case 4: dt = 730; t = 90; n = 8;break;
	}


	//var ds = dp * ( 1 + di * dt / 100 / 365 );


	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), 0, dtp ];
}

// Вклад "До востребования"
function depcalc9( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	var dv = form.dv.value;

	if ( ( dv == '0' && dp < 10 ) || ( dv == '1' && dp < 5 ) || ( dv == '2' && dp < 5 ) || ( dv == '3' && dp < 5 ) )
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var percents = { 0 : 0.01, 1: 0.01, 2: 0.01, 3: 0.01 };

	var dt = parseInt( form.dt.value );

	if ( isNaN( dt ) || dt < 1 )
	{
		if ( !only_result )
			alert( 'Ошибочный срок депозита!' );
		return false;
	}

	var dtp = dt + ' дн.';

	var di = percents[dv];


	//var ds = dp * ( 1 + di * dt / 100 / 365 );

	var t = 90;
	var n = Math.floor(dt / 90);
	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	var ds = dp * Math.pow( 1 + (di * t / 36500), n);

	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), dv, dtp ];
}

// Вклад "Особый"
function depcalc10( form, only_result )
{
	var dp = parseInt( form.dp.value );

	if ( isNaN( dp ) )
	{
		if ( !only_result )
			alert( 'Ошибочное значение первоначального взноса!' );
		return false;
	}

	var dv = form.dv.value;

	if ( dv == 0 )
		var dn = parseInt( form.dn.value );
	else
		var dn = parseInt( form.dnv.value );

//	alert(dn);
	if ( isNaN( dn ) )
	{
		if ( !only_result )
			alert( 'Ошибочное неснижаемого остатка!' );
		return false;
	}

	if ( ( dv == '0' && dp < 30000 ) /*|| ( dv == '1' && dp < 1000 ) || ( dv == '2' && dp < 1000 ) */)
	{
		if ( !only_result )
			alert( 'Значение первоначального взноса меньше допустимого!' );
		return false;
	}

	var percents = {
		0 : {
			1 : { 1: 7.25, 2:  9.75, 3: 10.75 },
			2 : { 1: 7.75, 2: 10.25, 3: 11.25 },
			3 : { 1: 8.00, 2: 10.75, 3: 11.75 },
			4 : { 1: 8.25, 2: 11.25, 3: 12.25 }
		}
/*
		,
		1 : {
			1 : { 1: 5, 2: 5.75, 3: 6 },
			2 : { 1: 5.25, 2: 6, 3: 6.25 },
			3 : { 1: 5.5, 2: 6.25, 3: 6.5 },
			4 : { 1: -1, 2: 6.6, 3: 6.75},
			5 : { 1: -1, 2: 6.75, 3: 6.85 },
			6 : { 1: -1, 2: 6.85, 3: 7 }

		},
		2 : {
			1 : { 1: 4.5, 2: 5.5, 3: 5.75 },
			2 : { 1: 4.75, 2: 5.75, 3: 6 },
			3 : { 1: 5, 2: 6, 3: 6.25 },
			4 : { 1: -1, 2: 6.5, 3: 6.6 },
			5 : { 1: -1, 2: 6.6, 3: 6.75 },
			6 : { 1: -1, 2: 6.75, 3: 6.85 }
		}
*/
		};

	// коэффициенты для вычисления дохода по вкладу, получены опытным путем из присланных правильных ответjd
	var koefs = {
		0 : {
			1: {1: 0.08115, 2: 0.098548, 3: 0.167677},
			2: {1: 0.086965, 2: 0.1335262, 3: 0.1986482},
			3: {1: 0.0898832, 2: 0.1388709, 3: 0.2072271},
			4: {1: 0.0928086, 2: 0.1442377, 3: 0.2158588}
		}
	};

	var dt = parseInt( form.dt.value );

	var dtp = ( form.dt.options ) ? form.dt.options[form.dt.selectedIndex].innerHTML : '';

	if ( isNaN( dt ) )
	{
		if ( !only_result )
			alert( 'Ошибочный срок депозита!' );
		return false;
	}

	var di = 0;

	if ( dv == '0' )
		di = percents[0][dn][dt];
		dk = koefs[0][dn][dt];
/*
		else if ( dv == '1' )
		di = percents[1][dn][dt];
	else
		di = percents[2][dn][dt];
*/
	if ( (di == -1) || (dk == -1))
	{
		if ( !only_result )
			alert( 'Величина процентной ставки не утверждена для выбранного неснижаемого остатка и срока вклада' );
		return false;
	}
	if ( (di == -2) || (dk == -2) )
	{
		if ( !only_result )
			alert( 'Величина процентной ставки не утверждена для выбранного неснижаемого остатка и срока вклада' );
		return false;
	}

/*	switch ( dt )
	{
		case 1: dt = 394;  t = 30; n = 13; break;
		case 2: dt = 545;  t = 30; n = 18;  break;
		case 3: dt = 732;  t = 30; n = 24; break;
	}*/

	//var ds = dp * ( 1 + di * dt / 100 / 365 );


	// Сложный процент (старый)
	//var ds = dp * ( 1 + di * dt / 100 / 365 );
	// с переводом процентов на карту
	//var ds = (di * dp *  dt) / (100 * 365 );
	// начисление процентов на тот же вклад
	//var ds = dp * Math.pow( 1 + (di * t / 36000), n);

	var ds = dp + dp * dk;


	return [ di, dp, Math.round( ds ), Math.round( ds - dp ), dv, dtp ];
}