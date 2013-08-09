$(function(){
  initDateP();
});

function initDateP() {
  $('#dateFrom, #dateTo').datepicker({
      changeMonth: true,
      changeYear: true,
      showOn: 'button',
      regional: 'ru',
      buttonImage: '../../../../../common/img/c.gif',
      buttonImageOnly: true,
      gotoCurrent:true
    });
  $('#dateFrom, #dateTo').datepicker('option', 'dateFormat', 'dd.mm.yy');

  $('#de').val(7);
  var date = new Date();

  date.setDate(date.getDate()+1);
  $('#dateFrom').datepicker('setDate',date);  

  date.setDate(date.getDate()+7);
  $('#dateTo').datepicker('setDate',date);

  $('#calback').parent().css('margin-top', ($('#AutoNumber1').height()-156) + 'px')
}

//=================================================================================
var bonuscalc={
  timeoutInterval: 500,
	closeAlert: function(){
                $('#dialogFormCalc').hide();
              },
	alert: function(text){
            $('#dialogFormCalc').hide();
            $('#dialogFormCalcText').html(text);
            $('#dialogFormCalc').show();
			setTimeout('bonuscalc.closeAlert()', 5000);
          },
		  
	number_format: function ( number, decimals, dec_point, thousands_sep ) {
		var i, j, kw, kd, km, minus = "";
		
		if(number < 0){
			minus = "-";
			number = number*-1;
		}

		// input sanitation & defaults
		if( isNaN(decimals = Math.abs(decimals)) ){
			decimals = 2;
		}
		if( dec_point == undefined ){
			dec_point = ",";
		}
		if( thousands_sep == undefined ){
			thousands_sep = ".";
		}

		i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

		if( (j = i.length) > 3 ){
			j = j % 3;
		} else{
			j = 0;
		}

		km = (j ? i.substr(0, j) + thousands_sep : "");
		kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
		//kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
		kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


		return minus + km + kw + kd;
	},

  validate: function(){
              //check
              if ($('#dp').val()=='') {
                //bonuscalc.alert('Введите целое число в поле Взнос');
                //return {error: 'initial_installment_shoud_be_int'};
				$('#dp').val('0');
              }

              if ($('#de').val()==0 || $('#de').val()=='') {
                bonuscalc.alert('Введите целое число в поле "Срок"');
                return {error: 'days_should_be_int'};
              }
			  
			var re = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
			if ( ($("#dateFrom").val() != '') && (!re.test($("#dateFrom").val())) ) {
				bonuscalc.alert('Введите корректную дату в поле "Дата открытия вклада"');
				return {error: 'incorrect_dateFrom'};				
			}
			if ( ($("#dateTo").val() != '') && (!re.test($("#dateTo").val())) ) {
				bonuscalc.alert('Введите корректную дату в поле "Дата закрытия вклада"');
				return {error: 'incorrect_dateFrom'};				
			}			
			  
			//дата закрытия не может быть раньше даты открытия
			if ( $("#dateFrom").val() && $("#dateTo").val() ) {
				var date_start 	= new Date( $("#dateFrom").val().replace(re, '$3/$2/$1') );
				var date_end	= new Date( $("#dateTo").val().replace(re, '$3/$2/$1') );	
				if ( date_end <= date_start ) {
					bonuscalc.alert('Дата закрытия вклада не должна быть раньше даты открытия');
					return {error: 'dateTo_early_dateFrom'};				
				}
			}
			
			//неснижаемый остаток не может быть меньше первоначального взноса
			if ( $("#neso").val().replace(/\s+/g,'') != '' && $("#neso").val().replace(/\s+/g,'') != 0 && $("#neso").is(':visible') ) {
				if ( ($("#neso").val().replace(/\s+/g,'')*1) > ($("#dp").val().replace(/\s+/g,'')*1) ) {
					bonuscalc.alert('Сумма неснижаемого остатка не может быть больше первоначального взноса');
					return {error: 'minBalanceIncorrect'};				
				}
			}			
			
              return {error: ''};
            },
  //------------------------------------------------------------------------------
  buildRequestParams: function (){
                        return {
                            VERSION: VERSION,
                            REGION_ID: REGION_ID,
                            CURRENCY_ID: $('#dv').val(),
                            GROUP_ID: typeof(CALC_CONTR_TYPE_ID)==='undefined'? '':CALC_CONTR_TYPE_ID,
                            CONTENT_ID:  typeof(CONTENT_ID)!=='undefined'? CONTENT_ID:'',
							COMPARE_PARAM_NAME: typeof(CALC_CONTR_COMPARE_PARAM_NAME)==='undefined'? '':CALC_CONTR_COMPARE_PARAM_NAME,
                            INC: $('#dp').val().replace(/\s+/g,''),  //начальный взнос
                            DAYS: $('#de').val(),
                            MIN_BALANCE: $('#neso').val()==null? '':$('#neso').val().replace(/\s+/g,''),
                            MONTHLY_PAYMENT: $('#dMonthlyPayment').val()==null? '':$('#dMonthlyPayment').val().replace(/\s+/g,''),
                            DATE_FROM: $('#dateFrom').val(),
                            isRenewal: $('#dIsRenewal').val()==null? 'n/a':$('#dIsRenewal').val(),
                            isPartial: $('#dIsPartial').val()==null? 'n/a':$('#dIsPartial').val(),
							isPensioner: $('input[name="isPensioner"]:checked').val()==null? 'no':$('input[name="isPensioner"]:checked').val()
                          };
                      },
  //------------------------------------------------------------------------------
  bindMinBalanceListRefresh: function(idList,addEmpty,callback){
                                if (addEmpty===undefined) {addEmpty=false;}
                                var compareTimerId;

                                var refreshWithTimeout=function(){
                                  if ($('#dn').is(':visible')) {
                                    if (typeof(compareTimerId)!==undefined) {
                                      clearTimeout(compareTimerId);
                                    }
                                    compareTimerId=setTimeout(function(){
                                                                bonuscalc.refreshMinBalanceList(addEmpty, callback)
                                                              }, bonuscalc.timeoutInterval);
                                  } else {
                                    if (callback!==undefined){callback()}
                                  }
                                };

                                $.each(idList,function(index,item){
                                  $('#'+item).bind('change',function(){refreshWithTimeout(addEmpty, callback)});
                                });
                              },
  //------------------------------------------------------------------------------
  refreshMinBalanceList:  function (addEmpty, callback){
                            var params=bonuscalc.buildRequestParams();
                            params.action='MinBalanceList';
                            var preserveValue= $('#dn').val();

                            $.getJSON('../../../../../common/js/get_calc_universalcmp_values.php', params,
                              function (data){
                                if (data.error) alert('error');
                                else {
                                  $('#dn').children().remove();
                                  var options=$('#dn').attr('options');
                                  $.each(data.minBalanceList,function(index,item){
                                    //$('#dn').append(new Option(item,item));
                                    options[options.length]=new Option(item,item);
                                  });
                                  if (addEmpty) {
                                    $('#dn').prepend(new Option('',''));
                                    $('#dn').val('');
                                  }
                                  if (preserveValue!=null) {
                                    $('#dn').val(preserveValue)
                                  }
                                  if (callback!==undefined){callback()}
                                }
                              })
                          }
};

