import { Database } from 'sqlite3';
import path from 'path';

let db: Database;

export const initDB = (): Database => {
  if (!db) {
    db = new Database(path.join(process.cwd(), 'auth.db'));
    
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  }
  
  return db;
};

export const getDB = (): Database => {
  if (!db) {
    return initDB();
  }
  return db;
};
