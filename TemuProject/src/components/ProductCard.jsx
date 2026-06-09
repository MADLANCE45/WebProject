import { Link } from 'react-router-dom';
import './ProductCard.css';
export default function ProductCard({ prodotto }) {
  // L'URL dovrebbe contenere parole chiave (es. /prodotto/123-mulinello-shimano)
  const productUrl = `/prodotto/${prodotto.id}-${prodotto.slug}`;

  return (
    <Link to={productUrl} className="card-link-wrapper">
      <div className="product-card">
        <img src={prodotto.immagine} alt={`Immagine di ${prodotto.nome}`} />
        <div className="card-content">
          <h3>{prodotto.nome}</h3>
          <p className="price">{prodotto.prezzo} €</p>
        </div>
      </div>
    </Link>
  );
}