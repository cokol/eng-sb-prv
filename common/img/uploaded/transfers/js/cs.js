$(document).ready(function($){	
	if( $('a.fixedTip1').length ) {$('a.fixedTip1').bind('click', function(e){e.preventDefault();}); $('a.fixedTip1').aToolTip({fixed: true, toolTipClass: 'dTheme1'})};
	if( $('a.fixedTip2').length ) {$('a.fixedTip2').bind('click', function(e){e.preventDefault();}); $('a.fixedTip2').aToolTip({fixed: true, toolTipClass: 'dTheme2'})};
	if( $('a.fixedTip3').length ) {$('a.fixedTip3').bind('click', function(e){e.preventDefault();}); $('a.fixedTip3').aToolTip({fixed: true, toolTipClass: 'dTheme3'})};

	$('.tbox').each(function(i, item){
		$(item).attr('capital', 1);
	})
	
	$('ul.tabs li:not(.current)').live('click', function(e) {
		e.preventDefault();
		$(this).addClass('current').siblings().removeClass('current').parent().parent().parent().parent().parent().parent().find('.tbox').hide().eq( $(this).parent().find('li').index( $(this)) ).fadeIn(150);
		if( $(this).parent().parent().parent().parent().parent().parent().find('.tbox').eq( $(this).parent().find('li').index( $(this)) ).attr('capital') == 0){
			$(this).parent().parent().next().find('.capital').attr('checked', '');
		} else {
			$(this).parent().parent().next().find('.capital').attr('checked', 'checked');
		};
		
	});
	
	$(".nnew-table h2").click(function(e){
		e.preventDefault();
		$(this).next("div").slideToggle("slow")
	}); 

	$('.capital').next().bind('click', function(e){
		e.preventDefault();
		$(this).prev().click().change();
	})
	
	$('.capital').change(function() {
		if( $(this).attr('checked') ) {
			$(this).parent().parent().parent().parent().parent().parent().find('.nnew-table-t').eq( $(this).parent().parent().prev().find('li').index( $(this).parent().parent().prev().find('li.current') ) ).attr('capital', 1).find('span').show();
		} else {
			$(this).parent().parent().parent().parent().parent().parent().find('.nnew-table-t').eq( $(this).parent().parent().prev().find('li').index( $(this).parent().parent().prev().find('li.current') ) ).attr('capital', 0).find('span').hide();
		}
	});
	
	if( $(".podbor-vk-header").length ) $(".podbor-vk-header").sticky({ topSpacing: 0 });
	
	// загрузка данных по вкладам
	
	var tables_file = new Array(
		// массив с названием файлов с данными
		'/projects/engage/sber/contributions6/files/add_15052013.csv',
		'/projects/engage/sber/contributions6/files/add_online-15052013.csv',
		'/projects/engage/sber/contributions6/files/control_online-15052013.csv',
		'/projects/engage/sber/contributions6/files/control-15052013.csv',
		'/projects/engage/sber/contributions6/files/save_online-15052013.csv',
		'/projects/engage/sber/contributions6/files/save-15052013.csv'
	); 
/*
	time_array = new Array(
		['от 1 до 2 мес'			, '1 мес.'],
		['от 2 до 3 мес'			, '2 мес.'],
		['от 3 до 6 мес'			, '3 мес.'],
		['от 6 мес до 1 года'	, '6 мес.'],
		['от 1 до 2 лет '		, '1 год'],
		['от 2 до 3 лет '		, '2 года'],
		['3 года '					, '3 год']);
*/	
	currency_array = new Array(
		['Российский рубль'	, 'Рубли'],
		['Доллар США' 			, 'Доллары США'],
		['Евро' 						, 'Евро']
	);

	mts_contribution_table_create('contribution-table', tables_file);
	
})

