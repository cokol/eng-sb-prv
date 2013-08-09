var compensation = {
	'currentYear': 2010
	, 'compensationCoefficients': {'default': 1, '1991': '-', '1992': 0.6, '1993': 0.7, '1994': 0.8, '1995': 0.9}
	, 'compensationYears': ['default', '1991', '1992', '1993', '1994', '1995']
	, 'init': function(){
		compensation.currentYear = new Date().getFullYear();
		var year = 1996;
		while(year <= compensation.currentYear){
			compensation.compensationCoefficients[year] = 1;
			compensation.compensationYears[compensation.compensationYears.length] = year;
			year++;
		};
	}
	, 'initYearSelect': function (){
		var value;
		var html = '';
		var yearsCount = compensation.compensationYears.length;
		for(var i = 0; i < yearsCount; i++){
			value = compensation.compensationYears[i];
			if(value == 'default'){
				value = 'Действующий';
			}
			html += '<option value="' + i + '">' + value + '</option>';
		};
		$('#closingYear').html(html);
	}
	, 'closeAlert': function(){
		$('#dialogForm').hide();
	}
	, 'alert': function(text){
		$('#dialogForm').hide();
		$('#dialogFormText').html(text);
		$('#dialogForm').show();
	}
	, 'getDebtBallance': function(){
		try{
			var debtBallance = compensation.toFloat($('#debtBallance').val());
			return debtBallance;
		} catch(e){
			return false;
		};
	}
	, 'toFloat': function(value){
		return parseFloat(value.replace(',', '.'));
	}
	, 'floatToFixed': function (value, fix){
		if(!isNaN(parseInt(fix)) && (parseInt(fix) >= 0)){
			fix = parseInt(fix);
			value = value + '';
			var pos = value.indexOf('.');
			if(pos > 0){
				value = value.replace('.', '');
				var val = 0;
				var result = '';
				if(parseInt(value.charAt(pos + fix)) > 4){
					val = parseInt(value.charAt(pos + fix - 1)) + 1;
					value = value.substring(0, pos + fix - 1) + val;
				};
				if(fix == 0){
					result = value.substring(0, pos);
				} else {
					result = value.substring(0, pos) + '.' + value.substring(pos, pos + fix);
				};
				return result;
			} else {
				return value;
			}
/*
			if(result.charAt(0) == '.' || result.charAt(0) == ','){
				result = '0' + result;
			};
			alert(result);
*/
		} else {
			return false;
		};
	}
	, 'getCompensationYear': function(){
		try{
			var yearIndex = parseInt($('#closingYear').val());
			var coeff = compensation.compensationYears[yearIndex];
			return coeff;
		} catch(e){
			return false;
		};
	}
	, 'getCompensationCoefficient': function(){
		try{
			var coeff = compensation.compensationCoefficients[compensation.getCompensationYear()];
			return coeff;
		} catch(e){
			return false;
		};
	}
	, 'getMultiplyCoefficient': function(){
		if(parseInt($('#birthDate').val()) < 1946){
			return 3;
		}else{
			return 2;
		};
	}
	, 'getCompensationSumm': function(index){
		var compensationSumm = compensation.toFloat($('#compensationSumm' + index).val());
		if(isNaN(compensationSumm)){
			compensationSumm = 0;
		}
		return compensationSumm;
	}
	, 'getFullCompensationSumm': function(){
		var compensationSumm = compensation.getCompensationSumm(1)
			+ compensation.getCompensationSumm(2)
			+ compensation.getCompensationSumm(3)
			+ compensation.getCompensationSumm(4);
		return compensationSumm;
	}
	, 'getFullCompensation': function(){
		return compensation.floatToFixed(compensation.getDebtBallance() * compensation.getCompensationCoefficient(),2)
				* compensation.getMultiplyCoefficient();
	}
	, 'valid': function(){
		if(isNaN(compensation.toFloat($('#debtBallance').val())) || ($('#debtBallance').val().length == 0) || (compensation.toFloat($('#debtBallance').val()) <= 0)){
			compensation.alert('Значение остатка должно быть числом больше нуля.');
			$('#debtBallance').focus();
			return false;
		};
		if(compensation.toFloat($('#debtBallance').val()) > 1000000){
			compensation.alert('Значение остатка не может быть больше 1000000.');
			$('#debtBallance').focus();
			return false;
		};
		if($('#closingYear').val() == 1){
			compensation.alert('В соответствии с <a target="_blank" href="../../../../../../government.ru/gov/results/8822/default.htm">постановлением  Правительства РФ № 1092 от 25.12.2009</a> по вкладам, закрытым в 1991 году 2-кратная или 3-кратная компенсации не выплачиваются.');
			$('#closingYear').focus();
			return false;
		};
		if($('#birthDate').val().length == 0){
			compensation.alert('Введите год рождения вкладчика.');
			return false;
		}
		if(isNaN(parseInt($('#birthDate').val()))){
			compensation.alert('Вы указали некорректный год рождения.');
			return false;
		}
		if((parseInt($('#birthDate').val()) < 1900) || (parseInt($('#birthDate').val()) > 1991)){
			if((parseInt($('#birthDate').val()) <= compensation.currentYear) && (parseInt($('#birthDate').val()) > 1991)){
				compensation.alert('В соответствии с <a target="_blank" href="../../../../../../government.ru/gov/results/8822/default.htm">постановлением  Правительства РФ № 1092 от 25.12.2009</a> право на получение 2-кратной или 3-кратной компенсаций предоставлено гражданам Российской Федерации по 1991 год рождения включительно.');
			} else {
				compensation.alert('Неверно указан год рождения вкладчика. Допустимое значение с 1900 по 1991.');
			};
			return false;
		};
		if(compensation.toFloat($('#compensationSumm1').val()) < 0){
			compensation.alert('Значение компенсационной суммы должно быть положительным числом.');
			$('#compensationSumm1').focus();
			return false;
		};
		if(compensation.toFloat($('#compensationSumm2').val()) < 0){
			compensation.alert('Значение компенсационной суммы должно быть положительным числом.');
			$('#compensationSumm2').focus();
			return false;
		};
		if(compensation.toFloat($('#compensationSumm3').val()) < 0){
			compensation.alert('Значение компенсационной суммы должно быть положительным числом.');
			$('#compensationSumm3').focus();
			return false;
		};
		if(compensation.toFloat($('#compensationSumm4').val()) < 0){
			compensation.alert('Значение компенсационной суммы должно быть положительным числом.');
			$('#compensationSumm4').focus();
			return false;
		};
		if(compensation.getFullCompensationSumm() > 1000000){
			compensation.alert('Значение компенсационной суммы не может быть больше 1000000.');
			return false;
		};
		if((compensation.getFullCompensation() - compensation.getFullCompensationSumm()) <= 0){
			compensation.alert('В текущем году компенсация не полагается.');
			return false;
		}
		return true;
	}
	, 'viewForm': function(){
		$('#calres').hide();
		$('#calforma2').show();
	}
	, 'viewResult': function(){
		this.viewForm();
	}
	, 'calculate': function(){
		if(compensation.valid()){
			var fullCompensation = compensation.getFullCompensation();
			var compensationSumm = compensation.getFullCompensationSumm();
			var compensationSummPer = compensation.floatToFixed(compensationSumm / fullCompensation * 100, 0);
			var compensationToPayment = fullCompensation - compensationSumm;
			var compensationCoefficient = compensation.getCompensationCoefficient();
			var multiplyCoefficient = compensation.getMultiplyCoefficient();
			$('#bg1s').html(compensation.floatToFixed(compensationSumm, 2));
			$('#bg3s').html(compensation.floatToFixed(fullCompensation,2));
			$('#compensation_coefficient').html(compensation.floatToFixed(compensationCoefficient,1));
			$('#multiply_coefficient').html(multiplyCoefficient);
			$('#multy1').html(multiplyCoefficient);
			$('#multy2').html(multiplyCoefficient);
			$('#full_compensation').html(compensation.floatToFixed(fullCompensation,2));
			$('#compensation_to_payment').html(compensation.floatToFixed(compensationToPayment, 2));
			$('#calcMore').html(
				'((' + compensation.floatToFixed(compensation.getDebtBallance(),2) + ' <span class="rub">руб.</span> * ' + compensationCoefficient
				+ ') * ' + multiplyCoefficient + ')'
				+ (compensation.getCompensationSumm(1)?' - ' + compensation.floatToFixed(compensation.getCompensationSumm(1),2) + ' <span class="rub">руб.</span>':'')
				+ (compensation.getCompensationSumm(2)?' - ' + compensation.floatToFixed(compensation.getCompensationSumm(2),2) + ' <span class="rub">руб.</span>':'')
				+ (compensation.getCompensationSumm(3)?' - ' + compensation.floatToFixed(compensation.getCompensationSumm(3),2) + ' <span class="rub">руб.</span>':'')
				+ (compensation.getCompensationSumm(4)?' - ' + compensation.floatToFixed(compensation.getCompensationSumm(4),2) + ' <span class="rub">руб.</span>':'')
				+ ' = ' + compensation.floatToFixed(compensationToPayment,2) + ' <span class="rub">руб.</span>'
			);
			if ($.browser.msie) {
				$('#calforma2').hide();
				$('#calres').show();
			} else {
				$('#calforma2').fadeOut(300, function(){
					$('#calres').fadeIn(300);
				});
			}
		}
	}
}
function keyDownHandler(e, regxpMask){
	var target = $(e.target)[0];
	var str = $(target).val();
	var readyStr;
	var code = 0;

	if (e.keyCode) { // IE
		code = e.keyCode;
	} else if (e.which) { // FF & O
		code = e.which;
	}

	var symbol = '';
	if(code == 110 || code == 190 || code == 191){
		symbol = '.';
	} else if(code == 188 || (e.shiftKey && code == 191)){
		symbol = ',';
	} else if(code == 8 || code == 9 || code == 35 || code == 36 || code == 37 || code == 39 || code == 46){
		return;
	} else {
		if(code > 95 && code < 106){
			code -= 48;
		};
		symbol = String.fromCharCode(code);
	};


	if(/[0-9\,\.]/.test(symbol)){
		if (document.selection){ // IE Support to find the caret position
			target.focus();
			var select = document.selection.createRange();
			selectLength = document.selection.createRange().text.length;
			select.moveStart ('character', - target.value.length);
			caretPos = (select.text.length - selectLength) * 1;
		} else if (target.selectionStart || target.selectionStart == '0'){ // Firefox support  to find the caret position
			selectLength = target.selectionEnd * 1 - target.selectionStart * 1;
			caretPos = target.selectionStart * 1;
		} // end caret position
		var leftPart = str.substr(0, caretPos);
		var rightPart = str.substr((caretPos + selectLength), (str.length - caretPos));
		readyStr = leftPart + symbol + rightPart;
		$(target).attr('prev', readyStr);
		if(readyStr.length > 0){
			var pattern = new RegExp(regxpMask);
			if(!(pattern.test(readyStr))){
				return false;
			};
		}
	} else if(!((e.ctrlKey) && (code == 67 || code == 86 || code == 88))){
		return false;
	};
	
};
function keyUpHandler(e, regxpMask){
	var target = $(e.target)[0];
	var str = $(target).val();
	if(str.length > 0){
		var pattern = new RegExp(regxpMask);
		if(!(pattern.test(str))){
			$(target).val($(target).attr('prev'));
		} else {
			$(target).attr('prev', str);
		};
	}
	
};

