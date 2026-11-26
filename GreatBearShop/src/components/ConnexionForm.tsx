import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [erreur, setErreur] = useState("");
  const [connexionEnCours, setConnexionEnCours] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErreur("");
    setConnexionEnCours(true);

    try {
      const reponse = await fetch(
        "http://localhost:4000/api/utilisateurs/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courriel: username,
            motDePasse: password,
          }),
        },
      );

      const donnees = await reponse.json();

      if (!reponse.ok) {
        throw new Error(donnees.message || "Connexion impossible.");
      }

      navigate("/profil");
    } catch (error) {
      setErreur(
        error instanceof Error
          ? error.message
          : "Impossible de joindre le serveur.",
      );
    } finally {
      setConnexionEnCours(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4 text-dark">Connexion</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-bold">
                    Courriel
                  </label>

                  <input
                    type="email"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Votre courriel"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">
                    Mot de passe
                  </label>

                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    required
                  />
                </div>

                {erreur && (
                  <p className="alert alert-danger" role="alert">
                    {erreur}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={connexionEnCours}
                >
                  {connexionEnCours ? "Connexion en cours…" : "Se connecter"}
                </button>
              </form>

              <div className="text-center mt-3">
                <a href="#">Mot de passe oublié ?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
