$('#apply_on').live('change', function (event) {
  if ($('#apply_on').val() == 'item') {
    $('#condition_field_cart').addClass('couponHideCondField');
    $('#condition_cart_field').attr('disabled', true);
    $('#condition_field_item').removeClass('couponHideCondField');
    $('#condition_item_field').attr('disabled', false);
  } else if ($('#apply_on').val() == 'cart') {
    $('#condition_field_item').addClass('couponHideCondField');
    $('#condition_item_field').attr('disabled', true);
    $('#condition_field_cart').removeClass('couponHideCondField');
    $('#condition_cart_field').attr('disabled', false);
  }
});
