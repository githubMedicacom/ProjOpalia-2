import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const getCmd = createAsyncThunk("commandeVente/getCmd", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/getCmd/"+action.idRole+"/"+action.idLine+"/"+action.idUser+"/"+action.annee, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const commandeVente = await response.json();
  return commandeVente;
});

export const getCmdValider = createAsyncThunk("commandeVente/getCmdValider", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/getCmdValider/"+action.idRole+"/"+action.idLine+"/"+action.idUser+"/"+action.annee, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const commandeVente = await response.json();
  return commandeVente;
});
export const countNum = createAsyncThunk("commandeVente/countNum", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/countNum/"+id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const commandeVente = await response.json();
  return commandeVente;
});
export const addCmd = createAsyncThunk("commandeVente/addCmd", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/addCmd", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const commandeVente = await response.json();
  return commandeVente;
});
export const addLigneCmd = createAsyncThunk("commandeVente/addLigneCmd", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/addLigneCmd", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const commandeVente = await response.json();
  return commandeVente;
});

//changerEtat
export const cmdChangeEtat = createAsyncThunk("commandeVente/changerEtat", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/changeEtat", {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
export const deleteCmd = createAsyncThunk("commandeVente/delete", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/delete/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const bl = await response.json();
  return bl;
});

//getDetailBl
export const getDetail = createAsyncThunk("commandeVente/getDetail", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commandeVente/getDetail/"+id, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});
const commandeVenteReduce = createSlice({
  name: "commandeVente",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {

    [getCmd.pending]: (state, action) => {
      state.loading = true;
    },
    [getCmd.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [getCmd.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default commandeVenteReduce.reducer;
