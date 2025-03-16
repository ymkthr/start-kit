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
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()
        
        if (!data.success) {
          return { success: false, error: data.message || 'ログインに失敗しました' }
        }
        
        this.setUser({
          id: String(data.user.id),
          username: data.user.username,
          email: data.user.email
        })
        this.setToken(data.token)
        
        return { success: true }
      } catch (error) {
        console.error('ログインエラー:', error)
        return { success: false, error: 'ログインに失敗しました' }
      }
    },
    
    async register(username: string, email: string, password: string) {
      try {
        const response = await fetch('http://localhost:3001/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password })
        })

        const data = await response.json()
        
        if (!data.success) {
          return { success: false, error: data.message || '登録に失敗しました' }
        }
        
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
          try {
            // トークンを使用してユーザー情報を取得
            const response = await fetch('http://localhost:3001/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.user) {
                this.setToken(token)
                this.setUser({
                  id: String(data.user.id),
                  username: data.user.username,
                  email: data.user.email
                })
                return
              }
            }
            
            // トークンが無効な場合はログアウト
            this.logout()
          } catch (error) {
            console.error('認証チェックエラー:', error)
            this.logout()
          }
        }
      }
    }
  }
})
