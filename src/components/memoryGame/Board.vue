<script setup>
// Importa componentes e bibliotecas necessárias
import VictoryLabel from './VictoryLabel.vue';
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@/stores/game';
import { useUserStore } from '@/stores/user';

// Inicializa as stores de jogo e usuário
const gameStore = useGameStore();
const userStore = useUserStore();

// Calcula a pontuação final
const finalScore = computed(() => gameStore.game.finalScore);

// Importa imagens de cartas do diretório especificado
const images = Object.values(import.meta.glob('../../assets/cards/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' }));
const uniqueImages = Array.from(new Set(images.map(img => img))); // Remove duplicatas
const semFaceCard = uniqueImages[uniqueImages.length - 1]; // Define a imagem padrão para "virar para baixo"

// Define o tamanho do tabuleiro com base no valor selecionado
const rows = computed(() => gameStore.selectedBoardSize.charAt(0)); // Número de linhas
const cols = computed(() => gameStore.selectedBoardSize.charAt(2)); // Número de colunas
const totalCards = rows.value * cols.value; // Total de cartas

// Imagens estáticas (cartas padrão ou genéricas)
const staticImages = ['/src/assets/cards/c1.png', '/src/assets/cards/c2.png'];
const cards = ref([]); // Array reativo para as cartas do jogo

// Configuração inicial de moedas e dicas
if (sessionStorage.getItem("coins") === null) {
  sessionStorage.setItem("coins", 1); // Se não existir, define 1 moeda como padrão
}
const coins = ref(sessionStorage.getItem("coins")); // Moedas disponíveis
const hintUsed = ref(false); // Controle de uso de dica

// Informações do jogo
const turns = computed(() => gameStore.game.turns); // Contador de jogadas
const timer = computed(() => gameStore.game.timer); // Timer em segundos
const pairsFound = computed(() => gameStore.game.pairsFound); // Número de pares encontrados

// Controle do temporizador
let interval = null; // Variável para armazenar o intervalo do timer

// Inicia o temporizador
const startTimer = () => {
  // Clear any existing intervals to prevent multiple intervals running
  clearInterval(interval);

  gameStore.game.timer = 0; // Reset the timer
  interval = setInterval(() => {
    gameStore.game.timer++; // Increment the timer every second
  }, 1000);
};

// Para o temporizador
const stopTimer = () => {
  clearInterval(interval);
};

// Função para embaralhar um array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatório
    [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
  }
  return array;
};

// Atualiza as cartas ao alterar o tabuleiro
watchEffect(() => {
  const numPairs = totalCards / 2; // Número de pares de cartas
  const selectedImages = [...uniqueImages].slice(0, numPairs); // Seleciona imagens suficientes
  const pairs = selectedImages.flatMap(image => [
    { image, semFace: semFaceCard, isFlipped: false, isMatched: false },
    { image, semFace: semFaceCard, isFlipped: false, isMatched: false }
  ]);
  cards.value = gameStore.selectedBoardSize !== '2x2' ? shuffleArray(pairs) : pairs; // Embaralha cartas se não for tabuleiro 2x2
});

// Computados para as cartas
const shuffledCards = computed(() => cards.value);
const displayedCards = computed(() => shuffledCards.value.slice(0, totalCards));

// Condição de vitória
const isVictory = computed(() => pairsFound.value === totalCards / 2); // Verifica se encontrou todos os pares

// Controle de cartas viradas
const flippedCards = ref([]);
const isFlippingCards = ref(true); // Controle para mostrar cartas no início

// Função para virar uma carta
const flipCard = (card) => {
  if (card.isFlipped || card.isMatched || flippedCards.value.length === 2) return; // Impede ações inválidas
  card.isFlipped = true;
  flippedCards.value.push(card);

  if (flippedCards.value.length === 2) {
    checkMatch(); // Verifica se as duas cartas viradas combinam
    gameStore.game.turns += 1; // Incrementa o número de jogadas
  }
};

// Função para verificar correspondência entre cartas
const checkMatch = () => {
  const [card1, card2] = flippedCards.value;
  if (card1.image === card2.image) {
    card1.isMatched = true;
    card2.isMatched = true;
    gameStore.game.pairsFound += 1;
  } else {
    setTimeout(() => {
      card1.isFlipped = false;
      card2.isFlipped = false;
    }, 500);
  }
  flippedCards.value = [];

  if (isVictory.value) {
    stopTimer();
    const finalScore = gameStore.calculateFinalScore(rows.value, cols.value); // Calculate final score
    console.log('Final Score:', finalScore); // Debugging
    gameStore.game.finalScore = finalScore; // Set final score in store

    sessionStorage.setItem("coins", coins.value); // Save coins to session storage

    // Save the game if user is logged in
    if (userStore.user) {
      gameStore.saveGame(userStore.user); // Save game to backend
    } else {
      console.log('User not logged in, game not saved.');
    }
  }
};

