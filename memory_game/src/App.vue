<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="p-8 mx-auto max-w-3xl" id="app">
    <div class="animated-fade-in"><h2 class="text-5xl pb-8">MEMORY GAME</h2></div>
    <router-view />
  </div>
</template>

<style scoped>
  h2 {
    text-align: center;
    font-weight: bold;
  }

  .animated-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  @keyframes fadeIn {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>