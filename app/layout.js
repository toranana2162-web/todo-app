import "./globals.css";

export const metadata = {
  title: "ToDo リスト",
  description: "シンプルで使いやすい ToDo リストアプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
