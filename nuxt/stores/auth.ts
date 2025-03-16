import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  csrfToken: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    csrfToken: null,
    isAuthenticated: false
  }),
  
  getters: {
    getUser: (state) => state.user,
    getCsrfToken: (state) => state.csrfToken,
    isLoggedIn: (state) => state.isAuthenticated
  },
  
  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = !!user
    },
    
    setCsrfToken(token: string) {
      this.csrfToken = token
    },
    
    async login(email: string, password: string) {
      try {
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
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
        
        if (data.csrfToken) {
          this.setCsrfToken(data.csrfToken)
        }
        
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
          body: JSON.stringify({ username, email, password }),
          credentials: 'include'
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
    
    async logout() {
      try {
        // サーバーにログアウトリクエストを送信
        await fetch('http://localhost:3001/auth/logout', {
          method: 'POST',
          headers: {
            'X-CSRF-Token': this.csrfToken || ''
          },
          credentials: 'include'
        })
      } catch (error) {
        console.error('ログアウトエラー:', error)
      } finally {
        // ステートをリセット
        this.user = null
        this.csrfToken = null
        this.isAuthenticated = false
      }
    },
    
    async checkAuth() {
      if (process.client) {
        try {
          // Cookieに保存されたトークンを使用してユーザー情報を取得
          const response = await fetch('http://localhost:3001/api/auth/me', {
            credentials: 'include'
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.user) {
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
})
