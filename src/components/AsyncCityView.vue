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
      <h1 class="text-4xl mb-3" @click="one">{{ route.params.city }}</h1>
        <time class="text-sm mb-10" 
		:datetime="weather.currentWeather.time || ''"
		>
        {{
          new Date(weather.currentWeather.time).toLocaleDateString(
            "en-us",
            {
              weekday: "short",
              day: "2-digit",
              month: "long",
            }
          )
        }}
        {{
          new Date(weather.currentWeather.time).toLocaleTimeString(
            "en-us",
            {
              timeStyle: "short",
            }
          )
        }}
      </time>
      <p class="text-8xl mb-10">
        {{weather.currentWeather.temp}}&deg;C
      </p>
      <p class="text-sm mb-2">
          Feels like:
        {{ weather.currentWeather.apparentTemp }}&deg;C
      </p>
      <p class="text-sm mb-2">
          Precipitation probability:
        {{ weather.currentWeather.precipitationProb }}%
      </p>
    </div>
    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div class="max-w-screen-lg w-full py-12 select-none">
      <div class="mx-8 text-white">
        <h2 class="text-4xl mb-10 text-center ">Hourly Weather</h2>
        <swiper 
		class="flex gap-10 pb-7"
		:modules="modules"
		:spaceBetween="5"
		:slidesPerView="4"
		:grabCursor="true"
		:scrollbar="{ draggable: true }"
		:freeMode="true"
		:breakpoints="breakpoints"
		>
            <swiper-slide 
			v-for="(hour, index) in weather.hourlyWeather" :key="hour"
            class = "flex flex-col gap-3 items-center"
            
			>
                     <p class="whitespace-nowrap text-lg"
					 :class="index === 0 ? 'font-bold' : ''"
					 >
						{{ 
							index === 0 ? "Now" : new Date(hour.time).toLocaleDateString(
								"en-us",
								{
              						weekday: "short",
									day: "2-digit",
								}
							)
						}}:
                        {{ 
							new Date(hour.time).toLocaleTimeString(
								"en-us",
								{
			              			timeStyle: "short",
								}
							)
						}}
                    </p> 
                     <i 
                    class="text-4xl pb-2"
                    :class="hour.description.icon"
                    ></i> 
                   <p class="text-base">
                        {{ hour.temp}}&deg;C
                    </p>
                   <p class="text-xs text-center">
                        {{ hour.description.string}}
                    </p>
            </swiper-slide>
			     
        </swiper>

		
      </div>
    </div>
  <hr class="border-white border-opacity-10 border w-full" />
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import { ref, defineEmits } from "vue";

const route = useRoute();

const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${route.query.lat}&longitude=${route.query.lng}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode,is_day&daily=weathercode,precipitation_probability_max&current_weather=true&timezone=auto&past_days=1`
    );

	const data = weatherData.data;

    console.log("weatherData",  data);
	
	let hourlyWeather = getHourlyWeather(data);
	let currentWeather = getCurrentWeather(data, hourlyWeather);

    return {
		currentWeather: currentWeather,
		hourlyWeather: hourlyWeather
	}
	
  } catch (err) {
    console.log(err);
  }
};

const weather = await getWeatherData();

function one() {
console.log("123",  weather.currentWeather)

}

// first obj created from API call
function getCurrentWeather(data, hourlyWeather) {
	try {

		let day = data['current_weather']['is_day'] === 1 ? true : false; 

		let info = {
			time: data['current_weather']['time'],
			temp: Math.round(data['current_weather']['temperature']),
			description: getWeatherIconString(data['current_weather']['weathercode'], day),
			apparentTemp: hourlyWeather[0].apparentTemp, // get info from hourly array
			precipitationProb: hourlyWeather[0].precipitationProb
		};

		console.log("getCurrentWeather",  info)

		return info;
	} catch (error) {
		console.log(`Couldn't fetch current data: ${error}`);
		return null;
	}
}

// second obj created from API call
function getHourlyWeather(data) {
	try {

		let startHoursIndex = data['hourly']['time']
		.findIndex((time) => 
			[...time]
			.slice(0, 13)
			.join('') === [...data['current_weather']['time']]
			.slice(0, 13)
		.join(''));
		
		let info = [];


		for (let i = startHoursIndex; i <= startHoursIndex + 25; i++) {
			let item = {
				time: data['hourly']['time'][i],
				temp: Math.round(data['hourly']['temperature_2m'][i]),
				apparentTemp: Math.round(data['hourly']['apparent_temperature'][i]),
				precipitationProb: data['hourly']['precipitation_probability'][i],
				description: getWeatherIconString(data['hourly']['weathercode'][i], data['hourly']['is_day'][i])
			};

			info.push(item);
		}

		console.log("test",  info)

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
			weatherIcon = `wi wi-${day ? 'day-sunny' : 'night-clear'}`;
			break;

		case 1:
			weatherString = "Mainly clear";
			weatherIcon = `wi wi-${day ? 'day-cloudy' : 'cloudy'}`;
			break;

		case 2:
			weatherString = "Partly cloudy";
			weatherIcon = `wi wi-${day ? 'day-cloudy' : 'cloudy'}`;
			break;

		case 3:
			weatherString = "Cloudy";
			weatherIcon = `wi wi-${day ? 'day-cloudy' : 'cloudy'}`;
			break;

		case 45:
			weatherString = "Foggy";
			weatherIcon = `wi wi-foggy`;
			break;

		case 48:
			weatherString = "Very Foggy";
			weatherIcon = `wi wi-foggy`;
			break;

		case 51:
			weatherString = "Light Drizzle";
			weatherIcon = `wi wi-grain`;
			break;

		case 53:
			weatherString = "Moderate Drizzle";
			weatherIcon = `wi wi-grain`;
			break;

		case 55:
			weatherString = "Dense Drizzle";
			weatherIcon = `wi wi-grain`;
			break;

		case 56:
			weatherString = "Light Freezing Drizzle";
			weatherIcon = `wi wi-grain`;
			break;

		case 57:
			weatherString = "Dense Freezing Drizzle";
			weatherIcon = `wi wi-grain`;
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
		icon: weatherIcon
	};
}


// swiper 
import { Navigation, Pagination, Scrollbar, A11y, Thumbs, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/scrollbar';

const modules = ref([
  Scrollbar,
  FreeMode
]);

const breakpoints = ref({
  0: {
	slidesPerView: 1
  },
  480: {
	slidesPerView: 2
  },
  768: {
	slidesPerView: 3
  },
  1024: {
	slidesPerView: 4
  }
});


</script>

<style scoped>

</style>