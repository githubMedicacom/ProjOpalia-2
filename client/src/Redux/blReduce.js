import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

//api scander
export const extractionsBL = createAsyncThunk("bl/fetchBl", async (action) => {
  const response = await fetch(Configuration.API_BASEURL, {
    method: "POST",
    headers: { Accept: "application/*" },
    body: action,
  });
  const bl = await response.json();
  return bl;
});

export const thumbnail = createAsyncThunk("bl/thumbnail", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/thumbnail", {
    method: "Post",
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

export const getBlById = createAsyncThunk("bl/getBlById", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlById/"+id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});

//Tableau recupulatif donnèes BL
export const tableProduits = createAsyncThunk("bl/tableProduits", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/tableProduits", {
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

//getAllAnneeLignesBL
export const getAllAnneeLignesBL = createAsyncThunk("bl/getAllAnneeLignesBL", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllAnneeLignesBL", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});

//verification si numero bl existe ou non
export const blVerif = createAsyncThunk("bl/blVerif", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/blVerif", {
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

//getBl pour validation
export const getBl = createAsyncThunk("bl/getBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBl", {
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

//getBl annuler
export const getBlAnnuler = createAsyncThunk("bl/getBlAnnuler", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlAnnuler", {
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

//getBl pour validation commercial
export const getBlComm = createAsyncThunk("bl/getBlComm", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlComm", {
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

//getBl pour visualisation
export const getBlVis = createAsyncThunk("bl/getBlVis", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlVis", {
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

export const getAllClientBl = createAsyncThunk("bl/getAllClientBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllClientBl", {
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

//filtre delegue
export const getAllDelegueBl = createAsyncThunk("bl/getAllDelegueBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllDelegueBl", {
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

//filtre secteur
export const getAllSecteurBl = createAsyncThunk("bl/getAllSecteurBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllSecteurBl", {
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

//filtre produit
export const getAllProduitBl = createAsyncThunk("bl/getAllProduitBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllProduitBl", {
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
export const getAllProdFourBl = createAsyncThunk("bl/getAllProdFourBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllProdFourBl", {
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

//filtre marche
export const getAllMarcheBl = createAsyncThunk("bl/getAllMarcheBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllMarcheBl", {
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

//filtre fournisseur
export const getFournisseurBl = createAsyncThunk("bl/getFournisseurBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getFournisseurBl", {
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

//filtre pharmacie
export const getAllParmacieBl = createAsyncThunk("bl/getAllParmacieBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllParmacieBl", {
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
export const getAllParmaParFour = createAsyncThunk("bl/getAllParmaParFour", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllParmaParFour", {
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

//filtre marche from detail
export const getMarcheFromDetail = createAsyncThunk("bl/getMarcheFromDetail", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getMarcheFromDetail", {
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

//filtre ims
export const getAllImsBl = createAsyncThunk("bl/getAllImsBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllImsBl", {
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

//filtre pack
export const getAllPackBl = createAsyncThunk("bl/getAllPackBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getAllPackBl", {
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

//comparaisonMarcheIms
export const comparaisonMarcheIms = createAsyncThunk("bl/comparaisonMarcheIms", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/comparaisonMarcheIms", {
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

//comparaisonImsBricks
export const comparaisonImsBricks = createAsyncThunk("bl/comparaisonImsBricks", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/comparaisonImsBricks", {
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

//getDetailBl
export const getDetailBl = createAsyncThunk("bl/getDetailBl", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getDetailBl/"+id, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});

//upload BL file
export const saveFile = createAsyncThunk("bl/saveFile", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/saveFile", {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token,
    },
    body:action
  });
  const bl = await response.json();
  return bl;
});
export const saveFile64 = createAsyncThunk("bl/saveFile64", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/saveFile64", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
export const saveFileContraste = createAsyncThunk("bl/saveFileContraste", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/saveFileContraste", {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token,
    },
    body:action
  });
  const bl = await response.json();
  return bl;
});
export const sendFileImage = createAsyncThunk("bl/sendFileImage", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/sendFileImage", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});

//changerEtat
export const blChangeEtat = createAsyncThunk("bl/changerEtat", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/changeEtat", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
export const numeroUpdate = createAsyncThunk("bl/updateNum", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/updateNum/"+action.id, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
export const payerOpalia = createAsyncThunk("bl/payerOpalia", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/payerOpalia/"+action.id, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
/* export const payer = createAsyncThunk("bl/payer", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/payer/"+action.idBl, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
}); */

//getFile
export const getFileBl = createAsyncThunk("bl/getFile", async (file) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getFile/"+file, {
    method: "GET",
    responseType: "blob",    
  }).then(response => response.blob())
  .then(function(myBlob) {
    return((myBlob))
  })
  .catch((error) => {
    console.log(error);
  })
  const files = await response;
  return files;
});
//getBlPayer
export const getDechargeBl = createAsyncThunk("bl/getDecharge", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getDecharge/"+id, {
    method: "GET",
    responseType: "blob",    
  }).then(response => response.blob())
  .then(function(myBlob) {
    return((myBlob))
  })
  .catch((error) => {
    console.log(error);
  })
  const files = await response;
  return files;
});
/* export const getDecharge = createAsyncThunk("bl/getDecharge", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getDecharge/"+id, {
    method: "GET",
    responseType: "blob",    
    type: "application/*",
    //Force to receive data in a Blob Format
  }).then(response =>{{ response.blob()}})
  .then(function(myBlob) {
    return((myBlob))
  })
  .catch((error) => {
    console.log(error);
  })
  const files = await response;
  return files;
}); */
/* export const getDecharge = createAsyncThunk("bl/getDecharge", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getDecharge/" + id, {
    method: "GET",
    responseType: "blob",
    //Force to receive data in a Blob Format
  })
  .then((response) => {
    return response.url;
  })
  .catch((error) => {
    console.log(error);
  })
  const files = await response;
  return files;
}); */
export const exportBlPayment = createAsyncThunk("bl/exportBlPayment", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/exportBlPayment", {
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
export const getBlPayer = createAsyncThunk("bl/getBlPayer", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlPayer", {
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
export const totalCaByPack = createAsyncThunk("bl/totalCaByPack", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/totalCaByPack", {
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
export const getExport = createAsyncThunk("bl/getExport", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getExport", {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});
export const exportBl = createAsyncThunk("bl/exportBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/exportBl", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
export const blAdded = createAsyncThunk("bl/addBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/addBl", {
    method: 'POST',
    headers: {          
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
/* export const saveDecharge = createAsyncThunk("bl/saveDecharge", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/saveDecharge", {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token
    },
    body:action.fileArray
  });
  const bl = await response.json();
  return bl;
}); */

export const saveDechargeBl = createAsyncThunk("bl/saveDecharge", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/saveDecharge/"+action.idBl, {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token
    },
    body:action.fileArray
  });
  const bl = await response.json();
  return bl;
});
export const updateDecharge = createAsyncThunk("bl/updateDecharge", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/updateDecharge/"+action.idBl, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
export const removeDecharge = createAsyncThunk("bl/removeDecharge", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/removeDecharge/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const bl = await response.json();
  return bl;
});
/* saveDecharge(state, action) {
      
  fetch(Configuration.BACK_BASEURL + "bl/saveDecharge/"+action.payload.idBl, {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token
    },
    body:action.payload.fileArray
  });
} */

/* export const getBlByPackClient = createAsyncThunk("bl/getBlByPackClient", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlByPackClient/"+action.idClient+"/"+action.idAction+"/"+action.idUser+"/"+action.idRole+"/"+action.root, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
}); */
export const getBlByPackClient = createAsyncThunk("bl/getBlByPackClient", async (action) => {
  var idClient = action.idClient;
  var idAction = action.idAction;
  var idUser = action.idUser;
  var idRole = action.idRole;
  var root = action.root;
  var month_d = action.month_d;
  var month_f = action.month_f;
  var year_d = action.year_d;
  var year_f = action.year_f;
  var mnt = action.mnt;
  const response = await fetch(Configuration.BACK_BASEURL + `bl/getBlByPackClient/${idClient}/${idAction}/${idUser}/${idRole}/${root}/${month_d}/${month_f}/${year_d}/${year_f}/${mnt}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});

export const getDetailCommande = createAsyncThunk("bl/getDetailCommande", async (action) => {
  var id = action.id;
  var mnt = action.mnt;
  var idAction = action.idAction;
  var idClient = action.idClient;  
  var idUser = action.idUser;
  var idRole = action.idRole;
  const response = await fetch(Configuration.BACK_BASEURL + `bl/getDetailCommande/${id}/${mnt}/${idAction}/${idClient}/${idUser}/${idRole}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});

export const exportExcelSpontanee = createAsyncThunk("bl/exportExcelSpontanee", async (action) => {
  var idClient = action.idClient;
  var annee = action.annee;
  const response = await fetch(Configuration.BACK_BASEURL + `bl/exportExcelSpontanee/${idClient}/${annee}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});
export const updateBl = createAsyncThunk("bl/updateBl", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/updateBl/"+action.idBl, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body:JSON.stringify(action)
  });
  const bl = await response.json();
  return bl;
});
export const getBlByClientId = createAsyncThunk("bl/getBlByClientId", async (action) => {
  var idClient = action.idClient;
  var idAction = action.idAction;
  var month_d = action.month_d;
  var month_f = action.month_f;
  var year_d = action.year_d;
  var year_f = action.year_f;
  const response = await fetch(Configuration.BACK_BASEURL + `bl/getBlByClientId/${idClient}/${idAction}/${month_d}/${month_f}/${year_d}/${year_f}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});

export const getBlByCmd = createAsyncThunk("bl/getBlByCmd", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlByCmd/"+id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});

export const getBlByClientRest = createAsyncThunk("bl/getBlByClientRest", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/getBlByClientRest/"+action.idAction+"/"+action.idClient+"/"+action.trimestreVal, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  const status = await response.status;
  var obj = {status:status, bl:bl}
  return obj;
});

export const getBlByPackSpontanee = createAsyncThunk("bl/getBlByPackSpontanee", async (action) => {
  var idClient = action.idClient;
  var idAction = action.idAction;
  var idRole = action.idRole;
  var idLine = action.idLine;
  var idUser = action.idUser;
  var annee = action.annee;
  const response = await fetch(Configuration.BACK_BASEURL + `bl/getBlByPackSpontanee/${idAction}/${idClient}/${idRole}/${idLine}/${idUser}/${annee}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  const status = await response.status;
  var obj = { status:status, bl:bl }
  return obj;
});

export const getBlByCmdSpontanee = createAsyncThunk("bl/getBlByCmdSpontanee", async (action) => {
  var idClient = action.idClient;
  var idAction = action.idAction;
  var idUser = action.idUser;
  var idRole = action.idRole;
  const response = await fetch(Configuration.BACK_BASEURL + `bl/getBlByCmdSpontanee/${idClient}/${idAction}/${idUser}/${idRole}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  const status = await response.status;
  var obj = { status:status, bl:bl }
  return obj;
});

export const verifBlByCLient = createAsyncThunk("bl/verifBlByCLient", async (action) => {
  var idClient = action.idClient;
  var idAction = action.idAction;
  var idUser = action.idUser;
  const response = await fetch(Configuration.BACK_BASEURL + `bl/verifBlByCLient/${idClient}/${idAction}/${idUser}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const bl = await response.json();
  return bl;
});
export const commandeValide = createAsyncThunk("bl/commandeValide", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "bl/commandeValide", {
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
const blReduce = createSlice({
  name: "bl",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* blAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "bl/addBl", {
        method: 'POST',
        headers: {          
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body:JSON.stringify(action.payload)
      });
    }, */
    /* exportBl(state, action) {
      fetch(Configuration.BACK_BASEURL + "bl/exportBl", {
        method: 'POST',
        headers: {          
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body:JSON.stringify(action.payload)
      });
    }, */
    blDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "bl/delete/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    },
    
    /* saveDecharge(state, action) {
      
      fetch(Configuration.BACK_BASEURL + "bl/saveDecharge/"+action.payload.idBl, {
        method: 'POST',
        headers: {
          'Accept': 'application/*',
          'x-access-token':token
        },
        body:action.payload.fileArray
      });
    }, */
  },
  extraReducers: {
    [extractionsBL.pending]: (state, action) => {
      state.loading = true;
    },
    [extractionsBL.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [extractionsBL.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { blDeleted } = blReduce.actions;

export default blReduce.reducer;
