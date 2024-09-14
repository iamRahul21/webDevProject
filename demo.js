$(document).ready(()=>{
    $('#open-sidebar').click(()=>{
        $('#sidebar').addClass('active');
        $('#sidebar-overlay').removeClass('d-none');
     });
    
    
     $('#sidebar-overlay').click(function(){
        $('#sidebar').removeClass('active');
        $(this).addClass('d-none');
     });
  });