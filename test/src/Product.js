/* global qeen */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import products from './products';

function Product() {
  let { id } = useParams();
  useEffect(() => {
    qeen.bindClickEvents(
      [
        new qeen.InteractionEvent('ADD_TO_CART', '#add-to-cart'),
        new qeen.InteractionEvent('ADD_TO_WATCHLIST', '#add-to-watchlist')
      ]
    );

    qeen.bindScrollEvents(
      [
        new qeen.InteractionEvent('SCROLL_TITLE', 'h2'),
        new qeen.InteractionEvent('SCROLL_DESC', '#desc')
      ]
    );
  }, []);

  const product = products.find(product => product.id === parseInt(id));

  return (
    <div style={styles.productContainer}>
      <img src={product.image} alt={product.title} style={styles.productImage} />
      <div style={styles.productDetails}>
        <h2 style={styles.productTitle}>{product.title}</h2>
        <p style={styles.productPrice}>Price: ${product.price}</p> {/* Adjust price as needed */}
        <button id="add-to-cart" style={styles.addToCartButton}>Add to Cart</button>
        <button id="add-to-watchlist" style={styles.addToWatchlistButton}>Add to Watchlist</button>
        <p id="desc">{product.description}</p>
      </div>
    </div>
  );
}

const styles = {
  productContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#282c34',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: 'white',
    fontFamily: '"Lucida Console", Courier, monospace',
  },
  productImage: {
    maxWidth: '50%',
    // maxHeight: '100%',
    maxHeight: '500px',
    borderRadius: '5px',
    marginRight: '20px',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '50%',
  },
  productTitle: {
    color: '#61dafb',
    margin: '0 0 10px 0',
  },
  productPrice: {
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  },
  addToCartButton: {
    backgroundColor: '#61dafb',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontFamily: '"Lucida Console", Courier, monospace',
    padding: '10px 20px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  addToWatchlistButton: {
    backgroundColor: '#f22b3e',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontFamily: '"Lucida Console", Courier, monospace',
    padding: '10px 20px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
};

export default Product;