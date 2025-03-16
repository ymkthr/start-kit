import bcrypt from 'bcrypt';
import { getDB } from '../db';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}

export class UserModel {
  async findByEmail(email: string): Promise<User | null> {
    const db = getDB();
    
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row as User || null);
        }
      );
    });
  }

  async findById(id: number): Promise<User | null> {
    const db = getDB();
    
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row as User || null);
        }
      );
    });
  }

  async create(userData: UserInput): Promise<User> {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [userData.username, userData.email, hashedPassword],
        function(this: any, err) {
          if (err) {
            reject(err);
            return;
          }

          // 挿入されたユーザーを取得
          db.get(
            'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
            [this.lastID],
            (err, row) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(row as User);
            }
          );
        }
      );
    });
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }
}
