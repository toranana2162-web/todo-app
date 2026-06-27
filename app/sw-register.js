"use client";

import { useEffect } from "react";

// クライアント側で Service Worker を登録する（本番のみ動作させる）
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("Service Worker の登録に失敗しました", err));
    };
    // load 済みなら即登録、未完了なら load 後に登録（リスナー取りこぼし防止）
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
