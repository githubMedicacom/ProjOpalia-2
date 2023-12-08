import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");


export const fetchAction = createAsyncThunk("actionComerciale/allAction", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/allAction", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  
  });
  const resultat = await response.json();
  return resultat;
});
export const getActionCloturer = createAsyncThunk("actionComerciale/allActionCloturer", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/allActionCloturer", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  
  });
  const resultat = await response.json();
  return resultat;
});
export const getActionByYear = createAsyncThunk("actionComerciale/getActionByYear", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/getActionByYear", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  
  });
  const resultat = await response.json();
  return resultat;
});
export const getDelegueByAction = createAsyncThunk("actionComerciale/getDelegueByAction", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/getDelegueByAction/"+id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const resultat = await response.json();
  return resultat;
});

export const getActionById = createAsyncThunk("actionComerciale/getActionById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/getActionById/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const action = await response.json();
  return action;
});



export const getActionUgById = createAsyncThunk("actionComerciale/getActionUgById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/getActionUgById/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const action = await response.json();
  return action;
});



export const getActionByLine = createAsyncThunk("actionComerciale/getActionByLine", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/getActionByLine/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const action = await response.json();
  return action;
});

export const getObjectifById = createAsyncThunk("actionComerciale/getObjectifById", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/getObjectifById/"+action.id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const objectif = await response.json();
  return objectif;
});

export const getObjectifDelegueById = createAsyncThunk("actionComerciale/getObjectifDelegueById", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/getObjectifDelegueById/"+action.id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const objectif = await response.json();
  return objectif;
});
export const actionChangeEtat = createAsyncThunk("actionComerciale/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "actionComerciale/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const objectif = await response.status;
  return objectif;
});
const actionReduce = createSlice({
  name: "action",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    actionAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "actionComerciale/addAction", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },

  },
  extraReducers: {

    [fetchAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchAction.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { actionAdded } = actionReduce.actions;

export default actionReduce.reducer;
