const city = document.getElementById("city");
const tmp = document.getElementById("tmp");
const relhum = document.getElementById("relhum");
const wcode = document.getElementById("wcode");
const icons = document.getElementById("icons");
const time = document.getElementById("time"); 

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

const weather_icon = {
	"0": "icons/clear-day.svg",
	"1": "icons/mostly-clear-day.svg",
	"2": "icons/mostly-clear-day.svg",
	"3": "icons/cloudy.svg",
	"45": "icons/mist.svg",
	"48": "icons/mist.svg",
	"51": "icons/drizzle.svg",
	"53": "icons/drizzle.svg",
	"55": "icons/extreme-drizzle.svg",
	"56": "icons/sleet.svg",
	"57": "icons/extreme-sleet.svg",
	"61": "icons/rain.svg",
	"63": "icons/rain.svg",
	"65": "icons/extreme-rain.svg",
	"66": "icons/sleet.svg",
	"67": "icons/extreme-sleet.svg",
	"71": "icons/snow.svg",
	"73": "icons/snow.svg",
	"75": "icons/extreme-snow.svg",
	"77": "icons/extreme-snow.svg",
	"80": "icons/rain.svg",
	"81": "icons/extreme-rain.svg",
	"82": "icons/extreme-rain.svg",
	"85": "icons/snow.svg",
	"86": "icons/extreme-snow.svg",
	"95": "icons/thunderstorms.svg",
	"96": "icons/thunderstorms-snow.svg",
	"97": "icons/extreme-thunderstorms.svg",
	"99": "icons/extreme-thunderstorms-snow.svg"
};

function update_meteo() {
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
                    + "&current=temperature_2m,weather_code,relative_humidity_2m&timezone=Europe/Paris")
                    .then(response => response.json())
                    .then(weather => {
                        console.log(weather);
                        const temperature = weather.current.temperature_2m + " " + weather.current_units.temperature_2m;
                        tmp.textContent = temperature;
                        const humidity = weather.current.relative_humidity_2m + " %";
                        relhum.textContent = humidity;
                        const code = weather.current.weather_code;
                        const description = weather_def[code] || "Météo indisponible";
                        wcode.textContent = description;
                        const wicons = weather_icon[code] || "icons/not-available.svg";
                        icons.src = wicons;
                        icons.alt = description;
                        const timestring = new Date().toLocaleTimeString();
                        time.textContent = timestring;
                    });
            });
        });
}

update_meteo();
setInterval(update_meteo, 60*60*1000);