/* global qeen */
import React, { useEffect } from 'react';
import "./About.css";

function About() {
  useEffect(() => {
    qeen.bindClickEvents(
        new qeen.InteractionEvent('ABOUT', 'h1'),
    );

  }, []);

  return (
    <div className="container">
      <h1 className="title">About Us</h1>
      <p className="content">
        Welcome to our page! We're thrilled to have you here.
      </p>
    </div>
  );
}

export default About;