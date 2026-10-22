import games from "../data/Jeux";
import CarteJeu from "../components/CarteJeu";

function Games() {
  return (
    <div style={{ backgroundColor: "#BBBBBB", minHeight: "100vh" }}>
      <div className="container py-5">
        <h1 className="text-center mb-4 text-dark">Jeux Vidéos</h1>

        <div className="row g-4">
          {games.map((game) => (
            <div className="col-12 col-sm-6 col-lg-3" key={game.id}>
              <CarteJeu jeu={game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Games;
