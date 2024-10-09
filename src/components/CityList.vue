<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)"/>
    </div>
    <p v-if="!savedCities.length"> No locations added. To start tracking a new location, search for it.</p>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import CityCard from './CityCard.vue'
import { getWeatherData } from "../utils/weather.js";
import { useRouter } from "vue-router";

const savedCities = ref([]);

const getCities = async () => {
    if(localStorage.getItem("savedCities")) {
        savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
    
        const requests = [];
        savedCities.value.forEach(city => {
            requests.push(
                getWeatherData(city.coords.lat, city.coords.lng)
            )
        })
        
        const weathers = await Promise.all(requests);

        weathers.forEach((weather, index) => {
            savedCities.value[index].weather = weather
        })

        console.log("Each of the saved cities in the local storage get obj with weather data", savedCities.value )

    };
}

await getCities();

const router = useRouter();

const goToCityView = (city) => {
    router.push({
        name: "cityView",
        params: {
            state: city.state,
            city: city.city
        },
        query: {
            id: city.id,
            lat: city.coords.lat,
            lng: city.coords.lng
        }
    })
}

</script>
