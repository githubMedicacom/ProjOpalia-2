import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");
export const getByAction = createAsyncThunk("messageries/getByAction", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "messageries/getByAction", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const messageries = await response.json();
  return messageries;
});
export const getMessageByLine = createAsyncThunk("messageries/getMessageByLine", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "messageries/getMessageByLine", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const messageries = await response.json();
  return messageries;
});
export const saveMessage = createAsyncThunk("messageries/getMessageByLine", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "messageries/ajout", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const messageries = await response.json();
  return messageries;
});
const messageriesReduce = createSlice({
  name: "messageries",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* saveMessage(state, action) {
      fetch(Configuration.BACK_BASEURL + "messageries/ajout", {
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
  },
});

/* export const { saveMessage } = messageriesReduce.actions; */

export default messageriesReduce.reducer;
