// Auto close dismissable alerts
$(".alert-dismissible").delay(4500).slideUp(500, function(){
  $(".alert-dismissible").alert('close');
});