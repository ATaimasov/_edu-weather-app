<template>
  <div
    class="grid grid-cols-3 justify-center justify-items-center items-center py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer"
  >
    <div
      class="grid grid-cols-1 justify-center justify-items-center items-center gap-1 pl-1"
    >
      <h2 class="text-3xl">{{ city.city }}</h2>
      <h3>{{ truncateWithEllipsis(city.state, 25) }}</h3>
    </div>
    <div
      class="grid grid-cols-1 justify-center justify-items-center items-center gap-1"
    >
      <p class="text-3xl">
        {{
          new Date(city.weather.currentWeather.time).toLocaleTimeString(
            "en-us",
            {
              timeStyle: "short",
            },
          )
        }}
      </p>
    </div>
    <div
      class="grid grid-cols-1 gap-1 justify-center justify-items-center items-center pr-1"
    >
      <p class="text-3xl">{{ city.weather.currentWeather.temp }}&deg;</p>
      <div class="flex gap-2">
        <i
          class="content-center"
          :class="city.weather.currentWeather.description.icon"
        ></i>
        <p>{{ city.weather.currentWeather.description.string }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  city: {
    type: Object,
    default: () => {},
  },
});

function truncateWithEllipsis(string, maxLength) {
  if (string.length > maxLength) {
    return string.slice(0, maxLength) + "...";
  }
  return string;
}
</script>
