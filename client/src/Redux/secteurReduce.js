import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchSecteur = createAsyncThunk("secteur/fetchSecteur", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "secteur/allSecteur", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const secteur = await response.json();
  return secteur;
});
export const getActiveSecteur = createAsyncThunk("secteur/getActiveSecteur", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "secteur/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const secteur = await response.json();
  return secteur;
});
export const secteurChangerEtat = createAsyncThunk("secteur/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "secteur/changerEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const secteur = await response.status;
  return secteur;
});

export const secteurGetById = createAsyncThunk("secteur/secteurGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "secteur/getSecteur", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const secteur = await response.json();
  return secteur;
});

export const getSecteurIms = createAsyncThunk("secteur/getSecteurIms", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "secteur/getSecteurIms/"+id, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const secteur = await response.json();
  return secteur;
});
export const getIdSecteurIms = createAsyncThunk("secteur/getIdSecteurIms", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "secteur/getIdSecteurIms/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const secteur = await response.json();
  return secteur;
});
export const secteurAdded = createAsyncThunk("secteur/addSecteur", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "secteur/addSecteur", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const secteur = await response.json();
  return secteur;
});
const secteurReduce = createSlice({
  name: "secteur",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* secteurAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "secteur/addSecteur", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */

  },
  extraReducers: {

    [fetchSecteur.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchSecteur.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchSecteur.rejected]: (state, action) => {
      state.loading = false;
    },
    [secteurGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [secteurGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [secteurGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { secteurAdded } = secteurReduce.actions; */

export default secteurReduce.reducer;
