import { useState, useEffect } from "react";

function App() {
  // const initialTasks = [
  //   { description: "Task 1", id: 1 },
  //   { description: "Task 2", id: 2 },
  //   { description: "Task 3", id: 3 },
  // ];

  const [tasksList, setTasksList] = useState([]);
  const [currTask, setCurrTask] = useState(null);
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
          <option value="input">Sort by input</option>
          <option value="status">Sort by status</option>
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
  const [updatedDescription, setUpdatedDescription] = useState(
    currTask.description
  );

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

  function closeModal(e) {
    e.preventDefault();
    setCurrTask(null);
  }

  function handleKeyDown(e) {
    if (e.keyCode === 27) closeModal(e);
    // if (e.key === "Escape") closeModal(e);
    if (e.keyCode === 17) handleUpdateTask(e);
  }

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
  // return (
  //   <>
  //     <div onKeyDown={handleKeyDown} className="modal">
  //       <form className="form form-update-task">
  //         <div>
  //           <h3 className="heading-update-item">Update Task</h3>
  //           <button onClick={closeModal} className="btn-close-modal">
  //             &times;
  //           </button>
  //         </div>
  //         <input
  //           className="input"
  //           type="text"
  //           placeholder="Enter updated task"
  //           value={updatedDescription}
  //           onChange={(e) => setUpdatedDescription(e.target.value)}
  //         />
  //         <button onClick={handleUpdateTask} className="btn btn-add-item">
  //           Update
  //         </button>
  //       </form>
  //     </div>
  //     <div className="overlay"></div>
  //   </>
  // );
}
