import { useState } from "react";

function App() {
  const initialTasks = [
    { description: "Task 1", id: 1 },
    { description: "Task 2", id: 2 },
    { description: "Task 3", id: 3 },
  ];

  // const [tasks, setTasks] = useState([{}]);
  const [tasks, setTasks] = useState(initialTasks);
  return (
    <>
      <Header />
      <FormAddTask />
      <TaskList tasks={tasks} />
    </>
  );
}

export default App;

function Header() {
  return (
    <header className="header">
      <h1>To-Do List</h1>
    </header>
  );
}

function FormAddTask() {
  return (
    <form className="form-add-task">
      <input className="input" type="text" placeholder="Enter task" />
      <button className="btn">Add</button>
    </form>
  );
}

function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} description={task.description} />
      ))}
    </ul>
  );
}

function TaskItem({ description }) {
  return (
    <li className="task-list-item">
      <div className="description-checkbox-container">
        <input className="checkbox" type="checkbox" />

        <p>{description}</p>
      </div>
      <div className="actions-container">
        <i className="delete-icon fa-sharp fa-solid fa-trash"></i>
        <i className="edit-icon fa-sharp fa-solid fa-pen"></i>
      </div>
    </li>
  );
}
