import jwt from 'jsonwebtoken';
import { UserModel, User, UserInput } from '../models/user';

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
}

export class AuthService {
  private userModel: UserModel;
  private jwtSecret: string;

  constructor() {
    this.userModel = new UserModel();
    this.jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_key';
  }

  async register(userData: UserInput): Promise<AuthResult> {
    try {
      // メールアドレスが既に使用されているか確認
      const existingUser = await this.userModel.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'このメールアドレスは既に使用されています'
        };
      }

      // ユーザーを作成
      const user = await this.userModel.create(userData);
      
      // パスワードを除外したユーザー情報
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword as Omit<User, 'password'>
      };
    } catch (error) {
      console.error('ユーザー登録エラー:', error);
      return {
        success: false,
        message: 'ユーザー登録中にエラーが発生しました'
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // ユーザーを検索
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'メールアドレスまたはパスワードが正しくありません'
        };
      }

      // パスワードを検証
      const isPasswordValid = await this.userModel.verifyPassword(user, password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'メールアドレスまたはパスワードが正しくありません'
        };
      }

      // JWTトークンを生成
      const token = this.generateToken(user);

      // パスワードを除外したユーザー情報
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword as Omit<User, 'password'>,
        token
      };
    } catch (error) {
      console.error('ログインエラー:', error);
      return {
        success: false,
        message: 'ログイン中にエラーが発生しました'
      };
    }
  }

  async getUserById(userId: number): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) return null;

      // パスワードを除外したユーザー情報を返す
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as Omit<User, 'password'>;
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
      return null;
    }
  }

  private generateToken(user: User): string {
    // トークンのペイロード
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    };

    // トークンを生成（有効期限24時間）
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  verifyToken(token: string): { userId: number } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded) {
        const userId = typeof decoded.sub === 'number' 
          ? decoded.sub 
          : parseInt(decoded.sub as string, 10);
        return { userId };
      }
      return null;
    } catch (error) {
      console.error('トークン検証エラー:', error);
      return null;
    }
  }
}
