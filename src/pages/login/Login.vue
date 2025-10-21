<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
        <div class="logo-wrapper">
          <img 
            :src="logo"
            alt="Logo BDD"
            class="logo-image"
            @error="showPlaceholder = true"
            v-show="!showPlaceholder"
          />
          <MessageCircle v-show="showPlaceholder" class="logo-placeholder" />
        </div>
      </div>

      <h1 class="login-title">Login</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <div class="input-wrapper">
            <div class="input-icon">
              <Mail class="icon" />
            </div>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="form-input"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrapper">
            <div class="input-icon">
              <Lock class="icon" />
            </div>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="form-input"
              placeholder="Enter your Password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
            >
              <Eye v-if="!showPassword" class="icon-toggle" />
              <EyeOff v-else class="icon-toggle" />
            </button>
          </div>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button
          type="submit"
          :disabled="isLoading"
          class="login-button"
          :class="{ 'loading': isLoading }"
        >
          <span v-if="!isLoading">Login</span>
          <div v-else class="loading-content">
            <div class="loading-spinner"></div>
            Logging in...
          </div>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-vue-next'
import { authAPI } from '@/services/api'
import logo from '@/assets/image/Logo 100x100.png'

export default {
  name: 'Login',
  components: { Mail, Lock, Eye, EyeOff, MessageCircle },
  setup() {
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const showPassword = ref(false)
    const isLoading = ref(false)
    const showPlaceholder = ref(false)
    const router = useRouter()

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const handleLogin = async () => {
      // Clear previous error
      error.value = ''
      
      // Validation
      if (!username.value || !password.value) {
        error.value = 'Please fill in all fields'
        return
      }

      isLoading.value = true

      try {
        // Call real API
        const response = await authAPI.login(username.value, password.value)
        
        console.log('✅ Login successful:', response.admin)
        
        // Redirect to dashboard
        router.push('/dashboard')
        
      } catch (err) {
        console.error('❌ Login failed:', err)
        error.value = err.message || 'Login failed. Please check your username and password.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      logo,
      username,
      password,
      error,
      showPassword,
      isLoading,
      showPlaceholder,
      togglePasswordVisibility,
      handleLogin
    }
  }
}
</script>

<style src="./Login.css" scoped></style>