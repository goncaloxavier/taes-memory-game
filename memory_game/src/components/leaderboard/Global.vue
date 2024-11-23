<script setup>
defineProps({
  globalLeaderboard: Array,
});

const boardSizes = {
  0: '2x2',
  1: '3x4',
  2: '4x4',
  3: '6x6'
};

const getBoardSize = (boardId) => boardSizes[boardId] || 'Unknown';
</script>

<template>
  <!-- Display Leaderboard -->
  <table class="leaderboard-table">
     <thead>
       <tr>
         <th>Rank</th>
         <th>Player</th>
         <th>Board Size</th>
         <th>Turns</th>
         <th>Total Time</th>
       </tr>
     </thead>
     <tbody>
       <tr v-if="!globalLeaderboard.length">
         <td :colspan="4" class="no-results">
           No games found for the selected filter.
         </td>
       </tr>
       <tr v-for="(game, rank) in globalLeaderboard"  :key="game.id">
         <td>#{{ rank + 1 }}</td>
         <td>{{ game.user?.nickname || 'Unknown' }}</td>
         <td>{{ getBoardSize(game.board_id) }}</td>
         <td>{{ game.custom.turn }}</td>
         <td>{{ game.total_time }}</td>
       </tr>
     </tbody>
   </table>
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

.leaderboard-toggle {
 display: flex;
 justify-content: center;
 gap: 20px;
}

button {
 background: none;
 border: 2px solid #007bff;
 padding: 10px 20px;
 border-radius: 5px;
 font-size: 16px;
 cursor: pointer;
 transition: background-color 0.3s ease;
 color: #007bff;
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

.leaderboard-table {
 width: 100%;
 border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
 padding: 15px;
 text-align: left;
 border-bottom: 1px solid #eee;
}

.leaderboard-table th {
 background-color: #f1f1f1;
 font-weight: bold;
}

.leaderboard-table tr:nth-child(even) {
 background-color: #f9f9f9;
}

.leaderboard-table tr:hover {
 background-color: #f1f1f1;
}

.no-results {
 text-align: center;
 font-size: 16px;
 color: #6c757d;
 font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
 .leaderboard-container {
   padding: 20px;
 }

 .leaderboard-table th, 
 .leaderboard-table td {
   font-size: 14px; /* Reduce font size for smaller screens */
   padding: 10px; /* Reduce padding */
 }
}

@media (max-width: 480px) {
 .leaderboard-container {
   padding: 15px;
 }

 .leaderboard-toggle {
   flex-direction: column; /* Stack buttons on smaller screens */
   gap: 10px;
 }

 .leaderboard-table th, 
 .leaderboard-table td {
   font-size: 12px; /* Further reduce font size for smaller screens */
   padding: 8px; /* Reduce padding */
 }

 .sort-filter {
   gap: 10px;
 }

 .no-results {
   font-size: 14px; /* Adjust font size */
 }
}
</style>