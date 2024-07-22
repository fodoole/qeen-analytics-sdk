/* global qeen */
import React, { useEffect } from 'react';
import products from './products';
import { Link } from 'react-router-dom';

function ProductLink({ product }) {
  return (
    <div className="product" style={styles.productContainer}>
      <Link to={`/product/${product.id}#qeen-dev`} style={{ textDecoration: 'none' }}>
        <img src={product.image} alt={product.title} style={styles.productImage} />
        <h3 style={styles.productTitle}>{product.title}</h3>
        <p style={styles.productPrice}>${product.price}</p>
      </Link>
    </div>
  );
}

function Home() {
  useEffect(() => {
    qeen.bindClickEvents([new qeen.InteractionEvent('CLICK_PRODUCT', '.product')]);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductLink key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    marginTop: '-71px',
    backgroundColor: '#282c34',
    color: 'white',
    textAlign: 'center',
    fontFamily: '"Lucida Console", Courier, monospace',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridRowGap: '20px',
    gridColumnGap: '20px',
  },
  content: {
    fontSize: '1.2rem',
    margin: '20px',
    maxWidth: '600px',
    lineHeight: '1.6',
  },
  productContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    minHeight: '285px',
  },
  productImage: {
    maxWidth: '150px',
    maxHeight: '150px',
    borderRadius: '5px',
  },
  productTitle: {
    color: '#61dafb',
    margin: '10px 0',
    maxWidth: '200px',
  },
  productPrice: {
    color: '#fff',
    fontWeight: 'bold',
  },
};

export default Home;