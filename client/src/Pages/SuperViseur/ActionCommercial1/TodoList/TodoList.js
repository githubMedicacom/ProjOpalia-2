import React, { useState } from "react";
import Todo from "./Todo";
import NewTodoForm from "./NewTodoForm";
import Select from "react-select";
import jwt_decode from "jwt-decode";
import { updateTodo } from "../../../../Redux/todoListReduce";
import { useDispatch } from "react-redux";

function TodoList({list,array,setArray,idDelegue,i,optionsDelegue,nomDelegue}) {
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idRole = decoded.userauth.idrole;
  const [todos, setTodos] = useState([]);
  const create = newTodo => {
    setTodos([...todos, newTodo]);
    var l = list;
    l[i] = [...todos, newTodo];
    setArray(list)
    /* setArray([...todos, newTodo]); */
  };

  const remove = id => {
    var tab = todos.filter(todo => todo.key.toString() !== id.toString());
    setTodos(tab);
    var l = list;
    l[i] = tab;
    setArray(list)
    /* setTodos(todos.filter(todo => todo.id.toString() !== id.toString())); */
  };

  const update = (id, updtedTask) => {
    const updatedTodos = todos.map(todo => {
      if (todo.key === id) {
        return { ...todo, task: updtedTask };
      }
      return todo;
    });
    setTodos(updatedTodos);
    var l = list;
    l[i] = updatedTodos;
    setArray(list)
  };

  const toggleComplete = id => {
    var valChanged =null;
    const updatedTodos = todos.map(todo => {
      if (todo.key.toString() === id.toString()) {
        valChanged = !todo.completed ;
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
    var l = list;
    l[i] = updatedTodos;
    setArray(list);    
    dispatch(updateTodo({ id: id,completed:valChanged  }));
    /* axios
      .put(Configuration.BACK_BASEURL + "todoList/update/"+id, { token: token,completed:valChanged })
      .then((response) => {
        
      })
      .catch((error) => {
        // error response
        console.log(error);
      }) */
  };

  const todosList = todos.map(todo => (
    <Todo
      toggleComplete={toggleComplete}
      update={update}
      remove={remove}
      key={todo.key}
      todo={todo}
    />
  )); 
  const [delegue, setDelegue] = React.useState(null);
  React.useEffect(() => {
    setTodos(array);
    setDelegue({value:idDelegue,label: nomDelegue})
  }, [idDelegue,nomDelegue,array]);

  return (
    <div className="TodoList">
        {parseInt(idRole) ===1?      
          <div>
            {(todos.length)===0?
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name="singleSelect"
                value={delegue}
                onChange={(val)=>{
                  setDelegue(val);
                }}
                options={optionsDelegue}
                placeholder="Délégué"
              />  
            :<p className="label-delegue">{delegue.label}</p>}        
          </div>
      :<div className="div-empty"></div>}
      <h3>
        Liste des taches
      </h3>
      <ul>{todosList}</ul>
      {parseInt(idRole) ===1? 
        <NewTodoForm delegue={delegue} createTodo={create} />
      :<div className="div-empty"></div>}
    </div>
  );
}

export default TodoList;
