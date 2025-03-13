<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div
      v-if="route.query.preview && !cityExist"
      class="text-white p-4 bg-weather-secondary w-full text-center"
    >
      <p>
        You are currently previewing this city, click the "+" icon to start
        tracking this city.
      </p>
    </div>
    <!-- Weather Overview -->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-3" @click="one">{{ route.params.city }}</h1>
      <time class="text-sm mb-10" :datetime="weather.currentWeather.time || ''">
        {{
          new Date(weather.currentWeather.time).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weather.currentWeather.time).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </time>
      <p class="text-8xl mb-10">{{ weather.currentWeather.temp }}&deg;C</p>
      <p class="text-sm mb-2">
        Feels like:
        {{ weather.currentWeather.apparentTemp }}&deg;C
      </p>
      <p class="text-sm mb-2">
        Precipitation probability:
        {{ weather.currentWeather.precipitationProb }}%
      </p>
      <i
        :class="weather.currentWeather.description.icon"
        class="pt-10 text-9xl"
      ></i>
    </div>
    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div class="max-w-screen-lg w-full py-12 select-none">
      <div class="mx-8 text-white">
        <h2 class="text-4xl mb-10 text-center">24 Hourly Weather</h2>
        <swiper
          class="flex gap-10 pb-14"
          :modules="modules"
          :spaceBetween="5"
          :slidesPerView="4"
          :grabCursor="true"
          :scrollbar="{ draggable: true }"
          :keyboard="true"
          :loop="true"
          :breakpoints="breakpoints"
          :mousewheel="mousewheel"
        >
          <swiper-slide
            v-for="(hour, index) in weather.hourlyWeather"
            :key="hour"
            class="grid grid-rows-hourWeather gap-3 items-center justify-items-center"
          >
            <p
              class="whitespace-nowrap text-lg"
              :class="index === 0 ? 'font-bold text-slate-100' : ''"
            >
              {{
                index === 0
                  ? "Now"
                  : new Date(hour.time).toLocaleDateString("en-us", {
                      weekday: "short",
                      day: "2-digit",
                    })
              }}:
              {{
                new Date(hour.time).toLocaleTimeString("en-us", {
                  timeStyle: "short",
                })
              }}
            </p>
            <i class="md:text-4xl text-4xl" :class="hour.description.icon"></i>
            <div class="flex flex-col items-center">
              <p class="text-base">{{ hour.temp }}&deg;C</p>
              <p class="text-xs text-center">
                {{ hour.description.string }}
              </p>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-lg w-full py-12 md:text-base text-sm">
      <div class="mx-8 text-white">
        <h2 class="text-4xl mb-10 text-center">Weekly Weather</h2>
        <div
          v-for="day in weather.weeklyWeather"
          :key="day"
          class="grid md:grid-cols-4 grid-cols-3 justify-items-center items-center pb-12"
        >
          <p class="flex-1">
            {{
              new Date(day.day).toLocaleDateString("en-us", {
                weekday: "long",
              })
            }}
          </p>
          <i class="md:text-4xl text-3xl" :class="day.description.icon"> </i>
          <p class="hidden md:block">
            {{ day.description.string }}
          </p>
          <div class="flex md:gap-6 gap-3 items-center">
            <div class="flex md:gap-2 gap-1 items-center">
              <i
                class="md:text-4xl text-3xl wi wi-direction-up text-red-400"
              ></i>
              <p class="md:text-base text-sm">{{ day.tempMax }}&deg;C</p>
            </div>
            <div class="flex gap-2 items-center">
              <i
                class="md:text-4xl text-3xl wi wi-direction-down text-sky-200"
              ></i>
              <p class="md:text-base text-sm">{{ day.tempMin }}&deg;C</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- remove -->
    <div
      class="flex items-center gap-2 pb-5 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, defineEmits, watch } from "vue";
import { getWeatherData } from "../utils/weather.js";

const route = useRoute();
const router = useRouter();

const cityExist = ref(false);
if (localStorage.getItem("savedCities")) {
  const savedCities = ref(JSON.parse(localStorage.getItem("savedCities")));
  const currentCity = savedCities.value.find(
    (city) =>
      city.coords.lat === route.query.lat &&
      city.coords.lng === route.query.lng,
  );

  if (currentCity) {
    cityExist.value = true;
  }
}

const weather = await getWeatherData(route.query.lat, route.query.lng);

async function consoleTest() {
  let result = await weather;
  console.log(
    "Async City View component. Get processed data from api call",
    result,
  );
}

consoleTest();

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  router.push({ name: "home" });
};

// swiper
import { Scrollbar, Mousewheel, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";

const modules = ref([Scrollbar, Mousewheel, Keyboard]);

const breakpoints = ref({
  0: {
    slidesPerView: 1,
  },
  480: {
    slidesPerView: 2,
  },
  768: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
});

const mousewheel = ref({
  invert: true,
});
</script>

<style>
.swiper-scrollbar {
  cursor: pointer;
  height: var(--swiper-scrollbar-size, 6px) !important;
}

.swiper-scrollbar-drag {
  cursor: grab;
}
</style>
