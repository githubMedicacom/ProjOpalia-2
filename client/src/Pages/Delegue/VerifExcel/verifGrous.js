export async function verifGrous(id, rows, mois, annee, template, type) {
  // Register Service Worker
  if (template === 1) return verifDefault(rows);
  if (id === 43) return verifProphasud(rows);
  if (id === 13) return verifCopropha(rows, mois);
  if (id === 46) return verifKarray(rows);
  if (id === 17) return verifCentre(rows);
  if (id === 16) return verifKioropha(rows, type);
  if (id === 45) return verifMediGros(rows);
  if (id === 34) return verifGzPharma(rows);
  if (id === 47) return verifDistrimed(rows);
  if (id === 41) return verifCab(rows, mois);
  if (id === 12) return verifCotupha(rows, mois, annee);
  if (id === 40) return verifCophadis(rows, mois);
  if (id === 28) return verifChirgui(rows, mois);
  if (id === 48) return verifCogepha(rows, mois, annee);
  if (id === 50) return verifSm(rows, mois, annee);
  if (id === 23) return verifCopharma(rows, mois);
  if (id === 44 || id === 38) return verifKair(rows, mois, annee);
  if (id === 11) return verifMedicaK(rows, mois, annee);
  return verifDefault(rows);
}

//bech na3mlo reformulation lil forme mte3 date
function setFormatDate(d) {
  var formatDate = null;
  d = d.toString();
  if (d !== "" && d !== null) {
    var str = d.replaceAll("/", "");
    if (isNaN(str.trim()) === false) {
      var pos = d.indexOf("/");
      var dataFormat = "";
      var dateTrime = "";
      var dataSplit = "";
      if (pos !== -1) {
        dateTrime = d.trim();
        dataSplit = dateTrime.split("/");
        if (dataSplit.length === 3)
          dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0];
        else dataFormat = dataSplit[1] + "-" + dataSplit[0] + "-01";
      } else {
        dateTrime = d.trim();
        dataSplit = dateTrime.split("-");
        if (dataSplit.length === 3)
          dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0];
        else dataFormat = dataSplit[1] + "-" + dataSplit[0] + "-01";
        /* dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0]; */
      }
      var newDate = new Date(dataFormat);
      if (newDate === "Invalid Date") formatDate = null;
      else formatDate = dataFormat;
    }
  }
  return formatDate;
}

//Template excel CENTRA NORD BIZERTE
function verifCentre(rows) {
  var array = [];
  for (let index = 6; index < rows.length; index++) {
    const row = rows[index];
    var code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    array.push({
      designation: row[2] ? row[2].trim() : "",
      stock: row[3] !== undefined && row[3] ? row[3] : 0,
      vente: row[4] !== undefined && row[4] ? row[4] : 0,
      code: code,
      idProduit: null,
      date: "N/A",
    });
  }
  return array;
}

//  Template excel MEDIGROS
function verifMediGros(rows) {
  var array = [];
  rows.slice(1).map((row) => {
    if (row && row !== "undefined") {
      array.push({
        code: row[0],
        designation: row[1] ? row[1].trim() : "",
        date: row[2] !== undefined && row[2] ? row[2].trim() : "N/A",
        vente: 0,
        stock: row[3] !== undefined && row[3] ? row[3] : 0,
        idProduit: null,
      });
    }
    return true;
  });
  return array;
}

//  Template excel GZ PHARMA
function verifGzPharma(rows) {
  var array = [];
  rows.slice(1).map((row) => {
    if (row && row !== "undefined") {
      array.push({
        code: row[0],
        designation: row[1] ? row[1].trim() : "",
        date: "N/A",
        vente: row[4] !== undefined && row[4] ? row[4] : 0,
        stock: row[5] !== undefined && row[5] ? row[5] : 0,
        idProduit: null,
      });
    }
    return true;
  });
  return array;
}

