import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchPoles = createAsyncThunk("pole/fetchPoles", async () => {
    const response = await fetch(Configuration.BACK_BASEURL + "pole/allPoles", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
  
    });
    const poles = await response.json();
    return poles;
  });

  export const poleGetById = createAsyncThunk("pole/poleGetById", async (id1) => {
    const  id  = id1;
    const response = await fetch(Configuration.BACK_BASEURL + "pole/getPole", {
      method: 'POST',
      headers: {
        'id':id,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
    
    });
    const pole = await response.json();
    return pole;
  });


  export const poleAdded = createAsyncThunk("pole/addPole", async (action) => {
    const response = await fetch(Configuration.BACK_BASEURL + "pole/addPole", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
      body: JSON.stringify(action)
    });
    const pole = await response.json();
    return pole;
  });





  const poleReduce = createSlice({
    name: "pole",
    initialState: {
      entities: [],
      loading: false,
    },
    reducers: {
      
  
    },
    extraReducers: {
 
    },
  });
  
  
  export default poleReduce.reducer;





