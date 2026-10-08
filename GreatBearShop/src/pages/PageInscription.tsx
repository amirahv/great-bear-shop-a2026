import Header from "../components/Header";
import InscriptionForm from "../components/InscriptionForm";


function Inscription() {
  return (
    <div className="containerfluid"
    style={{ backgroundColor: "#e9dc9f", minHeight: "100vh" }}>
        
         <Header />

      <h1 className="text-center mb-4 text-dark">
        Inscription
      </h1>

      <InscriptionForm />


    </div>
  );
}

export default Inscription;
