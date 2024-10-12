<template>
    <div>
        <Suspense>
            <AsyncCityView></AsyncCityView>
            <template #fallback>
                <!-- <CityViewSkeleton /> -->
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue';
import CityViewSkeleton from '../components/animation/CityViewSkeleton.vue';
</script>
