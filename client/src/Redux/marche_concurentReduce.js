import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchMarche_concurent = createAsyncThunk("marche_concurent/fetchMarche_concurent", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "marche_concurent/allMarche_concurent", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const marche_concurent = await response.json();
  return marche_concurent;
});
export const getActiveMarche = createAsyncThunk("marche_concurent/getActiveMarche", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "marche_concurent/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const marche_concurent = await response.json();
  return marche_concurent;
});
export const marcheChangerEtat = createAsyncThunk("marche_concurent/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "marche_concurent/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const marche_concurent = await response.status;
  return marche_concurent;
});

export const marche_concurentGetById = createAsyncThunk("marche_concurent/marche_concurentGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "marche_concurent/getMarche_concurent", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const marche_concurent = await response.json();
  return marche_concurent;
});
export const marche_concurentAdded = createAsyncThunk("marche_concurent/addMarche_concurent", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "marche_concurent/addMarche_concurent", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const marche_concurent = await response.json();
  return marche_concurent;
});
const marche_concurentReduce = createSlice({
  name: "marche_concurent",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {

    [fetchMarche_concurent.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchMarche_concurent.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchMarche_concurent.rejected]: (state, action) => {
      state.loading = false;
    },
    [marche_concurentGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [marche_concurentGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [marche_concurentGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { marche_concurentAdded } = marche_concurentReduce.actions; */

export default marche_concurentReduce.reducer;
