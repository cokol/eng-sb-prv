function show(target, id)
{
  $('#id0').html( $('#' + id).html() );
    $(target).find('.i1').hide();
    $(target).find('.i2').show();
}

function hide(target)
{
    $(target).find('.i2').hide();
    $(target).find('.i1').show();
}