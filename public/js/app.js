$( document ).ready(function() {

    //if(!'#address') return; // skip this fn from running if there is not input on the page
    const dropdown = new google.maps.places.Autocomplete(document.getElementById('address'));
  
    dropdown.addListener('place_changed', () => {
      const place = dropdown.getPlace();
      const latImput  = document.getElementById('lat');
      const lngInput = document.getElementById('lng');
      latImput.value = place.geometry.location.lat();
      lngInput.value = place.geometry.location.lng();
    });
    // if someone hits enter on the address field, don't submit the form
    $('#address').on('keydown', (e) => {
      if (e.keyCode === 13) e.preventDefault();
    });


});


