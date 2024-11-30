import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import "../css/dashboard.css";

const Dashboard = () => {
  const apiBase = "http://localhost:3000";
  let token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
  });

  const [addSection, setAddSection] = useState(false);

  function toggleAddButton() {
    setAddSection(!addSection);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiBase + "/task", {
        method: "GET",
        headers: { Authorization: `${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      alert("Tasks fetched successfully!");
      console.log("Tasks fetched successfully");
      const taskData = await response.json();
      setTasks(taskData);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/task/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id
            ? { ...task, completed: updatedTask.completed }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    try {
      const response = await fetch(apiBase + "/task", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      alert("Task created successfully!");
      console.log("Task created successfully");
      setAddSection(false);
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="header">
        <h2>TaskMaster</h2>
      </div>
      <div className="dash">
        <div className="tool-bar">
          <div className="search-bar">
            <input
              type="search"
              name="search"
              id="search-bar"
              placeholder="Search Tasks..."
            />
            <button>Search</button>
          </div>
        </div>
        <h4>Your Tasks:</h4>
        <div className="tasks-div">
          {loading && <p>Loading...</p>}
          {tasks.length < 1 ? (
            <h3>
              Your tasks display here. Click the button below to add a task.
            </h3>
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                dueDate={new Date(task.dueDate).toLocaleDateString()}
                priority={task.priority}
                status={task.status}
                onUpdate={() => handleUpdate(task.id)}
                onDelete={() => handleDelete(task.id)}
              />
            ))
          )}
        </div>
        <div className="add-section">
          <button onClick={toggleAddButton}>
            {addSection ? "Cancel" : "Add a new task"}
          </button>
          <form
            onSubmit={handleSubmit}
            className={addSection ? "add-form" : "hidden"}
          >
            <div className="select-div">
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                name="title"
                placeholder="Task Title..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="select-div">
              <label htmlFor="description">Description: </label>
              <textarea
                name="description"
                id=""
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="select-div">
              <label htmlFor="dueDate">Due date: </label>
              <input
                type="date"
                name="dueDate"
                id=""
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="select-div">
              <label htmlFor="priority">Priority: </label>
              <select
                name="priority"
                id=""
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            {/* <div className="select-div">
              <label for="status">Status: </label>
              <select name="status" id="">
                <option value="started">In progress</option>
                <option value="complete">Complete</option>
              </select>
            </div> */}
            <button disabled={loading}>
              {loading ? "Loading..." : "Add Task"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
