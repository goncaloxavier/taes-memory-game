<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useGameStore } from '@/stores/game';
import { useUserStore } from '@/stores/user';

const gameStore = useGameStore();
const userStore = useUserStore();

const selectedBoardSize = ref('');

// Fetch game history when the component mounts
onMounted(async () => {
  if (userStore.user && userStore.user.id) {
    const userId = userStore.user.id;
    await gameStore.fetchHistory(userId);
  } else {
    console.log("User not authenticated, cannot fetch game history.");
  }
});

watch([selectedBoardSize], async () => {
  try {
    if (userStore.user && userStore.user.id) {
      const userId = userStore.user.id;
      await gameStore.fetchHistory(userId, gameStore.currentPage, selectedBoardSize.value); // Fetch history with new board size filter
    }
  } catch (error) {
    console.error("Error fetching updated game history:", error);
  }
});

// Computed property to return the correct arrow based on sort order
const sortOrderArrow = computed(() => {
  return gameStore.sortOrder === 'asc' ? '▲' : '▼';
});

// Map board_id to human-readable board sizes
const boardSizes = {
  1: '3x4',
  2: '4x4',
  3: '6x6'
};

// Function to get the board size based on board_id
const getBoardSize = (boardId) => {
  return boardSizes[boardId] || 'Unknown';
};
</script>

<template>
  <div class="game-history-container">
    <!-- Filter Section with Back Button -->
    <div class="filter-container">
      <div class="flex-container">
        <!-- Back Button -->
        <RouterLink
          class="back-btn bg-gray-600 text-white py-2 px-4 rounded text-center font-semibold hover:bg-gray-700 inline-block"
          :to="{ name: 'Dashboard' }"
        >
          Back
        </RouterLink>

        <!-- Filter Dropdown -->
        <div class="filter-dropdown">
          <label for="boardFilter">Filter by Board Size:</label>
          <select id="boardFilter" v-model="selectedBoardSize">
            <option selected value="">All Boards</option>
            <option value="1">3x4</option>
            <option value="2">4x4</option>
            <option value="3">6x6</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Game History Table -->
    <table class="history-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Board Size</th>
          <th>Turns</th>
          <th>Total Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!gameStore.gameHistory.length || !gameStore.filteredGameHistory.length">
          <td colspan="4" class="no-results">No games found for the selected filter.</td>
        </tr>
        <tr v-for="game in gameStore.filteredGameHistory" :key="game.id">
          <td>{{ gameStore.formatDateToSimple(game.created_at) }}</td>
          <td>{{ getBoardSize(game.board_id) }}</td>
          <td>{{ game.custom.turn }}</td>
          <td>{{ game.total_time }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination-container">
      <button 
        class="pagination-btn" 
        :disabled="gameStore.currentPage === 1"
        @click="gameStore.fetchHistory(userStore.user.id, gameStore.currentPage - 1, selectedBoardSize)"
      >
        Prev
      </button>
      <span>Page {{ gameStore.currentPage }} of {{ gameStore.totalPages }}</span>
      <button 
        class="pagination-btn" 
        :disabled="gameStore.currentPage === gameStore.totalPages"
        @click="gameStore.fetchHistory(userStore.user.id, gameStore.currentPage + 1, selectedBoardSize)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-history-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.back-btn {
  flex: 1;
  text-align: center;
  margin: 0;
}

.filter-dropdown {
  flex: 2;
  text-align: center;
}

label {
  font-weight: bold;
  margin-right: 8px;
}

select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 0.5rem;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.history-table th, .history-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.history-table th.sortable {
  cursor: pointer;
}

.history-table tr:hover {
  background-color: #f1f1f1;
}

.no-results {
  text-align: center;
  font-size: 1rem;
  color: #6c757d;
  font-style: italic;
}

/* Pagination Styles */
.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 10px;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-btn:hover {
  background-color: #0056b3;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .game-history-container {
    padding: 15px;
  }

  .flex-container {
    flex-direction: column;
    gap: 0;
  }

  .back-btn, .filter-dropdown {
    width: 100%;
    margin-bottom: 10px;
  }

  .history-table th, 
  .history-table td {
    font-size: 14px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .game-history-container {
    padding: 10px;
  }

  .flex-container {
    gap: 5px;
  }

  .history-table th, 
  .history-table td {
    font-size: 12px;
    padding: 6px;
  }

  .no-results {
    font-size: 0.9rem;
  }
}
</style>