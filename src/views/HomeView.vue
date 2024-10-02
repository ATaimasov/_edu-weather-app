<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0_1px_0_0_#004E71]"
      />

      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="results"
      >
      <p v-if="searchError" class="py-2">
        Sorry, something went wrong, please try again
      </p>
      <p v-if="!searchError && results.length === 0" class="py-2">No cities found matching your search. Please try a different search term</p>
        <template v-else>
          <li
            v-for="searchResult in results"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.display_name }}
          </li>
        </template>
      </ul>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const previewCity = (searchResult) => {
  const locationName = searchResult.display_name;
  const [city, state, country] = locationName.split(",");

  const params = {
    state: state.trim().replace(/\s+/g, "-"), 
    city: city
  }

  if (country != undefined) {
    params.country = country.trim().replace(/\s+/g, "-");
  }
  
  router.push({
    name: "cityView",
    params:  params,
    query: { 
      lat: searchResult.lat,
      lng: searchResult.lon,
      preview: true

    }
  })
};


const searchQuery = ref("");
const queryTimeout = ref(null);
const results = ref(null);
const searchError = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);

  queryTimeout.value = setTimeout(async () => {
      if(searchQuery.value !== '') {
        try {
          const result = await axios.get(`https://geocode.maps.co/search?q=${searchQuery.value}&api_key=${import.meta.env.VITE_GEOCODE_API_KEY}`);
          results.value = result.data;
        } catch (error) {
            searchError.value = true;
        }
          return;
        }
          results.value = null;
      }, 1000);
};
</script>

<style  scoped>
</style>


