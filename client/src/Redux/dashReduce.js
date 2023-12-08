import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

//header dahsboard (Total CA && Total vente && Total Pharmacie)
export const totalCA = createAsyncThunk("bl/totalCA", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/totalCA", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//Suivi mensuel du CA généré par BL && Évolution du CA généré par BL
export const suiviMensuel = createAsyncThunk("bl/suiviMensuel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/suiviMensuel", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA généré par les BL selon le secteur
export const chiffreParSecteur = createAsyncThunk("bl/chiffreParSecteur", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/chiffreParSecteur", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA géneré par les BL selon délégué
export const venteBLParDelegue = createAsyncThunk("bl/venteBLParDelegue", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/venteBLParDelegue", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA des produits extraits des BL
export const venteBLProduit = createAsyncThunk("bl/venteBLProduit", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/venteBLProduit", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

// CA par pharmacies par bricks (Top 15)
export const chartPharmacieBricks = createAsyncThunk("bl/chartPharmacieBricks", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/chartPharmacieBricks", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

// CA des BL par Bricks
export const chiffreParIms = createAsyncThunk("bl/chiffreParIms", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/chiffreParIms", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA BL par marchè
export const produitMarche = createAsyncThunk("bl/produitMarche", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/produitMarche", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA BL par pharmacie
export const venteBLPharmacie = createAsyncThunk("bl/venteBLPharmacie", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/venteBLPharmacie", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA (IMS) d'Opalia par rapport au total du marché par bricks
export const detailsImsBricks = createAsyncThunk("bl/detailsImsBricks", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/detailsImsBricks", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA (IMS) produit opalia par rapport au marché total
export const detailsImsMarche = createAsyncThunk("bl/detailsImsMarche", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/detailsImsMarche", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//Distrubition du CA des packs par bricks
export const getPackBriks = createAsyncThunk("bl/getPackBriks", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getPackBriks", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//Distrubition du CA des packs par bricks
export const getDeleguePharmacie = createAsyncThunk("bl/getDeleguePharmacie", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getDeleguePharmacie", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//Nombre des packs vendus par bricks
export const getBriksPack = createAsyncThunk("bl/getBriksPack", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBriksPack", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//CA du total des packs vendus en %
export const getTotalPack = createAsyncThunk("bl/getTotalPack", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getTotalPack", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
// start dashboard chef
export const chartFourPharma = createAsyncThunk("bl/chartFourPharma", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/chartFourPharma", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

export const chartFourProd = createAsyncThunk("bl/chartFourProd", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/chartFourProd", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

export const suiviMensuelFour = createAsyncThunk("bl/suiviMensuelFour", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/suiviMensuelFour", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

export const getTotalPackFour = createAsyncThunk("bl/getTotalPackFour", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getTotalPackFour", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

// end dashboard chef
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
