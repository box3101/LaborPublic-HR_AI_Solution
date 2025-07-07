<template>
	<div class="signup-page">
		<div class="signup-card">
			<!-- 회원가입 제목 -->
			<h1 class="signup-title">SIGN UP</h1>

			<!-- username -->
			<div class="form-group">
				<label class="form-label">username</label>
				<input type="text" class="form-input" placeholder="이름" />
			</div>

			<!-- ID -->
			<div class="form-group">
				<label class="form-label">ID</label>
				<input type="text" class="form-input" placeholder="아이디" />
			</div>

			<!-- 생년월일 -->
			<div class="flex flex-3">
				<div class="form-group">
					<label class="form-label">생년월일</label>
					<input type="date" class="form-input" placeholder="" />
				</div>
				<!-- 직업 선택 -->
				<div class="form-group">
					<label class="form-label">사업자/근로자/ HR담당자/기타 </label>
					<input type="text" class="form-input" placeholder="입력" />
				</div>

				<!-- 이메일 -->
				<div class="form-group">
					<label class="form-label">이메일</label>
					<input type="email" class="form-input" placeholder="이메일 주소" />
				</div>
			</div>

			<div class="flex flex-3">
				<div class="form-group">
					<label class="form-label">직종</label>
					<input type="text" class="form-input" placeholder="직종 입력" />
				</div>
				<!-- 회사이름 -->
				<div class="form-group">
					<label class="form-label">회사이름 (선택)</label>
					<input type="text" class="form-input" placeholder="회사이름" />
				</div>
				<!-- 직급 -->
				<div class="form-group">
					<label class="form-label">직급</label>
					<input type="text" class="form-input" placeholder="직급 입력" />
				</div>
			</div>

			<!-- password -->
			<div class="form-group">
				<label class="form-label">password</label>
				<div class="password-field">
					<input type="password" class="form-input" placeholder="" />
					<button type="button" class="password-toggle">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
							<path
								d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
								stroke="#999"
								stroke-width="2"
							/>
							<circle cx="12" cy="12" r="3" stroke="#999" stroke-width="2" />
							<path d="M1 1l22 22" stroke="#999" stroke-width="2" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Confirm password -->
			<div class="form-group">
				<label class="form-label">Confirm password</label>
				<div class="password-field">
					<input type="password" class="form-input" placeholder="" />
					<button type="button" class="password-toggle">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
							<path
								d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
								stroke="#999"
								stroke-width="2"
							/>
							<circle cx="12" cy="12" r="3" stroke="#999" stroke-width="2" />
							<path d="M1 1l22 22" stroke="#999" stroke-width="2" />
						</svg>
					</button>
				</div>
			</div>

			<!-- 회원가입 버튼 -->
			<button class="create-account-btn">Create Account</button>

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
	name: 'SignupPage'
}
</script>

<style lang="scss">
// 통합 스타일 import
@import '@/assets/scss/auth.scss';
</style>