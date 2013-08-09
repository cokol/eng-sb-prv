$(function(){
    //bind controller
    if ($('#creditCalcFormChartContainer').size()>0){
        creditChartForm('#creditCalcFormChartContainer');
    }

    if (isModifiedCalc()) {
        $('#rateRangeRow').children('td').eq(0).css('vertical-align', 'middle');
    }

	if (typeof acBanner === 'function') {
		acBanner();
	}
});

//=========================================
function isModifiedCalc() {
    return ($('#valueStep_redefinition').length > 0);
}

//=========================================
function showErrorMessage(message)
{
    var messages={incorrectExtraPaymentsValue: 'Недопустимая сумма дополнительного платежа',
        incorrectCreditTotalValue: 'Недопустимый размер кредита',
        emptyMonthlyPayment: 'Ежемесячный платеж не может быть пустым',
        emptySalary: 'Величина дохода не может быть пустой',
        durationTooBig: 'Для этого срока кредита нет подходящих ставок',
        noRatesFound: 'На указанный срок данный тип кредита не выдаётся', /* Для заданных параметров нет подходящих ставок */
        noCoeffFound: 'Расчет резмера кредита или требуемого дохода невозможен',
        tooLittleCredit: 'Расчетный кредит слишком мал. Недостаточный доход'
    };

    if (messages[message]==undefined) messages[message]=message;

    $('#loadingIndicator').hide();
    alert(messages[message]);
}

