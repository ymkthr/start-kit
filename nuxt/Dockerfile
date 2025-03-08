FROM node:22.14.0-alpine

WORKDIR /app

# 必要なパッケージをインストール
RUN apk add --no-cache git

# npmを最新バージョンにアップデート
RUN npm install -g npm@latest

# nuxtプロジェクトの依存関係をインストールするための準備
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "run", "dev"]