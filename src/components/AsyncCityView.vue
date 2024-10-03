<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="text-white p-4 bg-weather-secondary w-full text-center"
    >
      <p>
        You are currently previewing this city, click the "+"
        icon to start tracking this city.
      </p>
    </div>
    <!-- Weather Overview -->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-3">{{ route.params.city }}</h1>
        <time class="text-sm mb-10">
        {{
          new Date(TimeData.currentLocalTime).toLocaleDateString(
            "en-us",
            {
              weekday: "short",
              day: "2-digit",
              month: "long",
            }
          )
        }}
        {{
          new Date(TimeData.currentLocalTime).toLocaleTimeString(
            "en-us",
            {
              timeStyle: "short",
            }
          )
        }}
      </time>
      <p class="text-8xl mb-10">
        {{currentTemperature}}&deg;C
      </p>
      <p class="text-sm mb-2">
          Feels like:
        {{ currentApparentTemperature }}&deg;C
      </p>
      <p class="text-sm mb-5">
          Average:
        {{ weatherData.averageTemperature.toFixed(1)}}&deg;C
      </p>
      <p class="text-sm mb-2">
          Precipitation probability:
        {{ currentPrecipitation }}%
      </p>
    </div>
    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll">
            <div v-for="hour in timeOfOneDay" :key="hour"
            class = "flex flex-col gap-3 items-center"
            >
                    <p class="whitespace-nowrap text-lg">
                        {{ getDayTime(hour) }}
                    </p>
                    
                    <!-- <i 
                    class="text-4xl pb-2"
                    :class="getRightIcon()"
                    ></i> -->
          
                  <p class="text-x1">
                        {{ getDayTemperature(hour) }}
                    </p>
            </div>
        </div>
      </div>
    </div>
  <hr class="border-white border-opacity-10 border w-full" />
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
console.log("",  route);

// Async logic
const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${route.query.lat}&longitude=${route.query.lng}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode,is_day&daily=weathercode,precipitation_probability_max&current_weather=true&past_days=1`
    );


    console.log("weatherData",  weatherData.data);
    weatherData.data.averageTemperature = weatherData.data.hourly.temperature_2m.splice(0, 24).reduce((a, b) => a + b, 0) / 24;
	
	let currentWeather = getCurrentWeather(weatherData.data);
    

    return {
		weatherData: weatherData.data,
		currentWeather: currentWeather
	}
  } catch (err) {
    console.log(err);
  }
};

const getTimeData = async () => {
  try {

    const TimeData = await axios.get(
        `https://timeapi.io/api/timezone/coordinate?latitude=${route.query.lat}&longitude=${route.query.lng}`
    );
    

    TimeData.data.Fulltime = TimeData.data.currentLocalTime.substring(0, 13);

    return TimeData.data;

  } catch (err) {
    console.log(err);
  }
};

const [weatherData, TimeData] = await Promise.all([getWeatherData(), getTimeData()]);


// Work with async data
getCurrentWeather(weatherData)
const timeList = weatherData.hourly.time;
const timeOfOneDay = timeList.slice(0, 24);
const currentDate = timeList.find((time) => time.substring(0,13) === TimeData.Fulltime);
const indexOfCurrentDate = timeList.indexOf(currentDate);
const currentTemperature = weatherData.hourly.temperature_2m.at(indexOfCurrentDate);
const currentPrecipitation = weatherData.hourly.precipitation_probability.at(indexOfCurrentDate);
const currentApparentTemperature = weatherData.hourly.apparent_temperature.at(indexOfCurrentDate);


// hourly weather 

let hourOfTheDay;
const getDayTime = (hour) => {
  
   hourOfTheDay = new Date(hour)
    .toLocaleDateString(
                          "ru-ru",
                          {
                            hour: "numeric",
                          }
                        )
    .replace(/^.{0,11}/, "")
    .replace(/(0)(?=[0-9])/, "")

  return hourOfTheDay + ":00"
}


const getDayTemperature = (hour) => {
 return  weatherData.hourly.temperature_2m.at(timeOfOneDay.indexOf(hour))
}


