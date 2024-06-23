let map;
let autocomplete;
let marker;

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.8087174, lng: -75.690601 },
        zoom: 8,
    });

    // Inicializar el campo de autocomplete
    const input = document.getElementById("search");
    autocomplete = new google.maps.places.Autocomplete(input); //Metodo de google
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error("No hay detalles : '" + place.name + "'");
            return;
        }

        // Centrar el mapa en la ubicación seleccionada
        map.setCenter(place.geometry.location);
        map.setZoom(10);

        // Colocar un marcador en la ubicación seleccionada
        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
        });

        // Obtener y mostrar el clima actual en la ubicación seleccionada
        getWeather(place.geometry.location.lat(), place.geometry.location.lng());
    });
}

async function getWeather(lat, lon) {
    // Obtener el clima actual usando la API de Open Meteo
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
    console.log(lat)
    console.log(lon)
    const data = await response.json();
    
    // Actualizar el contenido del elemento con la temperatura
    const temperatureElement = document.getElementById("temperature");
    temperatureElement.textContent = `Temperatura: ${data.current.temperature_2m} °C`;
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;