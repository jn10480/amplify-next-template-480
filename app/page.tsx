"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

import { useAuthenticator } from "@aws-amplify/ui-react";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  const { signOut } = useAuthenticator();

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("トークテーマを入力してください"),
    });
  }

  function deleteTodo(todo: Schema["Todo"]["type"]) {
    const confirmDelete = window.confirm(`削除しますか？\nトークテーマ: ${todo.content}`);
    if (confirmDelete) {
      client.models.Todo.delete({ id: todo.id });
    }
  }

  function pickRandomTodo() {
    if (todos.length === 0) {
      alert("トークテーマを登録してください。");
      return;
    }
    const randomTodo = todos[Math.floor(Math.random() * todos.length)];
    alert(`トークテーマ: ${randomTodo.content}`);
  }

  return (
    <Authenticator>
      <main>
        <h1>トークテーマ</h1>
        <button onClick={pickRandomTodo}>トークテーマを選ぶ!</button>
        <ul>
          {todos.map((todo) => (
            <li onClick={() => deleteTodo(todo)} key={todo.id}>{todo.content}</li>
          ))}
        </ul>
        <div>トークテーマをクリックして削除</div>
        <button onClick={createTodo}>追加</button>
      </main>
      <button onClick={signOut}>Sign out</button>
    </Authenticator>
  );
}
