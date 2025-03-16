import { Context, Next } from 'hono';
import { AuthService } from '../services/auth';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: '認証が必要です' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
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
