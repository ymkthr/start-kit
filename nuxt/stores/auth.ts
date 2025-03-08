import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },
  
  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = !!user
    },
    
    setToken(token: string) {
      this.token = token
      // トークンをローカルストレージに保存
      // セキュリティを考慮する場合は、Cookie(HttpOnly, Secure, SameSite)を使用する
      if (process.client) {
        localStorage.setItem('auth_token', token)
      }
    },
    
    async login(email: string, password: string) {
      try {
        // ここで実際のログインAPIを呼び出す（モック）
        // 実際のアプリケーションでは、APIエンドポイントを呼び出す
        
        // モックレスポンス
        const mockUser: User = {
          id: '1',
          username: 'testuser',
          email: email
        }
        const mockToken = 'mock_jwt_token'
        
        this.setUser(mockUser)
        this.setToken(mockToken)
        
        return { success: true }
      } catch (error) {
        console.error('ログインエラー:', error)
        return { success: false, error: 'ログインに失敗しました' }
      }
    },
    
    async register(username: string, email: string, password: string) {
      try {
        // ここで実際の登録APIを呼び出す（モック）
        console.log('登録処理:', { username, email, password })
        
        // モックレスポンス
        return { success: true }
      } catch (error) {
        console.error('登録エラー:', error)
        return { success: false, error: '登録に失敗しました' }
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // ローカルストレージからトークンを削除
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
    },
    
    async checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // トークンの検証（実際のアプリケーションではAPIを呼び出す）
          this.token = token
          
          // モックユーザー情報
          const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com'
          }
          
          this.setUser(mockUser)
        }
      }
    }
  }
})