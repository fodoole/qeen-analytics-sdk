/* global qeen */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Product.css';

function Product() {
  let { id } = useParams();

  const [products, setProducts] = useState([]);
  const [render, setRender] = useState(false);
  useEffect(() => {
    fetch('/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);  // Log fetched data
        setProducts(data);
        setRender(true);
      })
      .catch(error => console.error('Error fetching data:', error));
  },[]);

  useEffect(() => {
      console.log('Button was clicked!');
      if(render){
        console.log('render set to true!');
      qeen.bindClickEvents(
        [
          new qeen.InteractionEvent('ADD_TO_CART', '#add-to-cart'),
          new qeen.InteractionEvent('ADD_TO_WISHLIST', '#add-to-wishlist'),
          new qeen.InteractionEvent('ATW', '#add-to-wishlist-carrousel')
        ]
      );
      qeen.bindScrollEvents(
        [
          new qeen.InteractionEvent('SCROLL_TITLE', 'h2'),
          new qeen.InteractionEvent('SCROLL_DESC', '#desc')
        ]
      );
    }
  },[render]);
  
  // Log products array and ID
  console.log("Products array:", products);
  console.log("Product ID:", id);

  if (products === undefined || products.length === 0) {
    return <div>Loading...</div>;
  }
  const product = products.find(product => product.id === parseInt(id));
  

  return (
    <>
      <div className='productContainer'>
        <img src={product.image} alt={product.title} className='productImage' />
        <div className='productDetails'>
          <h2 className='productTitle'>{product.title}</h2>
          <p className='productPrice'>Price: ${product.price}</p> {/* Adjust price as needed */}
          <button id="add-to-cart" className='addToCartButton'>Add to Cart</button>
          <button id="add-to-wishlist" className='addToWishlistButton'>Add to wishlist</button>
          <button id="add-to-wishlist-carrousel" className='addToWishlistCarrouselButton'>atw1</button>
          <button id="add-to-wishlist-carrousel" className='addToWishlistCarrouselButton'>atw2</button>
          <button id="add-to-wishlist-carrousel" className='addToWishlistCarrouselButton'>atw3</button>
        </div>
      </div>
      <div id='desc' className='desc'>
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>
    </>
  );
}


export default Product;