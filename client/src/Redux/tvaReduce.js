import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchTva = createAsyncThunk("tva/fetchTva", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "tva/allTva", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const tva = await response.json();
  return tva;
});
export const getActiveTva = createAsyncThunk("tva/getActiveTva", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "tva/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const tva = await response.json();
  return tva;
});
export const getTvaByAnnee = createAsyncThunk("tva/getTvaByAnnee", async (annee) => {
  const response = await fetch(Configuration.BACK_BASEURL + "tva/getTvaByAnnee/"+annee, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const tva = await response.json();
  return tva;
});

export const tvaGetById = createAsyncThunk("tva/tvaGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "tva/getTva", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const tva = await response.json();
  return tva;
});
export const tvaChangerEtat = createAsyncThunk("tva/tvaChangerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "tva/changerEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const tva = await response.status;
  return tva;
});
export const tvaAdded = createAsyncThunk("tva/addTva", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "tva/addTva", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const tva = await response.json();
  return tva;
});
const tvaReduce = createSlice({
  name: "tva",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* tvaAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "tva/addTva", {
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

    [fetchTva.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchTva.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchTva.rejected]: (state, action) => {
      state.loading = false;
    },
    [tvaGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [tvaGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [tvaGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { tvaAdded } = tvaReduce.actions; */

export default tvaReduce.reducer;