function mts_contribution_table_create(class_name, table){

	var table_id = $('.' + class_name).attr('id').split('_')[1];
	var tables = $('.' + class_name + ' .nnew-table-t'); // таблицы, в которые будет вставляться информация
	tables_start = new Array(1, 1); // строка и столбец, с которых в файле начинается нужная информация
	
	var contribution_array = new Array();
	var amount_array = new Array();
	var time_array = new Array();
	var contribution_capital_array = new Array();
	var amount_capital_array = new Array();
	var time_capital_array = new Array();
	
	var capitalization = false;

	if( tables.length ){
		var file, n;
		var hostname = document.location.protocol + '//' + document.location.hostname;
				
		// делаем запрос на получение файла
		$.ajax({
			url: hostname + table[table_id], // адрес для запроса - текущий сервер + название файла с данными
			dataType: "html",
			success: function(msg){
				// парсин полученного файла
				array_loaded = $.csv.toArrays(msg, {
				  // delimiter:"'", // sets a custom value delimiter character
				  separator:";" // sets a custom field separator character
				});
				
				capitalization = array_loaded[0][9] ? 1 : 0;
				
				for( i = tables_start[0], n = array_loaded.length; i < n; i++){
					currency = mts_indexOf(currency_array, array_loaded[i][2]);
					//time = mts_indexOf(time_array, array_loaded[i][6]);
					
					if ( (array_loaded[i][8] == '-') || !capitalization){
						time_array[currency] = typeof time_array[currency] !== 'undefined' ? time_array[currency] : [];
						time = mts_indexOf(time_array[currency], array_loaded[i][6]);
						if( time === false) {
							time_array[currency].push([array_loaded[i][6], '']);
							time = time_array[currency].length - 1;
						}
						
						amount_array[currency] = typeof amount_array[currency] !== 'undefined' ? amount_array[currency] : [];
						amount_array[currency][time] = typeof amount_array[currency][time] !== 'undefined' ? amount_array[currency][time] : [];
						if(array_loaded[i][5] != '0'){
							amount = mts_indexOf(amount_array[currency][time], array_loaded[i][5].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'));
						} else {
							if(array_loaded[i][4] != '0'){
								amount = mts_indexOf(amount_array[currency][time], 'от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;') + ' до ' + array_loaded[i][4].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'));
							} else {
								amount = mts_indexOf(amount_array[currency][time], 'от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'));
							}
						}
						
						if( !amount ) {
							if(array_loaded[i][5] != '0'){
								amount_array[currency][time].push([array_loaded[i][5].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'), '']);
							} else {
								if(array_loaded[i][4] != '0'){
									amount_array[currency][time].push(['от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;') + ' до ' + array_loaded[i][4].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'), '']);
								} else {
									amount_array[currency][time].push(['от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'), '']);
								}
							}
							amount = amount_array[currency][time].length - 1;
						}
					
						contribution_array[ currency ] = typeof contribution_array[ currency ] !== 'undefined' ? contribution_array[ currency ] : [];
						contribution_array[ currency ][ amount ] = typeof contribution_array[ currency ][ amount ] !== 'undefined' ? contribution_array[ currency ][ amount ] : [];
						contribution_array[ currency ][ amount ][ time ] = typeof contribution_array[ currency ][ amount ][ time ] !== 'undefined' ? contribution_array[ currency ][ amount ][ time ] : [];
						contribution_array[ currency ][ amount ][ time ].push(array_loaded[i][0]);
						contribution_array[ currency ][ amount ][ time ].push(array_loaded[i][8 + capitalization]);
					} else {
						time_capital_array[currency] = typeof time_capital_array[currency] !== 'undefined' ? time_capital_array[currency] : [];
						time = mts_indexOf(time_capital_array[currency], array_loaded[i][6]);
						if( time === false) {
							time_capital_array[currency].push([array_loaded[i][6], '']);
							time = time_capital_array[currency].length - 1;
						}
					
						amount_capital_array[currency] = typeof amount_capital_array[currency] !== 'undefined' ? amount_capital_array[currency] : [];
						amount_capital_array[currency][time] = typeof amount_capital_array[currency][time] !== 'undefined' ? amount_capital_array[currency][time] : [];
						if(array_loaded[i][5] != '0'){
							amount = mts_indexOf(amount_capital_array[currency][time], array_loaded[i][5].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'));
						} else {
							if(array_loaded[i][4] != '0'){
								amount = mts_indexOf(amount_capital_array[currency][time], 'от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;') + ' до ' + array_loaded[i][4].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'));
							} else {
								amount = mts_indexOf(amount_capital_array[currency][time], 'от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'));
							}
						}
						if( !amount ) {
							if(array_loaded[i][5] != '0'){
								amount_capital_array[currency][time].push([array_loaded[i][5].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'), '']);
							} else {
								if(array_loaded[i][4] != '0'){
									amount_capital_array[currency][time].push(['от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;') + ' до ' + array_loaded[i][4].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'), '']);
								} else {
									amount_capital_array[currency][time].push(['от ' + array_loaded[i][3].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'), '']);
								}
							}
							amount = amount_capital_array[currency][time].length - 1;
						}

						contribution_capital_array[ currency ] = typeof contribution_capital_array[ currency ] !== 'undefined' ? contribution_capital_array[ currency ] : [];
						contribution_capital_array[ currency ][ amount ] = typeof contribution_capital_array[ currency ][ amount ] !== 'undefined' ? contribution_capital_array[ currency ][ amount ] : [];
						contribution_capital_array[ currency ][ amount ][ time ] = typeof contribution_capital_array[ currency ][ amount ][ time ] !== 'undefined' ? contribution_capital_array[ currency ][ amount ][ time ] : [];
						contribution_capital_array[ currency ][ amount ][ time ].push(array_loaded[i][0]);
						contribution_capital_array[ currency ][ amount ][ time ].push(array_loaded[i][8+capitalization]);
					}

				}
				row_text = 'Неснижаемый остаток';
				if(capitalization){
					row_text = 'Сумма вклада';
				}
				
				for( currency_index = 0, currency_length = currency_array.length; currency_index < currency_length; currency_index++){
					table_text = '<table><tr><th class="emt"></th><th class="first">' + row_text + '</th>';
					for( time_index = 0, time_length = time_array[currency_index].length; time_index < time_length; time_index++){
							table_text = table_text + '<th>' + time_array[currency_index][time_index][0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;') + '</th>';
					}
					table_text = table_text + '<th class="emt"></th></tr><tr class="top"><td colspan="10"></td></tr>';
					
					for( amount_index = 0, amount_length = amount_array[ currency_index ][0].length; amount_index < amount_length; amount_index++){
						table_text = table_text + '<tr><td class="emt"></td>';
						table_text = table_text + '<td class="first">' + amount_array[currency_index][0][amount_index][0] + '</td>';
						for( time_index = 0, time_length = time_array[currency_index].length; time_index < time_length; time_index++){
							table_text = table_text + '<td>';
							price = contribution_array[ currency_index ][ amount_index ][ time_index ][0];
							capital = contribution_array[ currency_index ][ amount_index ][ time_index ][1];
							if(capital){
								price = price + '<span>' + capital + '</span>';
							}
							price = '<div>' + price + '</div>';
							table_text = table_text + price;
							table_text = table_text + '</td>';
						}
					}
					
					table_text = table_text + '<tr class="end"><td class="emt"></td><td class="first">&nbsp;</td><td colspan="7"></td><td class="emt"></td></tr></table><div class="snoska-txt">Ставки указаны в % годовых.<br />Ставка по вкладу с учетом капитализации процентов рассчитана по формуле.</div>';
					
					$(tables[currency_index]).html(table_text);
				}
				if( contribution_capital_array.length ){
					var tables_capital = $('.' + class_name + '-capital .nnew-table-t');
					for( currency_index = 0, currency_length = currency_array.length; currency_index < currency_length; currency_index++){
						table_text = '<table><tr><th class="emt"></th><th class="first">Сумма вклада</th>';
						for( time_index = 0, time_length = time_capital_array[currency_index].length; time_index < time_length; time_index++){
								table_text = table_text + '<th>' + time_capital_array[currency_index][time_index][0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;') + '</th>';
						}
						table_text = table_text + '<th class="emt"></th></tr><tr class="top"><td colspan="10"></td></tr>';
						
						for( amount_index = 0, amount_length = amount_capital_array[ currency_index ][0].length; amount_index < amount_length; amount_index++){
							table_text = table_text + '<tr><td class="emt"></td>';
							table_text = table_text + '<td class="first">' + amount_capital_array[currency_index][0][amount_index][0] + '</td>';
							for( time_index = 0, time_length = time_capital_array[currency_index].length; time_index < time_length; time_index++){
								table_text = table_text + '<td>';
								price = contribution_capital_array[ currency_index ][ amount_index ][ time_index ][0];
								capital = contribution_capital_array[ currency_index ][ amount_index ][ time_index ][1];
								if(capital){
									price = price + '<span>' + capital + '</span>';
								}
								price = '<div>' + price + '</div>';
								table_text = table_text + price;
								table_text = table_text + '</td>';
							}
						}
						
						table_text = table_text + '<tr class="end"><td class="emt"></td><td class="first">&nbsp;</td><td colspan="7"></td><td class="emt"></td></tr></table><div class="snoska-txt">Ставки указаны в % годовых.<br />Ставка по вкладу с учетом капитализации процентов рассчитана по формуле.</div>';
						
						$( tables_capital[currency_index] ).html(table_text);
					}
				} else {
					// $('.contribution-table .check-box').hide();
					$('.' + class_name + '-capital').hide();
				}
			}
		})

	}
}

function mts_indexOf(array, needle, index){
	index = typeof index !== 'undefined' ? index : 0;
	for (var i = 0, n = array.length; i < n; i++) {
		 if (array[i][index] === needle) {
			return i;
		 }
	}
	return false
}