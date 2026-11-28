import { getWeatherInfo, computeAnimationSpeed } from "./weather-utils.js";

const windAnimation = lottie.loadAnimation({
    container: document.getElementById("wind-anim"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "icons/wind.json" });
const cityElement = document.getElementById("cityElement");
const temperatureElement = document.getElementById("temperatureElement");
const humidityElement = document.getElementById("humidityElement");
const weatherStateElement = document.getElementById("weatherStateElement");
const iconElement = document.getElementById("iconElement");
const timeElement = document.getElementById("timeElement");
const windElement = document.getElementById("windElement");
const errorElement = document.getElementById("errorElement");

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

	const info = getWeatherInfo(weather.code, weather.isDay);
	weatherStateElement.textContent = info.text;
	iconElement.src = info.icon;
	iconElement.alt = info.text;

	windAnimation.setSpeed(computeAnimationSpeed(weather.wind));

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
