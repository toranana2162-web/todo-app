// Next.js App Router がこのファイルから /manifest.webmanifest を自動生成する
export default function manifest() {
  return {
    name: "ToDo リスト",
    short_name: "ToDo",
    description: "シンプルで使いやすい ToDo リストアプリ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f6f9",
    theme_color: "#4f6ef7",
    lang: "ja",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // マスカブル（ホーム画面で形状にトリミングされる用途）
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