//=========================================
function CreditChartLabelDecorator(dataJSON)
{
    var currencyTxt=creditChartModel.data.currencyLabels[dataJSON.currency].abbrev;
    var months=['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
    return {
        getCurrencyTxt: function(){return currencyTxt;},
        renderCurrencyField: function(field){
            return Highcharts.numberFormat(dataJSON[field],2,'.','\'')+' '+currencyTxt;
        },
        renderCurrencyNum: function(field){
            return Highcharts.numberFormat(dataJSON[field],2,'.','\'');
        },

        renderMDate: function(date){
            var parts=date.split('.');
            return months[parts[0]-1]+' '+parts[1];
        }
    }
}

//=========================================
function creditChartForm(containerID){
    //Определяем используется ли слайдер для ставки
    if ($('#rateRange').length) creditChartModel.useRateRange=true;


    //привязки кнопок и блоков к событиям
    //-----------------------------------

    //Блок дополнительных платежей
    var bindAdditionalPaymentsBlock=function(){
        //Кнопка показать-скрыть весь блок
        $('.ccAdditionalPaymentsHeader a').click(function(){
            $("#additionalPaymentsBlock").toggle();

            var imgCtrl=$(this).find('img');
            var imgUrlBase=imgCtrl.attr('src').replace(/_.*?$/,'_');

            if ($("#additionalPaymentsBlock").is(':visible')) {
                imgCtrl.attr('src',imgUrlBase+'down.gif');
            } else {
                imgCtrl.attr('src',imgUrlBase+'right.gif');
            }
            return false;
        });

        //тонкая настройка -- в зависимости от периодичности платежей
        $('#additionalPayments').change(function(){
            var APtype=$('#additionalPayments option:selected').val();
            if (APtype=='no') {
                $('#additionalPaymentFrequencyInput').hide();
                $('#additionalPaymentDateInput').hide();
                $('#additionalPaymentAmountInput').hide();
            } else if (APtype=='single') {
                $('#additionalPaymentFrequencyInput').hide();
                $('#additionalPaymentDateInput').show();
                $('#additionalPaymentAmountInput').show();
                $('#additionalPaymentDateLabel').text('Дата платежа');
            } else if (APtype=='regular') {
                $('#additionalPaymentFrequencyInput').show();
                $('#additionalPaymentDateInput').show();
                $('#additionalPaymentAmountInput').show();
                $('#additionalPaymentDateLabel').text('Дата первого платежа');
            }
        });
    };

    //Группа полей, задающих начальные условия по размеру кредита
    //Вид расчета и поля суммы кредита, дохода, ежемесячного платежа

    //текущее поле для ввода суммы, определяющей требуемый доход и макс кредит
    //одно из byMonthlyIncomeInput, byCreditTotalInput, byMonthlyPaymentInput
    var curIncomeControl=$('#byMonthlyIncomeInput');

    //настройка видимости полей суммы кредита, дохода, ежемесячного платежа
    //от значения вида расчета
    var bindInitialConditionsMoneyGroup=function(){
        $('#initialConditionsType').change(function(){
            var newControlBlockID=$('#initialConditionsType').val()+'Input';
            var newControlBlock=$('#'+newControlBlockID);
            curIncomeControl.hide();
            newControlBlock.show();
            curIncomeControl=newControlBlock;
        });
    };

    //Календарики: начало платежей и начало доп взносов
    //общая функция создания календаря
    var createDatePicker=function(picker, curDate){
        var options={
            changeMonth: true,
            changeYear: true,
            showOn: 'button',
            regional: 'ru',
            buttonImage: '../../../../../common/img/c.gif',
            buttonImageOnly: true,
            gotoCurrent:true,
            dateFormat: 'dd.mm.yy'
        };
        picker.datepicker(options);
        picker.datepicker('setDate',curDate);
    };

    var getForbiddenMonths=function()
    {
        if (creditChartModel.getCurPaymentsType()=='annuity') {
            return LIMITATIONS.monthForbiddenAnnuity;
        } else {
            return LIMITATIONS.monthForbiddenDiff;
        }
    };

    //подстройка календаря доп платежей с учетом месяцев запрета
    var setDatePicker=function(picker, date, forbiddenMonth){
        if (date==null) return;
        if (typeof(forbiddenMonth)!=undefined) {
            date.setMonth(date.getMonth()+forbiddenMonth);
            picker.datepicker( "option", "minDate", date);
        }
        picker.datepicker('setDate',date);
    };


    //настраиваем
    var bindDatePicker=function(){
        var date = new Date();
        var correctAdditionalPaymentsDatePicker=function(){
            var date = $('#paymentStartDate').datepicker('getDate');
            setDatePicker($('#additionalPaymentDate'),date,getForbiddenMonths());
        };

        var checkAdditionalPayments=function(){
            var newDateParts=$('#additionalPaymentDate').val().split('.');
            var myDate=new Date(newDateParts[2], newDateParts[1], newDateParts[0]);
            var startDate=$('#paymentStartDate').datepicker('getDate');
            if (startDate==null) return;

            startDate.setMonth(startDate.getMonth()+getForbiddenMonths());
            if (myDate < startDate) {
                $('#additionalPaymentDate').val(startDate.getDate()+'.'+(startDate.getMonth()+1)+'.'+startDate.getFullYear());
            }
        };

        date.setDate(date.getDate()+1); //следующий день после сегодняшнего
        createDatePicker($('#paymentStartDate'),date);
        createDatePicker($('#additionalPaymentDate'),date);
        correctAdditionalPaymentsDatePicker();
        $('#paymentStartDate').change(correctAdditionalPaymentsDatePicker);

        $('#additionalPaymentDate').change(checkAdditionalPayments);

        //если можно выбирать тип платежей, то
        //при изменении типа платежей, также подстраиваем календарь доп платежей
        if (LIMITATIONS.isDiffPayment && LIMITATIONS.isAnnuity){
            $('input[name="paymentsType"]').change(correctAdditionalPaymentsDatePicker);
        }
    };


    //Если у нас есть контролы для Марки и Модели автомобилей
    //запоняем контрол,
    //добавляем скрытый контрол доп параметров
    var carCredBrand=$('#CRED_CAR_BRAND'),
        carCredModel=$('#CRED_CAR_MODEL');

    if (carCredBrand.length && carCredModel.length){
        carCredBrand.bind('keyup change', function(){
            creditChartModel.fillCarModels($(this).val());
        });

        carCredModel.bind('keyup change', function(){
            creditChartModel.carModelSelect($(this).val());
        });

        carCredModel.after($('<select id="AP_CAR_PRICE_GROUP" name="AP_CAR_PRICE_GROUP" style="visibility: hidden"></select>'));
        creditChartModel.carBrandModelInUse=true;
    }


    //привязываем доп-параметры ставок к очереди обновления объекта модели.
    //при изменении срока и валюты все эти параметры обновляются,
    //при этом клик по кнопке "Рассчитать", после изменения поля "срок"
    //не вызывает ошибки, т.к. расчет ставится в очередь и ждет пока подгрузятся
    //доп параметры
    var bindAdditionalRatesParameters=function(){
        var AP_Controllers={};
        var key;
        //Берем все элементы, с именем AP_*
        $('select[name^="AP_"]').each(function(index){
            key=$(this).attr('id').substr(3);
            AP_Controllers[key]=$('#AP_'+key);
            AP_Controllers[key].notify=doNotifyController;
            AP_Controllers[key].AP_key=key;
            creditChartModel.subscribe(AP_Controllers[key],'initData');
            creditChartModel.subscribe(AP_Controllers[key],'currencyChange');
            creditChartModel.subscribe(AP_Controllers[key],'durationChange');

            AP_Controllers[key].change(function(){
                if (creditChartModel.useRateRange) creditChartModel.loadRatesRange();
            });
        });


        //Привязываем к сроку и валюте события модели
        var durationCtrl=$('#duration');
        durationCtrl.data('preservedValue',durationCtrl.val());
        durationCtrl.change(function(){
                if ( durationCtrl.val()=='' || durationCtrl.val()<1) {
                    alert('Срок кредитования не может быть пустым');
                    return;
                }

                var validator = durationCtrl.data('validateDuration');
                if (typeof(validator) == 'function') {
                    if (!validator()) {
                        durationCtrl.val( $('#duration').data('preservedValue') );
                        return;
                    }
                }
                durationCtrl.data('preservedValue', durationCtrl.val());
                creditChartModel.fireEvent('durationChange')}
        );
        $('#currencyID').change(function(){creditChartModel.fireEvent('currencyChange')});

        //запрещаем ввод нецифровых значений в поля срока и суммы
        keyHandler.protectField('#duration', '^[0-9]+$');
        keyHandler.protectField('#monthlyIncome', '^[0-9]+$');
        keyHandler.protectField('#creditTotal', '^[0-9]+$');
        keyHandler.protectField('#monthlyPayment', '^[0-9]+$');
    };

    //функция, привязываемая к контролу доп-параметров ставок
    //вызывается после того,как данные, соответствующие валюте и сроку загружены
    //Если в списке возможных значений есть сохраненное, то оно выделяется
    var doNotifyController=function(event){
        var preserveValue= $(this).val();
        this.children().remove();
        var options=this.attr('options');
        var key=this.AP_key;
        var listData=creditChartModel.data.extraOptions[key];
        var preservedValueExistsFlag=false;

        for (k in listData){
            if (k==preserveValue) preservedValueExistsFlag=true;
            options[options.length]=new Option(listData[k],k);
        }

        if (key == 'debtor_category' && isModifiedCalc()) {
            $('#AP_debtor_category option:contains("Получатель зарплаты/пенсии в Сбербанке")').attr('selected','selected');
        } else if (preserveValue!=null && preservedValueExistsFlag) {
            this.val(preserveValue);
        }

        $('#AP_'+key).data('prservedValue',preserveValue);

    };


    //Привязки проверок на допустимые значения
    //служебная функция -- запминает предыдущее значение:
    var saveOldValue=function(){this.oldvalue=this.value;};

    var getRealCreditLimitations=function(){
        var curr= $('#currencyID').val();
        var extraLimitations =  LIMITATIONS.currencies[curr].extraLimits;
        var i, l, match;
        var currLimitations = {
            maxCredit: LIMITATIONS.currencies[curr].maxCredit,
            minCredit: LIMITATIONS.currencies[curr].minCredit
        };

        if (typeof extraLimitations == 'undefined') return currLimitations;

        for (i=0; i <  extraLimitations.length; i++) {
            l = extraLimitations[i];
            match=true;
            for ( var propertyName in l.conds ){
                if (l.conds[propertyName] != $('#AP_'+propertyName).val() ) {
                    match=false;
                    break;
                }
            }
            if (match) {
                //check if MAX_CREDIT Exists
                if ( typeof l.vals.MAX_CREDIT !== 'undefined') {
                    currLimitations.maxCredit = l.vals.MAX_CREDIT;
                }
                if ( typeof l.vals.MIN_CREDIT !== 'undefined') {
                    currLimitations.minCredit = l.vals.MIN_CREDIT;
                }
                return currLimitations;
            }
        }
        return currLimitations;
    }

    var applyLimitations=function(){
        //привязываем сохранения
        $('#creditTotal').focus(saveOldValue);
        $('#monthlyIncome').focus(saveOldValue);
        $('#monthlyPayment').focus(saveOldValue);
        $('#additionalPaymentAmount').focus(saveOldValue);

        //проверки
        $('#creditTotal').change(function(){
            var curr= $('#currencyID').val();
            var limitations=getRealCreditLimitations();

            //console.log(limitations);
            if (isNaN(this.value) ||
                (limitations.maxCredit!=0 &&  this.value > limitations.maxCredit) ||
                this.value < limitations.minCredit){
                this.value=this.oldvalue;
                showErrorMessage('incorrectCreditTotalValue');
            }
        });

        // при смене категории заемщика надо перепроверять введенную сумму кредита
        $('#AP_debtor_category').change(function() {
            if ( $("#initialConditionsType").val() == "byCreditTotal") {
                var curr= $('#currencyID').val(),
                    limitations=getRealCreditLimitations(),
                    inputSum = parseInt($('#creditTotal').val(), 10);

                if ( (limitations.maxCredit && inputSum > limitations.maxCredit) || (limitations.minCredit && inputSum < limitations.minCredit) ) {
                    //$('#creditTotal').val(limitations.maxCredit);
                    $('#creditTotal').focus();
                    showErrorMessage('incorrectCreditTotalValue');
                }
            }
        });

        $('#monthlyIncome').change(function(){
            if (this.value =='') {
                this.value=this.oldvalue;
                showErrorMessage('emptySalary');
            }
        });

        $('#monthlyPayment').change(function(){
            if (this.value =='') {
                this.value=this.oldvalue;
                showErrorMessage('emptyMonthlyPayment');
            }
        });

        function validateAdditionalPaymensAmount(){
            return isNaN(this.value) ||
                (
                    LIMITATIONS.currencies[curr].maxExtraPayment!=0
                        && this.value > LIMITATIONS.currencies[curr].maxExtraPayment
                    ) ||
                this.value< LIMITATIONS.currencies[curr].minExtraPayment;
        }

        $('#additionalPaymentAmount').change(function(){
            var curr= $('#currencyID').val();
            if (validateAdditionalPaymensAmount()){
                this.value=this.oldvalue;
                showErrorMessage('incorrectExtraPaymentsValue');
            }
        });
    };

    //График
    //------------------------------------
    //Кнопки Графика
    var bindChartButtons=function(){
        //кнопка "назад к форме"
        $('#btnBackToForm').click(function(){
            $('#calres').hide();
            $('#chartForm').show()});

        //Кнопка "Расчитать"
        var showChartTimerId;
        $('#btnBuild').click(function(){
            // если есть предв. обработчик - смотрим сначала на его результат
            if (typeof(btnBuildPrehandler) === 'function') {
                if (btnBuildPrehandler() == false) {
                    return;
                }
            }

            if ( $('#duration').val()=='' || $('#duration').val()<1) {
                alert('Срок кредитования не может быть пустым');
                return;
            }

            if ($('#paymentStartDate').val()==''){
                alert('Дата начала платежей не может быть пустой');
                return;
            }

            if ($('#additionalPaymentDate').length>0 && $('#additionalPayments').val()!='no' && $('#additionalPaymentDate').val()==''){
                alert('Дата дополнительного платежа не может быть пустой');
                return;
            }

            if (!validate_date_string($('#paymentStartDate').val()) ||
                ($('#additionalPaymentDate').length>0 && $('#additionalPayments').val()!='no' && !validate_date_string($('#additionalPaymentDate').val()))){
                alert('_25C4_25E0_25F2_25FB _25E4_25EE_25EB_25E6_25ED_25FB _25E1_25FB_25F2_25FC _25E2 _25F4_25EE_25F0_25EC_0E81032388');
                return;
            }

            var fireEvent=function(){
                if (typeof(showChartTimerId)!==undefined) {
                    clearTimeout(showChartTimerId);
                }
                showChartTimerId=setTimeout(requestChartData,300);
            };

            if (creditChartModel.isLoading){
                creditChartModel.enqueue(fireEvent);
            } else {
                fireEvent();
            }
        });

        //К таблице платежей привязываем кнопку "закрыть" и таскаемость
        $('#tableResult').draggable({handle: '.tableResultHeader'});
        $('#btnCloseTableResult').click(function(){$('#tableResult').hide();return false;});
        //Кнопка "Показать таблицу платежей"
        $('#btnShowResultTable').click(function(){showResultTable();return false});
    };

    //AJAX-Запрос данных для графика
    var requestChartData=function(){
        var chartOptions={
            action: 'chart',
            version: VERSION,
            regionID:  REGION_ID,
            calcID:  CONTENT_ID,

            paymentsType: creditChartModel.getCurPaymentsType(),
            initialConditionsType: $('#initialConditionsType').val(),
            monthlyIncome: $('#monthlyIncome').val(),
            creditTotal: $('#creditTotal').val(),
            monthlyPayment: $('#monthlyPayment').val(),
            duration: $('#duration').val(),
            additionalPayments: $('#additionalPayments').val(),
            additionalPaymentAmount: $('#additionalPaymentAmount').val(),
            additionalPaymentFrequency: $('#additionalPaymentFrequency').val(),
            paymentStartDate: $('#paymentStartDate').val(),
            additionalPaymentDate: $('#additionalPaymentDate').val(),
            currencyID: $('#currencyID').val()
        };
        if (creditChartModel.useRateRange) {
            chartOptions.assignedRate=creditChartModel.getRateRangeValue();
        }

        //доп параметры ставок. если их вообще нет, то в запрос поедет пустая строка
        $('select[name^="AP_"]').each(function(index){
            chartOptions['calculationParameters['+$(this).attr('id').substr(3)+']']=$(this).val();
        });

        $('#loadingIndicator').show();
        jQuery.getJSON(creditChartModel.requestUrl, chartOptions,
            function(dataJSON){showResult(dataJSON,chartOptions)});

    };

    //Показ графика по результатам запроса
    var showResult= function (dataJSON, chartOptions){
        if (typeof(dataJSON.errStatus)!='undefined' && !dataJSON.errStatus) {
            showErrorMessage(dataJSON.errMessage);
            return;
        }
        creditChartModel.saveRequest(dataJSON,chartOptions);
        var decorator=new CreditChartLabelDecorator(dataJSON);
        $('#loadingIndicator').hide();

        $("#calres").show();
        showChartDiagram('chart-container-1', dataJSON);
        $('#cred_total').text(decorator.renderCurrencyField('creditTotal'));
        $('#cred_percent').text(dataJSON.rate);
        $('#cred_overpayment').text(decorator.renderCurrencyField('overpayment'));
        $('#cred_income').text(decorator.renderCurrencyField('reqIncome'));
        $('#cred_duration').text(dataJSON.duration+' мес');
        $('#cred_beginDate').text(decorator.renderMDate(dataJSON.paymentBeginDate));
        $('#cred_endDate').text(decorator.renderMDate(dataJSON.realEndDate));

        $('#cred_monthlyPaymentLabel').text(dataJSON.monthlyPaymentLabel);
        $('#cred_monthlyPayment').text(decorator.renderCurrencyField('monthlyPayment'));

        //Генерим урл на основе данных запроса
        //загрузки экселя и вывода версии для печати
        chartOptions['action']='excel';
        $('#btnExcelDownload').attr('href',creditChartModel.requestUrl+'?'+$.param(chartOptions));
        chartOptions['action']='printChart';
        $('#btnPrint').attr('href',creditChartModel.requestUrl+'@action=printChart&'+$.param(chartOptions));

        //График показали, прячем форму (кроме автокредита)
		if (!window.isAutoCredit) {
			$('#chartForm').hide();
		}
    };

    //---------------------------------------------------
    var showResultTable=function(){
        var decorator=new CreditChartLabelDecorator(creditChartModel.data.calculationResult);
        var labels=creditChartModel.data.calculationResult.dateLabels;
        var data=creditChartModel.data.calculationResult.series;
        var content='<table class="result-table results-for-month-content">';
        var rowStyle;
        var totalDebtPayment=0;
        var totalPercentPayment=0;
        var dataRoot=creditChartModel.data.calculationResult;

        //нарисовать таблицу
        for (i=0;i< labels.length;i++){
            if (data.debtPayments[i]==0 && data.percentPayments[i]==0) break;
            totalDebtPayment+=data.debtPayments[i];
            totalPercentPayment+=data.percentPayments[i];

            rowStyle=(i%2==0)? 'light':'dark';
            content+='<tr class="results-for-month '+rowStyle+'"><td class="number">'+(i+1)+'</td>'+
                '<td class="month">'+labels[i]+'</td>'+
                '<td class="main-pay">'+data.debtPayments[i].toFixed(2)+'</td>'+
                '<td class="rate">'+data.percentPayments[i].toFixed(2)+'</td>'+
                '<td class="rest">'+data.debt[i].toFixed(2)+'</td>'+
                '<td class="total">'+data.payment[i].toFixed(2)+'</td></tr>';
        }

        content+='<tr class="separator"><td colspan="6">&nbsp;</td></tr>'+
            '<tr class="results-total"><td colspan="2" style="border-left:none;text-align:center;font-size: 14px">Итого:</td>'+
            '<td class="main-pay" style="vertical-align: middle">'+totalDebtPayment.toFixed(2)+'</td>'+
            '<td class="rate"  style="vertical-align: middle">'+totalPercentPayment.toFixed(2)+'</td>'+
            '<td class="rest">&nbsp;</td>'+
            '<td class="total"  style="vertical-align: middle">'+(totalDebtPayment+totalPercentPayment).toFixed(2)+'</td></tr>';

        content+='</table><p>&nbsp;</p>';
        $('#tableResult .tableResultContent').html(content);

        //сформировать шапку
        $('#tableResultRate').text(dataRoot.rate);
        $('#tableResultSumTotal').text(decorator.renderCurrencyNum('creditTotal'));
        $('#tableResult .tableResultCurrencyAbbrev').text(decorator.getCurrencyTxt());
        $('#tableResultOverpayment').text(decorator.renderCurrencyNum('overpayment'));
        $('#tableResultIncome').text(decorator.renderCurrencyNum('reqIncome'));

        $('#tableResultDuration').text(dataRoot.duration);
        $('#tableResultStartDate').text(decorator.renderMDate(dataRoot.paymentBeginDate));
        $('#tableResultEndDate').text(decorator.renderMDate(dataRoot.paymentEndDate));
        creditChartModel.data.requestOptions['action']='excel';
        $('#btnTableResultExcelDownload').attr('href',creditChartModel.requestUrl+'?'+$.param(creditChartModel.data.requestOptions));

        $('#tableResultMonthlyPaymentLabel').text(dataRoot.monthlyPaymentLabel);
        $('#tableResultMonthlyPayment').text(decorator.renderCurrencyNum('monthlyPayment'));


        //показать, спозиционировать, приклеить стилизованную полосу прокрутки
        $('#tableResult').show();
        var p = $("#calres").position();
        $('#tableResult').css({top: p.top-70, left: p.left+15});
        $('#tableResult .tableResultContent').jScrollPane({
            showArrows:true,
            dragMaxHeight: 12});
    };

    //Инициализация всех кнопок и областей
    var init=function(){
        bindAdditionalPaymentsBlock();
        bindInitialConditionsMoneyGroup();
        bindDatePicker();
        bindAdditionalRatesParameters();
        creditChartModel.init();
        bindChartButtons();
        applyLimitations();

        //позиционируем индикатор загрузки
        var n = $("#calcs").position();
        $('#loadingIndicator').css({top: n.top+ 80, left: n.left+350});


        //вызываем коллбэк после инициализации калькулятора
        if (typeof(creditChartForm_InitCallback)=='function'){
            creditChartForm_InitCallback();
        }

    };

    //Вызов точки входа
    //---------------------------------------------------
    init();
}

//=========================================
var creditChartModel = {
    requestUrl: '../../../../../common/js/credit_calc_chart.php',
    useRateRange: false,
    singleRateValue: false,

    subscribers: {
        currencyChange: [],
        durationChange: [],
        initData: []
    },

    isLoading: false,
    onLoadQueue: [],
    enqueue: function(handler){creditChartModel.onLoadQueue.push(handler)},
    completeLoad: function(){
        $('#loadingIndicator').hide();
        creditChartModel.isLoading=false;
        for (h in creditChartModel.onLoadQueue){
            creditChartModel.onLoadQueue[h]();
        }
    },

    carBrandModelInUse: false,

    data: {
        durationValue: 12,

        currencyLabels: {
            1: {abbrev: 'руб', genetive: 'рублей', locative: 'рублях'}, //nb. locative=предложный падеж
            2: {abbrev: 'USD', genetive: 'долларов США', locative: 'долларах США'},
            3: {abbrev: 'EUR', genetive: 'евро', locative: 'евро'}
        },
        extraOptions: {},
        calculationResult: {},
        requestOptions: {}
    },

    events: {
        durationChange: function(){
            creditChartModel.loadExtraOptions(function(){
                creditChartModel.notifyListeners('durationChange');
                if (creditChartModel.useRateRange) creditChartModel.loadRatesRange();
                creditChartModel.completeLoad();
            });
        },
        currencyChange: function(){
            creditChartModel.loadExtraOptions(function(){
                creditChartModel.notifyListeners('currencyChange');
                if (creditChartModel.useRateRange) creditChartModel.loadRatesRange();
                creditChartModel.completeLoad();
            });
        }
    },

    init: function(){
        this.loadExtraOptions(function(){
            creditChartModel.notifyListeners('initData');
            creditChartModel.completeLoad();
            if (creditChartModel.useRateRange) creditChartModel.loadRatesRange();
        });
    },

    getCurPaymentsType: function(){
        if (LIMITATIONS.isDiffPayment && LIMITATIONS.isAnnuity){
            return $('input[name="paymentsType"]:checked').val();
        } else {
            return $('#paymentsType').val();
        }
    },

    subscribe: function(object, event){
        this.subscribers[event].push(object);
    },

    fireEvent: function (event){
        this.events[event]();
    },

    notifyListeners: function(event) {
        for (key in creditChartModel.subscribers[event]){
            creditChartModel.subscribers[event][key].notify(event);
        }
    },

    saveRequest: function(jsonData,requestOptions) {
        this.data.calculationResult=jsonData;
        this.data.requestOptions=requestOptions;
    },

    getRateFromRangeSlider: function(){
        if (creditChartModel.useRateRange) {
            chartOptions.assignedRate=$('#rateRange').sliderInput('getValue');
        }
    },

    loadExtraOptions: function(callback){
        var error=function(message){
            creditChartModel.isLoading=false;
            showErrorMessage(message);
            $('#duration').val(creditChartModel.durationValue)};

        if($('select[name^="AP_"]').length==0) return;

        if ($('#duration').val()>30000) {
            error('noRatesFound'); /* durationTooBig */
            return;
        }

        creditChartModel.onLoadQueue=[];
        creditChartModel.isLoading=true;
        $('#loadingIndicator').show();
        jQuery.getJSON(creditChartModel.requestUrl,
            {
                action: 'ratesOptions',
                currencyID: $('#currencyID').val(),
                regionID:  REGION_ID,
                version: VERSION,
                calcID:  CONTENT_ID,
                duration: $('#duration').val()
            },
            function(dataJSON){
                if(dataJSON.errStatus){
                    creditChartModel.durationValue= $('#duration').val();
                    creditChartModel.data.extraOptions=dataJSON;
                    if ( creditChartModel.carBrandModelInUse )  creditChartModel.fillCarBrands();
                    callback();
                } else {
                    creditChartModel.onLoadQueue=[];
                    error(dataJSON.errMessage);
                }
            });
    },

    fillCarBrands: function(){
        var preserveValue = $('#CRED_CAR_BRAND').val();
        var brandCtrl=$('#CRED_CAR_BRAND');
        var pgExtraOptions=creditChartModel.data.extraOptions.CAR_PRICE_GROUP;
        var k, l, f, preservedValueExistsFlag = false;

        brandCtrl.children().remove();
        var options=brandCtrl.attr('options');
        for (k in CAR_MODELS){
            if (k==preserveValue) preservedValueExistsFlag=true;
            f=false;

            if (pgExtraOptions['0']!=undefined) {
                f=true;
            } else {
                for (l in creditChartModel.data.extraOptions.CAR_PRICE_GROUP){
                    if ($.inArray(l, CAR_MODELS[k].priceGroups)!=-1 ){
                        f=true;
                        break;
                    }
                }
            }

            if (f) {
                var sel = (preserveValue == CAR_MODELS[k].id);
                options[options.length]=new Option(CAR_MODELS[k].title,CAR_MODELS[k].id, false, sel);
            }
        }

        if (!preservedValueExistsFlag) preserveValue = brandCtrl.val();
        creditChartModel.fillCarModels(preserveValue);
    },

    fillCarModels: function(brandId){
        var preserveValue = $('#CRED_CAR_MODEL').val();
        var modelCtrl=$('#CRED_CAR_MODEL');
        var carModels = [];
        for (var brand in CAR_MODELS) {
            if (CAR_MODELS[brand].id == brandId)
                carModels = CAR_MODELS[brand].models;
        }
        //var carModels= CAR_MODELS[brandId].models;
        var pgExtraOptions=creditChartModel.data.extraOptions.CAR_PRICE_GROUP;
        var k, c, preservedValueExistsFlag = false;
        var pgroup;

        modelCtrl.children().remove();
        var options=modelCtrl.attr('options');
        c=0;
        for (k=0; k < carModels.length; k++){
            if (k==preserveValue) preservedValueExistsFlag=true;

            pgroup=carModels[k].price_group;
            if (pgExtraOptions[pgroup]!=undefined){
                c++;
                var sel = (preserveValue == carModels[k].id);
                options[options.length]=new Option(carModels[k].title, carModels[k].id, false, sel);
            }
        }
        if ( c==0 ) options[options.length]=new Option('Все модели', 0);

        creditChartModel.carModelSelect(modelCtrl.val());
    },

    carModelSelect: function(modelId){
        //var carModels = CAR_MODELS[$('#CRED_CAR_BRAND').val()].models;
        var carModels = [];
        var brandId = $('#CRED_CAR_BRAND').val();
        for (var brand in CAR_MODELS) {
            if (CAR_MODELS[brand].id == brandId)
                carModels = CAR_MODELS[brand].models;
        }
        var i;
        var carModelData;
        for (i=0; i < carModels.length; i++){
            if (carModels[i].id == modelId) {
                carModelData = carModels[i];
                break;
            }

        }
        $('#AP_CAR_PRICE_GROUP').val(carModelData.price_group);
    },

    getRateRangeValue: function(){
        if (creditChartModel.singleRateValue){
            return creditChartModel.singleRateValue;
        } else {
            return $('#rateRange').sliderInput('getValue');
        }
    },

    loadRatesRange: function(){
        var error=function(message){
            creditChartModel.isLoading=false;
            showErrorMessage(message);
        };

        creditChartModel.isLoading=true;
        $('#loadingIndicator').show();
        var rangeOptions={
            action: 'ratesRange',
            currencyID: $('#currencyID').val(),
            regionID:  REGION_ID,
            version: VERSION,
            calcID:  CONTENT_ID,
            duration: $('#duration').val(),
            paymentsType: creditChartModel.getCurPaymentsType(),
            initialConditionsType: $('#initialConditionsType').val(),
            monthlyIncome: $('#monthlyIncome').val(),
            creditTotal: $('#creditTotal').val(),
            monthlyPayment: $('#monthlyPayment').val(),
            additionalPayments: $('#additionalPayments').val(),
            additionalPaymentAmount: $('#additionalPaymentAmount').val(),
            additionalPaymentFrequency: $('#additionalPaymentFrequency').val(),
            paymentStartDate: $('#paymentStartDate').val(),
            additionalPaymentDate: $('#additionalPaymentDate').val()
        };

        //доп параметры ставок. если их вообще нет, то в запрос поедет пустая строка
        $('select[name^="AP_"]').each(function(index){
            rangeOptions['calculationParameters['+$(this).attr('id').substr(3)+']']=$(this).val();
        });

        jQuery.getJSON(creditChartModel.requestUrl,
            rangeOptions,
            function(dataJSON){
                if (isModifiedCalc()) {
                    $('#rateRangeRow').children('td').eq(1).html(''); // clear cell contents
                }

                if (dataJSON.errStatus) {
                    if (dataJSON.rangeType=='single'){
                        creditChartModel.singleRateValue=dataJSON.rate;

                        if (isModifiedCalc()) { // apply new changes where available
                            $('#rateRangeRow').children('td').eq(1).html('<span style="font-size:30px; color:#226d42;">'+dataJSON.rate+'%</span>');
                        } else { // old behavior otherwise
                            $('#rateRangeRow').hide();
                        }
                        $('#rateRange').hide();
                    } else {
                        creditChartModel.singleRateValue=false;
                        $('#rateRangeRow').show();
                        $('#rateRange').show();
                        $('#rateRange').sliderInput({maxRealValue: dataJSON.max,
                            minRealValue: dataJSON.min});
                    }
                } else {
                    creditChartModel.onLoadQueue=[];
                    error(dataJSON.errMessage);
                }
                creditChartModel.isLoading=false;
                $('#loadingIndicator').hide();
            });
    }
};

//=========================================
/**
 * Объект настройки параметров и показа графика
 *
 * @param containerId
 * @param dataJSON = {
 *                    currency:         1, //1=rub, 2=usd, 3=eur
 *                    rate:             7,
 *                    creditTotal:      50000,
 *                    overpayment:      5000,
 *                    reqIncome:        70000,
 *                    duration:         12, //months
 *                    paymentBeginDate: '2.2010',
 *                    paymentEndDate:   '2.2011',
 *                    dateLabels:       ['2.2010', '3.2010', ...],
 *                    series:           {
 *                                        percentPayments: [1000,  980, ...],
 *                                        debtPayments:     [10000, 10000, ...]
 *                                      }
 *                  }
 */
function showChartDiagram(containerId, dataJSON, colorScheme, customStyle)
{
    var tickersAllowed=8;
    var currencyAbbrev=creditChartModel.data.currencyLabels[dataJSON.currency].abbrev;
    var currencyGenetive=creditChartModel.data.currencyLabels[dataJSON.currency].genetive;
    var currencyLocative=creditChartModel.data.currencyLabels[dataJSON.currency].locative; //nb. locative=предложный падеж
    var chartLabelDetails='(в ';
    if (dataJSON.maxPayment >= 100000) {chartLabelDetails+='тыс. '+currencyGenetive;}
    else  {chartLabelDetails+=currencyLocative;}
    chartLabelDetails+=')';
    var decorator=new CreditChartLabelDecorator(dataJSON);
    if (colorScheme==undefined) {colorScheme='web';}
    var colors={
        web: ['#e58749','#8dad48'],
        contrast: ['#f1ae82','#586739']
    };

    if (customStyle!=undefined) {
        Highcharts.setOptions({
            chart: {
                style: customStyle
            }
        });
    }

    var options={
        colors: colors[colorScheme],

        chart: {
            renderTo: containerId,
            defaultSeriesType: 'column',
            backgroundColor: '#f4f1ea'
        },
        legend: {borderWidth: 0},
        title: {text: 'График платежей '+chartLabelDetails},
        xAxis: {
            tickmarkPlacement: 'on',
            startOnTick: false,
            endOntick: true,
            labels: {style: {fontSize: '10px'}}
        },
        yAxis: {
            endOntick: false,
            showFirstLabel: false,
            lineWidth: 1,
            title: {text: null},
            labels: {
                formatter: function() {
                    var label=(dataJSON.maxPayment <= 100000)? this.value:Math.round(this.value/1000);
                    return Highcharts.numberFormat(label,0,'.','\'');
                }
            }
        },
        credits: {enabled: false},
        plotOptions: {
            column: {
                animation: false,
                stacking: 'normal',
                pointPadding: 0.01,
                groupPadding: 0,
                lineWidth: 0,
                shadow: false,
                borderWidth: 0,
                borderColor: '#cdcdcd',
                lineColor: null//,
                //enableMouseTracking: false,
                //marker: {enabled: false}
            }
        },
        tooltip: {
            borderColor: '#226D42',
            formatter: function() {
                if (typeof(dataJSON.series.payment[this.points[0].point.x])=='undefined' ||
                    dataJSON.series.payment[this.points[0].point.x]==0) return false;
                var s = '<b>'+ decorator.renderMDate(this.x) +'</b>';
                s+='<br/>Платеж: '+ dataJSON.series.payment[this.points[0].point.x]+' '+currencyAbbrev;
                $.each(this.points, function(i, point) {
                    s += '<br/>'+ point.series.name +': '+
                        point.y +' '+currencyAbbrev;
                });
                s+='<br/>Остаток долга: '+dataJSON.series.debt[this.points[0].point.x]+' '+currencyAbbrev;

                return s;
            },
            shared: true
        },
        series: [{name: 'Платёж по процентам, начисленным на остаток основного долга'}, {name: 'Платёж по основному долгу'}]
    };

    //protected methods
    //-----------------------------------------------------------
    var buildOptions= function () {
        options.xAxis.tickInterval=calcTickerStep();
        options.series[0].data=dataJSON.series.percentPayments;
        options.series[1].data=dataJSON.series.debtPayments;
        options.xAxis.categories=dataJSON.dateLabels;

        options.series[0].data.push(0);
        options.series[1].data.push(0);
        options.xAxis.categories.push(' ');
        return options;
    };

    //-----------------------------------------------------------
    var calcTickerStep=function(){
        var tickersNum= dataJSON.dateLabels.length;
        return Math.round(tickersNum/tickersAllowed);
    };

    //Main
    //-----------------------------------------------------------
    return new Highcharts.Chart(buildOptions());
}

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


//==========================================================
function validate_date_string(ds) {
    var i,state=0;
    var dd="",mm="",yyyy="";
    if(ds=="") return true;
    for(i=0;i<ds.length;i++) {
        switch(state) {
            case 0:
                if(ds.charAt(i)==".") state=1;
                else if("0123456789".indexOf(ds.charAt(i))==-1) return false;
                else dd+=ds.charAt(i);
                break;
            case 1:
                if(ds.charAt(i)==".") state=2;
                else if("0123456789".indexOf(ds.charAt(i))==-1) return false;
                else mm+=ds.charAt(i);
                break;
            case 2:
                if("0123456789".indexOf(ds.charAt(i))==-1) return false;
                else yyyy+=ds.charAt(i);
        }
    }
    if(state!=2) return false;
    if(isNaN(parseInt(dd)) || isNaN(parseInt(mm)) || isNaN(parseInt(yyyy))) return false;
    if(dd.length != 2 || mm.length !=2 || yyyy.length != 4) return false;
    if(parseInt(dd) < 0 || parseInt(mm) < 0 || parseInt(dd) > 31 || parseInt(mm) > 12) return false;
    return true;
}