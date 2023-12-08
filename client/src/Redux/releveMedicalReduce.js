import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const allReleveMedical = createAsyncThunk("releveMedical/allReleveMedical", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/allReleveMedical", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releveMedical = await response.json();
  return releveMedical;
});

export const allReleveMedicalBi = createAsyncThunk("releveMedical/allReleveMedicalBi", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/allReleveMedicalBi", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releveMedical = await response.json();
  return releveMedical;
});
export const getDetailReleveMedical = createAsyncThunk("releveMedical/getDetailReleveMedical", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/getDetailReleveMedical/"+id, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const releveMedical = await response.json();
  return releveMedical;
});
export const getFileReleveMedical = createAsyncThunk("releveMedical/getFileReleveMedical", async (file) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/getFileReleveMedical/"+file, {
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
export const allReleveList = createAsyncThunk("releveMedical/allReleveList", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/allReleveList", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releveMedical = await response.json();
  return releveMedical;
});
export const exportReleve = createAsyncThunk("releveMedical/exportReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/exportReleve", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releveMedical = await response.json();
  return releveMedical;
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
  const response = await fetch("http://54.36.182.30:81/ocr", {
    method: "POST",
    headers: { Accept: "application/*" },
    body: action,
  });
  const releve = await response.json();
  return releve;
});



// add releve medical
export const releveMedicalAdded = createAsyncThunk("releveMedical/releveAdded", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/releveAdded", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releveMedical = await response.json();
  return releveMedical;
});


export const releveAddedExcel = createAsyncThunk("releveMedical/releveAddedExcel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/releveAddedExcel", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const releveMedical = await response.json();
  return releveMedical;
});
export const verifReleve = createAsyncThunk("releveMedical/verifReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveMedical/verifReleve", {
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
      fetch(Configuration.BACK_BASEURL + "releveMedical/delete/"+id, {
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

    [allReleveMedical.pending]: (state, action) => {
      state.loading = true;
    },
    [allReleveMedical.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [allReleveMedical.rejected]: (state, action) => {
      state.loading = false;
    }
  },
});

export const {deletereleve  } = releveReduce.actions;

export default releveReduce.reducer;
