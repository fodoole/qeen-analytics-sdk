/* global qeen */
import React, { useEffect } from 'react';

function About() {
  useEffect(() => {
    qeen.bindClickEvents(
        new qeen.InteractionEvent('ABOUT', 'h1'),
    );

  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Us</h1>
      <p style={styles.content}>
        Welcome to our page! We're thrilled to have you here.
      </p>
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
  title: {
    fontSize: '2.5rem',
    color: '#61dafb',
  },
  content: {
    fontSize: '1.2rem',
    margin: '20px',
    maxWidth: '600px',
    lineHeight: '1.6',
  },
};

export default About;