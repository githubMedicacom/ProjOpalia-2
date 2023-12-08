import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");
export const commandeAdded = createAsyncThunk("commande/addCommande", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/addCommande", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const commande = await response.status;
  return commande;
});
export const getAllCommande = createAsyncThunk("commande/getCommande", async (action) => {
  var id = action.id;
  var trimestre = action.trimestre;
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getCommande/"+id+"/"+trimestre, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});


export const getBlByCommande = createAsyncThunk("commande/getBlByCmd", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getBlByCmd/"+id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const commande = await response.json();
  return commande;
});


export const payerDelegue = createAsyncThunk("commande/payerDelegue", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/payerDelegue/"+action.id_cmd, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const commande = await response.json();
  return commande;
});

export const payerOpalia = createAsyncThunk("commande/payerOpalia", async (action) => {
  var id = action.id;
  const response = await fetch(Configuration.BACK_BASEURL + `commande/payerOpalia/${id}`, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const commande = await response.json();
  return commande;
});

export const getCommandeById = createAsyncThunk("commande/getCommandeById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getCommandeById/"+id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const getColorClient = createAsyncThunk("commande/getColorClient", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getColorClient/"+action.id+"/"+action.idClient, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const getColorClientCmd = createAsyncThunk("commande/getColorClientCmd", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getColorClientCmd/"+action.id+"/"+action.idClient+"/"+action.idCmd, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const getBlByClientRest = createAsyncThunk("commande/getBlByClientRest", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getBlByClientRest/"+action.id+"/"+action.etat, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const getCommandeByEtat = createAsyncThunk("commande/getCommandeByEtat", async (action) => {
  var id = action.id;
  var trimestre = action.trimestre;
  const response = await fetch(Configuration.BACK_BASEURL + `commande/getCommandeByEtat/${id}/${trimestre}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const saveDecharge = createAsyncThunk("commande/saveDecharge", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/saveDecharge/"+action.idBl, {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token
    },
    body:action.fileArray
  });
  const commande = await response.json();
  return commande;
});
export const getAllParmacieCmd = createAsyncThunk("commande/getAllParmacieCmd", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getAllParmacieCmd", {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
//getBlPayer
export const getDecharge = createAsyncThunk("commande/getDecharge", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/getDecharge/"+id, {
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
export const totalCaByAction = createAsyncThunk("commande/totalCaByAction", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "commande/totalCaByAction/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const getTypePayments = createAsyncThunk("commande/getTypePayments", async (action) => {
  var idCmd = action.idCmd;
  var mnt = action.mnt;
  const response = await fetch(Configuration.BACK_BASEURL + `commande/getTypePayments/${idCmd}/${mnt}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const getCommandeByAction = createAsyncThunk("commande/getCommandeByAction", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + `commande/getCommandeByAction`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token,
    },
    body:JSON.stringify(action)
  });
  const commande = await response.json();
  return commande;
});
export const getAllDelegue = createAsyncThunk("commande/getAllDelegue", async (action) => {
  var annee = action.date;
  const response = await fetch(Configuration.BACK_BASEURL + `commande/getAllDelegue/${annee}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
export const getAllActions = createAsyncThunk("commande/getAllActions", async (action) => {
  var annee = action.date;
  const response = await fetch(Configuration.BACK_BASEURL + `commande/getAllActions/${annee}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const commande = await response.json();
  return commande;
});
const dashReduce = createSlice({
  name: "dash",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {},
});

/* export const {} = dashReduce.actions; */

export default dashReduce.reducer;
