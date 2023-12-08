import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const saveExcel = createAsyncThunk("excel/saveExcel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "excel/saveExcel", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const excel = await response.json();
  return excel;
});
export const verifNumBl = createAsyncThunk("excel/verifNumBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "excel/verifNumBl", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
const excelReduce = createSlice({
  name: "excel",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {},
});

export default excelReduce.reducer;
