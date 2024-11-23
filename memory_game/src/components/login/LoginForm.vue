<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter();
const userStore = useUserStore()

const nickname = ref('')
const password = ref('')
const invalidAuth = ref(false)

const loginUser = async () => {
    try {
        if (nickname.value.trim() && password.value.trim()) {
            let userToLogin = {
                nickname: nickname.value,
                password: password.value,
            }
            const response = await userStore.login(userToLogin)
            
            if (response != false) {
                router.push({ name: 'Dashboard' });
                userStore.user = response.user
                invalidAuth.value = false
            }
            invalidAuth.value = true
        }
    } finally {
    }   
}
</script>

<template>
    <div class="login-container">
        <form @submit.prevent="loginUser" class="animated-slide-up">
            <h2>Login</h2>
            <div class="form-group">
                <label for="nickname">Nickname</label>
                <input type="text" v-model="nickname" id="nickname" placeholder="Enter nickname" required />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" v-model="password" id="password" placeholder="Enter password" required />
            </div>
            <div class="form-error" v-if="invalidAuth">
                <label for="error">Invalid credentials!</label>
            </div>
            <div class="button-group">
                <button type="submit" class="login-btn">Login</button>
                <RouterLink :to="{ name: 'Dashboard' }" class="guest-btn">Play as Guest</RouterLink>
            </div>
        </form>
    </div>
</template> 

<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
    }

    form {
        background-color: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }

    h2 {
        text-align: center;
        font-weight: bold;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-error {
        color: red;
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #007bff;
    }

    .login-btn, .guest-btn {
        width: 48%;
        padding: 0.75rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        text-align: center; /* Center text in buttons */
    }

    .login-btn {
        background-color: #007bff;
        color: white;
    }

    .login-btn:hover {
        background-color: #0056b3;
    }

    .guest-btn {
        background-color: #6c757d;
        color: white;
    }

    .guest-btn:hover {
        background-color: #5a6268;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
    }

    /* Animation */
    .animated-slide-up {
        animation: slideUp 0.8s ease-out forwards;
    }

    /* Keyframes for bottom-to-up animation */
    @keyframes slideUp {
        0% {
            transform: translateY(100%);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        form {
            padding: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        form {
            padding: 1rem;
        }
    }
</style>