//Template excel KAPROPHA
function verifKarray(rows) {
  var array = [];
  var header = [];
  var indexLigne = 0;

  var keyVente = 0;
  var keyStock = 0;

  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if (row[0] !== undefined) {
      if (row[0].toString().toLowerCase().trim() == "description") {
        indexLigne = index;
      }
    }
  }
  header = rows[indexLigne];
  if (header.length > 0)
    header.forEach((val, key1) => {
      var variable = "VENTE";
      if (val.trim() === variable) keyVente = key1;
      var variable = "Stock";
      if (val.trim() === variable) keyStock = key1;
    });

  rows.slice(1).map((row, index) => {
    let code = "";
    if (
      row &&
      row !== "undefined" &&
      row[0] !== "Description" &&
      row[0] &&
      row.length > 0
    ) {
      array.push({
        designation: row[0].trim(),
        stock: row[keyStock] !== undefined && row[keyStock] ? row[keyStock] : 0,
        vente: row[keyVente] !== undefined && row[keyVente] ? row[keyVente] : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

//Template excel Prophasud
function verifProphasud(rows) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (row && row !== "undefined" && row[2] !== undefined) {
      array.push({
        designation: row[2],
        stock: row[7] !== undefined && row[7] ? row[7] : 0,
        vente: row[6] !== undefined && row[6] ? row[6] : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

//Template excel Kioropha
function verifKioropha(rows, type) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    var vente =
      parseInt(type) === 0
        ? row[2]
        : parseInt(type) === 2
        ? row[1] !== undefined && row[1]
          ? row[1]
          : 0
        : 0;
    var stock =
      parseInt(type) === 0
        ? row[1]
        : parseInt(type) === 1
        ? row[1] !== undefined && row[1]
          ? row[1]
          : 0
        : 0;
    if (row && row !== "undefined" && row[0] !== "Total général") {
      array.push({
        designation: row[0],
        stock: stock,
        vente: vente,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

//Template excel Distrimed
function verifDistrimed(rows) {
  console.log('hechem')
  console.log(rows)
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (
      row &&
      row !== "undefined" &&
      row.length !== 0 &&
      row[0] !== "Réf. Interne"
    ) {
      array.push({
        designation: row[1],
        stock: parseInt(row[2]) + parseInt(row[4]),
        vente: parseInt(row[3]) + parseInt(row[5]),
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

//Template excel Cotupha
function verifCotupha(rows, mois, annee) {
  var array = [];
  var header = [];
  rows.map((row, index) => {
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    var keyVente = 0;
    if (header.length === 0 && row[0].toLowerCase() !== "cotupha") header = row;
    if (header.length > 0)
      header.forEach((val, key1) => {
        var variable = "Vente" + annee + "-" + mois;
        if (val === variable) keyVente = key1;
      });
    if (row[0] !== "Code" && header.length > 0) {
      array.push({
        designation: row[1],
        stock: row[3] !== undefined && row[3] ? row[3] : 0,
        vente:
          keyVente > 0 && row[keyVente] && row[keyVente] !== undefined
            ? row[keyVente]
            : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

//Template excel Cophadis
function verifCophadis(rows, mois) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row[1] !== undefined)
      code =
        typeof row[1] == "string"
          ? row[1].replaceAll(" ", "")
          : row[1].toString();
    if (
      row &&
      row !== "undefined" &&
      row[0] !== "() Totaux :" &&
      row[0] !== "Designation"
    ) {
      array.push({
        designation: row[0],
        stock: row[2] !== undefined && row[2] ? row[2] : 0,
        vente:
          row[2 + parseInt(mois)] !== undefined && row[2 + parseInt(mois)]
            ? row[2 + parseInt(mois)]
            : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

//Template excel COPROPHA
function verifCopropha(rows, mois) {
  // var array = [];
  // var header = [];
  // var keyVente = 0;
  // var keyStock = 0;
  // var indexLigne = 0;
  // var test = false;
  // var keyCode = 0;
  // for (let index = 0; index < rows.length; index++) {
  //   var row = rows[index];
  //   if (row[0] !== undefined) {
  //     if (row[0].toString().toLowerCase().trim() == "designation") {
  //       console.log('hechem')
  //       indexLigne = index;
  //       test = true;
  //     }
  //   }
  // }

  // if (test === false) {
  //   for (let index = 0; index < rows.length; index++) {
  //     var row = rows[index];
  //     if (row[2] !== undefined) {
  //       if (row[2].toString().trim() == "STK") {
  //         indexLigne = index;
  //       }
  //     }
  //   }
  // }
  

  // header = rows[indexLigne];
  // if (header.length > 0) {
  //   for (const key1 in header) {
  //     var val = header[key1];

  //     var variable = "";
  //     switch (parseInt(mois)) {
  //       case 1:
  //         variable = "M01";
  //         break;
  //       case 2:
  //         variable = "M02";
  //         break;
  //       case 3:
  //         variable = "M03";
  //         break;
  //       case 4:
  //         variable = "M04";
  //         break;
  //       case 5:
  //         variable = "M05";
  //         break;
  //       case 6:
  //         variable = "M06";
  //         break;
  //       case 7:
  //         variable = "M07";
  //         break;
  //       case 8:
  //         variable = "M08";
  //         break;
  //       case 9:
  //         variable = "M09";
  //         break;
  //       case 10:
  //         variable = "M10";
  //         break;
  //       case 11:
  //         variable = "M11";
  //         break;
  //       case 12:
  //         variable = "M12";
  //         break;
  //       default:
  //         break;
  //     }
  //     if (val.replaceAll(" ", "") === variable) keyVente = parseInt(key1);
  //     if (val.toString().toLowerCase().trim() === "code")
  //       keyCode = parseInt(key1);

  //     if (val.toString().trim() === "STK") keyStock = parseInt(key1);
  //   }
  // }

  // for (let index = indexLigne + 1; index < rows.length; index++) {
  //   const row = rows[index];

  //   /* if (header.length === 0) {
  //     header = row;
  //   } */
  //   let code =
  //     typeof row[keyCode] !== "undefined"
  //       ? row[keyCode].toString().replace(/\s+/g, "")
  //       : "";
  //   let vente =
  //     typeof row[keyVente] !== "undefined"
  //       ? row[keyVente].toString().replace(/\s+/g, "")
  //       : 0;

  //   let stock =
  //     typeof row[keyStock] !== "undefined"
  //       ? row[keyStock].toString().replace(/\s+/g, "")
  //       : 0;

  //   if (row && row !== "undefined" && header.length > 0) {
  //     array.push({
  //       designation: test === false ? row[1] : row[0],
  //       stock:
  //         test === false
  //           ? keyStock > 0
  //             ? typeof row[keyStock] !== "undefined"
  //               ? stock
  //               : 0
  //             : 0
  //           : typeof row[1] !== "undefined"
  //           ? row[1].toString().replace(/\s+/g, "")
  //           : 0,
  //       vente:
  //         keyVente > 0 ? (typeof row[keyVente] !== "undefined" ? vente : 0) : 0,
  //       code:
  //         test === false
  //           ? row[0]
  //           : keyCode > 0
  //           ? typeof row[keyCode] !== "undefined"
  //             ? code
  //             : ""
  //           : "",
  //       idProduit: null,
  //       date: "N/A",
  //     });
  //   }
  // }
  //return array;



  var array = [];
  var header = [];
  var keyVente = 0;
  var keyStock = 0;
  var indexLigne = 0;
  var test = false;
  var keyCode = 0;
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if (row[0] !== undefined) {
      if (row[0].toString().toLowerCase().trim() == "opalia") {
        indexLigne = index;
        test = true;
      }
    }
  }



  header = rows[indexLigne + 1];
  if (header.length > 0) {
    for (const key1 in header) {
      var val = header[key1];
      var variable = "";
      switch (parseInt(mois)) {
        case 1:
          variable = "M01";
          break;
        case 2:
          variable = "M02";
          break;
        case 3:
          variable = "M03";
          break;
        case 4:
          variable = "M04";
          break;
        case 5:
          variable = "M05";
          break;
        case 6:
          variable = "M06";
          break;
        case 7:
          variable = "M07";
          break;
        case 8:
          variable = "M08";
          break;
        case 9:
          variable = "M09";
          break;
        case 10:
          variable = "M10";
          break;
        case 11:
          variable = "M11";
          break;
        case 12:
          variable = "M12";
          break;
        default:
          break;
      }
      if (val.replaceAll(" ", "") === variable) keyVente = parseInt(key1);
      if (val.toString().toLowerCase().trim() === "code")
        keyCode = parseInt(key1);

      if (val.toString().trim() === "STK") keyStock = parseInt(key1);
    }
  }

  for (let index = indexLigne + 2; index < rows.length; index++) {
    const row = rows[index];
  // console.log(row)
    /* if (header.length === 0) {
      header = row;
    } */
    // let code =
    //   typeof row[0] !== "undefined"
    //     ? row[0].toString().replace(/\s+/g, "")
    //     : "";
    let vente =
      typeof row[keyVente] !== "undefined"
        ? row[keyVente].toString().replace(/\s+/g, "")
        : 0;

    // let stock =
    //   typeof row[3] !== "undefined"
    //     ? row[keyStock].toString().replace(/\s+/g, "")
    //     : 0;

    if (row && row !== "undefined" && header.length > 0) {
      array.push({
        designation: row[1],
        stock:
        row[3],
        vente:
          keyVente > 0 ? (typeof row[keyVente] !== "undefined" ? vente : 0) : 0,
        code:
        row[0],
        idProduit: null,
        date: "N/A",
      });
    }
  }
  return array;
}


function verifCopharma(rows, mois) {
  var array = [];
  var header = [];
  var keyVente = 0;
  var indexLigne = 0;
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if (row[0] !== undefined) {
      if (row[0].toString() == "CO PHAR MA") {
        indexLigne = index;
      }
    }
  }
  header = rows[indexLigne];
  if (header.length > 0) {
    for (const key1 in header) {
      var val = header[key1];

      var variable = "";
      switch (parseInt(mois)) {
        case 1:
          variable = "janvier";
          break;
        case 2:
          variable = "février";
          break;
        case 3:
          variable = "mars";
          break;
        case 4:
          variable = "avril";
          break;
        case 5:
          variable = "mai";
          break;
        case 6:
          variable = "juin";
          break;
        case 7:
          variable = "juillet";
          break;
        case 8:
          variable = "aout";
          break;
        case 9:
          variable = "septembre";
          break;
        case 10:
          variable = "octobre";
          break;
        case 11:
          variable = "novembre";
          break;
        case 12:
          variable = "decembre";
          break;
        default:
          break;
      }
      if (val.replaceAll(" ", "") === variable) keyVente = parseInt(key1);

    }
  }
  for (let index = indexLigne + 1; index < rows.length; index++) {
    const row = rows[index];
    let code = "";
    let vente =
      typeof row[keyVente] !== "undefined"
        ? row[keyVente].toString().replace(/\s+/g, "")
        : 0;
      array.push({
        designation: row[0], 
        code : code ,
        stock: row[1] !== undefined && row[1] ? row[1] : 0,
        vente:
          keyVente > 0 ? (typeof row[keyVente] !== "undefined" ? vente : 0) : 0,
        idProduit: null,
        date: "N/A",
      });
    
  }
  return array;
}

//Template excel COPROPHA
function verifCab(rows, mois) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (row && row !== "undefined" && row[0] !== "Article") {
      array.push({
        designation: row[1],
        stock: row[2] !== undefined && row[2] ? row[2] : 0,
        vente:
          row[2 + parseInt(mois)] && row[2 + parseInt(mois)] !== undefined
            ? row[2 + parseInt(mois)]
            : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

// template excel STE CAB DE PHAR
function verifCogepha(rows, mois, annee) {
  var array = [];
  var header = [];
  var keyStock = 0;
  var keyVente = 0;
  var list = [];
  for (let index = 11; index < rows.length; index++) {
    keyVente = 0;
    var row = rows[index];
    var list1 = [];
    if (row.length > 0)
      row.forEach((val) => {
        if (val !== "") list1.push(val);
      });
    list.push(list1);
  }
  header = list[0];
  for (let index = 1; index < list.length - 2; index++) {
    const row = list[index];
    keyVente = 0;
    var test = true;
    if (header.length === 0) {
      header = row;
    }
    if (header.length > 0) {
      keyStock = row.length - 1;
      for (const key1 in header) {
        var val = header[key1];
        var variable = "";
        switch (parseInt(mois)) {
          case 1:
            variable = "janv" + annee;
            break;
          case 2:
            variable = "févr" + annee;
            break;
          case 3:
            variable = "mars" + annee;
            break;
          case 4:
            variable = "avri" + annee;
            break;
          case 5:
            variable = "mai" + annee;
            break;
          case 6:
            variable = "juin" + annee;
            break;
          case 7:
            variable = "juil" + annee;
            break;
          case 8:
            variable = "août" + annee;
            break;
          case 9:
            variable = "sept" + annee;
            break;
          case 10:
            variable = "octo" + annee;
            break;
          case 11:
            variable = "nove" + annee;
            break;
          case 12:
            variable = "déce" + annee;
            break;
          default:
            break;
        }
        if (val.replaceAll(" ", "") === variable) keyVente = parseInt(key1) + 1;
      }
    }
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (
      row &&
      row[1] !== undefined &&
      row !== "undefined" &&
      header.length > 0 &&
      test
    ) {
      array.push({
        designation: row[1],
        stock: keyStock > 0 ? row[keyStock] : 0,
        vente: keyVente > 0 ? row[keyVente] : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
  }
  return array;
}

// template default tout les pharmacie
function verifDefault(rows) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (row && row !== "undefined" && code.toLowerCase().trim() !== "code") {
      array.push({
        designation: row[1] ? row[1].toString() : "",
        stock: row[2] !== undefined && row[2] ? row[2] : 0,
        vente: row[3] !== undefined && row[3] ? row[3] : 0,
        code: code,
        idProduit: null,
        date: row[4] ? setFormatDate(row[4]) : "N/A",
      });
    } else {
      array.push({
        designation: row[1] ? row[1].toString() : "",
        stock: row[2] !== undefined && row[2] ? row[2] : 0,
        vente: row[3] !== undefined && row[3] ? row[3] : 0,
        code: "",
        idProduit: null,
        date: row[4] ? setFormatDate(row[4]) : "N/A",
      });
    }
    return true;
  });
  return array;
}

// template excel M'CHIRGUI PHARMA
function verifChirgui(rows, mois) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row && row !== "undefined") {
      array.push({
        designation: row[0].trim(),
        stock: 0,
        vente:
          row[1 + parseInt(mois)] !== undefined && row[1 + parseInt(mois)]
            ? row[1 + parseInt(mois)]
            : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

/**
 * template excelSTE MEDIKA KAIROUAN
 * template excel MEDICAMENTS OKBA
 * template excel STE AVICENNE
 **/
function verifMedicaK(rows, mois, annee) {
  var array = [];
  var header = [];
  var keyStock = 0;
  var keyVente = 0;
  var list = [];
  var indexLigne = 0;
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    console.log(row);
    var list1 = [];
    if (
      row[0] != undefined &&
      row[0].toString().toLowerCase() == "designation"
    ) {
      indexLigne = index;
    }
  }
  for (let index = indexLigne; index < rows.length; index++) {
    keyVente = 0;
    var row = rows[index];
    var list1 = [];

    if (row.length > 0 && header.length > 0) {
      for (let j = 0; j < row.length; j++) {
        var val = row[j];
        if (val !== "" && typeof val !== "undefined") list1.push(val);
        else if (typeof val === "undefined" || val === "") list1.push(0);
      }
    }
    list.push(list1);
    if (header.length === 0) {
      for (let j = 0; j < row.length; j++) {
        var val = row[j];
        if (val !== "" && typeof val !== "undefined") header.push(val);
        else if (typeof val === "undefined") header.push("");
      }
    }
  }
  for (let index = 1; index < list.length - 1; index++) {
    const row = list[index];
    console.log(row);
    keyVente = 0;
    var test = true;
    var indexStock = 0;
    if (header.length > 0) {
      for (const key1 in header) {
        var val = header[key1];
        var variable = "";
        if (val.toLowerCase().trim() == "stock") {
          indexStock = key1;
        }
        switch (parseInt(mois)) {
          case 1:
            variable = "JANVIER";
            break;
          case 2:
            variable = "FEVRIER";
            break;
          case 3:
            variable = "MARS";
            break;
          case 4:
            variable = "AVRIL";
            break;
          case 5:
            variable = "MAI";
            break;
          case 6:
            variable = "JUIN";
            break;
          case 7:
            variable = "JUILLET";
            break;
          case 8:
            variable = "AOUT";
            break;
          case 9:
            variable = "SEPT";
            break;
          case 10:
            variable = "OCT";
            break;
          case 11:
            variable = "NOV";
            break;
          case 12:
            variable = "DEC";
            break;
          default:
            break;
        }
        if (val.toLowerCase() === variable.toLowerCase())
          keyVente = parseInt(key1);
      }
    }
    let code = "";
    if (row[1] !== undefined)
      code =
        typeof row[1] == "string"
          ? row[1].replaceAll(" ", "")
          : row[1].toString();
    if (
      row &&
      row !== "undefined" &&
      header.length > 0 &&
      row[0] !== "() Totaux :" &&
      test
    ) {
      array.push({
        designation: row[0],
        stock:
          row[indexStock] !== undefined && row[indexStock]
            ? row[indexStock]
            : 0,
        vente:
          keyVente > 0
            ? row[keyVente] !== "" && typeof row[keyVente] !== "undefined"
              ? row[keyVente]
              : 0
            : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
  }
  return array;
}
function verifKair(rows, mois, annee) {
  var array = [];
  var header = [];
  var keyStock = 0;
  var keyVente = 0;
  var list = [];
  for (let index = 2; index < rows.length; index++) {
    keyVente = 0;
    var row = rows[index];
    var list1 = [];
    if (row.length > 0 && header.length > 0) {
      for (let j = 0; j < row.length; j++) {
        var val = row[j];
        if (val !== "" && typeof val !== "undefined") list1.push(val);
        else if (typeof val === "undefined" || val === "") list1.push(0);
      }
    }
    list.push(list1);
    if (header.length === 0) {
      for (let j = 0; j < row.length; j++) {
        var val = row[j];
        if (val !== "" && typeof val !== "undefined") header.push(val);
        else if (typeof val === "undefined") header.push("");
      }
    }
  }
  for (let index = 1; index < list.length - 1; index++) {
    const row = list[index];
    keyVente = 0;
    var test = true;
    if (header.length > 0) {
      for (const key1 in header) {
        var val = header[key1];
        var variable = "";
        switch (parseInt(mois)) {
          case 1:
            variable = "JANVIER";
            break;
          case 2:
            variable = "FEVRIER";
            break;
          case 3:
            variable = "MARS";
            break;
          case 4:
            variable = "AVRIL";
            break;
          case 5:
            variable = "MAI";
            break;
          case 6:
            variable = "JUIN";
            break;
          case 7:
            variable = "JUILLET";
            break;
          case 8:
            variable = "AOUT";
            break;
          case 9:
            variable = "SEPT";
            break;
          case 10:
            variable = "OCT";
            break;
          case 11:
            variable = "NOV";
            break;
          case 12:
            variable = "DEC";
            break;
          default:
            break;
        }
        if (val.toLowerCase() === variable.toLowerCase())
          keyVente = parseInt(key1);
      }
    }
    let code = "";
    if (row[1] !== undefined)
      code =
        typeof row[1] == "string"
          ? row[1].replaceAll(" ", "")
          : row[1].toString();
    if (
      row &&
      row !== "undefined" &&
      header.length > 0 &&
      row[0] !== "() Totaux :" &&
      test
    ) {
      array.push({
        designation: row[0],
        stock: row[3] !== undefined && row[3] ? row[3] : 0,
        vente:
          keyVente > 0
            ? row[keyVente] !== "" && typeof row[keyVente] !== "undefined"
              ? row[keyVente]
              : 0
            : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
  }
  return array;
}
function verifSm(rows, mois, annee) {
  var array = [];
  var keyVente = 3;
  var newArray = rows.map((row) => row.slice(0, -1));
  newArray = newArray.slice(1);
  switch (parseInt(mois)) {
    case 1:
      keyVente = 3;
      break;
    case 2:
      keyVente = 4;
      break;
    case 3:
      keyVente = 5;
      break;
    case 4:
      keyVente = 6;
      break;
    case 5:
      keyVente = 7;
      break;
    case 6:
      keyVente = 8;
      break;
    case 7:
      keyVente = 9;
      break;
    case 8:
      keyVente = 10;
      break;
    case 9:
      keyVente = 11;
      break;
    case 10:
      keyVente = 12;
      break;
    case 11:
      keyVente = 13;
      break;
    case 12:
      keyVente = 14;
      break;
    default:
      break;
  }
  for (let index = 0; index < newArray.length; index++) {
    const row = newArray[index];
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (row && row !== "undefined") {
      array.push({
        designation: row[1],
        stock: row[2] !== undefined && row[2] ? row[2] : 0,
        vente:
          keyVente > 0
            ? row[keyVente] !== "" && typeof row[keyVente] !== "undefined"
              ? row[keyVente]
              : 0
            : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
  }
  return array;
}
