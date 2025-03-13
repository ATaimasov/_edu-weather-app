import axios from "axios";

const BASE_WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const WEATHER_URL_SETTINGS = {
  hourly:
    "temperature_2m,apparent_temperature,precipitation_probability,weathercode,is_day",
  daily:
    "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
};

export const getWeatherData = async (lat, lng) => {
  try {
    const weatherData = await axios.get(
      `${BASE_WEATHER_URL}?latitude=${lat}&longitude=${lng}&hourly=${WEATHER_URL_SETTINGS.hourly}&daily=${WEATHER_URL_SETTINGS.daily}&current_weather=true&timezone=auto&past_days=1`,
    );

    const data = weatherData.data;

    let hourlyWeather = getHourlyWeather(data);
    let currentWeather = getCurrentWeather(data, hourlyWeather);
    let weeklyWeather = getWeeklyWeather(data);

    // Flicker Delay
    //  await new Promise(resolve => setTimeout(resolve, 200));

    return {
      currentWeather: currentWeather,
      hourlyWeather: hourlyWeather,
      weeklyWeather: weeklyWeather,
    };
  } catch (err) {
    console.log(err);
  }
};

// first obj created from API call
function getCurrentWeather(data, hourlyWeather) {
  try {
    let day = data["current_weather"]["is_day"] === 1 ? true : false;

    let info = {
      time: data["current_weather"]["time"],
      temp: Math.round(data["current_weather"]["temperature"]),
      description: getWeatherIconString(
        data["current_weather"]["weathercode"],
        day,
      ),
      apparentTemp: hourlyWeather[0].apparentTemp, // get info from hourly array
      precipitationProb: hourlyWeather[0].precipitationProb,
    };

    return info;
  } catch (error) {
    console.log(`Couldn't fetch current data: ${error}`);
    return null;
  }
}

// second obj created from API call
function getHourlyWeather(data) {
  try {
    let startHoursIndex = data["hourly"]["time"].findIndex(
      (time) =>
        [...time].slice(0, 13).join("") ===
        [...data["current_weather"]["time"]].slice(0, 13).join(""),
    );

    let info = [];

    for (let i = startHoursIndex; i <= startHoursIndex + 25; i++) {
      let item = {
        time: data["hourly"]["time"][i],
        temp: Math.round(data["hourly"]["temperature_2m"][i]),
        apparentTemp: Math.round(data["hourly"]["apparent_temperature"][i]),
        precipitationProb: data["hourly"]["precipitation_probability"][i],
        description: getWeatherIconString(
          data["hourly"]["weathercode"][i],
          data["hourly"]["is_day"][i],
        ),
      };

      info.push(item);
    }

    return info;
  } catch (error) {
    console.log(`Couldn't fetch current data: ${error}`);
    return null;
  }
}

function getWeeklyWeather(data) {
  try {
    let info = [];

    for (let i = 0; i < 7; i++) {
      let item = {
        day: data["daily"]["time"][i],
        tempMax: data["daily"]["temperature_2m_max"][i],
        tempMin: data["daily"]["temperature_2m_min"][i],
        description: getWeatherIconString(
          data["daily"]["weathercode"][i],
          true,
        ),
      };

      info.push(item);
    }
    return info;
  } catch (error) {
    console.log(`Couldn't fetch current data: ${error}`);
    return null;
  }
}

// additional obj created to be used in both objs as value of 'weather'.
function getWeatherIconString(code, day) {
  let weatherString;
  let weatherIcon;

  switch (code) {
    case 0:
      weatherString = "Clear sky";
      weatherIcon = `wi wi-${day ? "day-sunny" : "night-clear"}`;
      break;

    case 1:
      weatherString = "Mainly clear";
      weatherIcon = `wi wi-${day ? "day-cloudy" : "cloudy"}`;
      break;

    case 2:
      weatherString = "Partly cloudy";
      weatherIcon = `wi wi-${day ? "day-cloudy" : "cloudy"}`;
      break;

    case 3:
      weatherString = "Cloudy";
      weatherIcon = `wi wi-${day ? "day-cloudy" : "cloudy"}`;
      break;

    case 45:
      weatherString = "Foggy";
      weatherIcon = `wi wi-fog`;
      break;

    case 48:
      weatherString = "Very Foggy";
      weatherIcon = `wi wi-fog`;
      break;

    case 51:
      weatherString = "Light Drizzle";
      weatherIcon = `wi wi-sprinkle`;
      break;

    case 53:
      weatherString = "Moderate Drizzle";
      weatherIcon = `wi wi-sprinkle`;
      break;

    case 55:
      weatherString = "Dense Drizzle";
      weatherIcon = `wi wi-sprinkle`;
      break;

    case 56:
      weatherString = "Light Freezing Drizzle";
      weatherIcon = `wi wi-sprinkle`;
      break;

    case 57:
      weatherString = "Dense Freezing Drizzle";
      weatherIcon = `wi wi-sprinkle`;
      break;

    case 61:
      weatherString = "Slight Rain";
      weatherIcon = `wi wi-rain`;
      break;

    case 63:
      weatherString = "Moderate Rain";
      weatherIcon = `wi wi-rain`;
      break;

    case 65:
      weatherString = "Heavy Rain";
      weatherIcon = `wi wi-rain`;
      break;

    case 66:
      weatherString = "Slight FreezingRain";
      weatherIcon = `wi wi-rain-mix`;
      break;

    case 67:
      weatherString = "Heavy Freezing Rain";
      weatherIcon = `wi wi-rain-wind`;
      break;

    case 71:
      weatherString = "Slight Snow";
      weatherIcon = `wi wi-snow`;
      break;

    case 73:
      weatherString = "Moderate Snow";
      weatherIcon = `wi wi-snow`;
      break;

    case 75:
      weatherString = "Heavy Snow";
      weatherIcon = `wi wi-snow-wind`;
      break;

    case 77:
      weatherString = "Snow grains";
      weatherIcon = `wi wi-hail`;
      break;

    case 80:
      weatherString = "Slight Rain showers";
      weatherIcon = `wi wi-showers`;
      break;

    case 81:
      weatherString = "Moderate Rain showers";
      weatherIcon = `wi wi-showers`;
      break;

    case 82:
      weatherString = "Heavy Showers";
      weatherIcon = `wi wi-storm-showers`;
      break;

    case 85:
      weatherString = "Light Showers";
      weatherIcon = `wi wi-showers`;
      break;

    case 86:
      weatherString = "Heavy Snow showers";
      weatherIcon = `wi wi-storm-showers`;
      break;

    case 95:
      weatherString = "Thunderstorm";
      weatherIcon = `wi wi-thunderstorm`;
      break;

    case 96:
      weatherString = "Thunderstorm with slight hail";
      weatherIcon = `wi wi-storm-showers`;
      break;

    case 99:
      weatherString = "Thunderstorm with heavy hail";
      weatherIcon = `wi wi-storm-showers`;
      break;

    default:
      weatherString = "Tornado";
      weatherIcon = `wi wi-tornado`;
      break;
  }

  return {
    code: code,
    string: weatherString,
    icon: weatherIcon,
  };
}
