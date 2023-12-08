import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");
export const getTodoByAction = createAsyncThunk("todoList/getTodoByAction", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "todoList/getTodoByAction", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const todoList = await response.json();
  return todoList;
});
const todoListReduce = createSlice({
  name: "todoList",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    saveTodo(state, action) {
      fetch(Configuration.BACK_BASEURL + "todoList/saveTodo", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    updateTodo(state, action) {
      fetch(Configuration.BACK_BASEURL + "todoList/update", {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },

  },
  extraReducers: {
  },
});

export const { saveTodo,updateTodo } = todoListReduce.actions;

export default todoListReduce.reducer;
