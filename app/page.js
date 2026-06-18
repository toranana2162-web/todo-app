"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "todo-app.tasks";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | done
  const [loaded, setLoaded] = useState(false);

  // 初回マウント時に localStorage から読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.error("タスクの読み込みに失敗しました", e);
    }
    setLoaded(true);
  }, []);

  // 変更があるたびに localStorage へ保存する（ブラウザを閉じても残る）
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("タスクの保存に失敗しました", e);
    }
  }, [tasks, loaded]);

  function addTask() {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: Date.now(), text, done: false },
      ...prev,
    ]);
    setInput("");
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  const visibleTasks = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const remaining = tasks.filter((t) => !t.done).length;
  const hasDone = tasks.some((t) => t.done);

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <h1>ToDo リスト</h1>
          <p>やることを追加して、ひとつずつ片付けましょう</p>
        </header>

        <div className="card">
          <div className="input-row">
            <input
              type="text"
              placeholder="新しいタスクを入力…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              aria-label="新しいタスク"
            />
            <button
              className="btn btn-add"
              onClick={addTask}
              disabled={!input.trim()}
            >
              追加
            </button>
          </div>

          <div className="filters">
            {[
              { key: "all", label: "すべて" },
              { key: "active", label: "未完了" },
              { key: "done", label: "完了済み" },
            ].map((f) => (
              <button
                key={f.key}
                className={`filter ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {visibleTasks.length === 0 ? (
            <p className="empty">
              {tasks.length === 0
                ? "まだタスクがありません。最初のタスクを追加しましょう！"
                : "表示するタスクがありません。"}
            </p>
          ) : (
            <ul className="list">
              {visibleTasks.map((task) => (
                <li
                  key={task.id}
                  className={`item ${task.done ? "done" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`${task.text} を完了にする`}
                  />
                  <span className="item-text">{task.text}</span>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`${task.text} を削除`}
                    title="削除"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {tasks.length > 0 && (
            <div className="footer">
              <span>残り {remaining} 件</span>
              {hasDone && (
                <button className="btn btn-clear" onClick={clearDone}>
                  完了済みを削除
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
