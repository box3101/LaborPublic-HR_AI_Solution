<template>
  <div class="welcome-container">
    <div class="welcome-header">
      <h1 class="welcome-title">Sgate S-AI Chatbot</h1>
      <p class="welcome-subtitle">인공지능 기반 스마트 챗봇 서비스</p>
    </div>
    
    <div class="welcome-content">
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h3>AI 챗봇</h3>
          <p>고도화된 인공지능 기술로 자연스러운 대화를 제공합니다</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📄</div>
          <h3>문서 분석</h3>
          <p>PDF 문서를 업로드하여 내용을 분석하고 질의응답할 수 있습니다</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">💼</div>
          <h3>업무 지원</h3>
          <p>다양한 업무 시나리오에 맞춘 전문적인 지원을 제공합니다</p>
        </div>
      </div>
      
      <div class="navigation-section">
        <h3>서비스 이용하기</h3>
        <div class="nav-buttons">
          <router-link to="/labor" class="nav-button primary">
            Labor 서비스
          </router-link>
          <router-link to="/hrd" class="nav-button secondary">
            HRD 서비스
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      // 필요한 데이터가 있으면 여기에 추가
    }
  },
  mounted() {
    // 컴포넌트가 마운트될 때 실행할 코드
  }
}
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  box-sizing: border-box;
}

.welcome-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.welcome-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.welcome-content {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.feature-card p {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.navigation-section {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.navigation-section h3 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-button {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-block;
  min-width: 150px;
}

.nav-button.primary {
  background: #4CAF50;
  color: white;
}

.nav-button.secondary {
  background: #2196F3;
  color: white;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .welcome-container {
    padding: 1rem;
  }
}
</style> 