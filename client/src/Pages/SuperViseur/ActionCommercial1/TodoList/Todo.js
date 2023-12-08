import React, { useState } from "react";
import jwt_decode from "jwt-decode";

function Todo({ todo, remove, update, toggleComplete }) {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idRole = decoded.userauth.idrole;
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(todo.task);

  const handleClick = evt => {
    remove(evt.target.id);
  };
  const toggleFrom = () => {
    setIsEditing(!isEditing);
  };
  const handleUpdate = evt => {
    evt.preventDefault();
    update(todo.key, task);
    toggleFrom();
  };
  const handleChange = evt => {
    setTask(evt.target.value);
  };
  const toggleCompleted = evt => {
    if(parseInt(idRole) === 2)
      toggleComplete(evt.target.id);
  };

  let result;
  if (isEditing) {
    result = (
      <div className="Todo">
        <form className="Todo-edit-form" onSubmit={handleUpdate}>
          <input onChange={handleChange} value={task} type="text" />
          <button>Save</button>
        </form>
      </div>
    );
  } else {
    result = (
      <div className="Todo">
        <li>
          <span className={todo.completed ? "Todo-task completed" : "Todo-task"}>
            Tache:{todo.task} <br></br>
          </span>
          <span className={todo.completed ? "Todo-task completed" : "Todo-task"}>
            Date début: {todo.date_debut} <br></br>
          </span>
          <span className={todo.completed ? "Todo-task completed" : "Todo-task"}>
            Date fin: {todo.date_fin}
          </span>
          {parseInt(idRole) ===2?
            <input id={todo.key} onChange={toggleCompleted} type={"checkbox"} checked={todo.completed ? "checked" : ""}/>
          :""}
        </li>
        {parseInt(idRole) ===1?
          <div className="Todo-buttons">
            {/* <button onClick={toggleFrom}>
              <i className="fas fa-pen" />
            </button> */}
            <button onClick={handleClick}>
              <i id={todo.key} className="fas fa-trash" />
            </button>
          </div>
        :""}
        
      </div>
    );
  }
  return result;
}

export default Todo;
