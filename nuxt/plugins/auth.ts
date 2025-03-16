import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  // アプリケーション起動時に認証状態をチェック
  const authStore = useAuthStore()
  
  // クライアントサイドでのみ実行
  if (process.client) {
    await authStore.checkAuth()
  }
})
