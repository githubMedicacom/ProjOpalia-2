import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");



export const getFileItm = createAsyncThunk("itm/getFileItm", async (file) => {
  const response = await fetch(Configuration.BACK_BASEURL + "itm/getFileItm/"+file, {
    method: "GET",
    responseType: "blob",    
  }).then(response => response.blob())
  .then(function(myBlob) {
    return((myBlob))
  })
  .catch((error) => {
    console.log(error);
  })
  const files = await response;
  return files;
});
export const allItmList = createAsyncThunk("itm/allItmList", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "itm/allItmList", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const itm = await response.json();
  return itm;
});


export const deleteItm = createAsyncThunk("itm/deleteItm", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "itm/delete/"+action.id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const itm = await response.json();
  return itm;
});

export const allItm = createAsyncThunk("itm/allItm", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "itm/allItm", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const itm = await response.json();
  return itm;
});

//upload BL file
export const saveFile = createAsyncThunk("itm/saveFile", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "itm/saveFile", {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token,
    },
    body:action
  });
  const itm = await response.json();
  return itm;
});

export const itmAdded = createAsyncThunk("itm/itmAdded", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "itm/itmAdded", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const itm = await response.json();
  return itm;
});


const itmReduce = createSlice({
  name: "itms",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
   
  },
  extraReducers: {

    [allItm.pending]: (state, action) => {
      state.loading = true;
    },
    [allItm.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [allItm.rejected]: (state, action) => {
      state.loading = false;
    }
  },
});


export default itmReduce.reducer;
