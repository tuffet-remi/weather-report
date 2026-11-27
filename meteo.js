const windAnimation = lottie.loadAnimation({
    container: document.getElementById("wind-anim"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "icons/wind.json"
});
const WIND_MIN = 0;
const WIND_MAX = 90;
const ANIMATION_MIN = 0.3;
const ANIMATION_MAX = 2;
const cityElement = document.getElementById("cityElement");
const temperatureElement = document.getElementById("temperatureElement");
const humidityElement = document.getElementById("humidityElement");
const weatherStateElement = document.getElementById("weatherStateElement");
const iconElement = document.getElementById("iconElement");
const timeElement = document.getElementById("timeElement");
const windElement = document.getElementById("windElement");
const errorElement = document.getElementById("errorElement");

const weatherCodes = {
	"0": { text: "Ciel dégagé", day: "icons/clear-day.svg", night: "icons/clear-night.svg" },
	"1": { text: "Plutôt dégagé", day: "icons/mostly-clear-day.svg", night: "icons/mostly-clear-night.svg" },
	"2": { text: "Partiellement nuageux", day: "icons/mostly-clear-day.svg", night: "icons/mostly-clear-night.svg" },
	"3": { text: "Couvert", day: "icons/cloudy.svg" },
	"45": { text: "Brouillard", day: "icons/mist.svg" },
	"48": { text: "Brouillard givrant", day: "icons/mist.svg" },
	"51": { text: "Bruine légère", day: "icons/drizzle.svg" },
	"53": { text: "Bruine modérée", day: "icons/drizzle.svg" },
	"55": { text: "Bruine dense", day: "icons/extreme-drizzle.svg" },
	"56": { text: "Bruine verglaçante légère", day: "icons/sleet.svg" },
	"57": { text: "Bruine verglaçante dense", day: "icons/extreme-sleet.svg" },
	"61": { text: "Faible pluie", day: "icons/rain.svg" },
	"63": { text: "Pluie modérée", day: "icons/rain.svg" },
	"65": { text: "Forte pluie", day: "icons/extreme-rain.svg" },
	"66": { text: "Faible pluie verglaçante", day: "icons/sleet.svg" },
	"67": { text: "Forte pluie verglaçante", day: "icons/extreme-sleet.svg" },
	"71": { text: "Neige faible", day: "icons/snow.svg" },
	"73": { text: "Neige modérée", day: "icons/snow.svg" },
	"75": { text: "Forte neige", day: "icons/extreme-snow.svg" },
	"77": { text: "Grains de neige", day: "icons/extreme-snow.svg" },
	"80": { text: "Faibles averses de pluie", day: "icons/rain.svg" },
	"81": { text: "Averses de pluie modérée", day: "icons/extreme-rain.svg" },
	"82": { text: "Violentes averses de pluie", day: "icons/extreme-rain.svg" },
	"85": { text: "Faibles averses de neige", day: "icons/snow.svg" },
	"86": { text: "Fortes averses de neige", day: "icons/extreme-snow.svg" },
	"95": { text: "Orage", day: "icons/thunderstorms.svg" },
	"96": { text: "Orage avec grêle légère", day: "icons/thunderstorms-snow.svg" },
	"97": { text: "Violent orage", day: "icons/extreme-thunderstorms.svg" },
	"99": { text: "Orage avec forte grêle", day: "icons/extreme-thunderstorms-snow.svg" }
};

const unknownWeather = { text: "Météo indisponible", day: "icons/not-available.svg" };

async function readConfig() {
    const response = await fetch("conf.json");

    if (!response.ok) {
        throw new Error("Impossible de lire le fichier de configuration");
    }
    const data = await response.json();

    if (!data.ville) {
        throw new Error("Aucune ville définie dans le fichier de configuration");
    }
    return data.ville;
}

async function findCoordinates(city) {
	const response = await fetch("https://geocoding-api.open-meteo.com/v1/search?name="
	+ encodeURIComponent(city) 
	+ "&count=1&language=fr&format=json");

	if (!response.ok) {
		throw new Error("Le serveur météo ne transmet pas la ville correctement");
	}

	const geo =  await response.json();
	if (!geo.results) {
		throw new Error("Ville introuvable : " + city);
	}
	return { latitude : geo.results[0].latitude, longitude : geo.results[0].longitude };
}

async function fetchWeather(latitude, longitude) {
	const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude="
	+ latitude
	+ "&longitude="
	+ longitude
	+ "&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,is_day&timezone=Europe/Paris");

	if (!response.ok) {
		throw new Error("Le serveur météo n'accède pas aux informations météorologiques");
	}

	const weather =  await response.json();
	return { temperature : weather.current.temperature_2m, 
	temperatureUnit : weather.current_units.temperature_2m,
	humidity : weather.current.relative_humidity_2m,
	wind : weather.current.wind_speed_10m,
	windUnit : weather.current_units.wind_speed_10m,
	isDay : weather.current.is_day,
	code : weather.current.weather_code };
}

function displayWeather(city, weather) {
	cityElement.textContent = city;
	temperatureElement.textContent = weather.temperature.toLocaleString("fr-FR") + " " + weather.temperatureUnit;
	humidityElement.textContent = weather.humidity + " %";
	windElement.textContent = weather.wind.toLocaleString("fr-FR") + " " + weather.windUnit;

	const Weatherinfos = weatherCodes[1000] || unknownWeather;
	let icon = Weatherinfos.day;
	const isNight = weather.isDay === 0;
	if (isNight && Weatherinfos.night) {
		icon = Weatherinfos.night;
	}
	weatherStateElement.textContent = Weatherinfos.text;
	iconElement.src = icon;
	iconElement.alt = Weatherinfos.text;

	let animationSpeed = ANIMATION_MIN + (weather.wind - WIND_MIN) * (ANIMATION_MAX - ANIMATION_MIN) / (WIND_MAX - WIND_MIN);
	animationSpeed = Math.min(Math.max(animationSpeed, ANIMATION_MIN), ANIMATION_MAX);
	windAnimation.setSpeed(animationSpeed);

	timeElement.textContent = new Date().toLocaleTimeString();

	errorElement.textContent = "";

}

function displayError(error) {
	errorElement.textContent = error.message;
	console.error(error);
}
		
async function updateWeather() {
    try {
        const city = await readConfig();
        const coordinates = await findCoordinates(city);
        const weather = await fetchWeather(coordinates.latitude, coordinates.longitude);
        displayWeather(city, weather);
    } catch (error) {
        displayError(error);
    }
}

updateWeather();
setInterval(updateWeather, 60 * 60 * 1000);
