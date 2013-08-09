/**
 * User: dsmirnov
 * Date: 9/28/11
 * Time: 11:47 AM
 *
 * Виджет для ввода значения с помощью слайдера
 */

(function( $ ){

	  var methods = {
		init: function(options) {

		$this=$(this);

		var settings = {
			minMargin: 0,
			maxRealValue: 13,
			minRealValue: 12,
			controlSize: 425
		};

		if ( options ) {
			$.extend( settings, options );
		}

			var controlValue; //здесь хранится текущее значение контрола
			//var preservedControlValue; //сохраненное значение перед ручной правкой

			$this.attr('class',"sliderInput");
			$this.html($('#sliderControlStruct').html());

			var controlSize=settings.controlSize;
			var minMargin=settings.minMargin;
			var maxRealValue=settings.maxRealValue;
			var minRealValue=settings.minRealValue;
			var unitOfMeasurements='%';
            var valueStep=0.01;
			var newValueStep = parseFloat( $('#valueStep_redefinition').text() );
			if( !isNaN(newValueStep) && newValueStep < 1 ) {
				valueStep = newValueStep;
			}

			var precision;

			var sliderRightIndent=37;
			var editState='slider';

			var scaleStep;
			var scaleTicksAmount=8;

			if (valueStep.toString().indexOf('.')!=-1){
				precision=valueStep.toString().substr(valueStep.toString().indexOf('.')+1).length;
			} else precision=0;

			var scaleKoeff=controlSize/(maxRealValue-minRealValue);


			function getRealValue(pixValue){
				 return (minRealValue+(pixValue/scaleKoeff)).toFixed(precision);
			}

			function getPixValue(realValue){
				return Math.round((realValue-minRealValue)*scaleKoeff);
			}

			var slider=$this.find('.slider');
			var content=$this.find('.area .content');
			var input=$this.find('.area .input input');
			var inputDiv=$this.find('.area .input');
			var range=$this.find('.scale-range');
			var scaleRightMargin=$this.find('.scale-right-margin');
			var editBtn=$this.find('.areaButton');
			var startOffset;
			var controlLeftOffset=$this.offset().left;

			content.text(getRealValue(minMargin));
			$this.find('.units').text(unitOfMeasurements);
			var sliderSize=slider.outerWidth();
			var sliderLeftIndent=sliderSize-sliderRightIndent;
			var scaleOffset;

			$this.find('.scale').css('width',controlSize);
			$this.find('.scale .scale-forbidden').css('width',minMargin);
			if (minMargin>0) {
				 $this.find('.scale-left-margin').addClass('scale-left-margin-forbidden');
			} else {
				$this.find('.scale-left-margin').addClass('scale-left-margin-green');
			}
			$this.find('.sliderContainment').css('width',controlSize-minMargin+sliderSize);
			if (minMargin<sliderLeftIndent){
				startOffset=controlLeftOffset;
				$this.find('.scale-area').css('margin-left',
					sliderLeftIndent-minMargin-$this.find('.scale-left-margin').outerWidth());
				scaleOffset=sliderLeftIndent-minMargin;
			} else {
				startOffset=controlLeftOffset+minMargin-sliderLeftIndent;
				$this.find('.sliderContainment').css('margin-left',minMargin-sliderLeftIndent);
				scaleOffset=0;
			}
			slider.css('left',0);


			var scaleSectionsOffset, ScaleSectionShift, newTick, tickPointOffset;
			function buildScale(container){
				var res, offset;
				res=container;
				newTick=$('<div />').addClass("fo_x_big").css('left', 0).text(minRealValue);
				newTick.appendTo(res);

				tickPointOffset=Math.round(newTick.outerWidth()/2);
				newTick.css('backgroundPosition',tickPointOffset+'px top');
				ScaleSectionShift = tickPointOffset;
				scaleSectionsOffset = scaleOffset - ScaleSectionShift;

				if (newValueStep == 0.1 && precision == 1) {
					scaleStep=parseFloat(((maxRealValue-minRealValue)/scaleTicksAmount).toFixed(precision+1));
				} else {
					scaleStep=parseFloat(((maxRealValue-minRealValue)/scaleTicksAmount).toFixed(precision));
				}

				var i;
				for (i=minRealValue+scaleStep;i<maxRealValue;i=i+scaleStep){
					if (controlSize==getPixValue(i)) break;
                    if (newValueStep == 0.1 && (i+newValueStep > maxRealValue)) break;

                    if (newValueStep == 0.1) {
						newTick=$('<div />').addClass("fo_x_small").text(i.toFixed(precision+1));
					} else {
						newTick=$('<div />').addClass("fo_x_small").text(i.toFixed(precision));
					}
					newTick.appendTo(res);
					offset=ScaleSectionShift+getPixValue(i)-Math.round(newTick.outerWidth()/2);
					tickPointOffset=Math.round(newTick.outerWidth()/2)-1;
					newTick.css('left', offset);
					newTick.css('backgroundPosition',tickPointOffset+'px top');
				}

				newTick=$('<div />').addClass("fo_x_big").text(maxRealValue);
				newTick.appendTo(res);
				tickPointOffset=Math.round(newTick.outerWidth()/2);
				newTick.css('left', ScaleSectionShift+controlSize-Math.round(newTick.outerWidth()/2)-1);
				newTick.css('backgroundPosition',tickPointOffset+'px top');
				//return res.html();
			}
			buildScale($this.find('.scale-sections'));
			//this.find('.scale-sections').html(buildScale());
			$this.find('.scale-sections').css('margin-left',scaleSectionsOffset);



			content.text(getRealValue(minMargin));
			input.val(getRealValue(minMargin));

			var updateWidget=function(v){
				controlValue=v;
				updateSlider();
				updateInput();
				updateText();
			};

			var updateSlider=function(){
				slider.css('left',controlValue-minMargin);
				content.text(getRealValue(controlValue));
				var rangeWidth=Math.round(slider.offset().left-startOffset);
				if (rangeWidth>controlSize-minMargin) rangeWidth=controlSize-minMargin;
				if ( $.browser.msie && $.browser.version >=6 && $.browser.version < 7 ) {
					range.css('width',rangeWidth-1);
				} else {
					range.css('width',rangeWidth);
				}

				if (controlValue>=controlSize) {
					 scaleRightMargin.addClass('scale-right-margin-green');
				} else {
					scaleRightMargin.removeClass('scale-right-margin-green');
				}
			};

			var updateInput=function(){
				input.val(getRealValue(controlValue));
			};

			var updateText=function(){
				content.text(getRealValue(controlValue));
			};

		  var getDragValue=function(){
			//alert(slider.offset().left-startOffset+minMargin);
			return slider.offset().left-startOffset+minMargin;
		  };

		  var toggleEditMode=function(btn){
			if (editState=='slider'){
				var contentWidth=content.outerWidth();
				content.hide(); inputDiv.show();
				input.css('width',contentWidth);
				$(btn).html("<img style='border: 0;margin:  0' src='/common/img/calculator/fo_panel_edit_icon.gif'/>");
				editState='input';
			} else {
				content.show(); inputDiv.hide();
				$(btn).html("<img style='border: 0;margin:  0' src='/common/img/calculator/fo_panel_icon.gif'/>");
				editState='slider';
			}
		  };

		  var checkInput=function(){
			if (isNaN(input.val())) return false;
			return input.val() >= getRealValue(minMargin);
		  };

		  slider.draggable({  axis: "x",
							  containment: "parent",
							  drag: function(event, ui) {
								updateWidget(getDragValue());
							  },
							  stop: function(event, ui) {
								updateWidget(getDragValue());
							  }
		  });

		  editBtn.click(function(){
						  if (editState=='input') {updateWidget(getPixValue(input.val()));}
						  toggleEditMode(editBtn);
						  return false;
						});

		  input.keydown(function(e){
						  var code = 0;

						  if (e.keyCode) { // IE
							code = e.keyCode;
						  } else if (e.which) { // FF & O
							code = e.which;
						  }
						  if (code==13){
							var v =checkInput()?input.val():controlValue;
							if (v>=minRealValue && v<=maxRealValue) updateWidget(getPixValue(v));
							toggleEditMode(editBtn);
						  }
						});

		  return $this;
		},
		reload: function(options) {},
		getValue: function() {
			return $(this).find('.area .input input').val();
		}
	  };


	$.fn.sliderInput = function(method) {
		// Method calling logic
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on Slider' );
		}
	};
})( jQuery );