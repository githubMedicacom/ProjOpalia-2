import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";

export const fetchRootBase = createAsyncThunk("root/fetchRootBase", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "root/allRoot", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

  });
  const rootBase = await response.json();
  return rootBase;
});

export const getRootByRole = createAsyncThunk("root/getRootByRole", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "root/getRootByRole/"+action.idrole+"/"+action.type, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

  });
  const rootBase = await response.json();
  return rootBase;
});

export const rootGetById = createAsyncThunk("root/rootGetById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "root/getRoot/"+id, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  
  });
  const rootBase = await response.json();
  return rootBase;
});
const rootBaseReduce = createSlice({
  name: "rootBase",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    rootBaseAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "root/addRoot", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action.payload)
      });
    },
    rootBaseDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "root/deleteRoot/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
    },

  },
  extraReducers: {

    [fetchRootBase.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchRootBase.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchRootBase.rejected]: (state, action) => {
      state.loading = false;
    },
    [getRootByRole.pending]: (state, action) => {
      state.loading = true;
    },
    [getRootByRole.fulfilled]: (state, action) => {
      state.loading = false;
      state.rootBase = [...state.entities, action.payload];
    },
    [getRootByRole.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { rootBaseAdded, rootBaseDeleted } = rootBaseReduce.actions;

export default rootBaseReduce.reducer;
