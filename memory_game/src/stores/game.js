
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useGameStore = defineStore('game', () => {
  // Store state for the current game and the game history
  const game = ref({
    id: null,            // Game ID (from DB, once the game is saved)
    timer: 0,            // Timer in seconds
    turns: 0,
    pairsFound: 0,
    coins: 1,
    hintUsed: false,
    finalScore: 0,
    gameStatus: '',      // 'in-progress', 'completed'
    createdAt: null,     // Store the creation date (timestamp)
    beganAt: null,       // Store the began date (timestamp)
    endedAt: null,       // Store the ended date (timestamp)
  });

  const gameHistory = ref([]); // Initialize as an empty array
  const selectedBoardSize = ref(''); // Selected board size for filtering
  const sortOrder = ref('asc'); // Sort order for game history
  const globalLeaderboard = ref([]);
  const personalLeaderboard = ref([]);
  const selectedCriteria = ref('');

  const currentPage = ref(1); // Track current page
  const totalPages = ref(1); // Track total pages for pagination

  let timerInterval = null; // Interval for updating the timer

  // Fetch game history for a given user
  const fetchHistory = async (userId, page = 1, boardSize) => {
    try {
      // Use boardSize from function argument, or fallback to selectedBoardSize
      const response = await axios.get(`/users/${userId}/games`, {
        params: {
          page: page,
          boardSize: boardSize || selectedBoardSize.value,  // Fallback to selectedBoardSize if boardSize is not passed
        },
      });
  
      // Parse the game data and store it
      gameHistory.value = (response.data.data || []).map(game => {
        return {
          ...game,
          custom: JSON.parse(game.custom), // Parse the custom field
        };
      });
  
      // Update pagination data from the API response
      totalPages.value = response.data.last_page; // Total number of pages
      currentPage.value = response.data.current_page; // Current page number
  
    } catch (error) {
      console.error('Error fetching game history:', error);
      gameHistory.value = []; // Clear history on error
    }
  };

  const filteredGameHistory = computed(() => {
    let games = [...gameHistory.value];
    if (selectedBoardSize.value) {
      games = games.filter(game => game.board_id.toString() === selectedBoardSize.value);
    }
    games.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return games;
  });

  // Toggle the sort order
  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  };

  // Function to format date to a simple MM/DD/YYYY format
  const formatDateToSimple = (timestamp) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Start a new game and begin the timer
  const startNewGame = () => {
    const now = new Date();
    game.value.createdAt = now.getTime(); // Store as timestamp
    game.value.beganAt = now.getTime();   // Store as timestamp
    game.value.gameStatus = 'PL';  // Game is in progress
    resetGame();
    // Start the timer when the game begins
  };

  // Reset game data (timer is reset to 0)
  const resetGame = () => {
    game.value.timer = 0;
    game.value.turns = 0;
    game.value.pairsFound = 0;
    game.value.coins = 1;
    game.value.hintUsed = false;
    game.value.finalScore = 0;
    game.value.gameStatus = 'PL';
    stopTimer();  // Stop the timer if resetting (it will be started again in startNewGame)
  };



  // Stop the timer when the game ends
  const stopTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
  };

  // Function to format the timer (seconds.milliseconds)
  const formatTimer = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);  // Whole seconds
    const millis = milliseconds % 1000;  // Remaining milliseconds
    return `${seconds}.${String(millis).padStart(3, '0')}`;  // Format to 'seconds.milliseconds'
  };

  // Calculate final score based on time and turns
  const calculateFinalScore = (rows, cols) => {
    const score = game.value.pairsFound * 100;
    const penalty = (game.value.turns * 15) + (game.value.timer * 0.015); // Apply time-based penalty
    const finalScore = Math.max(0, score * (rows || 1) * (cols || 1) - penalty);
    game.value.finalScore = Math.floor(finalScore); // Ensure the final score is an integer
    game.value.gameStatus = 'E'; // Game is complete
    const now = new Date();
    game.value.endedAt = now.getTime(); // Store as timestamp
    stopTimer(); // Stop the timer when game ends
    return game.value.finalScore;
  };

  // Format the date to 'Y-m-d H:i:s'
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const getBoardIdBySize = (selectedBoardSize) => {
    console.log('Selected board size:', selectedBoardSize);
    if (selectedBoardSize.value === '2x2') {
      return 1;
    } else if (selectedBoardSize.value === '3x4') {
      return 2;
    } else if (selectedBoardSize.value === '4x4') {
      return 3;
    } else if (selectedBoardSize.value === '6x6') {
      return 4;
    } else {
      return null; // Return null for unsupported board sizes
    }
  };

  
  // Save the game and send the data to the backend
  const saveGame = async (user) => {
    try {
      console.log('Timer before saving:', game.value.timer);
      const response = await axios.post('/games/save', {
        board_id: getBoardIdBySize(selectedBoardSize),
        status: game.value.gameStatus,
        type: 'S',
        began_at: formatDate(game.value.beganAt),
        ended_at: formatDate(game.value.endedAt),
        created_at: formatDate(game.value.createdAt),
        custom: {
          pairs_found: game.value.pairsFound,
          turns: game.value.turns,     
          score: game.value.finalScore,
        },
        total_time: game.value.timer,
        created_user_id: user.id,
      });
  
      game.value.id = response.data.id;
      console.log('Game saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const fetchGlobalLeaderboard = async (boardSize, sortCriteria) => {
    try {
      const response = await axios.get('/games/leaderboard/global', {
        params: {
          boardSize: boardSize,  // Dynamically pass the board size
          sortCriteria: sortCriteria || 'total_time', // Default to total_time if no criteria is provided
        },
      });

      console.log(response)
  
      globalLeaderboard.value = (response.data || []).map(game => {
        return {
          ...game,
          custom: JSON.parse(game.custom), // Parse the custom field
        };
      });
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
    }
  };
  
  const fetchPersonalLeaderboard = async (id, boardSize, sortCriteria) => {
    try {
      const response = await axios.get(`/games/leaderboard/personal/${id}`, {
        params: {
          boardSize: boardSize,  // Dynamically pass the board size
          sortCriteria: sortCriteria || 'total_time', // Default to sorting by score if no criteria is provided
        },
      });
  
      personalLeaderboard.value = (response.data || []).map(game => {
        return {
          ...game,
          custom: JSON.parse(game.custom), // Parse the custom field
        };
      });
    } catch (error) {
      console.error('Error fetching personal leaderboard:', error);
    }
  };

  // Return store methods and data
  return {
    game,
    gameHistory,
    selectedBoardSize,
    sortOrder,
    filteredGameHistory,
    personalLeaderboard,
    globalLeaderboard,
    totalPages,
    currentPage,
    fetchHistory,
    fetchPersonalLeaderboard,
    fetchGlobalLeaderboard,
    startNewGame,
    resetGame,
    calculateFinalScore,
    saveGame,
    toggleSortOrder,
    formatDateToSimple,
    formatTimer,
  };
});