$(document).ready(function() {

  if ($(".transfer-form").length) {
  
    $("#formInt").attr("autocomplete", "off");
    $("#formRus").attr("autocomplete", "off");
  
    var transfersRaw = $.getCsv('../../../../common/img/uploaded/transfers/example.csv');
    
    if (transfersRaw) {
    
      var transfersSplitted = transfersRaw.split('\n');
      
      transfersSplitted.splice(0,3);
      
      var transfers = new Array();
      
      for (i=0;i<transfersSplitted.length;i++) {
        transfersRow = transfersSplitted[i].split(";");
        transfers.push(transfersRow);
      }
      
    }
    
  }
  
  $(".transfer-form input:text").on( 'mouseon mouseout', function() {
        $(this).toggleClass('hover');
     }
  );
  
  $(".autocomplete").on( 'mouseon mouseout', function() {
        $(this).toggleClass('hover');
     }
  );
  
  $(".transfer-form").keydown(function(e) {
    if(window.event) { keynum = e.keyCode; }  // IE (sucks)
    else if(e.which) { keynum = e.which; }
    if (keynum==13) {
      e.preventDefault();
    }
  });
  
  $(".transfer-form input:text").keyup(function(e) {
    $(this).formatNumber();
    if(window.event) { keynum = e.keyCode; }  // IE (sucks)
    else if(e.which) { keynum = e.which; }
    
    if ((keynum != 37) // Left
                  || (keynum != 39) // Right
                  || (keynum != 40 || keynum != 38)// && (document.getElementById('ulSuggestList').style.display != 'none')) // Down or Up
                  || (keynum != 20) // Caps Lock
                  || (keynum != 9)  // Tab
                  || (keynum != 17) // Ctrl up
                  || (keynum != 33) // Page up
                  || (keynum != 34) // Page down
                  || (keynum != 35) // End
                  || (keynum != 36) // Home
                  || (keynum != 45) // Insert
                  || (keynum != 145)
                  || (keynum != 144)
                  || (keynum != 19) // Pause
                  || (keynum != 123) // F12
                  || (keynum != 122) // F11
                  || (keynum != 121) // F10
                  || (keynum != 120) // F9
                  || (keynum != 119) // F8
                  || (keynum != 118) // F7
                  || (keynum != 117) // F6
                  || (keynum != 116) // F5
                  || (keynum != 115) // F4
                  || (keynum != 114) // F3
                  || (keynum != 113) // F2
                  || (keynum != 112) // F1
                  || (keynum != 219)
                  || (keynum != 0)
      ) {
      
        $(".transfers-offers").remove();
      
      }
    
  });
  
  $("#tf_form_sum").keyup(function(e) {
    $(this).formatNumber();
  });
  
  $("#tf_form_sum_int").keyup(function() {
    $(this).formatNumber();
  });
  
  $(".transfer-form input:text").blur(function() {
    //$(".autocomplete").remove();
  });
  
  $(".transfers-tabs .item a").click(function() {
    var link = $(this);
    $(".autocomplete").remove();
    $(".transfers-tabs .item").removeClass("act");
    link.parents(".item").addClass("act");
    $(".tab-content").fadeOut(150,function() {
      $(".tab-content[rel='"+link.attr("rel")+"']").fadeIn(150)
    });
    
    window.location.hash = link.attr("rel");
    
    return false;
    
  });

  var pageUrl = location.href;
  
  var urlArray = pageUrl.split("#");
  
  var anchor = urlArray[1];

  if ($(".transfers-tabs").length) {
  
    if (anchor) {
      $(".transfers-tabs a[rel='"+anchor+"']").click();
    } else {
      window.location.hash = $(".transfers-tabs .item").eq(0).children("a").attr("rel");
    }
    
  }
  
  // Автозаполнение, страны
  
  if ($(".transfer-form").length) {
    var countriesXml = $.getValues("../../../../common/img/uploaded/transfers/countries.xml");
    var countries = $.xml2json(countriesXml).country;
    var citiesXml = $.getValues("../../../../common/img/uploaded/transfers/cities.xml");
    var cities = $.xml2json(citiesXml).city;
    
    $(".auto-cities").keyup(function(e) {
      var el = $(this);
      if(window.event) { keynum = e.keyCode; }  // IE (sucks)
      else if(e.which) { keynum = e.which; }
      
      if (keynum == 40) {
        acDown();
      } else if (keynum == 38) {
        acUp();
      } else if  (keynum == 13) {
        
        acSelect(el);
      } else if ((keynum != 37) // Left
                  || (keynum != 39) // Right
                  || (keynum != 40 || keynum != 38)// && (document.getElementById('ulSuggestList').style.display != 'none')) // Down or Up
                  || (keynum != 20) // Caps Lock
                  || (keynum != 9)  // Tab
                  || (keynum != 17) // Ctrl up
                  || (keynum != 33) // Page up
                  || (keynum != 34) // Page down
                  || (keynum != 35) // End
                  || (keynum != 36) // Home
                  || (keynum != 45) // Insert
                  || (keynum != 145)
                  || (keynum != 144)
                  || (keynum != 19) // Pause
                  || (keynum != 123) // F12
                  || (keynum != 122) // F11
                  || (keynum != 121) // F10
                  || (keynum != 120) // F9
                  || (keynum != 119) // F8
                  || (keynum != 118) // F7
                  || (keynum != 117) // F6
                  || (keynum != 116) // F5
                  || (keynum != 115) // F4
                  || (keynum != 114) // F3
                  || (keynum != 113) // F2
                  || (keynum != 112) // F1
                  || (keynum != 219)
                  || (keynum != 0)
      ) {
      
          $(".autocomplete").remove();
          
          var val = el.val();
          var acresults = new Array();
          
          for (i in cities) {
            name = cities[i].name;
            if (name.toLowerCase().indexOf(val.toLowerCase()) == 0 && val !="" && acresults.length < 11) {
              acresults.push(cities[i].name);
            }
          }
          
          if (acresults.length) {
            $("body").append("<ul class='autocomplete' />");
            $(".autocomplete").css("left",el.offset().left).css("top",el.offset().top + 31);
          }
          
          for (i in acresults) {
            $(".autocomplete").append("<li><span>" + acresults[i] + "</span></li>");
          }
          
          $(".autocomplete li").hover(function() {
            $(".autocomplete li").removeClass("act");
            $(this).addClass("act");
          });
          
          
            $(window).click(function() {
              
              if (!$(".autocomplete").hasClass("hover") && !el.hasClass("hover")) {
                $(".autocomplete").remove();
              }
             
            });
            
          
          
          $(".autocomplete li").click(function() {
            acSelect(el);
            //$("#formInt").submit();
          });
        
        
      }
    });
    
    $("#tf_form_country").keyup(function(e) {
      var el = $(this);
      if(window.event) { keynum = e.keyCode; }  // IE (sucks)
      else if(e.which) { keynum = e.which; }
      
      if (keynum == 40) {
        acDown();
      } else if (keynum == 38) {
        acUp();
      } else if  (keynum == 13) {
        
        acSelect(el);
      } else if ((keynum != 37) // Left
                  || (keynum != 39) // Right
                  || (keynum != 40 || keynum != 38)// && (document.getElementById('ulSuggestList').style.display != 'none')) // Down or Up
                  || (keynum != 20) // Caps Lock
                  || (keynum != 9)  // Tab
                  || (keynum != 17) // Ctrl up
                  || (keynum != 33) // Page up
                  || (keynum != 34) // Page down
                  || (keynum != 35) // End
                  || (keynum != 36) // Home
                  || (keynum != 45) // Insert
                  || (keynum != 145)
                  || (keynum != 144)
                  || (keynum != 19) // Pause
                  || (keynum != 123) // F12
                  || (keynum != 122) // F11
                  || (keynum != 121) // F10
                  || (keynum != 120) // F9
                  || (keynum != 119) // F8
                  || (keynum != 118) // F7
                  || (keynum != 117) // F6
                  || (keynum != 116) // F5
                  || (keynum != 115) // F4
                  || (keynum != 114) // F3
                  || (keynum != 113) // F2
                  || (keynum != 112) // F1
                  || (keynum != 219)
                  || (keynum != 0)
      ) {
      
          $(".autocomplete").remove();
          
          var val = el.val();
          
          var acresults = new Array();
          for (i in countries) {
            name = countries[i].name;
            if (name.toLowerCase().indexOf(val.toLowerCase()) == 0 && val !="" && acresults.length < 11) {
              acresults.push(countries[i].name);
            }
          }
          
          
          
          if (acresults.length) {
            $("body").append("<ul class='autocomplete' />");
            $(".autocomplete").css("left",el.offset().left).css("top",el.offset().top + 31);
          }
          
          for (i in acresults) {
            $(".autocomplete").append("<li><span>" + acresults[i] + "</span></li>");
          }
          
          $(".autocomplete li").hover(function() {
            $(".autocomplete li").removeClass("act");
            $(this).addClass("act");
          });
          
          
          
          $(window).click(function() {
            
            if (!$(".autocomplete").hasClass("hover") && !el.hasClass("hover")) {
              $(".autocomplete").remove();
            }
            
           
          });
          
          $(".autocomplete li").click(function() {
            acSelect(el);
            //$("#formInt").submit();
          });
        
        
      }
    });
    
    function acDown() {
      if ($(".autocomplete li").length) {
        var items = $(".autocomplete li");
        if (!$(".autocomplete .act").length) {
          items.eq(0).addClass("act");
        } else {
          actItem = $(".autocomplete .act");
          if (actItem.index() < items.length - 1) {
            actItem.next("li").addClass("act");
            actItem.removeClass("act");
          } else {
            actItem.removeClass("act");
            items.eq(0).addClass("act");
          }
        }
      }
    }

    function acUp() {
      if ($(".autocomplete li").length) {
        var items = $(".autocomplete li");
        if (!$(".autocomplete .act").length) {
          items.eq(items.length - 1).addClass("act");
        } else {
          actItem = $(".autocomplete .act");
          if (actItem.index() > 0) {
            actItem.prev("li").addClass("act");
            actItem.removeClass("act");
          } else {
            actItem.removeClass("act");
            items.eq(items.length - 1).addClass("act");
          }
        }
      }
    }

    function acSelect(element) {
      if ($(".autocomplete .act").length) {
        element.val($(".autocomplete .act span").html());
		element.next().val('1');
        $(".autocomplete").remove();
        //$("#formInt").submit();
      } else {
        //$("#formInt").submit();
      }
    }
    
  }
  
  // ----------------------
  
  $(".form-uniform input:text, .form-uniform input:radio").uniform();
  
  $(".form-uniform .form-radios label span").live("click",function() {
    $(this).parents("label").find("input:radio").attr("checked",true);
    $(this).parents(".form-radios").find("span").removeClass("checked");
    $(this).parents("label").find(".radio span").addClass("checked");
    
  });
  
  $("ul").each(function() {
    $(this).find("li").first().addClass("first");
    $(this).find("li").last().addClass("last");
  });
  
  $("input.form-submit").each(function () {
    var divBtn = $("<div></div>");
    var submit = $(this);
    divBtn.attr("class",$(this).attr("class")).attr("id",$(this).attr("id")).addClass($(this).attr("class") + "-" + $(this).attr("disabled")).html("<span>"+
    $(this).val()+"</span>");
    $(this).after(divBtn);
    $(this).hide();
    divBtn.on("click",function () {
      if (!divBtn.hasClass("button-1-disabld")) {
        submit.click();
      }
    });
  });
  
  $(".button").each(function () {
    $(this).html("<span>"+$(this).html()+"</span>") 
  });
  
  $(".form-radios label").click(function() {
    if (!$(this).hasClass("selected")) {
      $(".transfers-offers").remove()
    }
    $(this).prevAll("label").removeClass("selected");
    $(this).nextAll("label").removeClass("selected");
    $(this).addClass("selected");
  });
  
  $(".form-radios input").each(function() {
    if ($(this).is(":checked")) {
      $(this).parents("label").addClass("selected");
    }
  });
  
  $(".transfer-descr-wrapper .subscr").each(function() {
    $(this).css("width",$(this).prev(".rounded-block").outerWidth());
  });
  
  $("div.sbol_openening h4 u").click(function(){
		$(this).parent().parent().find("div.sbol_closed").slideToggle();
		$(this).toggleClass("active");
	});
  
  $("div.sbol_openening ol").each(function() {
    $(this).children("li").each(function() {
      $(this).html("<span class='pt'>" + parseInt($(this).index() + 1) + "</span><span class='txt'>" + $(this).html() + "</span>")
    });
  });
  
  // Валидация форм
  
  var validator = $("#formRus").bind("invalid-form.validate", function() {
			$("#summary").html("Пожалуйста, заполните все поля");
		}).validate({
    
    sendForm : false,
    messages: {
      tf_form_sum: "",
      tf_form_from: "",
      tf_form_to: ""
    },
    errorPlacement: function(error, element) {
      //element.parents(".input-wrapper").addClass("input-wrapper-error");
    },
    unhighlight: function(element, errorClass, validClass) {
      //$(element).parents(".input-wrapper").removeClass("input-wrapper-error");
      $(element).removeClass(errorClass);
    }
  });
  $("#tf_form_from").attr('placeholder', "Город");
  $('<input/>').attr({ type: 'hidden', id: 'tf_form_from_val', name: 'tf_form_from_val', 'value' : 0}).insertAfter($("#tf_form_from"));
  $("#tf_form_from").bind('change', function(){$(this).next().val('0')})

  $("#tf_form_to").attr('placeholder', "Город");
  $('<input/>').attr({ type: 'hidden', id: 'tf_form_to_val', name: 'tf_form_to_val', 'value' : 0}).insertAfter($("#tf_form_to"));
  $("#tf_form_to").bind('change', function(){$(this).next().val('0')})

  $("#tf_form_country").attr('placeholder', "Страна");
  $('<input/>').attr({ type: 'hidden', id: 'tf_form_country_val', name: 'tf_form_country_val', 'value' : 0}).insertAfter($("#tf_form_country"));
  $("#tf_form_country").bind('change', function(){$(this).next().val('0')})

  $("#tf_form_sum").rules("add", { regex: "^[0-9\\s]+ р.$" });

	$("#formRus").submit(function() {
  
    if( $('#tf_form_from_val').val() == 0){
      $("#tf_form_from").val('')
    };
    if( $('#tf_form_to_val').val() == 0){
      $("#tf_form_to").val('')
    };
	
    if ($("#formRus").valid()) {
      $("#formRus").append("<div class='loader' />");
      $.ajax().done(function() {
      
        if (!transfers) {
          alert('Произошла техническая ошибка. Попробуйте перегрузить страницу.');
        }
      
        /* .Submit message */
        $(".loader").remove();
        $(".transfers-offers").remove();
        
        var transferSum = $("#tf_form_sum").val().replace(" р.","");
        
        transferSum = parseFloat(transferSum.replace(/ /g,''));

        var transferType = $("[name='tf-type']:checked").val();
        
        if (transferType == 1) {
          transferType = "Нал"
        } else if (transferType == 2) {
          transferType = "Безнал"
        }
        
        var transfersResult = new Array();
        
        for (i=0;i<transfers.length;i++) {
          if (transfers[i][0] == "РФ" && transfers[i][1] == transferType) {
            transfersResult.push(transfers[i]);
          }
        }
        
        $("#formRus").parents(".transfer-descr-wrapper").parents(".fc").after("<div class='transfers-offers'></div>");
        
        $(".transfers-offers").append("<h2>Вам подходит</h2>");
        $(".transfers-offers").append("<div class='offers-list fc'>");
        
        for (i=0;i<transfersResult.length;i++) {
          if (transfersResult[i][1] == "Нал") {
            trFrom = "Наличные";
            var link = "nal_rus";
          }
          if (transfersResult[i][1] == "Безнал") {
            trFrom = "Безнал.";
            var link = "beznal_rus"
          }
          if (transfersResult[i][2] == "Счет") trTo = "На счет";
          if (transfersResult[i][2] == "Карта") trTo = "На карту";
          if (transfersResult[i][2] == "Нал") trTo = "Наличные";
          
          var timeArr = transfersResult[i][4].split(" ");
          
          if (timeArr[1] == "день" || timeArr[1] == "дней" || timeArr[1] == "дня") {
            var num = timeArr[0].slice(timeArr[0].length-1,timeArr[0].length); 
            if(num==0) units = "дней"; 
            if(num==1) units = "дня";
            if(num==2) units = "дней";
            if(num==3) units = "дней";
            if(num==4) units = "дней";
            if(num>=5) units = "дней";
            if(timeArr[0].slice(timeArr[0].length-2,timeArr[0].length) == 11) units = "дней"
          }
          
          if (timeArr[1] == "час" || timeArr[1] == "часов" || timeArr[1] == "часа") {
            var num = timeArr[0].slice(timeArr[0].length-1,timeArr[0].length); 
            if(num==0) units = "часов"; 
            if(num==1) units = "часа";
            if(num==2) units = "часов";
            if(num==3) units = "часов";
            if(num==4) units = "часов";
            if(num>=5) units = "часов";
            if(timeArr[0].slice(timeArr[0].length-2,timeArr[0].length) == 11) units = "часов"
          }
          
          if (timeArr[1] == "минута" || timeArr[1] == "минут" || timeArr[1] == "минуты") {
            var num = timeArr[0].slice(timeArr[0].length-1,timeArr[0].length); 
            if(num==0) units = "минут"; 
            if(num==1) units = "минута";
            if(num==2) units = "минуты";
            if(num==3) units = "минуты";
            if(num==4) units = "минуты";
            if(num>=5) units = "минут";
            if(timeArr[0].slice(timeArr[0].length-2,timeArr[0].length) == 11) units = "минут"
          }
            
            
          if (transfersResult[i][2] != "Колибри" && transfersResult[i][2] != "Маниграмм") {
            timeTtl = "Время перевода"
          } else {
            timeTtl = "Срочный перевод";
          }
          
          timeVal = "<div class='offer-data'>до <span>" + timeArr[0] + "</span> " + units + "</div>";
          
          if (transfersResult[i][2] != "Колибри") {
            trMethod = trFrom + " <span class='sep'><img src='../../../../common/img/uploaded/transfers/img/orange-rarr.png' /></span> " + trTo;
          } else {
            var link = "colibri#russia"
            trMethod = "<img src='../../../../common/img/uploaded/transfers/img/ico-colibri.png' class='ico'/> Перевод Колибри"
          }
          
          var comMin = parseInt(transfersResult[i][6]);
          var comMax = parseInt(transfersResult[i][7]);
          var comVal = transferSum*parseFloat(transfersResult[i][5].replace(",","\."))/100;
          
          if (comVal < comMin) {
            comVal = comMin
          }
          
          if (comVal > comMax) {
            comVal = comMax
          }
          
          comVal = comVal + "";
          
          var comArr = comVal.split("\.");
          
          comInt = comArr[0];
          comFloat = comArr[1];
          
          if (comFloat) {
            if (comFloat<10) comFloat = comFloat*10;
            var comString = "<div class='offer-data'><span>" + comInt +",</span><span class='sup'>" + comFloat + "</span> р.</div>"
          } else {
            var comString = "<div class='offer-data'><span>" + comInt +"</span> р.</div>"
          }

          
          
          $(".tab-content[rel='russia']").find(".offers-list").append("<div class='item' />");
          var item = $(".tab-content[rel='russia']").find(".offers-list .item").eq(i);
          
          item.append("<div class='ttl'>" + trMethod + "</div>")
          
          item.append("<div class='descr' />");
          
          item.find(".descr").append("<table></table>");
          
          item.find(".descr table").append("<tr><td>" + timeTtl + "</td><td>" + timeVal + "</td></tr>");
          item.find(".descr table").append("<tr><td>Комиссия</td><td>" + comString + "</td></tr>");
          item.find(".descr").append("<a class='button button-2' href='" + link +"' target='_blank'><span>Подробнее</span></a>");
          
        }
        
      });
      
    }
	
    return false;
	
	});
  
  var validator2 = $("#formInt").bind("invalid-form.validate", function() {
			$("#summary").html("Пожалуйста, заполните все поля");
		}).validate({
    sendForm : false,
    messages: {
      tf_form_sum_int: "",
      tf_form_country: "Укажите страну"
    },
    errorPlacement: function(error, element) {
      //element.parents(".input-wrapper").addClass("input-wrapper-error");
    },
    unhighlight: function(element, errorClass, validClass) {
      //$(element).parents(".input-wrapper").removeClass("input-wrapper-error");
      $(element).removeClass(errorClass);
    }
  });
  
  $("#tf_form_sum_int").rules("add", { regex: "^[0-9\\s]+$" });
  
  $("#formInt").submit(function() {
  	if( $('#tf_form_country_val').val() == 0){
		$("#tf_form_country").val('')
	};
	
    if ($("#formInt").valid()) {
    
      $("#formInt").append("<div class='loader' />");
      $.ajax().done(function() {
      
        if (!transfers) {
          alert('Произошла техническая ошибка. Попробуйте перегрузить страницу.')
        }
      
        /* .Submit message */
        $(".loader").remove();
        $(".transfers-offers").remove();
        
        var transferSum = $("#tf_form_sum_int").val();
        
        transferSum = parseFloat(transferSum.replace(/ /g,''));
        
        
        var transferType = $("[name='tf-type-int']:checked").val();
        
        if (transferType == 1) {
          transferType = "Нал"
        } else if (transferType == 2) {
          transferType = "Безнал"
        }

        var transferCurr = $("[name='tf-curr']:checked").val();
        
        if (transferCurr == 1) {
          transferCurr = "Рубли";
          trUnits = "р."
        } else if (transferCurr == 2) {
          transferCurr = "Доллары"
          trUnits = "$"
        } else if (transferCurr == 3) {
          transferCurr = "Евро"
          trUnits = "€"
        }
        
        var transfersResult = new Array();
        
        for (i=0;i<transfers.length;i++) {
          if (transfers[i][2] != "Колибри") {
            if (transfers[i][0] == "Международный" && transfers[i][1] == transferType && transfers[i][3] == transferCurr) {
              transfersResult.push(transfers[i]);
            }
          } else {
            if (transfers[i][1] == "Нал" && ($("#tf_form_country").val().toLowerCase() == "беларусь" || $("#tf_form_country").val().toLowerCase() == "украина" || $("#tf_form_country").val().toLowerCase() == "казахстан") && transfers[i][0] == "Международный" && transfers[i][1] == transferType && transfers[i][3] == transferCurr) {
              transfersResult.push(transfers[i]);
            }
          }
          
        }
        
        $("#formInt").parents(".transfer-descr-wrapper").parents(".fc").after("<div class='transfers-offers'></div>");
        
        $(".transfers-offers").append("<h2>Вам подходит</h2>");
        $(".transfers-offers").append("<div class='offers-list fc'>");
        
        for (i=0;i<transfersResult.length;i++) {
          if (transfersResult[i][1] == "Нал") {
            trFrom = "Наличные";
            var link = "nal_int";
          }
          if (transfersResult[i][1] == "Безнал") {
            trFrom = "Безнал.";
            var link = "beznal_int"
          }
          if (transfersResult[i][2] == "Счет") trTo = "На счет";
          if (transfersResult[i][2] == "Карта") trTo = "На карту";
          if (transfersResult[i][2] == "Нал") trTo = "Наличные";
          
          
          var timeArr = transfersResult[i][4].split(" ");
          
          if (timeArr[1] == "день" || timeArr[1] == "дней" || timeArr[1] == "дня") {
            var num = timeArr[0].slice(timeArr[0].length-1,timeArr[0].length); 
            if(num==0) units = "дней"; 
            if(num==1) units = "дня";
            if(num==2) units = "дней";
            if(num==3) units = "дней";
            if(num==4) units = "дней";
            if(num>=5) units = "дней";
            if(timeArr[0].slice(timeArr[0].length-2,timeArr[0].length) == 11) units = "дней"
          }
          
          if (timeArr[1] == "час" || timeArr[1] == "часов" || timeArr[1] == "часа") {
            var num = timeArr[0].slice(timeArr[0].length-1,timeArr[0].length); 
            if(num==0) units = "часов"; 
            if(num==1) units = "часа";
            if(num==2) units = "часов";
            if(num==3) units = "часов";
            if(num==4) units = "часов";
            if(num>=5) units = "часов";
            if(timeArr[0].slice(timeArr[0].length-2,timeArr[0].length) == 11) units = "часов"
          }
          
          if (timeArr[1] == "минута" || timeArr[1] == "минут" || timeArr[1] == "минуты") {
            var num = timeArr[0].slice(timeArr[0].length-1,timeArr[0].length); 
            if(num==0) units = "минут"; 
            if(num==1) units = "минута";
            if(num==2) units = "минуты";
            if(num==3) units = "минуты";
            if(num==4) units = "минуты";
            if(num>=5) units = "минут";
            if(timeArr[0].slice(timeArr[0].length-2,timeArr[0].length) == 11) units = "минут"
          }
            
            
          if (transfersResult[i][2] != "Колибри" && transfersResult[i][2] != "Маниграмм") {
            timeTtl = "Время перевода"
          } else {
            timeTtl = "Срочный перевод";
          }
          
          timeVal = "<div class='offer-data'>до <span>" + timeArr[0] + "</span> " + units + "</div>";
          
          if (transfersResult[i][2] != "Колибри" && transfersResult[i][2] != "Маниграмм") {
            trMethod = trFrom + " <span class='sep'><img src='../../../../common/img/uploaded/transfers/img/orange-rarr.png' /></span> " + trTo;
          } else if (transfersResult[i][2] == "Колибри") {
            var link = "colibri#international"
            trMethod = "<img src='../../../../common/img/uploaded/transfers/img/ico-colibri.png' class='ico'/> Перевод Колибри"
          } else if (transfersResult[i][2] == "Маниграмм") {
            var link = "moneygram_int"
            trMethod = "<img src='../../../../common/img/uploaded/transfers/img/ico-moneygram.png' class='ico'/> Перевод MoneyGram"
          }
          
          var comMin = parseInt(transfersResult[i][6]);
          var comMax = parseInt(transfersResult[i][7]);
          var comVal = transferSum*parseFloat(transfersResult[i][5].replace(",","\."))/100;
          
          if (comVal < comMin) {
            comVal = comMin
          }
          
          if (comVal > comMax) {
            comVal = comMax
          }
          
          comVal = comVal + "";
          
          var comArr = comVal.split("\.");
          
          comInt = comArr[0];
          comFloat = comArr[1];
          
          if (comFloat) {
            if (comFloat<10) comFloat = comFloat*10;
            var comString = "<div class='offer-data'><span>" + comInt +",</span><span class='sup'>" + comFloat + "</span> " + trUnits + "</div>"
          } else {
            var comString = "<div class='offer-data'><span>" + comInt +"</span> " + trUnits + "</div>"
          }
          
          if (transfersResult[i][2] == "Маниграмм") {
            var comString = "<div class='offer-data'>от <span>2</span> долларов</div>"
          }
          
          
          $(".tab-content[rel='international']").find(".offers-list").append("<div class='item' />");
          var item = $(".tab-content[rel='international']").find(".offers-list .item").eq(i);
          
          item.append("<div class='ttl'>" + trMethod + "</div>")
          
          item.append("<div class='descr' />");
          
          item.find(".descr").append("<table></table>");
          
          item.find(".descr table").append("<tr><td>" + timeTtl + "</td><td>" + timeVal + "</td></tr>");
          item.find(".descr table").append("<tr><td>Комиссия</td><td>" + comString + "</td></tr>");
          item.find(".descr").append("<a class='button button-2' href='" + link +"' target='_blank'><span>Подробнее</span></a>");
          
        }
        
      });
      
    }
    
    return false;
	});
  
  if ($(".transfer-form").length) {

  $.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "Please check your input."
  );
  
}  
	$(".transfer-form").show();
  
});