// Função para usar uma dica
// Hint function to reveal a matching pair
const useHint = () => {
  if (hintUsed.value || coins.value < 1) return;

  // Find an unmatched pair of cards
  const unmatchedPairs = [];
  const unmatchedCards = cards.value.filter(card => !card.isMatched && !card.isFlipped);

  // Group cards by image
  unmatchedCards.forEach(card => {
    const match = unmatchedCards.find(otherCard => otherCard !== card && otherCard.image === card.image);
    if (match) {
      unmatchedPairs.push([card, match]);
    }
  });

  // Reveal the first found pair
  if (unmatchedPairs.length > 0) {
    const [card1, card2] = unmatchedPairs[0];
    card1.isFlipped = true;
    card2.isFlipped = true;

    // Deduct a coin and mark hint as used
    coins.value -= 1;
    hintUsed.value = true;

    // Automatically hide the cards after a brief delay
    setTimeout(() => {
      card1.isFlipped = false;
      card2.isFlipped = false;
    }, 1000);
  }
};

// Funções de ciclo de vida
onMounted(() => {
  console.log(1)
  setTimeout(() => {
    // First, flip all cards down
    cards.value.forEach(card => card.isFlipped = false); 
    isFlippingCards.value = false; // Reset flipping state

    // Start the timer after the cards have been reset
    startTimer(); 

  }, 2000); // Wait for 2 second to reset the cards

  // Start a new game
  gameStore.startNewGame(); 
});

onUnmounted(() => {
  stopTimer(); // Para o temporizador ao sair
});
</script>


<template>
  <div id="app">

    <!-- Dashboard -->
    <div v-show="userStore.user" class="dashboard">
      <div class="header">
        <div class="user-info">
          <span class="user-icon">👤</span>
          <span class="username">{{ userStore.user?.nickname || 'Guest' }}</span>
        </div>
        <div class="points-container">
          <span class="points">{{ coins }} </span>
          <RouterLink class="add-points" :to="{name: 'AddCoins'}">+</RouterLink>
        </div>
      </div>
    </div>

    <!-- Game Info -->
    <div v-if="!isVictory" class="game-info">
      <div class="timer">Time: {{ timer }}s</div>
      <div class="score">Pairs Found: {{ pairsFound }}</div>
      <div class="turns">Turns: {{ turns }}</div>
    </div>

    <!-- Game Board -->
    <div v-if="!isVictory" class="game-board" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <template v-for="(card, index) in displayedCards" :key="index">
        <div class="card" :class="{ flipped: card.isFlipped || card.isMatched || isFlippingCards }" @click="flipCard(card)" :id="index">
          <img v-if="!card.isFlipped && !card.isMatched && !isFlippingCards" :src="card.semFace" />
          <img v-else :src="card.image" />
        </div>
      </template>
    </div>

    <!-- Hint Button -->
    <button v-if="!isVictory" class="hint-button" :disabled="hintUsed || coins < 1 || userStore.user == null" @click="useHint" :title="hintUsed ? 'Hint already used' : ''">
      ?
    </button>

    <!-- Victory Label -->
    <VictoryLabel v-if="isVictory" :final-score="finalScore" />
  </div>
</template>

<style scoped>
/* Dashboard Styles */
.dashboard {
  max-width: 400px;
  margin: 0 auto;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-icon {
  font-size: 24px;
  margin-right: 8px;
}

.username {
  font-weight: bold;
  font-size: 18px;
}

.points-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.points {
  font-weight: bold;
  font-size: 18px;
  color: #28a745;
  margin-right: 8px;
}

.add-points {
  background-color: #28a745;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.add-points:hover {
  background-color: #218838;
}

#app {
  font-family: Arial, sans-serif;
  text-align: center;
}

/* Game Info Styles */
.game-info {
  margin-bottom: 1rem;
}

.timer, .score, .turns {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem;
}

/* Game Board */
.game-board {
  border: 1px solid black;
  display: grid;
  gap: 15px;  /* Space between cards */
  margin: 20px auto;
  width: 100%;  /* Full available width */
  max-width: 1200px; /* Limit max width for large screens */
  justify-content: center;
  align-items: center;
  /* Define the grid layout for larger screens */
  grid-template-columns: repeat(4, 1fr); /* Default layout for 4x4 grid on desktop */
}

/* Card Styling */
.card {
  width: 100%; /* Let grid size dictate the card width */
  height: auto;
  aspect-ratio: 7 / 9; /* Maintain aspect ratio */
  max-width: 120px; /* Max card width */
  max-height: 170px; /* Max card height */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.4s ease-in-out;
}

/* Hint Button Styles */
.hint-button {
  margin-top: 1rem;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
}

.hint-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Responsive Design for Tablets and Medium Screens */
@media (max-width: 1200px) {
  .game-board {
    grid-template-columns: repeat(3, 1fr); /* Adjust to 3x4 grid for medium screens */
    gap: 12px;
  }

  .card {
    max-width: 100px;
    max-height: 140px;
  }

  .hint-button {
    font-size: 1.4rem;
    padding: 0.45rem;
  }
}

/* Responsive Design for Tablets */
@media (max-width: 768px) {
  .game-board {
    grid-template-columns: repeat(3, 1fr); /* Adjust to 3x4 grid for tablets */
    gap: 10px;
  }

  .card {
    max-width: 90px;
    max-height: 130px;
  }

  .hint-button {
    font-size: 1.3rem;
    padding: 0.4rem;
  }
}

/* Responsive Design for Mobile Devices */
@media (max-width: 480px) {
  .game-board {
    grid-template-columns: repeat(2, 1fr); /* Adjust to 2x4 grid for small screens */
    gap: 8px;
  }

  .card {
    max-width: 70px;
    max-height: 100px; /* Ensure the cards fit on small screens */
  }

  .hint-button {
    font-size: 1.2rem;
    padding: 0.4rem;
  }
}
</style>