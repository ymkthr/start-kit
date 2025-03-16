import { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { AuthService } from '../services/auth';
import { UserInput } from '../models/user';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async logout(c: Context) {
    try {
      // Cookieを削除
      setCookie(c, 'auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // 即時期限切れ
        path: '/'
      });
      
      setCookie(c, 'csrf_token', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // 即時期限切れ
        path: '/'
      });
      
      return c.json({ 
        success: true, 
        message: 'ログアウトしました' 
      });
    } catch (error) {
      console.error('ログアウトエラー:', error);
      return c.json({ 
        success: false, 
        message: 'サーバーエラーが発生しました' 
      }, 500);
    }
  }

  async register(c: Context) {
    try {
      const { username, email, password } = await c.req.json<UserInput>();

      // 入力バリデーション
      if (!username || !email || !password) {
        return c.json({ 
          success: false, 
          message: 'ユーザー名、メールアドレス、パスワードは必須です' 
        }, 400);
      }

      if (password.length < 8) {
        return c.json({ 
          success: false, 
          message: 'パスワードは8文字以上である必要があります' 
        }, 400);
      }

      const result = await this.authService.register({ username, email, password });

      if (!result.success) {
        return c.json({ success: false, message: result.message }, 400);
      }

      return c.json({ 
        success: true, 
        message: 'ユーザー登録が完了しました',
        user: result.user
      }, 201);
    } catch (error) {
      console.error('登録エラー:', error);
      return c.json({ 
        success: false, 
        message: 'サーバーエラーが発生しました' 
      }, 500);
    }
  }

  async login(c: Context) {
    try {
      const { email, password } = await c.req.json<{ email: string; password: string }>();

      // 入力バリデーション
      if (!email || !password) {
        return c.json({ 
          success: false, 
          message: 'メールアドレスとパスワードは必須です' 
        }, 400);
      }

      const result = await this.authService.login(email, password);

      if (!result.success) {
        return c.json({ 
          success: false, 
          message: result.message 
        }, 401);
      }

      // AUTH トークンをHTTPOnlyクッキーに設定
      if (result.token) {
        const cookieOptions = this.authService.getSecureCookieOptions(true);
        setCookie(c, 'auth_token', result.token, cookieOptions);
      }

      // CSRFトークンを非HTTPOnlyクッキーに設定
      if (result.csrfToken) {
        const csrfCookieOptions = this.authService.getSecureCookieOptions(false);
        setCookie(c, 'csrf_token', result.csrfToken, csrfCookieOptions);
      }

      return c.json({ 
        success: true, 
        user: result.user,
        csrfToken: result.csrfToken
      });
    } catch (error) {
      console.error('ログインエラー:', error);
      return c.json({ 
        success: false, 
        message: 'サーバーエラーが発生しました' 
      }, 500);
    }
  }

  async getMe(c: Context) {
    try {
      // authMiddlewareで設定されたユーザー情報を取得
      const user = c.get('user');
      
      return c.json({ 
        success: true, 
        user 
      });
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      return c.json({ 
        success: false, 
        message: 'サーバーエラーが発生しました' 
      }, 500);
    }
  }
}
