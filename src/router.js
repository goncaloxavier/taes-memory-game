// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/login/LoginForm.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import Settings from './components/settings/Settings.vue'
import GameHistory from './components/history/GameHistory.vue'
import Leaderboard from './components/leaderboard/Leaderboard.vue'
import AddCoins from './components/coins/AddCoins.vue'
import Board from '@/components/memoryGame/Board.vue'
import BoardSize from './components/memoryGame/BoardSize.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/BoardSize',
    name: 'BoardSize',
    component: BoardSize
  },
  {
    path: '/Board',
    name: 'Board',
    component: Board
  },
  {
    path: '/Settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/GameHistory',
    name: 'GameHistory',
    component: GameHistory
  },
  {
    path: '/Leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
  {
    path: '/AddCoins',
    name: 'AddCoins',
    component: AddCoins
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router