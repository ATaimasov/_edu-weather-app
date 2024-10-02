<template>
    <div>
        <Suspense>
            <AsyncCityView></AsyncCityView>
            <template #fallback>
                <p class="text-white text-center text-4xl mt-24">Loading...</p>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue';
</script>
