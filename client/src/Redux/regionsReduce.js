import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchRegions = createAsyncThunk("region/fetchRegions", async () => {
    const response = await fetch(Configuration.BACK_BASEURL + "region/allRegions", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
  
    });
    const regions = await response.json();
    return regions;
  });

  export const regionGetById = createAsyncThunk("region/regionGetById", async (id1) => {
    const  id  = id1;
    const response = await fetch(Configuration.BACK_BASEURL + "region/getRegion", {
      method: 'POST',
      headers: {
        'id':id,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
    
    });
    const region = await response.json();
    return region;
  });


  export const regionAdded = createAsyncThunk("region/addRegion", async (action) => {
    const response = await fetch(Configuration.BACK_BASEURL + "region/addRegion", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token':token
      },
      body: JSON.stringify(action)
    });
    const region = await response.json();
    return region;
  });





  const regionReduce = createSlice({
    name: "region",
    initialState: {
      entities: [],
      loading: false,
    },
    reducers: {
      
  
    },
    extraReducers: {
 
    },
  });
  
  
  export default regionReduce.reducer;





