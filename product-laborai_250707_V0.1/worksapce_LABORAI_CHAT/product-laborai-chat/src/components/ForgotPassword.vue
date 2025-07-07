<template>
  <div class="forgot-password-page">
    <div class="forgot-password-card">
      <!-- 비밀번호 찾기 제목 -->
      <h1 class="forgot-title">FORGOT PASSWORD</h1>

      <!-- 안내 텍스트 -->
      <p class="forgot-description">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <!-- 이메일 입력 -->
      <div class="form-group">
        <label class="form-label">email</label>
        <input v-model="email" type="email" class="form-input" placeholder="" />
      </div>

      <!-- 이메일 전송 버튼 -->
      <button class="send-btn" @click="handleSendEmail">임시 코드 발송</button>

      <!-- 성공 메시지 -->
      <div v-if="emailSent" class="success-message">
        <svg
          width="24"
          height="24"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="9" stroke="#10B981" stroke-width="1.5" />
          <path
            d="M6 10L8.5 12.5L14 7"
            stroke="#10B981"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Reset link sent to your email!</span>
      </div>

      <!-- 하단 링크들 -->
      <div class="forgot-links">
        <span class="remember-text">Remember your password?</span>
        <a href="./login" class="signin-link">Back to Sign in</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordPage',
  data() {
    return {
      email: '',
      emailSent: false
    }
  },
  methods: {
    handleSendEmail() {
      console.log('비밀번호 리셋 이메일 전송:', {
        email: this.email
      })

      // 성공 메시지 표시
      this.emailSent = true

      // 3초 후 메시지 숨김
      setTimeout(() => {
        this.emailSent = false
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
// 통합 스타일 import
@import '@/assets/scss/auth.scss';
</style>