function getWeatherIconString(code, day) {

  let weatherString;
	let weatherIcon;

  switch (code) {
		case 0:
			weatherString = "Clear sky";
			weatherIcon = `wi-${day ? 'day-sunny' : 'night-clear'}`;
			break;

		case 1:
			weatherString = "Mainly clear";
			weatherIcon = `wi-${day ? 'day-cloudy' : 'night-alt-cloudy'}`;
			break;

		case 2:
			weatherString = "Partly cloudy";
			weatherIcon = `wi-${day ? 'day-cloudy' : 'night-alt-cloudy'}`;
			break;

		case 3:
			weatherString = "Cloudy";
			weatherIcon = `wi-cloud`;
			break;

		case 45:
			weatherString = "Foggy";
			weatherIcon = `wi-foggy`;
			break;

		case 48:
			weatherString = "Very Foggy";
			weatherIcon = `wi-foggy`;
			break;

		case 51:
			weatherString = "Light Drizzle";
			weatherIcon = `wi-grain`;
			break;

		case 53:
			weatherString = "Moderate Drizzle";
			weatherIcon = `wi-grain`;
			break;

		case 55:
			weatherString = "Dense Drizzle";
			weatherIcon = `wi-grain`;
			break;

		case 56:
			weatherString = "Light Freezing Drizzle";
			weatherIcon = `wi-grain`;
			break;

		case 57:
			weatherString = "Dense Freezing Drizzle";
			weatherIcon = `wi-grain`;
			break;

		case 61:
			weatherString = "Slight Rain";
			weatherIcon = `wi-rainy`;
			break;

		case 63:
			weatherString = "Moderate Rain";
			weatherIcon = `wi-rainy`;
			break;

		case 65:
			weatherString = "Heavy Rain";
			weatherIcon = `wi-rainy-heavy`;
			break;

		case 66:
			weatherString = "Slight FreezingRain";
			weatherIcon = `wi-rainy-snow`;
			break;

		case 67:
			weatherString = "Heavy Freezing Rain";
			weatherIcon = `wi-rainy-heavy`;
			break;

		case 71:
			weatherString = "Slight Snow";
			weatherIcon = `wi-cloudy-snowing`;
			break;

		case 73:
			weatherString = "Moderate Snow";
			weatherIcon = `wi-cloudy-snowing`;
			break;

		case 75:
			weatherString = "Heavy Snow";
			weatherIcon = `wi-cloudy-snowing`;
			break;

		case 77:
			weatherString = "Snow grains";
			weatherIcon = `wi-grain`;
			break;

		case 80:
			weatherString = "Slight Rain showers";
			weatherIcon = `wi-rainy`;
			break;

		case 81:
			weatherString = "Moderate Rain showers";
			weatherIcon = `wi-rainy`;
			break;

		case 82:
			weatherString = "Heavy Showers";
			weatherIcon = `wi-rainy-heavy`;
			break;

		case 85:
			weatherString = "Light Showers";
			weatherIcon = `wi-rainy-snow`;
			break;

		case 86:
			weatherString = "Heavy Snow showers";
			weatherIcon = `wi-rainy-snow`;
			break;

		case 95:
			weatherString = "Thunderstorm";
			weatherIcon = `wi-thunderstorm-rounded`;
			break;

		case 96:
			weatherString = "Thunderstorm with slight hail";
			weatherIcon = `wi-thunderstorm-rounded`;
			break;

		case 99:
			weatherString = "Thunderstorm with heavy hail";
			weatherIcon = `wi-thunderstorm-rounded`;
			break;

		default:
			weatherString = "Tornado";
			weatherIcon = `wi-tornado-rounded`;
			break;
	}

  return {
		code: code,
		string: weatherString,
		icon: weatherIcon
	};
}

function getCurrentWeather(data) {
	try {

		let day = data['current_weather']['is_day'] === 1 ? true : false; 

		 info = {
			time: data['current_weather']['time'],
			temp: Math.round(data['current_weather']['temperature']),
			averageTemp: Math.round(data['hourly']['temperature_2m'].slice(0, 24).reduce((a, b) => a + b, 0) / 24),
			weather: getWeatherIconString(data['current_weather']['weathercode'], day)
		};

		console.log(" info",  info)

		console.log("datass",  data)
		return info;
	} catch (error) {
		console.log(`Couldn't fetch current data: ${error}`);
		return null;
	}
}

</script>