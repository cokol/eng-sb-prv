function calculateDepositIncome(deposit, currency, fromDate, days, addParams, succeeded, failed) {
	var params = {
		CONTENT_ID: window.CONTENT_ID,
		VERSION: window.VERSION,
		REGION_ID: window.REGION_ID,
		INC: deposit,
		CURRENCY_ID: currency,
		MONTHS: 0,
		DATE: fromDate,
		DAYS: days
	};
	for (var i in addParams) params[i] = addParams[i];
	$.getJSON('../../../../../common/js/get_calc_values_ajax.php', params, function(json) {
		if (json.error)
			failed(json.error);
		else {
			var income = json.result[0] != null ? json.result[0] : json.result;
			income = addZeroesToPrecision(roundToPrecision(income, 2), 2);
			if (isArray(json.pRate))
				var rate = (json.pRate.length == 1) ? json.pRate[0] : json.pRate[0] + '-' + json.pRate[json.pRate.length - 1];
			else {
				var rate = new String(json.pRate);
				if (rate.indexOf(',') > 0) {
					rate = rate.split(',');
					rate = rate[0] + '-' + rate[rate.length-1];
				}
			}
			rate.replace('.', ',');
			succeeded(income, rate, json.xDate);
		}
	});
}

function calculateIt() {
	var addParams = {};
	// начальная сумма вклада
	var deposit = $('#dp').val();
	if (!(/^\d+$/.test(deposit))) {
		alert('Введите целое число в поле Взнос');
		return 0;
	}

	// валюта
	var currency = $('#dv').val();
	// неснижаемый остаток
	if (currency == 1) { // рубли
		var min = $('#dn').val();
		if (min)
			addParams.MIN_BALANCE = min;
	}
	else {
		var min = $('#dnv').val();
		if (min)
			addParams.MIN_BALANCE = min;
	}
	if (min && parseInt(min) > parseInt(deposit)) {
		alert('Сумма вклада не может быть меньше неснижаемого остатка');
		return;
	}

	var days = $('#de').val();
	calculateDepositIncome(deposit, currency, $('#dateFrom').val(), days, addParams,
		function (income, rate, toDate) { // succeeded
			var dohod = addZeroesToPrecision(roundToPrecision(income - deposit, 2), 2);
			var period = days + ' дней';
			show_deposit_result([rate, deposit, income, dohod, currency, period, toDate])
		},
		function (error) { // failed
			var errorText = '';
			for (var i = 0; i < error.length; i++) {
				if (i > 0) errorText += '\r\n';
				switch (error[i]['kod']) {
					case 'no_duration':
						errorText += 'Нет подходящего срока предоставления депозита';
						break;
					case 'no_prate':
						errorText += 'Для введенных данных не найдена процентная ставка';
						break;
					default :
						errorText += 'Не удалось рассчитать значение депозита';
				}
				if (error[i]['msg'])
					errorText += json.error[i]['msg'];
			}
			if (errorText) alert(errorText); else alert('Неизвестная ошибка');
		});
}

function roundToPrecision(inputNum, desiredPrecision){
	var precisionGuide = Math.pow(10, desiredPrecision);
	return Math.round(inputNum * precisionGuide) / precisionGuide;
}

function addZeroesToPrecision(inputNum, desiredPrecision){
	return parseFloat(inputNum).toPrecision((parseInt(inputNum)+'').length + desiredPrecision);
}

