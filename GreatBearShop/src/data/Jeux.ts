export interface Jeu {
  id: number;
  titre: string;
  developpeur: string;
  editeur: string;
  console: string;
  prix: number;
  image: string;
}
const jeux = [
  {
    id: 1,
    titre: "journey to the savage planet",
    developpeur: "Typhoon Studios" ,
    editeur: "505 Games",
    console: "PlayStation 4",
    prix: 39.99,
    image: "/images/jeux/Journey_to_the_Savage_Planet.jpg"
  },

    {
    id: 2,
    titre: "Dead by daylight",
    developpeur: "Behaviour Interactive" ,
    editeur: "Behaviour Interactive",
    console: "PlayStation 5",
    prix: 39.99,
    image: "/images/jeux/Dead_by_Daylight.jpg"
  },

    {
    id: 3,
    titre: "Prince of Persia the two thrones",
    developpeur: "Ubisoft Montreal" ,
    editeur: "Ubisoft",
    console: "PC",
    prix: 9.99,
    image: "/images/jeux/Prince_of_Persia_the_Two_Thrones.jpg"
  },

    {
    id: 4,
    titre: "Sea of stars",
    developpeur: "Sabotage Studio" ,
    editeur: "Sabotage Studio",
    console: "PlayStation 4",
    prix: 34.99,
    image: "/images/jeux/Sea_of_Stars.jpg"
  },

    {
    id: 5,
    titre: "Outlast",
    developpeur: "Red Barrels" ,
    editeur: "Red Barrels",
    console: "PlayStation 4",
    prix: 19.99,
    image: "/images/jeux/Outlast.jpg"
  },

    {
    id: 6,
    titre: "Shadow of the Tomb Raider",
    developpeur: "Eidos-Montréal" ,
    editeur: "Square Enix",
    console: "PlayStation 5",
    prix: 53.49,
    image: "/images/jeux/Shadow_of_the_Tomb_Raider.jpg"
  },

    {
    id: 7,
    titre: "Batman: Arkham Origins",
    developpeur: "WB Games Montréal" ,
    editeur: "Warner Bros. Interactive Entertainment",
    console: "PC",
    prix: 19.99,
    image: "/images/jeux/Batman_Arkham_Origins.jpg"
  },

    {
    id: 8,
    titre: "Kona",
    developpeur: "Parabole" ,
    editeur: "Deep Silver",
    console: "PlayStation 4",
    prix: 19.99,
    image: "/images/jeux/Kona.jpg"
  },

    {
    id: 9,
    titre: "Mass Effect Legendary Edition ",
    developpeur: "BioWare" ,
    editeur: "Electronic Arts",
    console: "Xbox One",
    prix: 79.99,
    image: "/images/jeux/Mass_Effect_Legendary_Edition.jpg"
  },

    {
    id: 10,
    titre: "Luigi's mansion 3",
    developpeur: "Next Level Games" ,
    editeur: "Nintendo",
    console: "Nintendo Switch",
    prix: 84.99,
    image: "/images/jeux/Luigi's_Mansion_3.jpg"
  },


];

export default jeux