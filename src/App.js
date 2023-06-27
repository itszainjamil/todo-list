import { useState } from "react";

function App() {
  // const initialTasks = [
  //   { description: "Task 1", id: 1 },
  //   { description: "Task 2", id: 2 },
  //   { description: "Task 3", id: 3 },
  // ];

  const [tasksList, setTasksList] = useState([]);
  function handleToggle(id) {
    setTasksList((list) =>
      list.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  }

  function handleDelete(id) {
    setTasksList((list) => list.filter((item) => item.id !== id));
  }

  function handleDeleteAll() {
    setTasksList([]);
  }

  return (
    <>
      <Header />
      <FormAddTask setTasksList={setTasksList} />
      <TaskList
        tasksList={tasksList}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
        handleDeleteAll={handleDeleteAll}
      />
    </>
  );
}

export default App;

// HEADER

function Header() {
  return (
    <header className="header">
      <h1>To-Do List</h1>
    </header>
  );
}

// FORM

function FormAddTask({ setTasksList }) {
  const [task, setTask] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!task) return;
    const newTask = {
      description: task,
      id: crypto.randomUUID(),
      checked: false,
    };
    setTasksList((list) => [...list, newTask]);
    setTask("");
  }
  return (
    <form className="form-add-task" onSubmit={handleSubmit}>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="input"
        type="text"
        placeholder="Enter task"
      />
      <button className="btn btn-add-item">Add</button>
    </form>
  );
}

// TASKS LIST

function TaskList({ tasksList, handleToggle, handleDelete, handleDeleteAll }) {
  const [sortBy, setSortBy] = useState("input");
  let list;
  if (sortBy === "input") list = tasksList;
  if (sortBy === "description")
    list = tasksList
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "status")
    list = tasksList.slice().sort((a, b) => a.checked - b.checked);

  return (
    <div>
      <hr className="horizontal-line" />
      <div className="list-actions">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select"
        >
          <option value="input">By input</option>
          <option value="status">By status</option>
          <option value="description">By description</option>
        </select>
        <button onClick={handleDeleteAll} className="btn btn-delete-all">
          Delete All
        </button>
      </div>
      <ul className="task-list">
        {list.length !== 0 &&
          list.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleToggle={handleToggle}
              handleDelete={handleDelete}
            />
          ))}
      </ul>
    </div>
  );
}

// TASK ITEM

function TaskItem({ task, handleToggle, handleDelete }) {
  return (
    <li className="task-list-item">
      <div className="description-checkbox-container">
        <input
          value={task.checked}
          onChange={() => {
            handleToggle(task.id);
          }}
          className="checkbox"
          type="checkbox"
        />

        <p className={`${task.checked ? "checked" : ""}`}>{task.description}</p>
      </div>
      <div className="actions-container">
        {!task.checked && (
          <i className="edit-icon fa-sharp fa-solid fa-pen"></i>
        )}
        <i
          onClick={() => {
            handleDelete(task.id);
          }}
          className="delete-icon fa-sharp fa-solid fa-trash"
        ></i>
      </div>
    </li>
  );
}