jQuery.extend({
    getValues: function(url) {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'text',
            async: false
        }).done(function(data) {
          myDataTxt = data;
                var myData = $.parseXML(myDataTxt);
                
                
                // var myData = new Array();
                
                // $.each(myDataRaw, function(index, value) {
                  // if (value.GPS != "" && value.status != "Закрыта") {
                    // myData.push(value);
                  // }
                // });
                
                result = myData;
                
                
        });
        
        return result;
    }
});


  
(function( $ ) {
  $.fn.formatNumber = function() {
    var obj = $(this);
    obj.each(function () {
      if ($(this).val()) {
        number = $(this).val();
      } else {
        number = $(this).html();
      }
      
      number += '';
      number = number.replace(/\s/g, '');
      number = number.replace("р.","");
	  if ( (obj.attr("id") == "tf_form_sum") || (obj.attr("id") == "tf_form_sum_int") ) {number = number.replace(/[^0-9]/g, "");}
      x = number.split('.');
      x1 = x[0];
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
      }
      
      if ($(this).val()) {
        if (obj.attr("id") == "tf_form_sum") {
          $(this).val(x1 + " р.");
          $(this).caretTo($(this).val().length - 3);
        } else {
          $(this).val(x1);
        }
      } else {
        $(this).html(x1);
      }
      
      
      
      
    });
    
    
    
  };
})( jQuery );

jQuery.extend({
  getCsv: function(url) {
    var result = null;
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'text',
      async: false,
      error: function() {
        alert('Произошла техническая ошибка. Попробуйте перегрузить страницу.')
      }
    }).done(function(data) {
        myData = data;
        
        result = myData;
        
        
    });
    
    return result;
  }
});