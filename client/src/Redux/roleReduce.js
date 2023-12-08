import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchRole = createAsyncThunk("role/fetchRole", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "role/allRole", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const role = await response.json();
  return role;
});

export const roleGetById = createAsyncThunk("role/roleGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "role/getRole", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const role = await response.json();
  return role;
});
const roleReduce = createSlice({
  name: "role",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    roleAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "role/addRole", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    roleUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "role/addRole", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    roleDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "role/deleteRole/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
    },

  },
  extraReducers: {

    [fetchRole.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchRole.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchRole.rejected]: (state, action) => {
      state.loading = false;
    },
    [roleGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [roleGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [roleGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { roleAdded, roleUpdated, roleDeleted } = roleReduce.actions;

export default roleReduce.reducer;
