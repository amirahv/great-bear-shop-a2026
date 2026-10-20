import ConnexionForm from "../components/ConnexionForm";


function Connexion() {
    
  return (
     <div
      className="container-fluid"
      style={{
        backgroundColor: "#e9dc9f",
        minHeight: "100vh",
      }}
    >
     
      <main className="container py-5">
        <h1 className="text-center mb-4 text-dark">
          Connexion
        </h1>

        <ConnexionForm />
      </main>
    </div>
  );
}

export default Connexion;
