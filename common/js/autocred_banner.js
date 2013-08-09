var acBanner = function() {

    var init = function() {
            window.isAutoCredit = true;
            $('#btnBackToForm').hide();

            $(document).ajaxStop(function(){
                $(this).unbind();
                fillAutocredVals();
                $('#btnBuild').trigger('click');
                $(document).scrollTo('#creditCalcFormChartContainer', 800);
            });
        },

        getCarData = function(priceGroupId) {
            var i, k, o, cars;

            for (k in CAR_MODELS) {
                if (CAR_MODELS.hasOwnProperty(k) &&
                    typeof CAR_MODELS[k].models === 'object' &&
                    CAR_MODELS[k].models.length) {

                    cars = CAR_MODELS[k].models;
                    for(i = 0; i < cars.length; i++) {
                        if (cars[i].price_group == priceGroupId) {
                            return {
                                'cid': cars[i].id,
                                'cg': CAR_MODELS[k].id,
                                'pg': cars[i].price_group
                            };
                        }
                    }
                }
            }
        },

        parseQ = function(q) {
            var result = {},
                i, k, v,
                arr = [], kv = [];

            if (q.charAt(0) === '?') {
                q = q.slice(1);
            }

            if (q.length) {
                q = q.replace(/\+/g, ' ');
                arr = q.split('&');
                for (i = 0; i < arr.length; i++) {
                    kv = arr[i].split('=');
                    k = decodeURIComponent(kv[0]);
                    v = (kv[1]) ? decodeURIComponent(kv[1]) : '';
                    result[k] = v;
                }
            }

            return result;
        },

        validateAutoQ = function(o) {
            var isInt = function(n) {
                    return (/^\d+$/).test(n);
                },
                inArr = function(v, arr) {
                    return (jQuery.inArray(v, arr) > -1);
                };

            if (!inArr(o.vid, ['sk', 'ep', 'doh'])) o.vid = 'sk';

            if (!isInt(o.sm)) o.sm = 0;
            if (!isInt(o.sk)) o.sk = 700000;
            if (!isInt(o.mep)) o.mep = 0;
            if (!isInt(o.kod)) o.kod = 0;

            if (!isInt(o.srok) || o.srok < 3 || o.srok > 72)   o.srok = 36;
            if (!isInt(o.pvz) || o.pvz < 0 || o.pvz > 100) o.pvz = 15;

            if (!inArr(o.val, ['rub', 'dol', 'eu'])) o.val = 'rub';
            if (!inArr(o.car, ['new', 'old'])) o.car = 'new';
            if (!inArr(o.usl, ['ob', 'zp', 'rab'])) o.usl = 'ob';

            var re = /^([0][1-9]|[1][0-9]|[2][0-9]|[3][01])([0][1-9]|[1][0-2])(20\d{2})$/;
            if (re.test(o.date)) {
                o.date = o.date.slice(0, 2) + '.' + o.date.slice(2, 4) + '.' + o.date.slice(4);
            } else {
                var d = new Date();
                o.date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
                o.date += '.' + ( (d.getMonth() + 1)
                    ? '0' + (d.getMonth() + 1)
                    : (d.getMonth() + 1) );
                o.date += '.' + d.getFullYear();
            }

            return o;
        },

        fillAutocredVals = function() {
            var fillVals = {
                    'srok': 'duration',
                    'pvz': 'AP_initial_installment',
                    'date': 'paymentStartDate'
                },
                obj = parseQ(window.location.search),
                x;

            if (obj && obj.vid) {
                obj = validateAutoQ(obj);

                if (obj.vid == 'sk') {
                    fillVals['sk'] = 'creditTotal';
                } else if (obj.vid == 'doh') {
                    fillVals['sm'] = 'monthlyIncome';
                } else if (obj.vid == 'ep') {
                    fillVals['mep'] = 'monthlyPayment';
                }

                x = { 'rub': 1, 'dol': 2, 'eu': 3 };
                // изменяем только если валюта отлична от текущей
                if ( x[obj.val] != parseInt( $('#currencyID').val(), 10) ) {
                    $('#currencyID').val( x[obj.val] ).change();
                }

                x = { 'sk': 'byCreditTotal', 'doh': 'byMonthlyIncome', 'ep': 'byMonthlyPayment' };
                $('#initialConditionsType').val( x[obj.vid] ).change();

                x = { 'new': 'new', 'old': 'used' };
                $('#AP_car_type').val( x[obj.car] ).change();

                x = { 'ob': 'common', 'zp': 'salary_project', 'rab': 'job_accred' };
                $('#AP_debtor_category').val( x[obj.usl] ).change();

                for (var k in fillVals) {
                    if (fillVals.hasOwnProperty(k)) {
                        $('#' + fillVals[k]).val(obj[k]).change();
                    }
                }

                $(document).ajaxStop(function() {
                    $(this).unbind();
                    var cObj = getCarData( parseInt(obj.kod, 10) );
                    if (cObj) {
                        $('#CRED_CAR_BRAND').val(cObj.cg).change();
                        $('#CRED_CAR_MODEL').val(cObj.cid).change();
                        $('#AP_CAR_PRICE_GROUP').val(cObj.pg).change();
                    }
                });
            }
        };

    return init();
};
