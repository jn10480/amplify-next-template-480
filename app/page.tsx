import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

import { useAuthenticator } from "@aws-amplify/ui-react";



const client = generateClient<Schema>();

export default function App() {

    
  const { signOut } = useAuthenticator();

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

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
      <br />
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
