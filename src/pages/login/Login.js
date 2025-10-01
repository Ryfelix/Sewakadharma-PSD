import { ref, reactive } from 'vue'
import { Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-vue-next'

export default {
  name: 'Login',
  components: {
    Mail,
    Lock, 
    Eye,
    EyeOff,
    MessageCircle
  },
  setup() {
    // Reactive data
    const showPassword = ref(false)
    const showPlaceholder = ref(false)
    const isLoading = ref(false)
    const emailFocused = ref(false)
    const passwordFocused = ref(false)

    const loginForm = reactive({
      email: '',
      password: ''
    })

    // Methods
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const handleLogin = async () => {
      // Validation
      if (!loginForm.email || !loginForm.password) {
        alert('Please fill in all fields')
        return
      }

      isLoading.value = true
      
      try {
        // Simulate API call - replace with your actual authentication logic
        const response = await loginAPI(loginForm)
        
        if (response.success) {
          // Store token or user data
          localStorage.setItem('authToken', response.token)
          
          // Redirect to dashboard or home page
          // router.push('/dashboard')
          alert('Login successful!')
        } else {
          throw new Error(response.message || 'Login failed')
        }
        
      } catch (error) {
        console.error('Login failed:', error)
        alert(error.message || 'Login failed. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    const handleForgotPassword = () => {
      // Redirect to forgot password page
      router.push('/forgot-password')
    }

    // API call function (replace with your actual API)
    const loginAPI = async (credentials) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate successful login
          resolve({
            success: true,
            token: 'sample-jwt-token',
            user: {
              id: 1,
              email: credentials.email,
              name: 'Admin User'
            }
          })
        }, 2000)
      })
    }

    // Return all reactive data and methods
    return {
      showPassword,
      showPlaceholder,
      isLoading,
      emailFocused,
      passwordFocused,
      loginForm,
      togglePasswordVisibility,
      handleLogin,
      handleForgotPassword
    }
  }
}