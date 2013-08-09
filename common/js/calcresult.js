  $(document).ready(function(){
// -----------------------------

// ------ Показываем результаты расчета
    $("#calm2").click(
        function () {
			if ( div_calc && show_credit_result( div_calc ) ) {
			  $("#calform").fadeOut("slow");
			  $("#calforma").css("display", "none");
			  $("#calres").css("display", "block");
			  $("#calresult").fadeIn("slow");
			}
    });
    $("#calm_dep").click(
        function () {
			if ( show_deposit_result() ) {
			  $("#calform").fadeOut("slow");
			  $("#calforma").css("display", "none");
			  $("#calres").css("display", "block");
			  $("#calresult").fadeIn("slow");
			}
    });
// ------ Возвращаемся к форме калькулятора
    $("#calback").click(
        function () {
          $("#calresult").fadeOut("slow");
          $("#calres").css("display", "none");
          $("#calforma").css("display", "block");
          $("#calform").fadeIn("slow");


//          $("#calresult").fadeOut("slow");
//          $("#calt4").css("display", "none");
//          $("#calm3").css("display", "none");
//          $("#calb3").css("display", "none");
//          $("#calt1").css("display", "block");
//          $("#calt2").css("display", "block");
//          $("#calt3").css("display", "block");
//          $("#calm1").css("display", "block");
//          $("#calm2").css("display", "block");
//          $("#calb1").css("display", "block");
//          $("#calb2").css("display", "block");
//          $("#calform").fadeIn("slow");


    });


// -----------------------------
  });