 document.addEventListener("deviceready", getLocation, false);
 
 function getLocation() {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }

 // onSuccess Geolocation
 //
    function onSuccess(position) {
         alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n');
        
        var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />';
        
        $("#radar").append(element);
    }

 // onError Callback receives a PositionError object
 //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
