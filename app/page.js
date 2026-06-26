"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "todo-app.tasks";

// 利用できるカテゴリ（ラベルと色）
const CATEGORIES = [
  { key: "none", label: "なし", color: "#8a93a6" },
  { key: "work", label: "仕事", color: "#4f6ef7" },
  { key: "shopping", label: "買い物", color: "#34c98a" },
  { key: "private", label: "プライベート", color: "#f59e42" },
];

function categoryOf(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [inputCategory, setInputCategory] = useState("none");
  const [filter, setFilter] = useState("all"); // all | active | done
  const [categoryFilter, setCategoryFilter] = useState("all"); // all | カテゴリkey
  const [loaded, setLoaded] = useState(false);

  // 編集中のタスク
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const editInputRef = useRef(null);

  // ドラッグ中のタスク
  const [dragId, setDragId] = useState(null);

  // 初回マウント時に localStorage から読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 旧データに category が無い場合は "none" を補う
        setTasks(
          parsed.map((t) => ({ category: "none", ...t }))
        );
      }
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

  // 編集モードに入ったら入力欄へフォーカスする
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  function addTask() {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: Date.now(), text, done: false, category: inputCategory },
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

  function changeCategory(id, category) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, category } : t))
    );
  }

  // --- 編集（ダブルクリック） ---
  function startEdit(task) {
    setEditingId(task.id);
    setEditingText(task.text);
  }

  function commitEdit() {
    const text = editingText.trim();
    if (editingId === null) return;
    if (text) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text } : t))
      );
    }
    setEditingId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  // --- 並び替え（ドラッグ＆ドロップ） ---
  function handleDrop(targetId) {
    if (dragId === null || dragId === targetId) {
      setDragId(null);
      return;
    }
    setTasks((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === dragId);
      const toIndex = prev.findIndex((t) => t.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDragId(null);
  }

  const visibleTasks = tasks.filter((t) => {
    if (filter === "active" && t.done) return false;
    if (filter === "done" && !t.done) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
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
            <select
              className="category-select"
              value={inputCategory}
              onChange={(e) => setInputCategory(e.target.value)}
              aria-label="カテゴリを選択"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
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

          <div className="filters category-filters">
            <button
              className={`filter ${categoryFilter === "all" ? "active" : ""}`}
              onClick={() => setCategoryFilter("all")}
            >
              全カテゴリ
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={`filter ${categoryFilter === c.key ? "active" : ""}`}
                onClick={() => setCategoryFilter(c.key)}
                style={
                  categoryFilter === c.key
                    ? { background: c.color, borderColor: c.color, color: "#fff" }
                    : { color: c.color, borderColor: c.color }
                }
              >
                {c.label}
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
              {visibleTasks.map((task) => {
                const cat = categoryOf(task.category);
                const isEditing = editingId === task.id;
                return (
                  <li
                    key={task.id}
                    className={`item ${task.done ? "done" : ""} ${
                      dragId === task.id ? "dragging" : ""
                    }`}
                    draggable={!isEditing}
                    onDragStart={() => setDragId(task.id)}
                    onDragEnd={() => setDragId(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(task.id)}
                  >
                    <span className="drag-handle" title="ドラッグで並び替え">
                      ⠿
                    </span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`${task.text} を完了にする`}
                    />

                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        className="edit-input"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        aria-label="タスク名を編集"
                      />
                    ) : (
                      <span
                        className="item-text"
                        onDoubleClick={() => startEdit(task)}
                        title="ダブルクリックで編集"
                      >
                        {task.text}
                      </span>
                    )}

                    <select
                      className="category-badge"
                      value={task.category}
                      onChange={(e) => changeCategory(task.id, e.target.value)}
                      style={{ color: cat.color, borderColor: cat.color }}
                      aria-label={`${task.text} のカテゴリ`}
                      title="カテゴリを変更"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-delete"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`${task.text} を削除`}
                      title="削除"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
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
