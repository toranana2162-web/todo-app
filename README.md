# ToDo リスト

Next.js（App Router）で作成した、シンプルで使いやすい ToDo リスト Web アプリです。

## 機能

- ✅ タスクの追加
- ✅ 完了マーク（チェック）
- ✅ タスクの削除
- ✅ フィルター（すべて / 未完了 / 完了済み）
- ✅ ブラウザの `localStorage` にデータを保存するので、ブラウザを閉じてもデータが残ります

## 技術スタック

- [Next.js 15](https://nextjs.org/)（App Router）
- React 19
- データ永続化: ブラウザの localStorage（サーバー・DB 不要）

## 開発

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## ビルド

```bash
npm run build
npm start
```

## デプロイ

[Vercel](https://vercel.com/) にそのままデプロイできます。
