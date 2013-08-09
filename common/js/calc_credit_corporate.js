var CorpCalc = {
	'formId': '',
	'a1Id': '',
	'a2Id': '',
	'a3Id': '',
	'a4Id': '',
	'a5Id': '',
	'a6Id': '',
	'b1Id': '',
	'b2Id': '',
	'b3Id': '',
	'b4Id': '',
	'activities': [],
	'targets': [],
	'products': [],
	'formulas': [],
	'init': function(params)
	{
		if(params){
			for(name in params){
				this[name] = params[name];
			};
		};
		this.fillField(this.a1Id, 'activities');
		this.fillField(this.b1Id, 'targets');
		this.fillField(this.b2Id, 'products');
		this.fillField(this.b4Id, 'formulas');
	},
	'getById': function(entityName, id)
	{
		var entity = false, row;
			
		if(this[entityName]){
			for(key in this[entityName]){
				row = this[entityName][key];
				if(row.id == id){
					entity = row;
					break;
				};
			};
		};

		return entity;
	},
	'getEntity': function(entityName)
	{
		var entity = false;
			
		if(this[entityName]){
			entity = this[entityName];
		};

		return entity;
	},
	'fillField': function (fieldId, entity)
	{
		var txt = '', row;
		try {
			if (this[entity]){
				for (key in this[entity]){
					row = this[entity][key];
					txt += '<option' + (row.id?' value="' + row.id + '"':'') + '>' + row.title + '</option>';
				};
				jQuery('#' + fieldId).html(txt);
			};
		} catch(e) {if (debug){alert(e);};};
	},
	'min': function(a, b)
	{
		return (a < b? a : b);
	},
	'getMinSum': function()
	{
		var A1 = jQuery('#' + this.a1Id).val()	//Вид деятельности
			, A3 = jQuery('#' + this.a3Id).val().replace(/\s+/g,'')//Среднемесячная выручка от реализации
			, A4 = jQuery('#' + this.a4Id).val().replace(/\s+/g,'')//Среднемесячная прибыль
			, A5 = jQuery('#' + this.a5Id).val().replace(/\s+/g,'')//Стоимость активов используемых в бизнесе
			, A6 = jQuery('#' + this.a6Id).val().replace(/\s+/g,'')//Объём задолжности по кредитам и займам перед другили Банками
			, B1 = jQuery('#' + this.b1Id).val()//Цель кредита
			, B2 = jQuery('#' + this.b2Id).val()//Вид кредита
			, B3 = jQuery('#' + this.b3Id).val()//Срок кредита
			, sum = 0;

		//Если в поле «Вид кредита» выбран кредит «Бизнес-доверие», то минимальная сумма кредита 80 тыс.рублей,
		if (B2 == 9) {
			sum = 80;
		}
		if (B2 == 3 || B2 == 4 || B2 == 6 || B2 == 8 || B2 == 2 || B2 == 5 || B2 == 7) {
			
			sum = 150;
		}

		return Math.round(sum * 1000);
	},
	'getMaxSum': function()
	{
		var A1 = jQuery('#' + this.a1Id).val()	//Вид деятельности
			, A3 = jQuery('#' + this.a3Id).val().replace(/\s+/g,'')//Среднемесячная выручка от реализации
			, A4 = jQuery('#' + this.a4Id).val().replace(/\s+/g,'')//Среднемесячная прибыль
			, A5 = jQuery('#' + this.a5Id).val().replace(/\s+/g,'')//Стоимость активов используемых в бизнесе
			, A6 = jQuery('#' + this.a6Id).val().replace(/\s+/g,'')//Объём задолжности по кредитам и займам перед другили Банками
			, B1 = jQuery('#' + this.b1Id).val()//Цель кредита
			, B2 = jQuery('#' + this.b2Id).val()//Вид кредита
			, B3 = jQuery('#' + this.b3Id).val()//Срок кредита
			, sum = 0;


        /*Если в поле «Вид кредита» выбран кредит «Экспресс-авто» или «Экспресс-актив», то максимальная сумма
         ограничивается 5000 тыс.руб., расчет производится по формуле, применяемой к кредиту «Кредит «Доверие» (B2 == 1)
         */
        if (B2 == 11 || B2 == 12) {
            return this.min(((A4 * B3 + 0.2 * A3 * B3) * 0.5 - A6), 5000) * 1000;
        }

		if (B1 == 1 && A1 != 5 && B2 != 8 && B2 != 1) {
			sum = this.min((A3 * 3 - A6 * 0.1), (5 * (A5 - A6) - A5));
		} else if (B1 == 2 && A1 != 5 && B2 != 8 && B2 != 1) {
			sum = this.min((A4 * B3 * 0.8 - A6), (5 * (A5 - A6) - A5));
		} else if (A1 != 5 && B2 == 8) {
			sum = B3 * 0.75 * A4;
		} else if (A1 != 5 && B2 == 1) {
			sum = this.min(((A4 * B3 + 0.2 * A3 * B3) * 0.5 - A6), 3000);
		}
		 else if (B1 == 1 && A1 == 5 && B2 != 1) {
			sum = this.min((0.75 * A3 * 12 - A6 * 0.6), (5 * (A5 - A6) - A5));
		} else if (B1 == 2 && A1 == 5 && B2 != 1) {
			sum = this.min((A4 * 0.8 - A6), (5 * (A5 - A6) - A5));
		} else if (B1 == 3 && A1 == 5 && B2 != 1) {
			sum = this.min((A4 * 0.8 - A6), (5 * (A5 - A6) - A5));
		}
		
		//Если в поле «Вид кредита» выбран кредит «Госзаказ», то максимальная сумма кредита не может превышать 90 000 руб.
		if (B2 == 5) {
			sum =this.min(sum, 90);
		}
		else if (B2 == 9) {
			
			sum = this.min(sum, 3000);
		}
		return Math.round(sum * 1000);
	},
	'currencyRound': function(value)
	{
		return Math.round(value * 100) / 100;
	},
	'getRate': function()
	{
		return this.getById('products', jQuery('#' + this.b2Id).val() * 1).rate;
	},
	'getSpecificRate': function(Rate)
	{
		return Rate / 1200;
	},
	'getPeriod': function()
	{
		return jQuery('#' + this.b3Id).val() * 1;
	},
	'getRegularPayment': function(sum, period, rate)
	{
		if (period == 0) return 0;
		return sum * rate * Math.pow(1 + rate, period) / (Math.pow(1 + rate, period) - 1);
	},
	'pad': function(number, length)
	{
		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		};
		return str;
	},
	'buildDateLabel': function(startDate, month)
	{
		var mdate = new Date(startDate.getTime());
		mdate.setMonth(startDate.getMonth() + month);
		var mNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
		return (this.pad((mdate.getMonth('month') + 1), 2) + '.' + mdate.getFullYear());
	},
	'correctLastPayment': function(series, key, totalPaid, totalToBePaid)
	{
		var lastIndex = series[key].length-1;
		var lastPayment = series[key][lastIndex];
		series[key][lastIndex] = this.currencyRound(totalToBePaid - (totalPaid-lastPayment));
		return series;
	},
	'buildDifferentialSeries': function(options)
	{
		var startDateParts = options.startDate.split('.');
		var startDate = new Date(startDateParts[2], startDateParts[1], startDateParts[0]);
		var specificRate = this.getSpecificRate(options.rate); //удельная ставка
		var debt = options.sum;
		var regularPayment = options.sum/options.duration;// = this.getRegularPayment(options.sum,options.duration, specificRate);
		var paymentsTotalReal = 0, paymentsTotal = 0, totalDebtPaid = 0, totalPercentPaid = 0;
		var maxPayment = 0;

		var dateLabels = [];
		var series = {percentPayments: [], debtPayments: [], debt: [], payment: []};
		var pPercent, pDebt, m;
		for (m = 0; m < options.duration; m++){
			pPercent = debt * specificRate;
			pDebt = regularPayment;
			if (pDebt > debt){
				pDebt = debt;
			};
			payment = pDebt + pPercent;
			paymentsTotalReal += payment;

			debt = debt - this.currencyRound(pDebt);
			paymentsTotal += this.currencyRound(payment);
			totalDebtPaid += this.currencyRound(pDebt);
			totalPercentPaid += this.currencyRound(pPercent);

			dateLabels[dateLabels.length] = this.buildDateLabel(startDate, m);
			series.percentPayments[series.percentPayments.length] = this.currencyRound(pPercent);
			series.debtPayments[series.debtPayments.length] = this.currencyRound(pDebt);
			series.debt[series.debt.length] = this.currencyRound(debt);
			series.payment[series.payment.length] = this.currencyRound(payment);

			if (maxPayment < payment) {
				maxPayment = this.currencyRound(payment);
			};
		};
		series = this.correctLastPayment(series, 'percentPayments', totalPercentPaid, paymentsTotalReal-options.sum);
		series = this.correctLastPayment(series, 'debtPayments', totalDebtPaid, options.sum);
		series = this.correctLastPayment(series, 'payment', paymentsTotal, paymentsTotalReal);
		series.debt[series.debt.length] = 0;
		return {
			currency: options.currency,
			maxPayment: maxPayment,
			dateLabels: dateLabels,
			series: series
		};
	},
	'buildAnnuitySeries': function(options)
	{
		var startDateParts = options.startDate.split('.');
		var startDate = new Date(startDateParts[2], startDateParts[1], startDateParts[0]);
		var specificRate = this.getSpecificRate(options.rate); //удельная ставка
		var debt = options.sum;
		var regularPayment = this.getRegularPayment(options.sum,options.duration, specificRate);
		var paymentsTotalReal = 0, paymentsTotal = 0, totalDebtPaid = 0, totalPercentPaid = 0;
		var maxPayment = 0;

		var dateLabels = [];
		var series = {percentPayments: [], debtPayments: [], debt: [], payment: []};
		var pPercent, pDebt, m;
		for (m = 0; m < options.duration; m++){
			pPercent = debt * specificRate;
			pDebt = 0;
			if (m == options.duration - 1) {//последний месяц
				pDebt = debt;
			} else {
				pDebt = regularPayment - pPercent;
			};
			if (pDebt > debt){
				pDebt = debt;
			};
			payment = pDebt + pPercent;
			paymentsTotalReal += payment;

			debt = debt - this.currencyRound(pDebt);
			paymentsTotal += this.currencyRound(payment);
			totalDebtPaid += this.currencyRound(pDebt);
			totalPercentPaid += this.currencyRound(pPercent);

			dateLabels[dateLabels.length] = this.buildDateLabel(startDate, m);
			series.percentPayments[series.percentPayments.length] = this.currencyRound(pPercent);
			series.debtPayments[series.debtPayments.length] = this.currencyRound(pDebt);
			series.debt[series.debt.length] = this.currencyRound(debt);
			series.payment[series.payment.length] = this.currencyRound(payment);

			if (maxPayment < payment) {
				maxPayment = this.currencyRound(payment);
			};
		};
		series = this.correctLastPayment(series, 'percentPayments', totalPercentPaid, paymentsTotalReal-options.sum);
		series = this.correctLastPayment(series, 'debtPayments', totalDebtPaid, options.sum);
		series = this.correctLastPayment(series, 'payment', paymentsTotal, paymentsTotalReal);
		series.debt[series.debt.length] = 0;
		return {
			currency: options.currency,
			maxPayment: maxPayment,
			dateLabels: dateLabels,
			series: series
		};
	}
};