//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
bonuscalc.compare=function(){
  var compareTimerId;
  var performCompareWithTimeout = function () {
    if (typeof(compareTimerId)!==undefined) {
      clearTimeout(compareTimerId);
    }
    compareTimerId=setTimeout(performCompare,bonuscalc.timeoutInterval);
  };

  var performCompare= function () {
                        if (bonuscalc.validate().error!='') return 0;
                        var params= bonuscalc.buildRequestParams();
                        params.action='ComparisonList';
						
						$("#ajax_loader").show();

                        $.getJSON('../../../../../common/js/get_calc_universalcmp_values.php',params,
                                  function(json){
									$("#ajax_loader").hide();
                                    if (json.error!='') {
                                      alert('Error: '+json.error);
                                    } else {									 
                                      showCompareResult(json);
                                    }
                                  });
                        return 0;
                      };

  //------------------------------------------------------------------------------
  
  var showCompareResult = function (json) {
	var currencies = {1:'р.',2:'$',3:'€'};  
                            var emptyTableFlag=true;
                            $('#showAllCalc').show();
                            $('#calcNotFoundMessage').hide();
                            $.each(json.data, function (index,item){
                              if (item.status=='off'){
                                $('#row_'+item.CONTENT_ID).hide();
                              } else {
                                emptyTableFlag=false;
                                if (item.incomeBonus==0) {item.incomeBonus='-';}
                                if (item.effectiveIncome==0) {item.effectiveIncome='-';}
                                $('#row_'+item.CONTENT_ID).show();
								
                                $('#pRate_'+item.CONTENT_ID).html(String(bonuscalc.number_format(item.plainRate, 2, ',', ' ')).replace(/\./g, ',')+'%');
                                $('#base_result_'+item.CONTENT_ID).text(String(item.incomePlainRate).replace(/\./g, ','));
                                $('#bonus_result_'+item.CONTENT_ID).text(String(item.incomeBonus).replace(/\./g, ','));
                                $('#effective_result_'+item.CONTENT_ID).text(String(item.effectiveIncome).replace(/\./g, ','));
								$('#effectiveRate_'+item.CONTENT_ID).html(String(bonuscalc.number_format(item.effectiveRate, 2, ',', ' ')).replace(/\./g, ',')+'%');	
								if ($("#dv").val() == 1) {
									$('#start_balance_'+item.CONTENT_ID).text(String(bonuscalc.number_format(item.start_balance, 0, ',', ' ')).replace(/\./g, ',')+' '+currencies[$("#dv").val()]);
									$('#income_'+item.CONTENT_ID).text(String(bonuscalc.number_format(item.income, 2, ',', ' ')).replace(/\./g, ',')+' '+currencies[$("#dv").val()]);
									$('#all_money_'+item.CONTENT_ID).text(String(bonuscalc.number_format(item.all_money, 2, ',', ' ')).replace(/\./g, ',')+' '+currencies[$("#dv").val()]);
									$('#incomeWithCapitalization_'+item.CONTENT_ID).text(String(bonuscalc.number_format(item.incomeWithCapitalization, 2, ',', ' ')).replace(/\./g, ',')+' '+currencies[$("#dv").val()]);
									$('#all_moneyWithCapitalization_'+item.CONTENT_ID).text(String(bonuscalc.number_format(item.all_moneyWithCapitalization, 2, ',', ' ')).replace(/\./g, ',')+' '+currencies[$("#dv").val()]);				
								} else {
									$('#start_balance_'+item.CONTENT_ID).text(currencies[$("#dv").val()]+String(bonuscalc.number_format(item.start_balance, 0, ',', ' ')).replace(/\./g, ','));
									$('#income_'+item.CONTENT_ID).text(currencies[$("#dv").val()]+String(bonuscalc.number_format(item.income, 2, ',', ' ')).replace(/\./g, ','));
									$('#all_money_'+item.CONTENT_ID).text(currencies[$("#dv").val()]+String(bonuscalc.number_format(item.all_money, 2, ',', ' ')).replace(/\./g, ','));
									$('#incomeWithCapitalization_'+item.CONTENT_ID).text(currencies[$("#dv").val()]+String(bonuscalc.number_format(item.incomeWithCapitalization, 2, ',', ' ')).replace(/\./g, ','));
									$('#all_moneyWithCapitalization_'+item.CONTENT_ID).text(currencies[$("#dv").val()]+String(bonuscalc.number_format(item.all_moneyWithCapitalization, 2, ',', ' ')).replace(/\./g, ','));
								}
								clone = $('#row_'+item.CONTENT_ID).clone();
								$('#row_'+item.CONTENT_ID).remove();
								$(clone).insertAfter(".second_level");
                              }
                            });
                            if(emptyTableFlag) {
                              $('.compare_table').hide();
							  $('.prim').hide();
                              $('#calcNotFoundMessage').show();
                            } else {						
                              $('.compare_table').show();
							  $('.prim').show();
							  $("#compare_table_preview").hide();								  
                            }
                          };
  //------------------------------------------------------------------------------
  var bindCalc = function (idList){
                  $.each(idList,function(index,item){
                    $('#'+item).bind('change',performCompareWithTimeout);
                  });
                 };
  //------------------------------------------------------------------------------
  var bindYNVisibleSwitch = function(master,slave){
    $(master).bind('change', function(){
      if ($(master).val()=='yes'){
        $(slave).show();
      } else {
        $(slave).hide();
      }
    });
  };
  
  //------------------------------------------------------------------------------
  var bindNVisibleSwitch = function(master,slave){
    $(master).bind('change', function(){
      if ($(master).val()=='no'){
        $(slave).hide();
      } else {
        $(slave).show();
      }
    });
  };  
  
  //------------------------------------------------------------------------------
	var bindEndDateChange = function(master) {
		var re = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
		
		$(master).bind( 'change', function() { change_date(master) } );
		
		function addZero(i) {
			return (i < 10)? "0" + i: i;
		}
		
		function IsLeapYear(year) { 
			if(year%4 == 0) { 
				if(year%100 == 0) { 
					if(year%400 == 0) { 
						return true; 
					} 
					else 
						return false; 
				} 
				else 
					return true; 
			} 
			return false; 
		}
		
		function isValidDate(checkDate) {
			
			var date = $(checkDate).val().split('.');	
			
			var day = date[0];
			var month = date[1];
			var year = date[2];
			
			var newDay = parseInt(day);
			var newMonth = month;
			var newYear = year;
						
			
			if (month < 1 || month > 12) {
				 newMonth = 12;
			}
			if (day < 1 || day > 31) {
				newDay = 31;			
			}
			
			if (newDay == 31 && (month == 4 || month == 6 || month == 9 || month == 11)) {
				newDay = 30;
			}	
			 
			if (month == 2 && (newDay == 30 || newDay == 31 || newDay == 29)) {				
				var leap = IsLeapYear(year);
				if (leap) {
					newDay = 29;
				} else {
					newDay = 28;
				}
			}

			$(checkDate).val(addZero(newDay)+'.'+(newMonth)+'.'+newYear);
		}
				
		
		function change_date(master) {
			if ( re.test($("#dateFrom").val()) ) {
				var date = new Date( $("#dateFrom").val().replace(re, '$3/$2/$1') );
				switch (master) {
					case '#de':
						if ( $(master).val() != '' && $(master).val() != 0 ) {							
							date.setDate( date.getDate()+($(master).val()*1) );
							$("#dateTo").datepicker('setDate',date);
						}
					break
					
					case '#dateTo':
						if ( re.test($(master).val()) ) {
							isValidDate(master);
							var dateTo = new Date( $(master).val().replace(re, '$3/$2/$1') );
							var result = round( (dateTo.getTime() - date.getTime()) / (1000*60*60*24) );
							if (result > 0) {
								$("#de").val( result );
							}
						}
					break
					
					case '#dateFrom':		
						if ( re.test($(master).val()) ) {
							isValidDate(master);					
							change_date('#de');
							change_date('#dateTo');
						}
					break					
				}
			}
		}
	}

  //------------------------------------------------------------------------------
  //initial assignments
  $('#dMonthlyPaymentRow').hide();
  //$('#dMinBalanceListRow').hide();
  $('#showAllCalc').hide();
  //привязываем показ-скрытие полей мин. остатка и ежемес. платежей
  //bindYNVisibleSwitch('#dIsPartial','#dMinBalanceListRow');
  bindYNVisibleSwitch('#dIsRenewal','#dMonthlyPaymentRow');
  bindNVisibleSwitch('#dIsPartial','#dMinBalanceListRow');
  
  //обновление даты окончания
  bindEndDateChange('#de');
  bindEndDateChange('#dateTo');
  bindEndDateChange('#dateFrom');

  //привязываем обновление списка мин остатков с таймаутом,
  //после обновления следует расчет таблицы сравнения
  //bonuscalc.bindMinBalanceListRefresh(['dIsPartial','dp','dv'], false, performCompareWithTimeout);

  //привязываем расчет таблицы сравнения с таймутом
  //bindCalc(['de','dateFrom','dateTo','dIsRenewal','dMonthlyPayment','dn']);

  //навешиваем на поля запрет на неразрешенные символы
  keyHandler.protectField('#dp', '^[0-9 ]{0,13}$');
  keyHandler.protectField('#de', '^[0-9]{0,4}$');
  keyHandler.protectField('#neso', '^[0-9 ]{0,13}$');
  keyHandler.protectField('#dMonthlyPayment', '^[0-9 ]{0,13}$');

  $('#btnCompare').click(performCompareWithTimeout);
};

