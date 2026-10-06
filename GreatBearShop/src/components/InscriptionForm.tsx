import { useState } from "react";

function InscriptionForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    console.log("Nom :", nom);
    console.log("Prénom :", prenom);
    console.log("Email :", email);
    console.log("Mot de passe :", password);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">
                Créer un compte
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="prenom" className="form-label">
                      Prénom
                    </label>

                    <input
                      type="text"
                      id="prenom"
                      className="form-control"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="nom" className="form-label">
                      Nom
                    </label>

                    <input
                      type="text"
                      id="nom"
                      className="form-control"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Adresse courriel
                  </label>

                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>

                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    minLength={6}
                    required
                  />

                  <div className="form-text">
                    Le mot de passe doit contenir au moins 6 caractères.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmer le mot de passe
                  </label>

                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  S'inscrire
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Vous avez déjà un compte ?{" "}
                <a href="/login">Se connecter</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InscriptionForm;

