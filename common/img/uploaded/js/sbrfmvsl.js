var d = document;
var p = new Array();
function _VSP(s) { p[p.length] = s; }
function getSelected(obj) {
    return d.getElementById(obj).options[d.getElementById(obj).selectedIndex].text;
}
function addSort(a, v) {
    if (v == '') return a;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == v) return a;
        if (a[i] > v) {
            for (var j = a.length - 1; j >= i; j--)
                a[j + 1] = a[j];
            a[i] = v;
            return a;
        }
    }
    a[a.length] = v;
    return a;
}
function fillRegions() {
    d.getElementById(_pn).disabled = true;
	d.getElementById(_card).disabled = true;
	d.getElementById(_ensurance).disabled = true;
	d.getElementById(_safe).disabled = true;
	d.getElementById(_account).disabled = true;
	d.getElementById(_pn).disabled = true;
	
    d.getElementById(_on).innerHTML = '';
    d.getElementById(_rn).options.length = 0;
    var _r = new Array();
    for (var i = 0; i < p.length; i++)
        _r = addSort(_r, p[i].split('|')[0]);
    var _of = (_r.length > 1 ? 1 : 0);
    if (_of) d.getElementById(_rn).options[0] = new Option(_ss);
    for (var i = 0; i < _r.length; i++)
        d.getElementById(_rn).options[i + _of] = new Option(_r[i]);
    var _msk = d.getElementById(_rn).options[1].text;
    var _spb = d.getElementById(_rn).options[2].text;
    d.getElementById(_rn).options[1].text = _spb;
    d.getElementById(_rn).options[2].text = _msk;
    return false;
}
function fillCities() {
    d.getElementById(_pn).disabled = true;
	d.getElementById(_card).disabled = true;
	d.getElementById(_ensurance).disabled = true;
	d.getElementById(_safe).disabled = true;
	d.getElementById(_account).disabled = true;
	d.getElementById(_opsnpo).disabled = true;
	
    d.getElementById(_on).innerHTML = '';
    d.getElementById(_mn).options.length = 0;
    var reg = d.getElementById(_rn);
    var cit = d.getElementById(_cn);
    var x = getSelected(_rn);
    var _c = new Array();
    d.getElementById(_cn).options.length = 0;
    for (var i = 0; i < p.length; i++) {
        var _a = p[i].split(_sp);
        if (_a[0] == x)
            _c = addSort(_c, _a[1]);
    }
    var _of = (_c.length > 1 ? 1 : 0);
    if (_of) cit.options[0] = new Option(_ss);
    for (var i = 0; i < _c.length; i++)
        cit.options[i + _of] = new Option(_c[i]);
    cit.disabled = cit.options.length == 0;
    if (cit.options.length < 2)
        fillMetro();
    return false;
}
function fillMetro() {
    d.getElementById(_pn).disabled = true;
	d.getElementById(_card).disabled = true;
	d.getElementById(_ensurance).disabled = true;
	d.getElementById(_safe).disabled = true;
	d.getElementById(_account).disabled = true;
	d.getElementById(_opsnpo).disabled = true;
	
    d.getElementById(_on).innerHTML = '';
    var reg = d.getElementById(_rn);
    var x = getSelected(_rn);
    var cit = d.getElementById(_cn);
    var y = getSelected(_cn);
    var met = d.getElementById(_mn);
    var _m = new Array();
    d.getElementById(_mn).options.length = 0;
    for (var i = 0; i < p.length; i++) {
        var _a = p[i].split(_sp);
        if (_a[0] == x && _a[1] == y)
            _m = addSort(_m, _a[2]);
    }
    var _of = (_m.length > 1 ? 1 : 0);
    if (_of) met.options[0] = new Option(_ss);
    for (var i = 0; i < _m.length; i++)
        met.options[i + _of] = new Option(_m[i]);
    met.disabled = met.options.length == 0;
    if (met.options.length < 2)
        showOffices();
    return false;
}
function showOffice(a) {
    d.getElementById(_on).innerHTML += '<br/><strong>' + a[3] + '</strong><br/>' + (a[4] == '' ? '' : 'Адрес: ' + a[4] + '<br/>') + (a[5] == '' ? '' : 'График работы: ' + a[5] + '<br/>Оформление паев ПИФ, продуктов «Депозит+ПИФ» и «Депозит+ПИФ+ОМС»: ' + (a[6] == '1' ? 'да' : 'нет') + '<br/>Оформление карт Platinum American Express: ' + (a[7] == '1' ? 'да' : 'нет') + '<br/>Оформление страховых продуктов: Инвестиционное страхование жизни (ИСЖ), Накопительное страхование жизни (НСЖ): ' + (a[8] == '1' ? 'да' : 'нет') + '<br/>Предоставление в аренду банковских сейфов: ' + (a[9] == '1' ? 'да' : 'нет') + '<br/>Открытие сберегательного счета: ' + (a[10] == '1' ? 'да' : 'нет') + '<br/>Оформление негосударственного пенсионного обеспечения (НПО) и обязательного пенсионного страхования (ОПС): ' + (a[11] == '1' ? 'да' : 'нет') + '<br/>');
}
function showOffices() {
    d.getElementById(_on).innerHTML = '';
    var reg = d.getElementById(_rn);
    var cit = d.getElementById(_cn);
    var met = d.getElementById(_mn);
    var _r = getSelected(_rn);
    var _c = (cit.disabled ? '' : getSelected(_cn));
    var _m = (met.disabled ? '' : getSelected(_mn));
    for (var i = 0; i < p.length; i++) {
        var _a = p[i].split(_sp);
        if (_a[0] == _r && _a[1] == _c && _a[2] == _m && (!d.getElementById(_pn).checked || _a[6]!='0') && (!d.getElementById(_card).checked || _a[7]!='0') && (!d.getElementById(_ensurance).checked || _a[8]!='0') && (!d.getElementById(_safe).checked || _a[9]!='0') && (!d.getElementById(_account).checked || _a[10]!='0') && (!d.getElementById(_account).checked || _a[10]!='0') && (d.getElementById(_opsnpo).value == -1 || d.getElementById(_opsnpo).value ==  _a[11])) 
            showOffice(_a);
    }
    d.getElementById(_on).innerHTML = (d.getElementById(_on).innerHTML != '' ? '<br/><strong>Офисы:</strong><br/>' + d.getElementById(_on).innerHTML : _nd);
    d.getElementById(_pn).disabled = false;
	d.getElementById(_card).disabled = false;
	d.getElementById(_ensurance).disabled = false;
	d.getElementById(_safe).disabled = false;
	d.getElementById(_account).disabled = false;
	d.getElementById(_opsnpo).disabled = false;	
}

function showPif() {
    var reg = d.getElementById(_rn);
    var cit = d.getElementById(_cn);
    var met = d.getElementById(_mn);
    var _r = getSelected(_rn);
    var _c = (cit.disabled ? '' : getSelected(_cn));
    var _m = (met.disabled ? '' : getSelected(_mn));
    if (_r != '' && _c != '' && (met.disabled || met.options.length > 0))
        showOffices();
    return true;
}
