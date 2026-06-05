import { useState, useEffect } from 'react';

const StarRating = ({ productId }) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Genera un voto fittizio ma realistico basato sull'ID del prodotto
    const generateFakeRating = (id) => {
      if (!id) return 4.5;
      const num = String(id).charCodeAt(0) || 5;
      const fakeRating = 4.0 + (num % 10) / 10; 
      return fakeRating;
    };

    setRating(generateFakeRating(productId));
  }, [productId]);

  return (
    <span style={{ color: '#FBBF24', fontSize: '14px', letterSpacing: '1px' }}>
      {'★★★★★'.substring(0, Math.round(rating))}
      <span style={{ color: '#E5E7EB' }}>
        {'★★★★★'.substring(0, 5 - Math.round(rating))}
      </span>
      <span style={{ color: '#6B7280', fontSize: '11px', marginLeft: '4px' }}>
        ({rating.toFixed(1)})
      </span>
    </span>
  );
};

export default StarRating;