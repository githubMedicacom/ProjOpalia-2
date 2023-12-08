import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const allReleve = createAsyncThunk("releve/allReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/allReleve", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});

export const allReleveBi = createAsyncThunk("releve/allReleveBi", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/allReleveBi", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});
export const getDetailReleve = createAsyncThunk("releve/getDetailReleve", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/getDetailReleve/"+id, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const releve = await response.json();
  return releve;
});

export const updateReleve = createAsyncThunk("releve/updateReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/updateReleve/"+action.idBl, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});


export const getFileReleve = createAsyncThunk("releve/getFileReleve", async (file) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/getFileReleve/"+file, {
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
export const allReleveList = createAsyncThunk("releve/allReleveList", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/allReleveList", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});
export const exportReleve = createAsyncThunk("releve/exportReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/exportReleve", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});
export const cheeckProduit = createAsyncThunk("releve/cheeckProduit", async (action) => { 
  const response = await fetch(Configuration.BACK_BASEURL + "releve/cheeckProduit", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const releve = await response.json();
  return releve;
});

//upload BL file
export const saveFile = createAsyncThunk("releve/saveFile", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/saveFile", {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token,
    },
    body:action
  });
  const releve = await response.json();
  return releve;
});
export const extractionsReleve = createAsyncThunk("bl/extractionsReleve", async (action) => {
  /* new http://54.36.182.30:81/ocr */
  /* old http://54.36.183.243:92/submit */

  ///http://54.36.182.30:81/ocr
  const response = await fetch("https://releve.medicacom.tn/ocr", {
    method: "POST",
    headers: { Accept: "application/*" },
    body: action,
  });
  const releve = await response.json();
  return releve;
});
export const releveAdded = createAsyncThunk("releve/releveAdded", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/releveAdded", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});
export const releveAddedExcel = createAsyncThunk("releve/releveAddedExcel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/releveAddedExcel", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});
export const verifReleve = createAsyncThunk("releve/verifReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releve/verifReleve", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releve = await response.json();
  return releve;
});
const releveReduce = createSlice({
  name: "releve",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
   
    deletereleve(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "releve/delete/"+id, {
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

    [allReleve.pending]: (state, action) => {
      state.loading = true;
    },
    [allReleve.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [allReleve.rejected]: (state, action) => {
      state.loading = false;
    }
  },
});

export const {deletereleve  } = releveReduce.actions;

export default releveReduce.reducer;
