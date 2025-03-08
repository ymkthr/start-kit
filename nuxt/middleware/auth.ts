import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // クライアントサイドでのみ実行
  if (process.client) {
    // 認証が必要なページで未認証の場合はログインページにリダイレクト
    if (!authStore.isLoggedIn && to.meta.requiresAuth) {
      return navigateTo('/login')
    }

    // すでに認証済みでログインページや登録ページにアクセスした場合はダッシュボードにリダイレクト
    if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
      return navigateTo('/dashboard')
    }
  }
})