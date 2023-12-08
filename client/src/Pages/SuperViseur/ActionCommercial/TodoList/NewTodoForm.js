import React, { useReducer } from "react";
import {v1 as uuid} from "uuid";

function NewTodoForm({ task, createTodo,delegue }) {
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      task: ""
    }
  );

  const handleChange = evt => {
    setUserInput({ [evt.target.name]: evt.target.value });
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    if(delegue.value !==0 && userInput.task !==""){
      const newTodo = { 
        key: uuid(), 
        task: userInput.task, 
        completed: false,
        idDelegue:delegue.value,
        nomDelegue:delegue.label,
        date_debut:dateDebut,
        date_fin:dateFin
      };
      createTodo(newTodo);
      setUserInput({ task: "" });
    }
  };

  return (
    <form className="NewTodoForm" onSubmit={handleSubmit}>
      <label htmlFor="task">Nouvelle tache</label>
      <input
        value={userInput.task}
        onChange={handleChange}
        id="task"
        type="text"
        name="task"
        placeholder="Nouvelle tache"
      />
      <br></br>
      <div className="dateTask">
        <label htmlFor="task">Date début</label>
        <input
          value={dateDebut}
          onChange={(value) => { setDateDebut(value.target.value); }}
          id="dateDebut"
          type="date"
          name="dateDebut"
        />
      </div>
      <div className="dateTask">
        <label htmlFor="task">Date fin</label>
        <input
          value={dateFin}
          onChange={(value) => { setDateFin(value.target.value); }}
          id="dateDebut"
          type="date"
          name="dateFin"
        />
      </div>
      <button>Ajouter</button>
    </form>
  );
}

export default NewTodoForm;
