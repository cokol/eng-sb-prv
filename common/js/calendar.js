
function show_calendar(str_target, str_date) {
	var arr_months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
		"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
	var week_days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
	var n_weekstart = 1; 

	if (str_date != null && str_date != "") {
		if (str2dt2(str_date) == false) {
		 	alert("Неверный формат даты: "+str_date);
			return;
		}
	}
	var dt_date = (str_date == null || str_date =="" ?  new Date() : str2dt2(str_date));
	var dt_prev_month = new Date(dt_date);
	dt_prev_month.setMonth(dt_date.getMonth()-1);
	if (dt_date.getMonth()%12 != (dt_prev_month.getMonth()+1)%12) {
		dt_prev_month.setMonth(dt_date.getMonth());
		dt_prev_month.setDate(0);
	}
	var dt_prev_year = new Date(dt_date);
	dt_prev_year.setMonth(dt_date.getMonth()-12);

	var dt_next_month = new Date(dt_date);
	dt_next_month.setMonth(dt_date.getMonth()+1);
	if ((dt_date.getMonth() + 1)%12 != dt_next_month.getMonth()%12)
		dt_next_month.setDate(0);

	var dt_next_year = new Date(dt_date);
	dt_next_year.setMonth(dt_date.getMonth()+12);
	
	var dt_firstday = new Date(dt_date);
	dt_firstday.setDate(1);
	dt_firstday.setDate(1-(7+dt_firstday.getDay()-n_weekstart)%7);
	var dt_lastday = new Date(dt_next_month);
	dt_lastday.setDate(0);
	
	var str_buffer = new String (
		"<html>\n"+
		"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=windows-1251\">\n"+
		"<head>\n"+
		"	<title>Выбор даты</title>\n"+
		"</head>\n"+
        "<body bgcolor=\"#fafafa\" text=\"#000000\" alink=\"#660000\" link=\"#000000\" vlink=\"#000000\" marginwidth=\"10\" marginheight=\"10\" topmargin=\"10\" bottommargin=\"10\" leftmargin=\"10\" rightmargin=\"10\">\n"+
		"<table style=\"margin-bottom:5px;\" align=center cellspacing=\"0\" cellpadding=\"1\" border=\"0\" width=200>\n"+
		"<tr bgcolor=\"#e5e6e0\">\n<td align=center nowrap><a href=\"javascript:window.opener.show_calendar('"+str_target+"', '"+dt2dtstr2(dt_prev_year)+"');\" style=\"text-decoration: none; color:#000000; font-family: verdana; font-size: 10px; font-weight:bold;\"><img src=\"../../../../common/img/pager_first.gif\"  border=\"0\" alt=\"Предыдущий год\" title=\"Предыдущий год\"></a><a style=\"text-decoration: none; color:#000000; font-size:9pt; font-family: arial\" href=\"javascript:window.opener.show_calendar('"+
		str_target+"', '"+ dt2dtstr2(dt_prev_month)+"');\">"+
		"<b><img src=\"../../../../common/img/pager_prev.gif\" border=\"0\" alt=\"Предыдущий месяц\" title=\"Предыдущий месяц\"></b></a></td>\n"+
		"<td colspan=\"5\" align=center ><font style=\"color:#5d5e5b; font-weight: bold; font-size:12px; font-family: Arial\">"
		+arr_months[dt_date.getMonth()]+" "+dt_date.getFullYear()+"</font></td>\n"+
		"<td align=\"center\" nowrap><a style=\"text-decoration: none; color:#000000; font-size:9pt; font-family: arial\" href=\"javascript:window.opener.show_calendar('"+
		str_target+"', '"+dt2dtstr2(dt_next_month)+"');\">"+
		"<b><img src=\"../../../../common/img/pager_next.gif\" border=\"0\" alt=\"Следующий месяц\" title=\"Следующий месяц\"></b></a><a href=\"javascript:window.opener.show_calendar('"+str_target+"', '"+dt2dtstr2(dt_next_year)+"');\" style=\"text-decoration: none; color:#000000; font-family: verdana; font-size: 10px; font-weight:bold;\"><img src=\"../../../../common/img/pager_last.gif\" border=\"0\" alt=\"Следующий год\" title=\"Следующий год\"></a></td>\n</tr>\n"+
        "</table>"+ 
		"<table align=center cellspacing=\"0\" cellpadding=\"1\" border=\"0\" width=200>\n"
	);

	var dt_current_day = new Date(dt_firstday);
	str_buffer += "<tr>\n";
	for (var n=0; n<7; n++)
		str_buffer += "<td align=center><font style=\"color:#008558; font-size:9pt; font-weight: bold; font-family: Arial\">"+
		week_days[(n_weekstart+n)%7]+"</font></td>\n";
	str_buffer += "</tr>\n";
	while (dt_current_day.getMonth() == dt_date.getMonth() ||
		dt_current_day.getMonth() == dt_firstday.getMonth()) {
		str_buffer += "<tr>\n";
		for (var n_current_wday=0; n_current_wday<7; n_current_wday++) {
				if (dt_current_day.getDate() == dt_date.getDate() &&
					dt_current_day.getMonth() == dt_date.getMonth())
					
					str_buffer += "	<td  align=\"center\" bgcolor=\"#e5e6e0\">";
				else if (dt_current_day.getDay() == 0 || dt_current_day.getDay() == 6)
					
					str_buffer += "	<td align=\"center\">";
				else
					
					str_buffer += "	<td align=\"center\">";

				if (dt_current_day.getMonth() == dt_date.getMonth())
					
					str_buffer += "<a style=\"color:#5d5e5b; font-size:9pt; font-family: arial; text-decoration: none;\" href=\"javascript:window.opener."+str_target+
					".value='"+dt2dtstr2(dt_current_day)+"'; self.close();\">"+
					"";
				else 
					
					str_buffer += "<a style=\"color:#ababab; font-size:9pt; font-family: arial; text-decoration: none;\" href=\"javascript:window.opener."+str_target+
					".value='"+dt2dtstr2(dt_current_day)+"'; self.close();\">"+
					"";
				str_buffer += dt_current_day.getDate()+"</a></td>\n";
				dt_current_day.setDate(dt_current_day.getDate()+1);
		}
		
		str_buffer += "</tr>\n";
	}
	
	str_buffer += "<tr><td colspan=7><b style=\"color:#6f706d; font-size:9pt; font-family: arial;\">Текущая дата:</b>&nbsp;<a style=\"text-decoration: none; color:#008558; font-size:9pt; font-family: arial\" href=\"javascript:window.opener."+str_target+".value='"+
	dt2dtstr2(new Date())+"';self.close();\"><b>"+dt2dtstr2(new Date())+"</b></a></td></tr>";
	
	str_buffer +=
		"</table>\n" +
		"</body>\n" +
		"</html>\n";

	var vWinCal = window.open("", "Calendar", 
		"width=240,height=180,status=no,resizable=no,top=200,left=200");
	vWinCal.opener = self;
	vWinCal.focus();
	var calc_doc = vWinCal.document;
	calc_doc.write (str_buffer);
	calc_doc.close();
}

function str2dt2 (str_date) {
	var re_date = /^(\d+)\.(\d+)\.(\d+)$/;
	if (!re_date.exec(str_date)) {
		return (false);
	} else {
		var arrD = new Array();
		var m, d, Y;
		arrD = str_date.split(".");
		d = parseInt(correct_number(arrD[0]));
		m = parseInt(correct_number(arrD[1])) - 1;
		Y = parseInt(arrD[2]);
		return (new Date(Y, m, d));
		//return (new Date (RegExp.$3, RegExp.$2-1, RegExp.$1));
	}
}

function dt2dtstr2 (dt_date) {
var bday, bmonth;
bday = dt_date.getDate().toString();
bmonth = (dt_date.getMonth()+1).toString();

if (bmonth.length == 1) {
	bmonth = "0" + bmonth;
}
if (bday.length == 1) {
	bday = "0" + bday;
}

	return (new String (
			bday+"."+bmonth+"."+dt_date.getFullYear()));
}

function correct_number(strIn) {
	var res;
	if (strIn.length = 2 && (strIn.substr(0, 1) == '0')) {
		res = strIn.substr(1, 1);
	} else {
		res = strIn;
	}
	return (res);
}

