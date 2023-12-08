import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchPack = createAsyncThunk("pack/fetchPack", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "pack/allPack", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pack = await response.json();
  return pack;
});

export const packGetById = createAsyncThunk("pack/packGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "pack/getPack", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const pack = await response.json();
  return pack;
});

export const getPackByProduits = createAsyncThunk("pack/getPackByProduits", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pack/getPackByProduits", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  
  });
  const produit = await response.json();
  return produit;
});

export const getActivePack = createAsyncThunk("pack/getActivePack", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "pack/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pack = await response.json();
  return pack;
});
export const getPackBySegment = createAsyncThunk("pack/getPackBySegment", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pack/getPackBySegment/"+id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pack = await response.json();
  return pack;
});
export const verifPackByProduits = createAsyncThunk("pack/verifPackByProduits", async (action) => {
  var idProduit = action.idProduit;
  var idPack = action.idPack;
  const response = await fetch(Configuration.BACK_BASEURL + "pack/verifPackByProduits/"+idProduit+"/"+idPack, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pack = await response.json();
  return pack;
});
export const allProduitPack = createAsyncThunk("pack/allProduitPack", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "pack/allProduitPack", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pack = await response.json();
  return pack;
});
export const packAdded = createAsyncThunk("pack/addPack", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "pack/addPack", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const pack = await response.json();
  return pack;
});
const packReduce = createSlice({
  name: "pack",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* packAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "pack/addPack", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */
    packChangeEtat(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "pack/changeEtat/"+id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    },

  },
  extraReducers: {

    [fetchPack.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchPack.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchPack.rejected]: (state, action) => {
      state.loading = false;
    },
    [packGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [packGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [packGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { packChangeEtat } = packReduce.actions;

export default packReduce.reducer;
