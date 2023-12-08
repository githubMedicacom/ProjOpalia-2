function PropositionCommmande() {
  const url =
    "https://app.powerbi.com/view?r=eyJrIjoiNjUzMmM4MDAtYTdjMi00ODE4LTgxZGUtNjAzODFhMzNhMDIzIiwidCI6ImU0YmQ2OWZmLWU2ZjctNGMyZS1iMjQ3LTQxYjU0YmEyNDkwZSIsImMiOjh9"; 

  return <>
          <iframe src={url}  style={{ width: "100%", height: "600px" }}></iframe>

  </>;
}

export default PropositionCommmande;