function init_control_element(id, keyDownHandler, keyUpHandler){
	var jqID = '#' + id;
	$(jqID).keydown(keyDownHandler);
	$(jqID).keyup(keyUpHandler);
	$(jqID).change(keyUpHandler);
	$(jqID).attr('prev', $(jqID).val());
}

$(document).ready(function (){
	var compensationSummKeyDown = function(e){
		return keyDownHandler(e, '^[0-9]{0,6}([.,]([0-9]{0,2})?)?$');
	};
	var compensationSummKeyUp = function(e){
		keyUpHandler(e, '^[0-9]{0,6}([.,]([0-9]{0,2})?)?$');
	};
	var birthDateKeyDown = function(e){
		return keyDownHandler(e, '^[12][0-9]{0,3}$');
	};
	var birthDateKeyUp = function(e){
		keyUpHandler(e, '^[12][0-9]{0,3}$');
	};
	var debtBallanceKeyDown = function(e){
		return keyDownHandler(e, '^[0-9]{0,6}([.,]([0-9]{0,2})?)?$');
	};
	var debtBallanceKeyUp = function(e){
		keyUpHandler(e, '^[0-9]{0,6}([.,]([0-9]{0,2})?)?$');
	};
	
	compensation.init();
	compensation.initYearSelect();

	init_control_element('birthDate', birthDateKeyDown, birthDateKeyUp);
	init_control_element('debtBallance', debtBallanceKeyDown, debtBallanceKeyUp);
	init_control_element('compensationSumm1', compensationSummKeyDown, compensationSummKeyUp);
	init_control_element('compensationSumm2', compensationSummKeyDown, compensationSummKeyUp);
	init_control_element('compensationSumm3', compensationSummKeyDown, compensationSummKeyUp);
	init_control_element('compensationSumm4', compensationSummKeyDown, compensationSummKeyUp);
});