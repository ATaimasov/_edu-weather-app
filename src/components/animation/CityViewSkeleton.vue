<template>
  <div class="flex flex-col flex-1">
    <!-- Overview -->
    <div class="flex flex-col py-12 items-center">
      <AnimatedPlaceholder class="max-w-[300px] h-[75px] w-full mb-10" />
      <AnimatedPlaceholder class="max-w-[300px] h-[100px] w-full mb-8" />
      <AnimatedPlaceholder class="max-w-[300px] h-[50px] w-full mb-8" />
      <AnimatedPlaceholder class="max-w-[300px] h-[150px] w-full" />
    </div>
    <!-- Hourly -->
    <div class="flex flex-col py-5 px-8 items-center">
      <AnimatedPlaceholder class="h-[300px] max-w-screen-lg w-4/5 mb-12" />
    </div>
    <!-- Weekly -->
    <div class="flex flex-col px-8 items-center">
      <AnimatedPlaceholder class="max-w-screen-lg h-[800px] w-full" />
    </div>
  </div>
</template>

<script setup>
import AnimatedPlaceholder from "./AnimatedPlaceholder.vue";
</script>
