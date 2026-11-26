
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    obtenirProduitParId,
    type ProduitAPI,
} from "../services/api";
import type { ArticlePanierDetaille } from "../data/panierTemporaire";

const CLE_PANIER = "greatBearPanier";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProduitAPI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!id) {
            setError("Identifiant manquant.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        obtenirProduitParId(id)
            .then(setProduct)
            .catch(() => setError("Impossible de charger le produit."))
            .finally(() => setLoading(false));
    }, [id]);

    function ajouterAuPanier() {
        if (!product) return;

        const article: ArticlePanierDetaille = {
            produitId: product._id,
            nom: product.nom,
            images: product.images || [],
            quantite: 1,
            prixUnitaire: product.prix,
            totalLigne: product.prix,
            disponible: product.stock > 0,
        };

        const panierActuel: ArticlePanierDetaille[] = JSON.parse(
            localStorage.getItem(CLE_PANIER) || "[]"
        );

        const articleExistant = panierActuel.find(
            (item) => item.produitId === product._id
        );

        if (articleExistant) {
            articleExistant.quantite += 1;
            articleExistant.totalLigne =
                articleExistant.prixUnitaire !== null
                    ? articleExistant.prixUnitaire * articleExistant.quantite
                    : null;
        } else {
            panierActuel.push(article);
        }

        localStorage.setItem(CLE_PANIER, JSON.stringify(panierActuel));
        setMessage("Produit ajouté au panier !");
    }

    if (loading) {
        return <div className="container py-5">Chargement...</div>;
    }

    if (error || !product) {
        return (
            <div className="container py-5">
                <p className="text-danger">{error || "Produit introuvable."}</p>
                <button className="btn btn-dark" onClick={() => navigate(-1)}>
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row g-5 align-items-center">
                <div className="col-md-6 text-center">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.nom}
                            className="img-fluid rounded"
                            style={{
                                maxHeight: "450px",
                                width: "100%",
                                objectFit: "contain",
                            }}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <p className="text-muted">Image non disponible</p>
                    )}
                </div>

                <div className="col-md-6">
                    <p className="text-muted">{product.categorie}</p>
                    <h1>{product.nom}</h1>
                    <h3 className="my-3">{product.prix.toFixed(2)} $</h3>

                    <p>{product.description || "Aucune description disponible."}</p>

                    <p>
                        <strong>Stock disponible :</strong> {product.stock}
                    </p>

                    {Object.entries(product.caracteristiques || {}).map(([key, value]) =>
                        value != null ? (
                            <p key={key}>
                                <strong>{key} :</strong>{" "}
                                {Array.isArray(value) ? value.join(", ") : String(value)}
                            </p>
                        ) : null
                    )}

                    {message && (
                        <p className="text-success fw-bold mt-3">{message}</p>
                    )}

                    <div className="d-flex flex-wrap gap-2 mt-4">
                        <button
                            className="btn btn-dark"
                            onClick={ajouterAuPanier}
                            disabled={product.stock <= 0}
                        >
                            Ajouter au panier
                        </button>

                        <button
                            className="btn btn-outline-dark"
                            onClick={() => navigate(-1)}
                        >
                            ← Retour aux produits
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
