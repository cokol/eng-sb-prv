$(function(){
  initDateP();
  initDefaultVal();
});

function initDateP() {
  $('#dateFrom, #CloseAheadTime').datepicker({
      changeMonth: true,
      changeYear: true,
      showOn: 'button',
      regional: 'ru',
      buttonImage: '../../../../../../common/img/c.gif',
      buttonImageOnly: true,
      gotoCurrent:true
    });
  $('#dateFrom, #dateTo, #CloseAheadTime').datepicker('option', 'dateFormat', 'dd.mm.yy');

  var date = new Date();
  
  //if ( !($("#dateTo").hasAttr('disabled')) ) {
  //alert('123');
	  $('#dateTo').not(':disabled').datepicker({
		  changeMonth: true,
		  changeYear: true,
		  showOn: 'button',
		  regional: 'ru',
		  buttonImage: '../../../../../../common/img/c.gif',
		  buttonImageOnly: true,
		  gotoCurrent:true
		});
	  $('#dateTo').not(':disabled').datepicker('option', 'dateFormat', 'dd.mm.yy');  
 // }

  date.setDate(date.getDate()+1);
  $('#dateFrom').datepicker('setDate',date);  

  //date.setDate(date.getDate()+7);
  //$('#dateTo').datepicker('setDate',date);

  $('#calback').parent().css('margin-top', ($('#AutoNumber1').height()-156) + 'px')
}

$.fn.unwrap = function() {
  this.parent(':not(select)')
    .each(function(){
      $(this).replaceWith( this.childNodes );
    });

  return this;
}; 

