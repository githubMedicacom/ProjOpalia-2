import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const getNotification = createAsyncThunk("notification/getNotification", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "notification/getNotification", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const notif = await response.json();
  return notif;
});

export const updateNotif = createAsyncThunk("notification/update", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "notification/update/"+action.id+"/"+action.idUser, {
    /* method: 'PUT', */
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const notif = await response.json();
  return notif;
});


const notificationReduce = createSlice({
  name: "notification",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* updateNotif(state, action) {
      fetch(Configuration.BACK_BASEURL + "notification/update/"+action.payload.id+"/"+action.payload.idUser, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    }, */
  },
  extraReducers: {

    [getNotification.pending]: (state, action) => {
      state.loading = true;
    },
    [getNotification.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [getNotification.rejected]: (state, action) => {
      state.loading = false;
    },
    
  },
});

/* export const { updateNotif } = notificationReduce.actions; */

export default notificationReduce.reducer;
