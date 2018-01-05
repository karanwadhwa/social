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

// Select2 branch
$(document).ready(function() {
  $('.select2').select2({
    minimumResultsForSearch: Infinity
  });
});

$(document).ready(function() {
  $('.select2-multiple-tags').select2({
    placeholder: 'Tags'
  });
});

$(document).ready(function() {
  $('.select2-multiple-audience').select2({
    placeholder: 'Post Audience'
  });
});