function show_deposit_result(result) {
	var div_calc = document.getElementById('div_calc');
	if (result[3] > 0) {
		// Ставка депозита
		var dep_percent = result[0];
		dep_percent = String(dep_percent).replace(/\./g,",");
		// Сумма депозита
		var dep_deposit = result[1];
		// Сумма к выдаче
		var dep_total = result[2];
		// Сумма начисленных процентов
		var dep_result = result[3];
		// Валюта депозита
		var dep_currency = result[4];
		// Срок депозита
		var dep_period = result[5];
		var dep_date_from = $('#dateFrom').val();
		// Дата выдачи
		var dep_date_to = result[6];
		var mark1 = Math.round(dep_deposit * 100 / dep_total);

		$('#bg1').css('width', mark1 + '%');
		$('#bg3').css('width', (100 - mark1) + '%');
		$('#bg1s').text(dep_deposit);
		$('#bg3s').text(dep_total);
		$('#bg1g').css('width', mark1 + '%');
		$('#bg3g').css('width', (100 - mark1) + '%');

		$('#dep_percent').text(dep_percent);
		$('#dep_deposit').text(String(dep_deposit).replace(/\./g, ','));
		$('#dep_result').text(String(dep_result).replace(/\./g, ','));
		$('#dep_period').text(dep_period);
		$('#dep_date_from').text(dep_date_from);
		$('#dep_date_to').text(dep_date_to);

		var currencies = {1:'руб.',2:'USD',3:'EUR',31:'GBP',43:'CHF',44:'SEK',54:'SGD',72:'NOK',109:'JPY',135:'DKK',148:'CAD',165:'AUD'};
		var val_text = currencies[dep_currency];
		if (!val_text) val_text = '';

		$('#val1').text(val_text);
		$('#val2').text(val_text);
		$('#calform2').fadeOut('slow');
		$('#calforma2').css('display', 'none');
		$('#calres').css('display', 'block');
		$('#calresult').fadeIn('slow');
	}
	else
		alert('Произошла ошибка при расчете');
}

function init_calc(){
	$("#calm_dep2").click(calculateIt);
	$("#calback").click(function() {
		$("#calresult").fadeOut("slow");
		$("#calres").css("display", "none");
		$("#calforma2").css("display", "block");
		$("#calform2").fadeIn("slow");
	});
}

function compare_deposit(){
	var de = $('#dt').val();
	var fromDate = new Date();
	//начальная сумма вклада
	var s = $('#dp').val();
	//валюта
	var cur = $('#dv').val();
//    console.log(dt, s, cur);
	var params = {
		CONTENT_ID: 0,
		VERSION: VERSION,
		REGION_ID: REGION_ID,
		INC: s,
		CURRENCY_ID: cur,
		MONTHS: 0,
		DATE: new Date(),
		DAYS: de
	};
	if (cur == 1) {
		var min = $('#dn').val();
		if (min)
			params.MIN_BALANCE = min;
	}
	else {
		var min = $('#dnv').val();
		if (min)
			params.MIN_BALANCE = min;
	}
	$.getJSON('../../../../../common/js/get_calc_values_ajax.php', params, function(json){fillCompareResults(json)});
}

// return true if it is an Array
function isArray(it) {
	return it instanceof Array || typeof it == 'array';
}

function fillCompareResults(r) {
	$('.prates').text('');
	$('.results').text('');
	for (var i = 0; i < r.length; i++) {
		if (r[i].CONTENT_ID && !r[i].error) {
			var item = r[i];
			if (isArray(item.pRate))
				var rate = item.pRate.length == 1 ? item.pRate[0] : item.pRate[0] + '-' + item.pRate[item.pRate.length - 1];
			else {
				var rate = new String(item.pRate);
				if (rate.indexOf(',') > 0) {
					rate = rate.split(',');
					rate = rate[0] + '-' + rate[pRate.length-1];
				}
			}
			rate.replace('.', ',');
			if (isArray(item.result)) {
				var result = (item.result.length == 1) ? Math.round(item.result[0]) - $('#dp').val() : (Math.round(item.result[0]) - $('#dp').val()) + '-' + (Math.round(item.result[item.result.length - 1]) - $('#dp').val());
			}
			else
				var result = Math.round(item.result) - $('#dp').val();

			rate = String(rate).replace(/\./g, ',');
			$('#pRate_' + item.CONTENT_ID).text(rate);
			$('#result_' + item.CONTENT_ID).text(result);
		}
	}
}

setTimeout('init_calc()', 1000);