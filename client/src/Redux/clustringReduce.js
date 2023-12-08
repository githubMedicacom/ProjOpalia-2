import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchClustring = createAsyncThunk("clustering/fetchClustring", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "clustering/getDonnees", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    /* body: JSON.stringify({a: 1, b: 'Textual content'}) */
  });
  const clustring = await response.json();
  return clustring;
});
export const fetchAction = createAsyncThunk("clustering/fetchAction", async (segment) => {
  const response = await fetch(Configuration.BACK_BASEURL + "clustering/actions", {
    method: 'POST',
    headers: {
      'segment':segment,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    /* body: JSON.stringify({a: 1, b: 'Textual content'}) */
  });
  const clustring = await response.json();
  return clustring;
});

export const fetchSegment = createAsyncThunk("clustering/fetchSegment", async (segment) => {
  const response = await fetch(Configuration.BACK_BASEURL + "clustering/getSegmentAction", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify({segment:segment})
  });
  const clustring = await response.json();
  return clustring;
});

const clustringReduce = createSlice({
  name: "clustring",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    clustringAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "clustering/addClustrings", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action.payload)
      });
    },
  },
  extraReducers: {
    [fetchClustring.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchClustring.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [state.entities, action.payload];
    },
    [fetchClustring.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [fetchAction.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchSegment.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [fetchSegment.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { clustringAdded } = clustringReduce.actions;

export default clustringReduce.reducer;
