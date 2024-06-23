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
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m&hourly=temperature_2m,wind_speed_10m
`);
    const data = await response.json();
    console.log(data);
    
    // Actualizar el contenido del elemento con la temperatura
    const temperatureElement = document.getElementById("temperature");
    const humidity = document.getElementById("humidity-text");
    const wind = document.getElementById("wind-text");
    const precipitation = document.getElementById("precipitation-text");
    const logo = document.getElementById("logo-img")


    temperatureElement.textContent = `${data.current.temperature_2m} °C`;
    humidity.textContent = `${data.current.relative_humidity_2m}%`;
    wind.textContent = `${data.current.wind_speed_10m} km/h`;
    precipitation.textContent = `${data.current.rain}`;

    if (data.current.rain > 0){
        logo.src = "assets/rain-icon.gif";
    }
    else {
        logo.src = "assets/sun-icon.gif";
    }
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;