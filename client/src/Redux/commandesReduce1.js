import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");
export const commandeAdded = createAsyncThunk("commande/addCommande", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/addCommande", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const commande = await response.status;
  return commande;
});
export const getAllCommande = createAsyncThunk("commande/getCommande", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getCommande/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const todoList = await response.json();
  return todoList;
});
export const getCommandeByEtat = createAsyncThunk("commande/getCommandeByEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getCommandeByEtat/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const todoList = await response.json();
  return todoList;
});
const dashReduce = createSlice({
  name: "dash",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {},
});

/* export const {} = dashReduce.actions; */

export default dashReduce.reducer;
