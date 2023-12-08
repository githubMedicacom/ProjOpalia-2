import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchMarcheIms = createAsyncThunk("marcheIms/fetchMarcheIms", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "marcheIms/allMarcheIms", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const marcheIms = await response.json();
  return marcheIms;
});
export const getActiveMarche = createAsyncThunk("marcheIms/getActiveMarche", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "marcheIms/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const marcheIms = await response.json();
  return marcheIms;
});
export const marcheChangerEtat = createAsyncThunk("marcheIms/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "marcheIms/changerEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const marcheIms = await response.status;
  return marcheIms;
});

export const marcheImsGetById = createAsyncThunk("marcheIms/marcheImsGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "marcheIms/getMarcheIms", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const marcheIms = await response.json();
  return marcheIms;
});
export const marcheImsAdded = createAsyncThunk("marcheIms/addMarcheIms", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "marcheIms/addMarcheIms", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const marcheIms = await response.json();
  return marcheIms;
});
const marcheImsReduce = createSlice({
  name: "marcheIms",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* marcheImsAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "marcheIms/addMarcheIms", {
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

    [fetchMarcheIms.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchMarcheIms.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchMarcheIms.rejected]: (state, action) => {
      state.loading = false;
    },
    [marcheImsGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [marcheImsGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [marcheImsGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { marcheImsAdded } = marcheImsReduce.actions; */

export default marcheImsReduce.reducer;
