const city = document.getElementById("city");
const tmp = document.getElementById("tmp");
const relhum = document.getElementById("relhum");
const wcode = document.getElementById("wcode");
const icons = document.getElementById("icons");
const time = document.getElementById("time"); 
const wind = document.getElementById("wind"); 

const codesMeteo = {
	"0": { texte : "Ciel dégagé", jour : "icons/clear-day.svg", nuit : "icons/clear-night.svg"},
	"1": { texte : "Plutôt dégagé", jour : "icons/mostly-clear-day.svg", nuit : "icons/mostly-clear-night.svg"},
	"2": { texte : "Partiellement nuageux", jour : "icons/mostly-clear-day.svg", nuit : "icons/mostly-clear-night.svg"},
	"3": { texte : "Couvert", jour : "icons/cloudy.svg"},
	"45": { texte : "Brouillard", jour : "icons/mist.svg"},
	"48": { texte : "Brouillard givrant", jour : "icons/mist.svg"},
	"51": { texte : "Bruine légère", jour : "icons/drizzle.svg"},
	"53": { texte : "Bruine modérée", jour : "icons/drizzle.svg"},
	"55": { texte : "Bruine dense", jour : "icons/extreme-drizzle.svg"},
	"56": { texte : "Bruine verglaçante légère", jour : "icons/sleet.svg"},
	"57": { texte : "Bruine verglaçante dense", jour : "icons/extreme-sleet.svg"},
	"61": { texte : "Faible pluie", jour : "icons/rain.svg"},
	"63": { texte : "Pluie modérée", jour : "icons/rain.svg"},
	"65": { texte : "Forte pluie", jour : "icons/extreme-rain.svg"},
	"66": { texte : "Faible pluie verglaçante", jour : "icons/sleet.svg"},
	"67": { texte : "Forte pluie verglaçante", jour : "icons/extreme-sleet.svg"},
	"71": { texte : "Neige faible", jour : "icons/snow.svg"},
	"73": { texte : "Neige modérée", jour : "icons/snow.svg"},
	"75": { texte : "Forte neige", jour : "icons/extreme-snow.svg"},
	"77": { texte : "Grains de neige", jour : "icons/extreme-snow.svg"},
	"80": { texte : "Faibles averses de pluie", jour : "icons/rain.svg"},
	"81": { texte : "Averses de pluie modérée", jour : "icons/extreme-rain.svg"},
	"82": { texte : "Violentes averses de pluie", jour : "icons/extreme-rain.svg"},
	"85": { texte : "Faibles averses de neige", jour : "icons/snow.svg"},
	"86": { texte : "Fortes averses de neige", jour : "icons/extreme-snow.svg"},
	"95": { texte : "Orage", jour : "icons/thunderstorms.svg"},
	"96": { texte : "Orage avec grêle légère", jour : "icons/thunderstorms-snow.svg"},
	"97": { texte : "Violent orage", jour : "icons/extreme-thunderstorms.svg"},
	"99": { texte : "Orage avec forte grêle", jour : "icons/extreme-thunderstorms-snow.svg"}
};

const meteoInconnue = { texte : "Météo indisponible", jour : "icons/not-available.svg" };

function update_meteo() {
    fetch("conf.json")
        .then(response => response.json())
        .then(data => {
            const ville = data.ville;
            city.textContent = ville;

            fetch("https://geocoding-api.open-meteo.com/v1/search?name="
            + ville
            + "&count=1&language=fr&format=json")
            .then(response => response.json())
            .then(geo => {
                const latitude = geo.results[0].latitude;
                const longitude = geo.results[0].longitude;

                fetch("https://api.open-meteo.com/v1/forecast?latitude="
                    + latitude
                    + "&longitude="
                    + longitude
                    + "&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,is_day&timezone=Europe/Paris")
                    .then(response => response.json())
                    .then(weather => {
                        console.log(weather);

                        tmp.textContent = weather.current.temperature_2m.toLocaleString("fr-FR") + " " + weather.current_units.temperature_2m;
                        relhum.textContent = weather.current.relative_humidity_2m + " %";
						wind.textContent = weather.current.wind_speed_10m.toLocaleString("fr-FR") + " " + weather.current_units.wind_speed_10m;
                        
                        const code = weather.current.weather_code;
                        const infos = codesMeteo[code] || meteoInconnue;

						const isNight = weather.current.is_day === 0;

						let icone = infos.jour;
						if (isNight && infos.nuit) {
							icone = infos.nuit;
						}

                        wcode.textContent = infos.texte;
                        icons.src = icone;
                        icons.alt = infos.texte;

                        time.textContent = new Date().toLocaleTimeString();
                    });
            });
        });
}

update_meteo();
setInterval(update_meteo, 60*60*1000);