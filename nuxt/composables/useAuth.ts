import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  
  /**
   * ユーザー登録を行う
   */
  const register = async (username: string, email: string, password: string) => {
    const result = await authStore.register(username, email, password)
    return result
  }
  
  /**
   * ログインを行う
   */
  const login = async (email: string, password: string) => {
    const result = await authStore.login(email, password)
    return result
  }
  
  /**
   * ログアウトを行う
   */
  const logout = async () => {
    await authStore.logout()
    router.push('/login')
  }
  
  /**
   * 認証状態をチェックする
   */
  const checkAuth = async () => {
    await authStore.checkAuth()
    return authStore.isLoggedIn
  }
  
  /**
   * 現在のユーザー情報を取得する
   */
  const user = computed(() => authStore.getUser)
  
  /**
   * 認証状態を取得する
   */
  const isAuthenticated = computed(() => authStore.isLoggedIn)
  
  return {
    register,
    login,
    logout,
    checkAuth,
    user,
    isAuthenticated
  }
}