//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
bonuscalc.calc=function(){
  //private methods
  var doCalc=function() {
                var errors={no_prate: 'Для заданных условий нет подходящих ставок',
                            check_failed: 'Для выбранного вклада нельзя использовать неснижаемый остаток или ежемесячный платеж'};
    var v=bonuscalc.validate();
                if (bonuscalc.validate().error!='') return 0;

                var params= bonuscalc.buildRequestParams();
                params.action='Calc';
                if (params.MONTHLY_PAYMENT) params.isRenewal='yes';
                if (params.MIN_BALANCE) params.isPartial='yes';

                $.getJSON('../../../../../common/js/get_calc_universalcmp_values.php',params,
                          function(json){
                            if (json.error!='') {
                              bonuscalc.alert(errors[json.error]);
                            } else {
                              showCalc(json);
                            }
                          });
                return 0;
              };

  var showCalc= function (json) {
                  var currencies = {1:'руб.',2:'USD',3:'EUR',31:'GBP',43:'CHF',
                                    44:'SEK',54:'SGD',72:'NOK',109:'JPY',135:'DKK',148:'CAD',165:'AUD'};
                  var dep_deposit, dep_total;
                  if (json.balanceBonus) {
                    dep_deposit=json.balanceBonus-json.incomeBonus;
                    dep_total=json.balanceBonus
                  } else {
                    dep_deposit=json.balancePlainRate-json.incomePlainRate;
                    dep_total=json.balancePlainRate;
                  }

                  var mark1 = Math.round(dep_deposit * 100 / dep_total);
                  if (json.incomeBonus==0) {json.incomeBonus='-';}
                  if (json.effectiveIncome==0) {json.effectiveIncome='-';}

                  $('#bg1').css('width', mark1 + '%');
                  $('#bg3').css('width', (100 - mark1) + '%');
                  $('#bg1s').text(dep_deposit);
                  $('#bg3s').text(dep_total);
                  $('#bg1g').css('width', mark1 + '%');
                  $('#bg3g').css('width', (100 - mark1) + '%');
                  $('#dep_percent').text(json.plainRate);
                  $('#dep_deposit').text(String(dep_deposit).replace(/\./g, ','));
                  $('#dep_result').text(String(json.incomePlainRate).replace(/\./g, ','));
                  $('#dep_period').text($('#de').val());
                  $('#dep_date_from').text($('#dateFrom').val());

                  $('#dep_date_to').text(json.dateEnd);

                  var currency_text = currencies[$('#dv').val()];
                  if (!currency_text) currency_text= '';

                  $('#val1').text(currency_text);
                  $('#val2').text(currency_text);

                  $('#dep_result_bonus').text(String(json.incomeBonus).replace(/\./g, ','));
                  $('#dep_effective_income').text(String(json.effectiveIncome).replace(/\./g, ','));

                    $('#calform2').fadeOut('slow');
                    $('#calforma2').css('display', 'none');
                    $('#calres').css('display', 'block');
                    $('#calresult').fadeIn('slow');
                };
  //init calc
  bonuscalc.bindMinBalanceListRefresh(['dp','dv'], true);
  if ($('#dn').is(':visible')) { bonuscalc.refreshMinBalanceList(true)};

  //навешиваем на поля запрет на неразрешенные символы
  keyHandler.protectField('#dp', '^[0-9 ]{0,13}$');  
  keyHandler.protectField('#de', '^[0-9 ]{0,4}$');
  keyHandler.protectField('#neso', '^[0-9]{0,13}$');
  keyHandler.protectField('#dMonthlyPayment', '^[0-9 ]{0,13}$');
  
  $('#btnCalc').click(doCalc);
};

