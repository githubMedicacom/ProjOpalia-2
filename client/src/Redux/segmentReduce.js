import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchSegment = createAsyncThunk("segment/fetchSegment", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "segment/allSegment", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const segment = await response.json();
  return segment;
});

export const segmentGetById = createAsyncThunk("segment/segmentGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "segment/getSegment", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const segment = await response.json();
  return segment;
});

export const segmentDeleted = createAsyncThunk("segment/segmentDeleted", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "segment/delete/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const segment = await response.json();
  return segment;
});

export const getSegmentsApi = createAsyncThunk("segment/getSegmentsApi", async (action) => {
  
  const response = await fetch(Configuration.BACK_BASEURL + "segment/getSegmentsApi", {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const document = await response.json();
  return document;
});

export const getLigneSegments = createAsyncThunk("segment/getLigneSegments", async (action) => {  
  const response = await fetch(Configuration.BACK_BASEURL + "segment/getLigneSegments/"+action.id+"/"+action.idPrincipal, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const document = await response.json();
  return document;
});

export const getCltSegProd = createAsyncThunk("segment/getCltSegProd", async () => {  
  const response = await fetch(Configuration.BACK_BASEURL + "segment/getCltSegProd", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const document = await response.json();
  return document;
});
export const getClientSegmentById = createAsyncThunk("segment/getClientSegmentById", async (action) => {  
  const response = await fetch(Configuration.BACK_BASEURL + "segment/getClientSegmentById", {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const document = await response.json();
  return document;
});
export const getAllClientSeg = createAsyncThunk("segment/getAllClientSeg", async (action) => {  
  const response = await fetch(Configuration.BACK_BASEURL + "segment/getAllClientSeg", {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const document = await response.json();
  return document;
});
export const getPharmacieSegment = createAsyncThunk("segment/getPharmacieSegment", async (action) => {  
  const response = await fetch(Configuration.BACK_BASEURL + "segment/getPharmacieSegment", {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const document = await response.json();
  return document;
});
const segmentReduce = createSlice({
  name: "segment",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    segmentAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "segment/addSegment", {
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

    [fetchSegment.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchSegment.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchSegment.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { segmentAdded } = segmentReduce.actions;

export default segmentReduce.reducer;
