<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ref } from 'vue';


const router = useRouter();
const userStore = useUserStore()

const logoutUser = async () => {
    userStore.user = null
    router.push({ name: 'Login' });
}

if (sessionStorage.getItem("coins") === null) {
  sessionStorage.setItem("coins", 1);
}

const coins = ref(sessionStorage.getItem("coins"));

</script>

<template>
  <div class="dashboard">
    <!-- Cabeçalho com informações do usuário -->
    <div v-show="userStore.user"  class="header">
      <div class="user-info">
        <span class="user-icon">👤</span>
        <span class="username">{{ userStore.user?.nickname || 'Guest' }}</span>
      </div>
      <div class="points-container">
        <span class="points">{{ coins }} </span>
        <RouterLink class="add-points" :to="{name: 'AddCoins'}">+</RouterLink>
      </div>
    </div>

    <!-- Botões principais do jogo -->
    <div class="buttons">
      <RouterLink class="primary-btn" :to="{name: 'BoardSize'}">Play</RouterLink>
      <RouterLink class="primary-btn" :to="{name: 'Leaderboard'}">Leaderboard</RouterLink>
      <RouterLink v-show="userStore.user" class="primary-btn" :to="{name: 'GameHistory'}">Game History</RouterLink>
      <RouterLink v-show="userStore.user" class="secondary-btn" :to="{name: 'Settings'}">Settings</RouterLink>
    </div>

    <!-- Botão de logout -->
    <button v-show="userStore.user" @click="logoutUser" class="log-off-btn">Logout</button>
    <RouterLink v-if="!userStore.user" :to="{name: 'Login'}" class="log-in-btn">Login</RouterLink>
  </div>
</template>

<style scoped>
/* Estilo da dashboard */
.dashboard {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Cabeçalho com user e pontos */
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
  justify-content: center; /* Centers the points and + button horizontally */
  align-items: center; /* Vertically aligns the content */
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
  width: 40px; /* Increased the size of the button */
  height: 40px; /* Increased the size of the button */
  display: flex;
  justify-content: center; /* Centers content horizontally */
  align-items: center; /* Centers content vertically */
  cursor: pointer;
}

.add-points:hover {
  background-color: #218838;
}

/* Título do jogo */
h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* Botões principais */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.primary-btn {
  background-color: #007bff;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary-btn:hover {
  background-color: #0056b3;
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

/* Botão de logout */
.log-off-btn {
  background-color: #dc3545;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  display: inline-block;
}

.log-off-btn:hover {
  background-color: #c82333;
}

/* Botao Login */
.log-in-btn {
  background-color: #6c757d;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  display: inline-block;
}

.log-off-btn:hover {
  background-color: #a1a8ad;
}
</style>
