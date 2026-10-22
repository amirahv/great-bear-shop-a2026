import InscriptionForm from "../components/InscriptionForm";


function Inscription() {
  return (
    <div className="containerfluid"
    style={{ backgroundColor: "#BBBBBB", minHeight: "100vh" }}>
        

      <h1 className="text-center mb-4 text-dark">
        Inscription
      </h1>

      <InscriptionForm />


    </div>
  );
}

export default Inscription;
