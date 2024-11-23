<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import { useUserStore } from '@/stores/user';

const gameStore = useGameStore();
const userStore = useUserStore();
const router = useRouter();

const sizes = [
  { label: "2x2", value: "2x2" },
  { label: "3x4", value: "3x4" },
  { label: "4x4", value: "4x4" },
  { label: "6x6", value: "6x6" },
];

// Default board size
gameStore.selectedBoardSize = gameStore.selectedBoardSize || "3x4";

const warningMessage = ref("");
const coins = ref(parseInt(sessionStorage.getItem("coins")) || 0);

const selectBoardSize = (size) => {
  const isLoggedIn = !!userStore.user;
  if (!isLoggedIn && (size === "4x4" || size === "6x6")) {
    warningMessage.value = "You need to be logged in to select this board size.";
    return;
  }
  warningMessage.value = "";
  gameStore.selectedBoardSize = size;
};

const advanceToBoard = () => {
  if ((gameStore.selectedBoardSize === "4x4" || gameStore.selectedBoardSize === "6x6") && coins.value < 1) {
    warningMessage.value = "You don't have enough coins to start the game.";
    return;
  }
  if (gameStore.selectedBoardSize === "4x4" || gameStore.selectedBoardSize === "6x6") {
    coins.value -= 1;
    sessionStorage.setItem("coins", coins.value);
  }
  warningMessage.value = "";
  router.push({ name: "Board" });
};

const canAdvance = computed(() => !!gameStore.selectedBoardSize);
</script>

<template>
  <div class="container mx-auto p-6">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">Select Board Size</h1>

    <!-- Board Size Dropdown -->
    <div class="w-full max-w-xs mx-auto mb-6">
      <label for="boardSize" class="block text-gray-700 font-medium mb-2">Board Size</label>
      <select
        id="boardSize"
        class="block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="gameStore.selectedBoardSize"
        @change="selectBoardSize($event.target.value)"
      >
        <option v-for="(size, index) in sizes" :key="index" :value="size.value">{{ size.label }}</option>
      </select>
    </div>

    <!-- Warning Message -->
    <p v-if="warningMessage" class="text-center text-red-500 mb-4">{{ warningMessage }}</p>

    <!-- Buttons (Start & Back) -->
    <div class="flex flex-col items-center mt-8 gap-4">
      <button
        class="w-full max-w-xs bg-blue-600 text-white py-3 rounded text-center font-semibold hover:bg-blue-700"
        :disabled="!canAdvance"
        @click="advanceToBoard"
      >
        Start
      </button>
      <RouterLink
        class="w-full max-w-xs bg-gray-600 text-white py-3 rounded text-center font-semibold hover:bg-gray-700"
        :to="{ name: 'Dashboard' }"
      >
        Back
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Styles for better mobile responsiveness and layout */
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Ensure the buttons stack vertically with some spacing */
.flex-col {
  display: flex;
  flex-direction: column;
}

.gap-4 {
  gap: 16px; /* Adds vertical spacing between buttons */
}

@media (max-width: 640px) {
  /* For mobile screens, buttons will already be full width */
  .w-full {
    width: 100%;
  }
}
</style>