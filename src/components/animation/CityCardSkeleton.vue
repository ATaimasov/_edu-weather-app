<template>
    <div class="flex  py-6 px-3 bg-weather-secondary rounded-md shadow-md">
        <div class='flex flex-col flex-1 gap-2 pl-16'>
            <AnimatedPlaceholder class="max-w-[70%]"></AnimatedPlaceholder>
            <AnimatedPlaceholder class="max-w-[60%]"></AnimatedPlaceholder>
        </div>  

        <div class="flex flex-col justify-end item-end flex-1 gap-2 pl-20">
            <AnimatedPlaceholder class="max-w-[40%] h-[50px] w-full"></AnimatedPlaceholder>
        </div>    
        <div class="flex flex-col item-end flex-1 gap-2 items-center">
            <AnimatedPlaceholder class="max-w-[50%] w-full"></AnimatedPlaceholder>
            <AnimatedPlaceholder class="max-w-[60%] w-full"></AnimatedPlaceholder>
        </div>    
    </div>
</template>

<script setup>
import AnimatedPlaceholder from './AnimatedPlaceholder.vue';
</script>

<style lang="scss" scoped>

</style>