// src/config.js 또는 config.ts
const runtimeEnv = window.__ENV__ || {};

export const config = {
  // 현재 환경
  env: runtimeEnv.ENV || 'local',

  // API Base URL
  apiBaseUrl: 'http://dev.strategygate.biz:8885' || 'http://localhost:8082',
  // apiBaseUrl: 'http://localhost:8083' || 'http://localhost:8083',

  // 환경별 설정
  isLocal: runtimeEnv.ENV === 'local',
  isDev: runtimeEnv.ENV === 'dev',
  isProd: runtimeEnv.ENV === 'prod',

  // 환경 정보 출력
  logEnvironment() {
    console.log('=== 환경 설정 정보 ===');
    console.log(`환경: ${this.env}`);
    console.log(`Labor WebSocket URL: ${this.wsUrlLabor}`);
    console.log(`HRD WebSocket URL: ${this.wsUrlHrd}`);
    console.log(`API Base URL: ${this.apiBaseUrl}`);
    console.log('=====================');
  }
};

// 환경 정보 출력 (로컬에서만 보기 원하면 주석 처리 가능)
config.logEnvironment();

export default config;
