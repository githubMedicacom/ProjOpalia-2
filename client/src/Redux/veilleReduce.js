import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");




export const getProduitsByMarche = createAsyncThunk("veille/getProduitsByMarche", async (action) => {
    const response = await fetch(Configuration.BACK_BASEURL + "veille/getProduitsByMarche", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body:JSON.stringify(action)
    });
    const produits = await response.json();
    return produits;
  });


  export const veilleAdded = createAsyncThunk("veille/addVeille", async (action) => {
    const response = await fetch(Configuration.BACK_BASEURL + "veille/addVeille", {
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


  export const allVeille = createAsyncThunk("veille/allVeille", async (action) => {
    const response = await fetch(Configuration.BACK_BASEURL + "veille/allVeille", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
      body:JSON.stringify(action)
    });
    const veille = await response.json();
    return veille;
  });
  

  export const deleteVeille = createAsyncThunk("veille/deleteVeille", async (action) => {
    const response = await fetch(Configuration.BACK_BASEURL + "veille/delete/"+action.id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
    });
    const veille = await response.json();
    return veille;
  });
  

  const veilleReduce = createSlice({
    name: "veille",
    initialState: {
      entities: [],
      loading: false,
    },
    reducers: {
     
     
    },
    
  });
  
  
  export default veilleReduce.reducer;