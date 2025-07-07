import Vue from 'vue';
import VueRouter from 'vue-router';
import Hrd from '@/components/Hrd.vue';  // @는 src 폴더를 의미
import Labor from '@/components/Labor.vue';
import Welcome from '@/components/Welcome.vue';  // 안내 페이지 컴포넌트
import NotFound from '@/components/NotFound.vue'; // 404 컴포넌트 임포트

//Vue와 VueRouter 연결
Vue.use(VueRouter);

//우리가 사용할 route 생성 및 설정
const routes = [
  { path: '/', name: 'Welcome', component: Welcome },  // 기본 안내 페이지
  { 
    path: '/labor', 
    name: 'LABOR', 
    component: Labor,
    meta: {
      title: 'AI 노무 상담 서비스'
    }
  },
  { path: '/hrd', name: 'HRD', component: Hrd },
  /*{ path: '/sai', name: 'Sai', component: Sai },*/
  {
    path: '/pdf-viewer',
    name: 'PdfPopup',
    component: () => import('@/components/PdfViewer.vue')
  },
  { path: '*', redirect: '/' }  // 정의되지 않은 경로는 안내 페이지로 리다이렉트
];

//VueRouter에 route를 등록하고 설정한다.
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// 라우터 가드: 페이지 타이틀 자동 변경
router.beforeEach((to, from, next) => {
  // meta 정보에서 타이틀 가져오기
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    // 기본 타이틀 설정
    document.title = 'SGate AI 서비스';
  }
  next();
});

//설정한 VueRouter 내보낸다.
export default router;