function initDefaultVal() {
	if ( $("#dv").val() > 0 ) {
		$(".minBalanceCurrency").wrap('<span></span>');
		className = ".minBalanceCurrency_"+String($("#dv").val())
		$(className).unwrap();
		$("#minBalance").val($(className+":first").val());
	} else {
		$("#TR_minBalance").hide();
	}
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
			if ( !re.test($("#dateFrom").val()) ) {
				bonuscalc.alert('Введите корректную дату в поле "Дата открытия вклада"');
				return {error: 'incorrect_dateFrom'};				
			}
			if ( ($("#dateTo").val() != '') && (!re.test($("#dateTo").val())) ) {
				bonuscalc.alert('Введите корректную дату в поле "Дата закрытия вклада"');
				return {error: 'incorrect_dateFrom'};				
			}
			if ( ((!re.test($("#CloseAheadTime").val())) && $("#CloseAheadTime").is(":visible") ) ) {
				bonuscalc.alert('Введите корректную дату в поле "Дата досрочного закрытия вклада"');
				return {error: 'incorrect_CloseAheadTime'};				
			}
			  
			//дата закрытия не может быть раньше даты открытия; дата досрочного закрытия должна быть в промежутке между ними
			if ( $("#dateFrom").val() && $("#dateTo").val() ) {
				var date_start 	= new Date( $("#dateFrom").val().replace(re, '$3/$2/$1') );
				var date_end	= new Date( $("#dateTo").val().replace(re, '$3/$2/$1') );				
				if ( date_end <= date_start ) {
					bonuscalc.alert('Дата закрытия вклада не должна быть раньше даты открытия вклада');
					return {error: 'dateTo_early_dateFrom'};				
				}
				if ( $("#CloseAheadTime").is(":visible") ) {
					var date_close	= new Date( $("#CloseAheadTime").val().replace(re, '$3/$2/$1') );
					if (date_close<=date_start || date_close>=date_end) {
						bonuscalc.alert('Дата досрочного закрытия вклада не должна быть раньше даты открытия и позже закрытия вклада');
						return {error: 'CloseAheadTimeError'};						
					}
				}
			}
			
			if ($("#dv").val() == 1) {
				if (parseInt($("#dp").val().replace(/\s+/g,'')) < FIRST_CONTRIB_1) {
					bonuscalc.alert('Минимальная сумма первоначального взноса для выбранной валюты: '+FIRST_CONTRIB_1);
					return {error: 'firstContribIncorrect'};					
				}
				if ( $("#RenewalPayment").is(":visible") && parseInt($("#RenewalPayment").val().replace(/\s+/g,'')) < RENEWAL_1 ) {
					bonuscalc.alert('Минимальная сумма пополнения для выбранной валюты: '+RENEWAL_1);
					return {error: 'renewalSumIncorrect'};				
				}				
			}
			if ($("#dv").val() == 2) {
				if (parseInt($("#dp").val().replace(/\s+/g,'')) < FIRST_CONTRIB_2) {
					bonuscalc.alert('Минимальная сумма первоначального взноса для выбранной валюты: '+FIRST_CONTRIB_2);
					return {error: 'firstContribIncorrect'};					
				}
				if ( $("#RenewalPayment").is(":visible") && parseInt($("#RenewalPayment").val().replace(/\s+/g,'')) < RENEWAL_2 ) {
					bonuscalc.alert('Минимальная сумма пополнения для выбранной валюты: '+RENEWAL_2);
					return {error: 'renewalSumIncorrect'};				
				}								
			}
			if ($("#dv").val() == 3) {
				if (parseInt($("#dp").val().replace(/\s+/g,'')) < FIRST_CONTRIB_3) {
					bonuscalc.alert('Минимальная сумма первоначального взноса для выбранной валюты: '+FIRST_CONTRIB_3);
					return {error: 'firstContribIncorrect'};					
				}
				if ( $("#RenewalPayment").is(":visible") && parseInt($("#RenewalPayment").val().replace(/\s+/g,'')) < RENEWAL_3 ) {
					bonuscalc.alert('Минимальная сумма пополнения для выбранной валюты: '+RENEWAL_3);
					return {error: 'renewalSumIncorrect'};				
				}								
			}
			
			if ( $("#minBalance").is(":visible") && parseInt($("#minBalance").val()) > parseInt($("#dp").val().replace(/\s+/g,'')) ) {
				bonuscalc.alert('Сумма неснижаемого остатка не может быть больше первоначального взноса');
				return {error: 'minBalanceIncorrect'};				
			}
			
			if ( $("#RenewalPayment").is(":visible") && (parseInt($("#RenewalPayment").val().replace(/\s+/g,'')) <= 0 || $("#RenewalPayment").val() == '' ) ) {
				bonuscalc.alert('Введите корректное число в поле "Сумма дополнительных взносов"');
				return {error: 'RenewalPaymentIncorrect'};				
			}		
			if ( $("#PartialPayment").is(":visible") && (parseInt($("#PartialPayment").val().replace(/\s+/g,'')) <= 0 || $("#PartialPayment").val() == '' ) ) {
				bonuscalc.alert('Введите корректное число в поле "Сумма частичного снятия"');
				return {error: 'PartialPaymentIncorrect'};				
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
                            INC: $('#dp').val().replace(/\s+/g,''),  //начальный взнос
                            DAYS: $('#de').val(),
							
                            MIN_BALANCE: $('#minBalance').val()==null? '':$('#minBalance').val().replace(/\s+/g,''),
							
							ISCLOSE_AHEAD: $('input[name="isCloseAheadTime"]:checked').val()==null? '':$('input[name="isCloseAheadTime"]:checked').val(),
							CLOSE_AHEAD_TIME: $('#CloseAheadTime').val()==null? '':$('#CloseAheadTime').val(),
							
							REGULARITY_PAYMENT: $('#isRenewalRegular').val()==null? '':$('#isRenewalRegular').val(),
                            MONTHLY_PAYMENT: $('#RenewalPayment').val()==null? '':$('#RenewalPayment').val().replace(/\s+/g,''),
							DATE_PAYMENT: $('#RenewalDate').val()==null? '':$('#RenewalDate').val(),
							PERIOD_PAYMENT: $('#RenewalPeriod').val()==null? '':$('#RenewalPeriod').val(),
							
							REGULARITY_PARTIAL: $('#isPartialRegular').val()==null? '':$('#isPartialRegular').val(),
                            MONTHLY_PARTIAL: $('#PartialPayment').val()==null? '':$('#PartialPayment').val().replace(/\s+/g,''),
							DATE_PARTIAL: $('#PartialDate').val()==null? '':$('#PartialDate').val(),
							PERIOD_PARTIAL: $('#PartialPeriod').val()==null? '':$('#PartialPeriod').val(),	

							CAPITALIZATION: $("input[name='isCapitalization']:checked").val()==null? 'no':$("input[name='isCapitalization']:checked").val(),
							
                            DATE_FROM: $('#dateFrom').val(),
							
							isRenewal: 'n/a',
							isPartial: 'n/a',
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

                            $.getJSON('../../../../../../common/js/get_calc_universalcmp_values.php', params,
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
  var errors={no_prate: 'Для заданных условий нет подходящих ставок',
			  invalid_data: 'Для заданных условий нет подходящих ставок',
			  incorrectSourceDataException: 'Некорректность расходных операций. Проверьте введенные данные'};  
  var performCompareWithTimeout = function () {
    if (typeof(compareTimerId)!==undefined) {
      clearTimeout(compareTimerId);
    }
    compareTimerId=setTimeout(performCompare,bonuscalc.timeoutInterval);
  };

  var performCompare= function () {
                        if (bonuscalc.validate().error!='') return 0;
                        var params= bonuscalc.buildRequestParams();
                        params.action='Calc';
						
						$("#ajax_loader").show();

                        $.getJSON('../../../../../../common/js/get_calc_universalcmp_values.php',params,
                                  function(json){
									$("#ajax_loader").hide();
                                    if (json.error!='') {
                                      bonuscalc.alert(errors[json.error]);
                                    } else {
                                      showCompareResult(json);
                                    }
                                  });
                        return 0;
                      };

  //------------------------------------------------------------------------------
  var showCompareResult = function (json) {
	var currencies = {1:'руб.',2:'USD',3:'EUR',31:'GBP',43:'CHF',
                                    44:'SEK',54:'SGD',72:'NOK',109:'JPY',135:'DKK',148:'CAD',165:'AUD'};
                            if (json.status=='off'){

							} else {
								$('#result_dp').text(String(bonuscalc.number_format(json.start_balance, 2, ',', ' ')).replace(/\./g, ','));
								$('#result_renewal').text(String(bonuscalc.number_format(json.currentPaymentSum, 2, ',', ' ')).replace(/\./g, ','));
								$('#result_partial').text(String(bonuscalc.number_format(json.currentPartialSum, 2, ',', ' ')).replace(/\./g, ','));
								$('#result_rate').text(String(json.plainRate).replace(/\./g, ','));
								$('#result_income').text(String(bonuscalc.number_format(json.currentIncomeSum, 2, ',', ' ')).replace(/\./g, ','));
								$('#result_balance').text(String(bonuscalc.number_format(json.currentCalcBalance, 2, ',', ' ')).replace(/\./g, ','));
								$('#result_effectiveRate').text(String(json.currentEffectiveRate).replace(/\./g, ','));
								
								if ($("#CloseAheadTime_yes").is(':checked') && $("#CloseAheadTime").val() != '') {
									$('#result_dateEnd').text($("#CloseAheadTime").val());
								} else {
									$('#result_dateEnd').text(String(json.dateEnd));
								}
								$('#result_dateFrom').text($("#dateFrom").val());
																
								if (json.currentCalcBalance == 0) {
									a = 100;
									b = 0;
								} else {
									a = round( (100 * json.start_balance) / (json.currentCalcBalance) );
									b = 100 - a;
								}
								
								$("#bg1, #bg1g").css("width",a+"%");
								$("#bg3, #bg3g").css("width",b+"%");
								
								$("#bg1s").text(String(bonuscalc.number_format(json.start_balance, 2, ',', ' ')));
								if (json.currentCalcBalance == 0) {
									$("#bg3s").text(String(0));
								} else {
									$("#bg3s").text(String(bonuscalc.number_format(json.currentCalcBalance, 2, ',', ' ')));
								}

								$(".currency").text( currencies[$("#dv").val()] );
								
								if ( $("#isRenewalRegular").val() == undefined ) {
									$("#currency_renewal").text('');
									$('#result_renewal').text('нет');
								}
								
								if ( $("#isPartialRegular").val() == undefined ) {
									$("#currency_partial").text('');
									$('#result_partial').text('нет');
								}																
								
								$("#result_days").text( $("#de").val() );
								
								$("#calc").fadeOut("slow");
								$("#calcs").css("display", "none");
								$("#calresult").css("display", "block");
								$("#calres").fadeIn("slow"); 
								
							}
                          };
  //------------------------------------------------------------------------------
  var bindCalc = function (idList){
                  $.each(idList,function(index,item){
                    $('#'+item).bind('change',performCompareWithTimeout);
                  });
                 };
  //------------------------------------------------------------------------------
  var bindYNVisibleSwitch = function(master,slave,action){
	if (action == 'undefined') {
		action = 'change';
	}
    $(master).bind(action, function(){
      if ($(master).val()=='yes'){
        $(slave).show();
      } else {
        $(slave).hide();
      }
    });
  };
  
  //------------------------------------------------------------------------------
  var bindRegularVisibleSwitch = function(master,slave,slave2){
    $(master).bind('change', function(){
      if ( $(master).val()=='monthly' || $(master).val()=='quarterly' ){
        $(slave).show();
		if ( $(master).val()=='monthly' ) {
			$(slave2).hide();
		} else {
			$(slave2).show();
		}
      } else {
        $(slave).hide();
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
			
			var newDay = parseInt(day,10);
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
					
					case '#CloseAheadTime':
						if ( re.test($(master).val()) ) {
							isValidDate(master);
						}
					break;
					
					case '#dateFrom':
						if ( re.test($(master).val()) ) {
							isValidDate(master);
							if ( $("#dateTo").attr('disabled') && $("#de").attr('disabled') ) {
							
								if ( (($('#de').val() * (60*60*24)) / 31536000) >= 1 ) {
									years = round( ($('#de').val() * (60*60*24)) / 31536000 , 0);
								}
								var day_sum = 0;
								
								for (i = 0; i <= years-1; i++) {
									if ( IsLeapYear(date.getFullYear()+i) ) {
										if (date.getMonth()+1 > 2) {
											day_sum += 365;
										} else {
											day_sum += 366;
										}
									} else {
										day_sum += 365;
									}
									if ( IsLeapYear(date.getFullYear()+i+1) ) {
										if (date.getMonth()+1 > 2) {
											day_sum += 366;
										} else {
											day_sum += 365;
										}
									} else {
										day_sum += 365;
									}				

									day_sum -= 365;
								}
											
								$('#de').val(day_sum);
								
								date.setDate( date.getDate()+day_sum );
								$("#dateTo").val(addZero(date.getDate())+'.'+addZero(date.getMonth()+1)+'.'+date.getFullYear());
							} else {
								change_date('#de');
								change_date('#dateTo');
							}
						}
					break
				}
			}
		}
	}
	
	//------------------------------------------------------------------------------	
	var bindCurrencyChange = function(master, slave) {
		$(master).bind('change', function() {
			if ( $(master).val() > 0 ) {
				$(".minBalanceCurrency").unwrap();
				$(".minBalanceCurrency").wrap('<span></span>');
				className = ".minBalanceCurrency_"+$(master).val();
				$(className).unwrap();
				//className = ".minBalanceCurrency_"+$(master).val();
				$(slave).val($(className+":first").val());
			}
		});
	}

  //------------------------------------------------------------------------------
  //initial assignments
  $('#dMonthlyPaymentRow').hide();
  $('#dMinBalanceListRow').hide();
  $('#showAllCalc').hide();

  bindYNVisibleSwitch('#CloseAheadTime_yes','#TR_CloseAheadTime','click');
  bindYNVisibleSwitch('#CloseAheadTime_no','#TR_CloseAheadTime','click');
  
  bindRegularVisibleSwitch('#isRenewalRegular','.TR_Renewal','#TR_RenewalPeriod');
  bindRegularVisibleSwitch('#isPartialRegular','.TR_Partial','#TR_PartialPeriod');
  
  //обновление даты окончания
  bindEndDateChange('#de');
  bindEndDateChange('#dateTo');
  bindEndDateChange('#dateFrom');
  bindEndDateChange('#CloseAheadTime');
  
  //неснижаемый остаток для выбранной валюты
  bindCurrencyChange('#dv', '#minBalance');

  //привязываем обновление списка мин остатков с таймаутом,
  //после обновления следует расчет таблицы сравнения
  //bonuscalc.bindMinBalanceListRefresh(['dIsPartial','dp','dv'], false, performCompareWithTimeout);

  //привязываем расчет таблицы сравнения с таймутом
  //bindCalc(['de','dateFrom','dateTo','dIsRenewal','dMonthlyPayment','dn']);

  //навешиваем на поля запрет на неразрешенные символы
  //keyHandler.protectField('#dp', '^[0-9]{0,10}$');
  keyHandler.protectField('#de', '^[0-9]{0,4}$');
  //keyHandler.protectField('#neso', '^[0-9]{0,10}$');
  //keyHandler.protectField('#dMonthlyPayment', '^[0-9]{0,10}$');
  //keyHandler.protectField('#RenewalPayment', '^[0-9]{0,10}$');
  //keyHandler.protectField('#PartialPayment', '^[0-9]{0,10}$');

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

                $.getJSON('../../../../../../common/js/get_calc_universalcmp_values.php',params,
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
  //keyHandler.protectField('#dp', '^[0-9]{0,10}$');  
  //keyHandler.protectField('#de', '^[0-9]{0,4}$');
  //keyHandler.protectField('#neso', '^[0-9]{0,10}$');
  //keyHandler.protectField('#dMonthlyPayment', '^[0-9]{0,10}$');
  
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

