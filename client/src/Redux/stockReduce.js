import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchStock = createAsyncThunk("stock/fetchStock", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "stock/allStock", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const stock = await response.json();
  return stock;
});

export const stockGetById = createAsyncThunk("stock/stockGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "stock/getStock", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const stock = await response.json();
  return stock;
});

export const getActiveStock = createAsyncThunk("stock/getActiveStock", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "stock/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const stock = await response.json();
  return stock;
});

export const verifStock = createAsyncThunk("stock/verifStock", async (action) => {
  var id_fournisseur = action.id_fournisseur;
  var mois=action.mois;
  var annee = action.annee;
  var id = action.id;
  var type = action.type ;
  console.log(type)
  const response = await fetch(Configuration.BACK_BASEURL + `stock/verifStock/${id}/${id_fournisseur}/${mois}/${annee}/${type}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const stock = await response.json();
  return stock;
});

export const exportStock = createAsyncThunk("stock/exportStock", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + `stock/exportStock`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const stock = await response.json();
  return stock;
});

export const stockAdded = createAsyncThunk("stock/addStock", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "stock/addStock", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const stock = await response.json();
  return stock;
});


export const stockChangeEtat = createAsyncThunk("stock/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "stock/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const stock = await response.status;
  return stock;
});

export const deleteStock = createAsyncThunk("stock/delete", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "stock/delete/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const stock = await response.json();
  return stock;
});

const stockReduce = createSlice({
  name: "stock",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* stockAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "stock/addStock", {
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

    [fetchStock.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchStock.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchStock.rejected]: (state, action) => {
      state.loading = false;
    },
    [stockGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [stockGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [stockGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default stockReduce.reducer;
