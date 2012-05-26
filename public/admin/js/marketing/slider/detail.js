$('#marketing_slider_editform').submit(function (ev) {
    ev.preventDefault();  
      $.post('/marketing/slider/save', $(this).serialize(), function (res) {
          if(res){
            showMessage('#saveStatus','alert-message block-message success', 'Slider saved successfully.');
            refreshSliderDataTable();
          }          
      }); 
  });