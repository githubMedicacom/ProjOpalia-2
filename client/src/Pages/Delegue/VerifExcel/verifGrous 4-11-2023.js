export async function verifGrous(id, rows, mois, annee, template) {
  // Register Service Worker
  if (template === 1) return verifDefault(rows);
  if (id === 43) return verifProphasud(rows);
  if (id === 13) return verifCopropha(rows, mois);
  if (id === 46) return verifKarray(rows);
  if (id === 16) return verifKioropha(rows);
  if (id === 47) return verifDistrimed(rows);
  if (id === 41) return verifCab(rows, mois);
  if (id === 12) return verifCotupha(rows, mois, annee);
  if (id === 40) return verifCophadis(rows, mois);
  if (id === 28) return verifChirgui(rows, mois);
  if (id === 48) return verifCogepha(rows, mois, annee);
  if (id === 11 || id === 44) return verifKair(rows, mois, annee);
  return verifDefault(rows);
}

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

function verifKarray(rows) {
  var array = [];
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
        stock: row[2],
        vente: row[3],
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

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
        stock: row[7],
        vente: row[6],
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

function verifKioropha(rows) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row && row !== "undefined" && row[0] !== "Total général") {
      array.push({
        designation: row[0],
        stock: row[1],
        vente: row[2],
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

function verifDistrimed(rows) {
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
        stock: row[3],
        vente: keyVente > 0 ? row[keyVente] : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

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
        stock: row[2],
        vente: row[2 + parseInt(mois)],
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}

function verifCopropha(rows, mois) {
  var array = [];
  var header = [];
  var keyVente = 0;
  for (let index = 3; index < rows.length; index++) {
    const row = rows[index];
    if (header.length === 0) {
      header = row;
    }
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
      }
    }
    let code = "";
    let vente =
      typeof row[keyVente] !== "undefined"
        ? row[keyVente].toString().replace(/\s+/g, "")
        : 0;
    /* if (typeof row[keyVente] !== "undefined")
      console.log(code, row[keyVente].toString().replace(/\s+/g, "")); */
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (row && row !== "undefined" && header.length > 0) {
      array.push({
        designation: row[1],
        stock:
          typeof row[2] !== "undefined"
            ? row[2].toString().replace(/\s+/g, "")
            : 0,
        vente:
          keyVente > 0 ? (typeof row[keyVente] !== "undefined" ? vente : 0) : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
  }
  return array;
}

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
        stock: row[2],
        vente: row[2 + parseInt(mois)],
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
  return array;
}


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
  for (let index = 1; index < list.length - 3; index++) {
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
    if (row && row[1] !== undefined && row !== "undefined" && header.length > 0 && test) {
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


/* function verifCogepha(rows, mois, annee) {
  var array = [];
  var header = [];
  var keyStock = 0;
  var keyVente = 0;
  for (let index = 11; index < rows.length; index++) {
    keyVente = 0;
    var row = rows[index];
    if (header.length === 0) {
      header = row;
      for (const key2 in header) {
        var val1 = header[key2];
        if (val1.indexOf("Stock") !== -1) keyStock = key2 - 1;
      }
    }
    if (header.length > 0) {
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
          default:break;
        }
        console.log(val.replaceAll(" ",""),variable)
        if (val.replaceAll(" ","") === variable) keyVente = key1;
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
      row[0] &&
      row !== "undefined" &&
      header.length > 0
    ) {
      array.push({
        designation: row[3],
        stock: keyStock > 0 ? row[keyStock] : 0,
        vente: keyVente > 0 ? row[keyVente] : 0,
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
  }
  return array;
} */

function verifDefault(rows) {
  var array = [];
  console.log(rows)
  rows.slice(1).map((row, index) => {
    console.log(row[2])
    let code = "";
    if (row[0] !== undefined)
      code =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();
    if (
      row &&
      row !== "undefined" &&
      code.toLowerCase().trim() !== "code"
    ) {
      array.push({
        designation: row[1].toString(),
        stock: row[2] !== undefined && row[2]?row[2]:0,
        vente: row[3] !== undefined && row[3]?row[3]:0,
        code: code,
        idProduit: null,
        date: row[4] ? setFormatDate(row[4]) : "N/A",
      });
    } else {
      array.push({
        designation: row[1].toString(),
        stock: row[2] !== undefined && row[2]?row[2]:0,
        vente: row[3] !== undefined && row[3]?row[3]:0,
        code: "",
        idProduit: null,
        date: row[4] ? setFormatDate(row[4]) : "N/A",
      });
    }
    return true;
  });
  return array;
}

function verifChirgui(rows, mois) {
  var array = [];
  rows.slice(1).map((row, index) => {
    let code = "";
    if (row && row !== "undefined") {
      array.push({
        designation: row[0].trim(),
        stock: 0,
        vente: row[1 + parseInt(mois)],
        code: code,
        idProduit: null,
        date: "N/A",
      });
    }
    return true;
  });
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
  for (let index = 1; index < list.length; index++) {
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
    if (row && row !== "undefined" && header.length > 0 && test) {
      array.push({
        designation: row[0],
        stock: row[3],
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
