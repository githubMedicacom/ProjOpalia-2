import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchFournisseur = createAsyncThunk("fournisseur/fetchFournisseur", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/allFournisseur", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const fournisseur = await response.json();
  return fournisseur;
});
export const cheeckFournisseur = createAsyncThunk("fournisseur/cheeckFournisseur", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/cheeck", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const fournisseur = await response.json();
  return fournisseur;
});
export const getActiveFournisseur = createAsyncThunk("fournisseur/getActiveFournisseur", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const fournisseur = await response.json();
  return fournisseur;
});

export const fournisseurGetById = createAsyncThunk("fournisseur/fournisseurGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/getFournisseur", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const fournisseur = await response.json();
  return fournisseur;
});
export const fournisseurChangerEtat = createAsyncThunk("fournisseur/fournisseurChangerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/changerEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const fournisseur = await response.status;
  return fournisseur;
});
export const fournisseurAdded = createAsyncThunk("fournisseur/addFournisseur", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "fournisseur/addFournisseur", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const fournisseur = await response.json();
  return fournisseur;
});
const fournisseurReduce = createSlice({
  name: "fournisseur",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* fournisseurAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "fournisseur/addFournisseur", {
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

    [fetchFournisseur.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchFournisseur.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchFournisseur.rejected]: (state, action) => {
      state.loading = false;
    },
    [fournisseurGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [fournisseurGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [fournisseurGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { fournisseurAdded } = fournisseurReduce.actions; */

export default fournisseurReduce.reducer;