//========================================================================================
//              Защита поля от ввода неверных значений
//========================================================================================
var keyHandler={};

keyHandler.protectField = function(fieldID,regexp){
  if ($(fieldID).length===0) return; //element not found
  var keyUp = function(e){return keyHandler.up(e, regexp)};
  var keyDown = function(e){return keyHandler.down(e, regexp)};
  var field=$(fieldID);
  field.keydown(keyDown).keyup(keyUp).change(keyUp).attr('prev', field.val());
};

keyHandler.down = function (e, regxpMask){
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
      //стрелки и backspace
      return true;
    } else {
      if(code > 95 && code < 106){
        //цифры на keypad при включенном NumLock
        code -= 48;
      }
      symbol = String.fromCharCode(code);
    }


    if(/[0-9\,\.]/.test(symbol)){
      if (document.selection){ // IE Support to find the caret position
        target.focus();
        var select = document.selection.createRange();
        selectLength = document.selection.createRange().text.length;
        select.moveStart ('character', - target.value.length);
        caretPos = (select.text.length - selectLength) * 1;
      }
      else if (target.selectionStart || target.selectionStart == '0'){ // Firefox support  to find the caret position
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
        }
      }
    } else if(!((e.ctrlKey) && (code == 67 || code == 86 || code == 88))){
      //ctrl-c, ctrl-v, ctrl-x
      return false;
    }
    return true;
  };

keyHandler.up= function (e, regxpMask){
	var target = $(e.target)[0];
	var str = $(target).val();
	if(str.length > 0){
		var pattern = new RegExp(regxpMask);
		if(!(pattern.test(str))){
			$(target).val($(target).attr('prev'));
		} else {
			$(target).attr('prev', str);
		}
	}
};

