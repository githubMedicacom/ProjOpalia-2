import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchLigneIms = createAsyncThunk("ligneIms/fetchLigneIms", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "ligneIms/allLigneIms", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const ligneIms = await response.json();
  return ligneIms;
});
export const getActiveLigne = createAsyncThunk("ligneIms/getActiveLigne", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "ligneIms/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const ligneIms = await response.json();
  return ligneIms;
});

export const ligneImsGetById = createAsyncThunk("ligneIms/ligneImsGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "ligneIms/getLigneIms", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const ligneIms = await response.json();
  return ligneIms;
});
export const ligneChangerEtat = createAsyncThunk("ligneIms/ligneChangerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ligneIms/changerEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const ligneIms = await response.status;
  return ligneIms;
});
export const ligneImsAdded = createAsyncThunk("ligneIms/addLigneIms", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ligneIms/addLigneIms", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const ligneIms = await response.json();
  return ligneIms;
});
const ligneImsReduce = createSlice({
  name: "ligneIms",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* ligneImsAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "ligneIms/addLigneIms", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */

  },
  extraReducers: {

    [fetchLigneIms.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchLigneIms.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchLigneIms.rejected]: (state, action) => {
      state.loading = false;
    },
    [ligneImsGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [ligneImsGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [ligneImsGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { ligneImsAdded } = ligneImsReduce.actions; */

export default ligneImsReduce.reducer;
