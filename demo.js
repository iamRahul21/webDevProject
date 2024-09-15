$(document).ready(() => {
   // Toggle sidebar visibility
   $('#toggle-sidebar').click(() => {
       $('#sidebar').toggleClass('active');
       $('#sidebar-overlay').toggleClass('d-none');
   });

   // Close sidebar when clicking on overlay
   $('#sidebar-overlay').click(() => {
       $('#sidebar').removeClass('active');
       $('#sidebar-overlay').addClass('d-none');
   });
});