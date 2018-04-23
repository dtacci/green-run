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

    //on verification, check if brewed, convert to string
    var isActivelyBrewed = "";
    if ($('#postModal #isActivelyBrewed').prop('checked') == false) {
      isActivelyBrewed = "false";}
    else { 
      isActivelyBrewed = "true";} 

    //all others, compile info to Object
    var newlyAddedBeer = {
      "name": $('#postModal input#inputName').val(),
      "activelyBrewed": isActivelyBrewed,
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

        //create new div and populate client side
        $('<div>', {class: 'card col-4 brewed' + response.activelyBrewed , style: 'display: none;'}).attr('data-rel', response.id).appendTo('.beer-card-container');
        var $newBeerAdded = $('.beer-card-container').find("[data-rel='" + response.id + "']");
        $newBeerAdded.append( $('<div>', {class: 'card-body'}) );
        $newBeerAdded.find('.card-body').append( ' <h5 class="card-title">#<span class="' + response.id + '">'+ response.id +'</span>' + 
          '<span class="beerListName">' + response.name + '</span></h5>');
        $newBeerAdded.find('.card-body').append(' <h6 class="beerListBreweryName">by ' + response.breweryName +'</h6>');
        $newBeerAdded.find('.card-body').append('<h6><span class="beerListABV">' + response.abv + '</span>% ABV,' +
         '<span class="beerListIBU">'+ response.ibu + '</span> IBU </h6>');
        $newBeerAdded.find('.card-body').append('<h6 class="small">Last tapped on <span class="beerListLastTapped">' + response.lastTappedOn + '</span></h6> ');
        $newBeerAdded.find('.card-body').append('<p class="card-text">Tastes: <span class="beerListFlavors">' + response.flavors + '</span></p>');
        $newBeerAdded.find('.card-body').append('<a href="#" class="btn btn-primary" data-rel="' + response.id + '" onClick=editBeerModal(this.getAttribute("data-rel"))>Edit</a>');
        $newBeerAdded.find('.card-body').append('<a href="#" class="btn btn-primary" data-rel="' + response.id + '" onClick=deleteBeer(this.getAttribute("data-rel"))>Delete</a>');
        //scroll to the change
        document.querySelector('footer').scrollIntoView({ behavior: 'smooth', alignToTop: false });
        $newBeerAdded.fadeIn();
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

  //prevent normal href action
  event.preventDefault();

  //.ajax call
  $.ajax({
    type: 'POST',
    data: { id: dataRel },
    url: '/beers/delete',
    dataType: 'JSON'
  }).done(function( response ) {

    //check for successful response
    if (!response.error) {
      //yay it worked! Now delete the beer on the client side since it's gone off the server
      $('.beer-card-container').find("[data-rel='" + dataRel + "']").fadeOut(400, function(){ $(this).remove(); });
    }
    else {
      //if something goes wrong, give err response
      alert('Error: ' + response.msg);
    }
  });
};


//Beer object edit modal function =============================================================
function editBeerModal(dataRel) {
  //prevent normal href action (prevent jumping)
  event.preventDefault();

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

    var isActivelyBrewed = "";
    if ($('#editModal #isActivelyBrewed').prop('checked') == false) {
      isActivelyBrewed = "false";}
    else { 
      isActivelyBrewed = "true";} 

    //on verification, compile info to Object
    var editedBeerObj = {
      "name": $('#editModal #inputName').val(),
      "activelyBrewed": isActivelyBrewed,
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
      console.log(' error: it failed');
    }).done(function( response ) {

      //check for successful response
      if (!response.error) {

        //Hide modal
        $('#editModal').modal('hide');
        //update text on the client side
        var beerToEdit = $('.beer-card-container').find("[data-rel='" + dataRel + "']");
        beerToEdit.find('.beerListName').text(editedBeerObj.name);
        beerToEdit.find('.beerListBreweryName').text(editedBeerObj.breweryName);
        beerToEdit.find('.beerListABV').text(editedBeerObj.abv);
        beerToEdit.find('.beerListIBU').text(editedBeerObj.ibu);
        beerToEdit.find('.beerListLastTapped').text(editedBeerObj.lastTappedOn);
        beerToEdit.find('.beerListFlavors').text(editedBeerObj.flavors);
        //scroll to the change
        document.querySelector('.beer-holder').scrollIntoView({ behavior: 'smooth' });

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


