import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // クライアントサイドでのみ実行
  if (process.client) {
    // オリジナルのfetch関数を保存
    const originalFetch = globalThis.fetch
    
    // グローバルfetch関数をオーバーライド
    globalThis.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      // すべてのリクエストにcredentials: 'include'を追加
      const modifiedInit: RequestInit = {
        ...init,
        credentials: 'include'
      }
      
      // CSRFトークンをヘッダーに追加（非GETリクエスト）
      if (modifiedInit.method && modifiedInit.method !== 'GET' && authStore.getCsrfToken) {
        modifiedInit.headers = {
          ...modifiedInit.headers,
          'X-CSRF-Token': authStore.getCsrfToken
        }
      }
      
      return originalFetch(input, modifiedInit)
    }
  }
})
