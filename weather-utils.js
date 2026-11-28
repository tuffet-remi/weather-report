const WIND_MIN = 0;
const WIND_MAX = 90;
const ANIMATION_MIN = 0.3;
const ANIMATION_MAX = 2;

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

export function getWeatherInfo(code, isDay) {
    const info = weatherCodes[code] || unknownWeather;

    let icon = info.day;
    if (isDay === 0 && info.night) {
        icon = info.night;
    }

    return { text: info.text, icon: icon };
}

export function computeAnimationSpeed(wind) {
    let speed = ANIMATION_MIN
        + (wind - WIND_MIN) * (ANIMATION_MAX - ANIMATION_MIN) / (WIND_MAX - WIND_MIN);

    speed = Math.min(Math.max(speed, ANIMATION_MIN), ANIMATION_MAX);
    return speed;
}
