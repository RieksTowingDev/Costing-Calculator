let map;
let directionsService;
let directionsRenderer;
let startMarker;
let endMarker;
let autocompleteFrom;
let autocompleteTo;

function initMap() {
    console.log('Initializing map...');
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -27.3944, lng: 24.7956 },
        zoom: 8
    });

    // Create a directions service object to use the route method and get a result for our request
    directionsService = new google.maps.DirectionsService();

    // Create a directions renderer object to display the route
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Initialize the autocomplete fields
    autocompleteFrom = new google.maps.places.Autocomplete(document.getElementById('from'));
    autocompleteTo = new google.maps.places.Autocomplete(document.getElementById('to'));

    // Add event listeners to the autocomplete fields
    autocompleteFrom.addListener('place_changed', onPlaceChanged);
    autocompleteTo.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    const fromPlace = autocompleteFrom.getPlace();
    const toPlace = autocompleteTo.getPlace();

    if (fromPlace && fromPlace.geometry && toPlace && toPlace.geometry) {
        if (startMarker) startMarker.setMap(null);
        if (endMarker) endMarker.setMap(null);

        startMarker = new google.maps.Marker({
            position: fromPlace.geometry.location,
            map: map,
            label: 'A'
        });

        endMarker = new google.maps.Marker({
            position: toPlace.geometry.location,
            map: map,
            label: 'B'
        });

        calculateAndDisplayRoute();
    }
}

function calculateAndDisplayRoute() {
    if (startMarker && endMarker) {
        const request = {
            origin: startMarker.getPosition(),
            destination: endMarker.getPosition(),
            travelMode: 'DRIVING'
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
                const distance = result.routes[0].legs[0].distance.value / 1000; // distance in km
                const tariff = (distance * 15).toFixed(2); // Assuming R15 per km travelled, rounded to 2 decimal places
                document.getElementById('travelqty').value = distance;
                document.getElementById('Traveltariff').textContent = `R${tariff}`;
            } else {
                console.error('Directions request failed due to ' + status);
                alert('Directions request failed due to ' + status);
            }
        });
    }
}

// Load the Google Maps API script dynamically
function loadGoogleMapsAPI(apiKey) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = function() {
        console.error('Google Maps API failed to load.');
        alert('Google Maps API failed to load. Please check your API key.');
    };
    script.onload = function() {
        console.log('Google Maps API script loaded successfully.');
    };
    document.head.appendChild(script);
}

// Call this function with your API key to initialize the map
loadGoogleMapsAPI('AIzaSyCGuR-XJd_FeIEPwEhjqbmibIkK-XDbTA4');