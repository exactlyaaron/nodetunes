(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    // $('.add-new-wrapper').hide();
    $('.btn-addnew').click(addDrawer);
    $('.btn-filter').click(filterDrawer);
  }

  function addDrawer(){
    $('.add-new-wrapper').slideToggle();
  }

  function filterDrawer(){
    $('#genres').slideToggle();
  }

})();
