/* global qeen */
import React, { useState } from 'react';

function Checkout() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleButtonClick = () => {
    setTimeout(() => {
      qeen.sendCheckoutEvent('USD', 1_234.56);
      setPaymentSuccess(true);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <p style={styles.content}>Checkout Amount: <span style={styles.amount}>$1,234.56</span></p>
      <button style={styles.button} id="checkout" onClick={handleButtonClick}>Pay Now</button>
      {paymentSuccess && <p style={styles.successMessage}>Payment successful!</p>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    marginTop: '-71px',
    backgroundColor: '#282c34',
    color: 'white',
    textAlign: 'center',
    fontFamily: '"Lucida Console", Courier, monospace',
  },
  content: {
    fontSize: '1.2rem',
    margin: '20px',
    maxWidth: '600px',
    lineHeight: '1.6',
  },
  amount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#61dafb',
  },
  button: {
    fontSize: '1rem',
    fontFamily: '"Lucida Console", Courier, monospace',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  successMessage: {
    color: 'limegreen',
    fontSize: '1.2rem',
    marginTop: '20px',
  },
};

// Add hover effect for button
styles.button[':hover'] = {
  backgroundColor: '#4f9ac8',
};

export default Checkout;