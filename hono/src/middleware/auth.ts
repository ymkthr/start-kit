import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { AuthService } from '../services/auth';

export const authMiddleware = async (c: Context, next: Next) => {
  // Cookieからトークンを取得
  const token = getCookie(c, 'auth_token');
  
  // CSRFトークンの検証（POST, PUT, DELETE, PATCHリクエストの場合）
  const method = c.req.method;
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfTokenHeader = c.req.header('X-CSRF-Token');
    const csrfTokenCookie = getCookie(c, 'csrf_token');
    
    if (!csrfTokenHeader || !csrfTokenCookie || csrfTokenHeader !== csrfTokenCookie) {
      return c.json({ message: 'CSRFトークンが無効です' }, 403);
    }
  }
  
  // トークンがない場合
  if (!token) {
    return c.json({ message: '認証が必要です' }, 401);
  }
  
  const authService = new AuthService();
  const tokenData = authService.verifyToken(token);
  
  if (!tokenData) {
    return c.json({ message: '無効なトークンです' }, 401);
  }
  
  // ユーザー情報を取得
  const user = await authService.getUserById(tokenData.userId);
  
  if (!user) {
    return c.json({ message: 'ユーザーが見つかりません' }, 401);
  }
  
  // コンテキストにユーザー情報を設定
  c.set('user', user);
  
  await next();
};
