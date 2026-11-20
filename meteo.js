const city = document.getElementById("city");
const tmp = document.getElementById("tmp");
const relhum = document.getElementById("relhum");
let wcode = document.getElementById("wcode");

const weather_def = {
	"0": "Ciel dégagé",
	"1": "Plutôt dégagé",
	"2": "Partiellement nuageux",
	"3": "Couvert",
	"45": "Brouillard",
	"48": "Brouillard givrant",
	"51": "Bruine légère",
	"53": "Bruine modérée",
	"55": "Bruine dense",
	"56": "Bruine verglaçante légère",
	"57": "Bruine verglaçante dense",
	"61": "Faible pluie",
	"63": "Pluie modérée",
	"65": "Forte pluie",
	"66": "Faible pluie verglaçante",
	"67": "Forte pluie verglaçante",
	"71": "Neige faible",
	"73": "Neige modérée",
	"75": "Forte neige",
	"77": "Grains de neige",
	"80": "Faibles averses de pluie",
	"81": "Averses de pluie modérée",
	"82": "Violentes averses de pluie",
	"85": "Faibles averses de neige",
	"86": "Fortes averses de neige",
	"95": "Orage",
	"96": "Orage avec grêle légère",
	"97": "Violent orage",
	"99": "Orage avec forte grêle"
};

fetch("conf.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const ville = data.ville;
        city.textContent = ville;
        fetch("https://geocoding-api.open-meteo.com/v1/search?name="
        + ville
        + "&count=1&language=fr&format=json")
        .then(response => response.json())
        .then(geo => {
            console.log(geo);
            const latitude = geo.results[0].latitude;
            const longitude = geo.results[0].longitude;
            console.log(latitude);
            console.log(longitude);

            fetch("https://api.open-meteo.com/v1/forecast?latitude="
                + latitude
                + "&longitude="
                + longitude
                + "&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=Europe/Paris")
                .then(response => response.json())
                .then(weather => {
                    console.log(weather);
                    const temperature = weather.current.temperature_2m + " " + weather.current_units.temperature_2m;
                    tmp.textContent = temperature;
                    const humidity = weather.current.relative_humidity_2m + "%";
                    relhum.textContent = humidity;
                    let weather_code = weather.current.weather_code;
                    weather_code = weather_def[weather_code]
                    wcode.textContent = weather_code;
                });
        });
    });
