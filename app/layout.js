import "./globals.css";
import ServiceWorkerRegister from "./sw-register";

export const metadata = {
  title: "ToDo リスト",
  description: "シンプルで使いやすい ToDo リストアプリ",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ToDo",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  // iOS Safari のホーム画面スタンドアロン起動用（Next が標準では出力しないため明示）
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#4f6ef7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
