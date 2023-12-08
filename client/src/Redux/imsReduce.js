import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";

var token = localStorage.getItem("x-access-token");
export const fetchIms = createAsyncThunk("ims/fetchIms", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "ims/allIms", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const ims = await response.json();
  return ims;
});
export const getActiveIms = createAsyncThunk("ims/getActiveIms", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "ims/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const ims = await response.json();
  return ims;
});
export const getDetailsims = createAsyncThunk("ims/getDetailsims", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ims/getDetailsims", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const ims = await response.json();
  return ims;
});
export const getLastDetail = createAsyncThunk("ims/getLastDetail", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ims/getLastDetail", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const ims = await response.json();
  return ims;
});

export const imsGetById = createAsyncThunk("ims/imsGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "ims/getIms", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const ims = await response.json();
  return ims;
});
export const imsChangeEtat = createAsyncThunk("ims/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ims/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const ims = await response.status;
  return ims;
});
export const imsAdded = createAsyncThunk("ims/addIms", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "ims/addIms", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const ims = await response.json();
  return ims;
});
const imsReduce = createSlice({
  name: "ims",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* imsAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "ims/addIms", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */
    addcsvims(state, action) {
      fetch(Configuration.BACK_BASEURL + "ims/addcsvims", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    deleteDetailIms(state, action) {
      const id  = action.payload;
      fetch(Configuration.BACK_BASEURL + "ims/deleteDetail/"+id, {
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

    [fetchIms.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchIms.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchIms.rejected]: (state, action) => {
      state.loading = false;
    },
    [imsGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [imsGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [imsGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { addcsvims,deleteDetailIms } = imsReduce.actions;

export default imsReduce.reducer;
