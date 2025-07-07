<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 로그인 제목 -->
      <h1 class="login-title">LOGIN</h1>

      <!-- 이메일 입력 -->
      <div class="form-group">
        <label class="form-label">email</label>
        <input v-model="email" type="email" class="form-input" placeholder="" />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="form-group">
        <label class="form-label">password</label>
        <div class="password-field">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder=""
          />
          <button type="button" class="password-toggle" @click="togglePassword">
            <svg
              v-if="showPassword"
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 10C2.5 10 5.5 4 10 4C14.5 4 17.5 10 17.5 10C17.5 10 14.5 16 10 16C5.5 16 2.5 10 2.5 10Z"
                stroke="#B0B0B0"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="10"
                cy="10"
                r="3"
                stroke="#B0B0B0"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.12 14.12C13.15 14.7 12.1 15 10 15C5.5 15 2.5 10 2.5 10C3.21 8.84 4.31 7.49 6 6.5M9.9 4C10.5 4 11.5 4.2 12.5 4.8C13.5 5.4 14.5 6.5 15.5 8C16 8.8 16.5 9.4 17.5 10C17.5 10 16.5 11.6 15 13.5"
                stroke="#B0B0B0"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="2"
                y1="2"
                x2="18"
                y2="18"
                stroke="#B0B0B0"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 로그인 버튼 -->
      <button class="login-btn" @click="handleLogin">Sign in</button>

      <!-- 하단 링크들 -->
      <div class="login-links">
        <a href="./signup" class="signup-link">Sign up</a>
        <a href="./forgot-password" class="forgot-link">Forgot password</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false
    }
  },
  methods: {
    handleLogin() {
      console.log('로그인:', {
        email: this.email,
        password: this.password
      })
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style lang="scss">
// 통합 스타일 import
@import '@/assets/scss/auth.scss';
</style>