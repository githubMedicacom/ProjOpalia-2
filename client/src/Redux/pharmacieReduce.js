import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";

var token = localStorage.getItem("x-access-token");
export const fetchPharmacie = createAsyncThunk("pharmacie/fetchPharmacie", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/allPharmacie", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pharmacie = await response.json();
  return pharmacie;
});
export const getPharmacieByNum = createAsyncThunk("pharmacie/getPharmacieByNum", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/getPharmacieByNum", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const pharmacie = await response.json();
  return pharmacie;
});
export const getActivePharmacie = createAsyncThunk("pharmacie/getActivePharmacie", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const produit = await response.json();
  return produit;
});
export const getPharmaBySeg = createAsyncThunk("pharmacie/getPharmaBySeg", async (id_segment) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/getPharmaBySeg/"+id_segment, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const produit = await response.json();
  return produit;
});
export const getPharmacieByBricks = createAsyncThunk("pharmacie/getPharmacieByBricks", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/getPharmacieByBricks", {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  
  });
  const pharmacie = await response.json();
  return pharmacie;
});

export const pharmacieGetById = createAsyncThunk("pharmacie/pharmacieGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/getPharmacie", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const pharmacie = await response.json();
  return pharmacie;
});
export const pharmacieChangeEtat = createAsyncThunk("pharmacie/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const pharmacie = await response.status;
  return pharmacie;
});
export const pharmacieAdded = createAsyncThunk("pharmacie/addPharmacie", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pharmacie/addPharmacie", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const pharmacie = await response.json();
  return pharmacie;
});
const pharmacieReduce = createSlice({
  name: "pharmacie",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
   /*  pharmacieAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "pharmacie/addPharmacie", {
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

    [fetchPharmacie.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchPharmacie.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchPharmacie.rejected]: (state, action) => {
      state.loading = false;
    },
    [pharmacieGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [pharmacieGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [pharmacieGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { pharmacieAdded } = pharmacieReduce.actions; */

export default pharmacieReduce.reducer;
