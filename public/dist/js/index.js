// Auto close dismissable alerts
$(".alert-dismissible").delay(5500).slideUp(500, function(){
  $(".alert-dismissible").alert('close');
});

function toggleVisibility(id) {
  var e = document.getElementById(id);
  if(e.style.display == 'inline-block'){
     e.style.display = 'none';
     console.log('none');
  }else {
     e.style.display = 'inline-block';
     console.log('block');
  }
}
