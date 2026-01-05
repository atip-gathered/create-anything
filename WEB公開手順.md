# エレベーターシミュレーターのWeb公開手順

このアプリケーションをWebに公開する方法をいくつか紹介します。

## 方法1: Vercel（推奨・最も簡単）

### 手順:
1. **GitHubにコードをプッシュ**
   ```bash
   cd /Users/naotohashimoto/Downloads/create-anything
   git init
   git add .
   git commit -m "Initial commit"
   # GitHubで新しいリポジトリを作成後
   git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
   git push -u origin main
   ```

2. **Vercelにデプロイ**
   - [Vercel](https://vercel.com)にアクセス
   - GitHubアカウントでサインアップ/ログイン
   - 「New Project」をクリック
   - GitHubリポジトリを選択
   - Framework Preset: `Vite`を選択
   - Root Directory: `apps/web`を指定
   - 「Deploy」をクリック

3. **完了！**
   - 数分でデプロイが完了し、URLが発行されます
   - 例: `https://your-project.vercel.app`

### メリット:
- 無料
- 自動デプロイ（GitHubにpushすると自動更新）
- カスタムドメイン対応
- SSL証明書自動設定

---

## 方法2: Netlify

### 手順:
1. **ビルド**
   ```bash
   cd /Users/naotohashimoto/Downloads/create-anything/apps/web
   npm run build
   ```

2. **Netlifyにデプロイ**
   - [Netlify](https://netlify.com)にアクセス
   - 「Add new site」→「Deploy manually」
   - `apps/web/dist`フォルダをドラッグ&ドロップ

### メリット:
- 無料
- ドラッグ&ドロップで簡単
- カスタムドメイン対応

---

## 方法3: GitHub Pages

### 手順:
1. **vite.config.tsを編集**
   ```typescript
   // apps/web/vite.config.ts
   export default defineConfig({
     base: '/リポジトリ名/',
     // ... 他の設定
   })
   ```

2. **ビルドとデプロイ**
   ```bash
   cd /Users/naotohashimoto/Downloads/create-anything/apps/web
   npm run build
   
   # gh-pagesブランチにデプロイ
   npm install -g gh-pages
   gh-pages -d dist
   ```

3. **GitHubで設定**
   - リポジトリの Settings → Pages
   - Source: `gh-pages` branch を選択

### メリット:
- 完全無料
- GitHubアカウントがあればすぐ使える

---

## 方法4: Firebase Hosting

### 手順:
1. **Firebase CLIインストール**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **プロジェクト初期化**
   ```bash
   cd /Users/naotohashimoto/Downloads/create-anything/apps/web
   firebase init hosting
   # Public directory: dist
   # Single-page app: Yes
   ```

3. **デプロイ**
   ```bash
   npm run build
   firebase deploy
   ```

### メリット:
- Googleのインフラ
- 高速
- 無料枠が充実

---

## おすすめの選択肢

- **初心者・手軽さ重視**: Vercel（GitHubと連携で自動デプロイ）
- **とにかく今すぐ**: Netlify（ドラッグ&ドロップ）
- **完全無料で長期運用**: GitHub Pages
- **Googleサービス利用者**: Firebase Hosting

---

## 注意事項

1. **環境変数**: 本番環境で必要な環境変数がある場合は、各サービスの設定画面で追加してください
2. **ビルドコマンド**: `npm run build`
3. **出力ディレクトリ**: `dist`（Viteのデフォルト）
4. **Node.jsバージョン**: package.jsonで指定されているバージョンを使用

---

## カスタムドメインの設定

どのサービスでも、独自ドメイン（例: `elevator-sim.com`）を設定できます：

1. ドメインを購入（お名前.com、Google Domainsなど）
2. 各サービスの管理画面でドメインを追加
3. DNSレコードを設定（各サービスが指示を出してくれます）

---

質問があれば、いつでもお聞きください！
