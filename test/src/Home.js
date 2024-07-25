/* global qeen */
import React, { useEffect } from 'react';
import products from './products';
import { Link } from 'react-router-dom';
import './Home.css';

function ProductLink({ product }) {
  return (
    <div className="productContainer product">
      <Link to={`/product/${product.id}#qeen-dev`} style={{ textDecoration: 'none' }}>
        <img src={product.image} alt={product.title} className='productImage' />
        <h3 className='productTitle'>{product.title}</h3>
        <p className='productPrice'>${product.price}</p>
      </Link>
    </div>
  );
}

function Home() {
  useEffect(() => {
    qeen.bindClickEvents([new qeen.InteractionEvent('CLICK_PRODUCT', '.product')]);
  }, []);

  return (
    <div className='container'>
      <div className='grid'>
        {products.map((product) => (
          <ProductLink key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;