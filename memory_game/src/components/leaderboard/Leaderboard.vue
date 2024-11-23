<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGameStore } from '@/stores/game';
import { useUserStore } from '@/stores/user';
import Global from '@/components/leaderboard/Global.vue'
import Personal from '@/components/leaderboard/Personal.vue'

const gameStore = useGameStore();
const userStore = useUserStore();

// Default view to Global Leaderboard - Score
const currentLeaderboardType = ref('global'); // 'global' or 'personal'

// Selected filters for criteria and board size
const selectedCriteria = ref('total_time');
const selectedBoardSize = ref('1');

// Fetch leaderboard data when mounted
onMounted(async () => {
  try {
    if (userStore.user && userStore.user.id) {
      const userId = userStore.user.id;
      await gameStore.fetchGlobalLeaderboard(selectedBoardSize.value, selectedCriteria.value); // Fetch global leaderboard
      await gameStore.fetchPersonalLeaderboard(userId, selectedBoardSize.value, selectedCriteria.value); // Fetch personal leaderboard
    } else {
      await gameStore.fetchGlobalLeaderboard(selectedBoardSize.value, selectedCriteria.value); // Fetch global leaderboard only
      console.log("User not authenticated, fetching global leaderboard only!");
    }
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
  }
});

// Watch for changes in criteria and board size, and fetch updated data
watch([selectedCriteria, selectedBoardSize], async () => {
  try {
    if (userStore.user && userStore.user.id) {
      const userId = userStore.user.id;
      if (currentLeaderboardType.value === 'global') {
        await gameStore.fetchGlobalLeaderboard(selectedBoardSize.value, selectedCriteria.value); // Fetch global leaderboard
      } else  {
        await gameStore.fetchPersonalLeaderboard(userId, selectedBoardSize.value, selectedCriteria.value); // Fetch personal leaderboard
      }
    } else {
      await gameStore.fetchGlobalLeaderboard(selectedBoardSize.value, selectedCriteria.value); // Fetch global leaderboard only
    }
  } catch (error) {
    console.error("Error fetching updated leaderboards:", error);
  }
});
</script>

<template>
  <div class="leaderboard-container">
    <div class="filter-container">
      <!-- Back Button and Toggle Global/Personal -->
      <div class="leaderboard-controls">
        <!-- Back Button -->
        <RouterLink
          class="secondary-btn"
          :to="{ name: 'Dashboard' }"
        >
          Back
        </RouterLink>

        <!-- Toggle Global/Personal -->
        <div class="leaderboard-toggle">
          <button
            :class="{ active: currentLeaderboardType === 'global' }"
            @click="currentLeaderboardType = 'global'"
          >
            <span class="icon">🌍</span> Global
          </button>
          <button
            :class="{ active: currentLeaderboardType === 'personal' }"
            @click="currentLeaderboardType = 'personal'"
            :disabled="!userStore.user"
          >
            <span class="icon">👤</span> Personal
          </button>
        </div>
      </div>

      <h2 class="leaderboard-title">
        {{ currentLeaderboardType === 'global' ? 'Global Leaderboard' : 'Your Best Games' }}
      </h2>

      <!-- Sort Type -->
      <div class="sort-filter">
        <label for="sortType">Sort By:</label>
        <select id="sortType" v-model="selectedCriteria">
          <option value="total_time">Total Time</option>
          <option value="custom->turn">Turns</option>
        </select>

        <!-- Filter by Board Size -->
        <label for="boardFilter">Board Size:</label>
        <select id="boardFilter" v-model="selectedBoardSize">
          <option value="1">3x4</option>
          <option value="2">4x4</option>
          <option value="3">6x6</option>
        </select>

        <Global v-if="currentLeaderboardType === 'global'" :global-leaderboard="gameStore.globalLeaderboard" />
        <Personal v-if="currentLeaderboardType === 'personal'" :personal-leader-board="gameStore.personalLeaderboard" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f4f6f9;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.filter-container {
  margin-bottom: 20px;
}

/* Flexbox container for the Back button and Leaderboard Toggle */
.leaderboard-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.button {
  background: none;
  border: 2px solid #007bff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: #007bff;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button:hover {
  background-color: #007bff;
  color: white;
}

.leaderboard-toggle {
  display: flex;
  gap: 20px;
}

.secondary-btn {
  background-color: #6c757d;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.secondary-btn:hover {
  background-color: #5a6268;
}

button {
  background: none;
  border: 2px solid #007bff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: #007bff;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #007bff;
  color: white;
}

button.active {
  background-color: #007bff;
  color: white;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.icon {
  margin-right: 8px;
}

.sort-filter {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

label {
  font-weight: bold;
  font-size: 14px;
}

select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.leaderboard-title {
  text-align: center;
  font-size: 24px;
  margin: 20px 0;
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  .leaderboard-container {
    padding: 25px;
  }

  /* Stack controls vertically on smaller screens */
  .leaderboard-controls {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .leaderboard-toggle {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .leaderboard-container {
    padding: 20px;
  }

  .sort-filter select {
    width: 100%;
  }
}
</style>