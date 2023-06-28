import { useState, useEffect } from "react";

function App() {
  // Holds all the tasks
  const [tasksList, setTasksList] = useState([]);

  // Used to edit a task
  const [currTask, setCurrTask] = useState(null);

  // Handling checkbox
  function handleToggle(id) {
    setTasksList((list) =>
      list.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  // Deleteing a task
  function handleDelete(id) {
    setTasksList((list) => list.filter((item) => item.id !== id));
  }

  // Delete all tasks
  function handleDeleteAll() {
    if (tasksList.length === 0) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (confirmed) setTasksList([]);
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
        setCurrTask={setCurrTask}
      />

      {currTask && (
        <Modal
          currTask={currTask}
          setCurrTask={setCurrTask}
          setTasksList={setTasksList}
        />
      )}
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

  // To add new task to the list
  function handleSubmit(e) {
    e.preventDefault();
    if (!task) return;
    const newTask = {
      description: task,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasksList((list) => [...list, newTask]);
    setTask("");
  }

  return (
    <form className="form form-add-task" onSubmit={handleSubmit}>
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

function TaskList({
  tasksList,
  handleToggle,
  handleDelete,
  handleDeleteAll,
  setCurrTask,
}) {
  // Sorting
  const [sortBy, setSortBy] = useState("input");

  // Creating a list variable to update the list according to 'sortBy'
  let list;

  // Default - Sort by input order
  if (sortBy === "input") list = tasksList;

  // Sort alphabetically
  if (sortBy === "description")
    list = tasksList
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  // Sort by completed status
  if (sortBy === "status")
    list = tasksList.slice().sort((a, b) => a.completed - b.completed);

  return (
    <div>
      <hr className="horizontal-line" />
      <div className="list-actions">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select"
        >
          <option value="input">Sort by input</option>
          <option value="status">Sort by completed status</option>
          <option value="description">Sort by description</option>
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
              setCurrTask={setCurrTask}
            />
          ))}
      </ul>
    </div>
  );
}

// TASK ITEM

function TaskItem({ task, handleToggle, handleDelete, setCurrTask }) {
  return (
    <li className="task-list-item">
      <div className="description-checkbox-container">
        <input
          value={task.completed}
          onChange={() => {
            handleToggle(task.id);
          }}
          className="checkbox"
          type="checkbox"
        />

        <p className={`${task.completed ? "checked" : ""}`}>
          {task.description}
        </p>
      </div>
      <div className="actions-container">
        {!task.completed && (
          <i
            onClick={() => setCurrTask(task)}
            className="edit-icon fa-sharp fa-solid fa-pen"
          ></i>
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

// MODAL
function Modal({ currTask, setCurrTask, setTasksList }) {
  // Modal input
  const [updatedDescription, setUpdatedDescription] = useState(
    currTask.description
  );

  // To update the task
  function handleUpdateTask(e) {
    e.preventDefault();

    setTasksList((list) =>
      list.map((task) =>
        task.id === currTask.id
          ? { ...task, description: updatedDescription }
          : task
      )
    );
    setCurrTask(null);
  }

  // To close the modal window
  function closeModal(e) {
    e.preventDefault();
    setCurrTask(null);
  }

  // To handle ENTER and ESCAPE key event
  function handleKeyDown(e) {
    // Close modal on ESCAPE key
    if (e.keyCode === 27) closeModal(e);
    // if (e.key === "Escape") closeModal(e);

    // Update the task on ENTER key
    if (e.keyCode === 17) handleUpdateTask(e);
  }

  // Event listener for key press
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  });

  return (
    <>
      <div className="modal">
        <div className="modal-header">
          <h3 className="heading-update-item">Update Task</h3>
          <button onClick={closeModal} className="btn-close-modal">
            &times;
          </button>
        </div>
        <form onSubmit={handleUpdateTask} className="form form-update-task">
          <input
            className="input"
            type="text"
            placeholder="Enter updated task"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
          <button className="btn btn-add-item">Update</button>
        </form>
      </div>
      <div onClick={closeModal} className="overlay"></div>
    </>
  );
}
