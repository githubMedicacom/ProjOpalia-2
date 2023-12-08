import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const loginFetch = createAsyncThunk("user/login", async (payload) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/login", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },    
    body: JSON.stringify(payload)
  });
  const users = await response.json();
  return users;
});

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/allUser", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const users = await response.json();
  return users;
});

export const getActiveUser = createAsyncThunk("user/getActiveUser", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});

export const getActiveDelegue = createAsyncThunk("user/getActiveDelegue", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getActiveDelegue", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});

export const getDelegueByLine = createAsyncThunk("user/getDelegueByLine", async (line) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getDelegueByLine/"+line, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});

export const getSuperviseur = createAsyncThunk("user/getSuperviseur", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getSuperviseur", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});

export const getDelegueByLineAction = createAsyncThunk("user/getDelegueByLineAction", async (line) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getDelegueByLineAction/"+line, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});

export const userGetById = createAsyncThunk("user/userGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "user/getUser", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const userBase = await response.json();
  return userBase;
});

export const userChangeEtat = createAsyncThunk("user/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const user = await response.status;
  return user;
});

export const userAdded = createAsyncThunk("user/addUser", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/addUser", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const user = await response.json();
  return user;
});
const usersReduce = createSlice({
  name: "users",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* userAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "user/addUser", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */
    
    profilUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "user/updateProfile", {
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
    [fetchUsers.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchUsers.rejected]: (state, action) => {
      state.loading = false;
    },
    [loginFetch.pending]: (state, action) => {
      state.loading = true;
    },
    [loginFetch.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [loginFetch.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { profilUpdated } = usersReduce.actions;

export default usersReduce.reducer;
