import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const allReleveVente = createAsyncThunk("releveVente/allReleveVente", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/allReleveVente", {
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

export const allReleveVenteBi = createAsyncThunk("releveVente/allReleveVenteBi", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/allReleveVenteBi", {
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
export const getDetailReleveVente = createAsyncThunk("releveVente/getDetailReleveVente", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/getDetailReleveVente/"+id, {
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
export const getFileReleveVente = createAsyncThunk("releveVente/getFileReleveVente", async (file) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/getFileReleveVente/"+file, {
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

export const allReleveList = createAsyncThunk("releveVente/allReleveList", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/allReleveList", {
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

export const exportReleve = createAsyncThunk("releveVente/exportReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/exportReleve", {
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
export const cheeckProduit = createAsyncThunk("releveVente/cheeckProduit", async (action) => { 
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/cheeckProduit", {
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

export const cheeckFournisseur = createAsyncThunk("releveVente/cheeckFournisseur", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/cheeckFournisseur", {
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
})

//upload BL file
export const saveFile = createAsyncThunk("releveVente/saveFile", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/saveFile", {
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
export const releveVenteAdded = createAsyncThunk("releveVente/releveAdded", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/releveAdded", {
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


export const releveVenteAddedExcel = createAsyncThunk("releveVente/releveVenteAddedExcel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/releveVenteAddedExcel", {
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
export const verifReleveVente = createAsyncThunk("releveVente/verifReleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/verifReleve", {
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

export const deletereleve = createAsyncThunk("releveVente/deletereleve", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "releveVente/deletereleve/"+action.id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const releve = await response.json();
  return releve;
});


const releveVenteReduce = createSlice({
  name: "releveVente",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
   
    // deletereleve(state, action) {
    //   const { id } = action.payload;
    //   fetch(Configuration.BACK_BASEURL + "releveVente/delete/"+id, {
    //     method: 'DELETE',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'x-access-token':token
    //     },
    //   });
    // },
  },
  extraReducers: {

    [allReleveVente.pending]: (state, action) => {
      state.loading = true;
    },
    [allReleveVente.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [allReleveVente.rejected]: (state, action) => {
      state.loading = false;
    }
  },
});


export default releveVenteReduce.reducer;
