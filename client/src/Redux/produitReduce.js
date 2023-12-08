import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";

var token = localStorage.getItem("x-access-token");
export const fetchProduit = createAsyncThunk("produit/fetchProduit", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/allProduit", {
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
export const getProduitFour = createAsyncThunk("produit/getProduitFour", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/getProduitFour", {
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
export const getActiveProduit = createAsyncThunk("produit/getActiveProduit", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/getActive", {
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
export const getProduitLbr = createAsyncThunk("produit/getProduitLbr", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/getProduitLbr", {
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
export const getParent = createAsyncThunk("produit/getParent", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/getParent", {
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
export const cheeckProduit = createAsyncThunk("produit/cheeckProduit", async (action) => { 
  const response = await fetch(Configuration.BACK_BASEURL + "produit/cheeckProduit", {
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

export const produitGetById = createAsyncThunk("produit/produitGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "produit/getProduit", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const produit = await response.json();
  return produit;
});
export const getPrixProduit = createAsyncThunk("produit/getPrixProduit", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/getPrixProduit", {
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
export const produitChangeEtat = createAsyncThunk("produit/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const produit = await response.status;
  return produit;
});
export const verifCode = createAsyncThunk("produit/verifCode", async (action) => {
  var id = action.id;
  var code = action.code;
  const response = await fetch(Configuration.BACK_BASEURL + "produit/verifCode", {
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
export const produitAdded = createAsyncThunk("produit/addProduit", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "produit/addProduit", {
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
const produitReduce = createSlice({
  name: "produit",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* produitAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "produit/addProduit", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */
    produitDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "produit/delete/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    },

  },
  extraReducers: {

    [fetchProduit.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchProduit.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchProduit.rejected]: (state, action) => {
      state.loading = false;
    },
    [produitGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [produitGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [produitGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { produitDeleted } = produitReduce.actions;

export default produitReduce.reducer;
