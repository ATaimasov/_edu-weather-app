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
            class = "flex flex-col gap-4 items-center"
            >
            <table>
                <thead>
                    <tr class="whitespace-nowrap text-md">
                        {{
                          new Date(hour).toLocaleDateString(
                            "ru-ru",
                            {
                              hour: "numeric",
                            }
                          ).replace(/^.{0,11}/, "").replace(/(0)(?=[0-9])/, "")
                        }}:00
                    </tr>
                </thead>
                <tbody>
                  <tr class="text-x1">
                        {{weatherData.hourly.temperature_2m.at(timeOfOneDay.indexOf(hour))}}
                    </tr>
                </tbody>
            </table>
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
const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${route.query.lat}&longitude=${route.query.lng}&hourly=temperature_2m,precipitation_probability,weather_code,apparent_temperature`
    );
    

    console.log("weatherData",  weatherData.data);
    weatherData.data.averageTemperature = weatherData.data.hourly.temperature_2m.splice(0, 24).reduce((a, b) => a + b, 0) / 24;
 
    

    return weatherData.data;
  } catch (err) {
    console.log(err);
  }
};


const getTimeData = async () => {
  try {

    const TimeData = await axios.get(
        `https://timeapi.io/api/timezone/coordinate?latitude=${route.query.lat}&longitude=${route.query.lng}`
    );
    

    console.log("TimeData",  TimeData.data);

    TimeData.data.Fulltime = TimeData.data.currentLocalTime.substring(0, 13);


    return TimeData.data;

  } catch (err) {
    console.log(err);
  }
};


const [weatherData, TimeData] = await Promise.all([getWeatherData(), getTimeData()]);

const timeList = weatherData.hourly.time
const timeOfOneDay = timeList.slice(0, 24);
const currentDate = timeList.find((time) => time.substring(0,13) === TimeData.Fulltime);
const indexOfCurrentDate = timeList.indexOf(currentDate);
const currentTemperature = weatherData.hourly.temperature_2m.at(indexOfCurrentDate);
const currentPrecipitation = weatherData.hourly.precipitation_probability.at(indexOfCurrentDate);
const currentApparentTemperature = weatherData.hourly.apparent_temperature.at(indexOfCurrentDate);

</script>