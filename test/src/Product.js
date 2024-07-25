/* global qeen */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import products from './products';
import './Product.css';

function Product() {
  let { id } = useParams();
  useEffect(() => {
    qeen.bindClickEvents(
      [
        new qeen.InteractionEvent('ADD_TO_CART', '#add-to-cart'),
        new qeen.InteractionEvent('ADD_TO_WISHLIST', '#add-to-wishlist')
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
    //const [products, setProducts] = useState([]);

    /*useEffect(() => {
      console.log("Component mounted"); // Verify if component mounts

      fetch('/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        console.log("Fetched data:", data); // Log fetched data to console
      })
      .catch(err => console.log("error fetching products", err));
    }, []);*/
    
  // Log products array and ID
  console.log("Products array:", products);
  console.log("Product ID:", id);


  /*const product = products.find(product => product.id === parseInt(id));
  if (!product) {
    return <div>Loading...</div>;
  }*/

  return (
    <>
    <div className='productContainer'>
      <img src={product.image} alt={product.title} className='productImage' />
      <div className='productDetails'>
        <h2 className='productTitle'>{product.title}</h2>
        <p className='productPrice'>Price: ${product.price}</p> {/* Adjust price as needed */}
        <button id="add-to-cart" className='addToCartButton'>Add to Cart</button>
        <button id="add-to-wishlist" className='addToWishlistButton'>Add to wishlist</button>
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