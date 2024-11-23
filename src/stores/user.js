import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
    const user = ref()


    const login = async (user) => {
        try {
            const response = await axios.post('login', user)
            return response.data
        } catch (e) {
            return false
        }
    }

    return {
        user, login
    }
})
