import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { config } from 'dotenv';
import { initDB } from './db';
import { AuthController } from './controllers/auth';
import { authMiddleware } from './middleware/auth';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

// 環境変数の読み込み
config();

// データベース初期化
initDB();

const app = new Hono();
const authController = new AuthController();

// ミドルウェア
app.use('*', logger());
app.use('*', secureHeaders());

// CORS設定
app.use('*', cors({
  origin: 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  exposeHeaders: ['X-CSRF-Token']
}));

// 公開ルート
app.get('/', (c) => c.text('Hono Server Running 🔥'));

// 認証ルート（JWTトークン不要）
app.post('/auth/register', (c) => authController.register(c));
app.post('/auth/login', (c) => authController.login(c));
app.post('/auth/logout', (c) => authController.logout(c));

// 保護されたルート（JWTトークン必要）
app.use('/api/*', authMiddleware);
app.get('/api/auth/me', (c) => authController.getMe(c));

// サーバー起動
const port = parseInt(process.env.PORT || '3001');
console.log(`Starting server on port ${port}...`);

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server running on port ${info.port}`);
});
