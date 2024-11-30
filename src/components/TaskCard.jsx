import { useEffect, useState } from "react";
import "../css/taskcard.css";

const TaskCard = ({
  title,
  description,
  dueDate,
  priority,
  taskStatus,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="task-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="card-status">
        <div className="duedate-div">
          <p>Due date:</p>
          <p className="due-date"> {dueDate}</p>
        </div>
        <div className="priority-div">
          <p>Priority:</p>
          {priority === "low" && <p className="p-low">Low</p>}
          {priority === "medium" && <p className="p-med">Medium</p>}
          {priority === "high" && <p className="p-high">High</p>}
        </div>
        <div className="status-div">
          <p>Status:</p>
          {taskStatus ? (
            <p className="completed">Completed</p>
          ) : (
            <p className="in-progress">In progress</p>
          )}
        </div>
      </div>
      <div className="button-div">
        <button className="edit-btn" onClick={onUpdate} disabled={taskStatus}>
          {taskStatus ? "Completed" : "Complete"}
        </button>
        <button className="del-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
