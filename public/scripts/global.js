// DOM Ready =============================================================
$(document).ready(function() {

  //load Isotope
  var $grid = $('.grid').isotope({
    // options
    itemSelector: '.card',
    layoutMode: 'fitRows',
    masonry: {
      gutter: 10
    },
    getSortData: {
      name: '.name',
      category: '[data-category]'
    },
    filter: '.not-brewed',
    stagger: 50,
    transitionDuration: '.8s',
    initLayout: true
  });

  $('#toggleBrewed').click(function(){
    $(this).toggleClass('faded');
    $('.brewedfalse').fadeToggle();
  })
});



// Functions =============================================================
function scroll2beer() {
  document.querySelector('.beer-holder').scrollIntoView({ 
    behavior: 'smooth' 
  });
}
function getRandomInt(max) { return Math.floor(Math.random() * Math.floor(max)); }

//Modal for Add/Contribute Beer =============================================================
function addBeerModal() {
  $('#postModal').modal('show');
}

//Main beer object adding function =============================================================
function addBeer() {

  //basic validation
  var errorCount = 0;
  $('#postModal input').each(function(index, val) { 
    if($(this).val() === '') { errorCount++; }
  });

  //check and make sure errorCount is still zero
  if(errorCount === 0) {

    //on verification, compile info to Object
    var newlyAddedBeer = {
      "name": $('#postModal input#inputName').val(),
      "activelyBrewed": (function() {
        var brewedIsChecked= document.getElementById('isActivelyBrewed').checked;
        brewedIsChecked == 'checked' ? "true" : "false";
        })(), 
      "ibu": $('#postModal input#inputIBU').val(),
      "abv": $('#postModal input#inputABV').val(),
      "flavors": $('#postModal input#inputFlavor').val(),
      "lastTappedOn": $('#postModal input#inputLastBrewDate').val(), 
      "breweryId": "UserSubmitted",
      "breweryName": $('#postModal input#inputBrewery').val()
    }

    //.ajax post
    $.ajax({
      type: 'POST',
      data: newlyAddedBeer,
      url: '/beers/add',
      dataType: 'JSON'
    }).done(function( response ) {

      //check for successful response
      if (!response.error) {

        //Clear forms
        $('#postModal input').val('');
        $('#postModal').modal('hide');
        return
      }
      else {
        //if something goes wrong, give err response
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    //if errorCount is more than 0, error out
    alert('Please fill all the fields!');
    return false;
  }
};

//Beer object deleting function =============================================================
function deleteBeer(dataRel) {

  //.ajax call
  $.ajax({
    type: 'POST',
    data: { id: dataRel },
    url: '/beers/delete',
    dataType: 'JSON'
  }).done(function( response ) {

    //check for successful response
    if (!response.error) {
      //yay it worked
    }
    else {
      //if something goes wrong, give err response
      alert('Error: ' + response.msg);
    }
  });
};


//Beer object edit modal function =============================================================
function editBeerModal(dataRel) {
  //show modal (duh)
  $('#editModal').modal('show');

  // jQuery AJAX call for JSON
  $.ajax({
    type: 'GET',
    url: '/beers/single/' + dataRel,
    dataType: 'JSON'
  }).done(function( response ) {

    //check for successful response
    if (!response.error) {

      //update the edit form with corresponding response data
      $('#editModal #inputName').val(response.name);
      $('#editModal #inputBrewery').val(response.breweryName);
      $('#editModal #inputFlavor').val(response.flavors);
      $('#editModal #inputABV').val(response.abv);
      $('#editModal #inputIBU').val(response.ibu);
      $('#editModal #inputLastBrewDate').val(response.lastTappedOn);
      response.activelyBrewed == 'false' ? $('#editModal #isActivelyBrewed').prop('checked', false) : $('#editModal #isActivelyBrewed').prop('checked', true); 
      $('#editModal #editSubmitButton').attr("data-rel", response.id);
    }
    else {
      //if something goes wrong, give err response
      alert('Error: ' + response.msg);
    }
  });
};

//Main Editing beer object adding function =============================================================
function editBeer(dataRel) {

  //basic validation
  var errorCount = 0;
  $('#editModal input').each(function(index, val) { 
    if($(this).val() === '') { errorCount++; }
  });

  //check and make sure errorCount is still zero
  if(errorCount === 0) {

    //on verification, compile info to Object
    var editedBeerObj = {
      "name": $('#editModal #inputName').val(),
      "activelyBrewed": (function() {
        var brewedIsChecked= document.getElementById('isActivelyBrewed').checked;
        brewedIsChecked == 'checked' ? "true" : "false";
        })(), 
      "ibu": $('#editModal #inputIBU').val(),
      "abv": $('#editModal #inputABV').val(),
      "flavors": $('#editModal #inputFlavor').val(),
      "lastTappedOn": $('#editModal #inputLastBrewDate').val(), 
      "breweryId": "UserSubmitted",
      "breweryName": $('#editModal #inputBrewery').val()
    }

    //.ajax post
    $.ajax({
      type: 'POST',
      data: { id: dataRel, beerData: editedBeerObj },
      url: '/beers/edit',
      dataType: 'JSON'
    }).fail(function( response ) {
      console.log(' error it failed');
    }).done(function( response ) {

      //check for successful response
      if (!response.error) {

        //Hide modal
        $('#editModal').modal('hide');

      }
      else {
        //if something goes wrong, give err response
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    //if errorCount is more than 0, error out
    alert('Please fill all the fields!');
    return false;s
  }
};





