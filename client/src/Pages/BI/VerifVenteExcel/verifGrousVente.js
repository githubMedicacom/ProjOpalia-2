export async function verifGrous(rows, annee, type) {
  return verifVente(rows, annee, type);
}

function verifVente(rows, anne, type) {
  var array = [];
  var header = [];
  var indexLigne = 0;
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if (row[0] !== undefined) {
      if (row[0].toString().toLowerCase().trim() == "code grossiste") {
        indexLigne = index;
      }
    }
  }
  header = rows[indexLigne];
  for (let index = indexLigne + 1; index < rows.length; index++) {
    const row = rows[index];

    let code = "";
    let codeFr = "";

    if (row[2] !== undefined)
      code =
        typeof row[2] == "string"
          ? row[2].replaceAll(" ", "")
          : row[2].toString();

    if (row[0] !== undefined)
    codeFr =
        typeof row[0] == "string"
          ? row[0].replaceAll(" ", "")
          : row[0].toString();


    if (row && row !== "undefined" && header.length > 0) {
      if (row[3] && row[3] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[3],
          idProduit: null,
          mois: 1,
          date: "N/A",
        });
      }

      if (row[4] && row[4] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[4],
          idProduit: null,
          mois: 2,
          date: "N/A",
        });
      }

      if (row[5] && row[5] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[5],
          idProduit: null,
          mois: 3,
          date: "N/A",
        });
      }

      if (row[6] && row[6] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[6],
          idProduit: null,
          mois: 4,
          date: "N/A",
        });
      }

      if (row[7] && row[7] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[7],
          idProduit: null,
          mois: 5,
          date: "N/A",
        });
      }

      if (row[8] && row[8] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[8],
          idProduit: null,
          mois: 6,
          date: "N/A",
        });
      }

      if (row[9] && row[9] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[9],
          idProduit: null,
          mois: 7,
          date: "N/A",
        });
      }

      if (row[10] && row[10] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[10],
          idProduit: null,
          mois: 8,
          date: "N/A",
        });
      }

      if (row[11] && row[11] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[11],
          idProduit: null,
          mois: 9,
          date: "N/A",
        });
      }

      if (row[12] && row[12] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[12],
          idProduit: null,
          mois: 10,
          date: "N/A",
        });
      }

      if (row[13] && row[13] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[13],
          idProduit: null,
          mois: 11,
          date: "N/A",
        });
      }

      if (row[14] && row[14] !== undefined) {
        array.push({
          codeFr:  codeFr,
          designation: row[1].trim(),
          code: code,
          vente: row[14],
          mois: 12,
          idProduit: null,
          date: "N/A",
        });
      }
    }
  }

  return array;
}
