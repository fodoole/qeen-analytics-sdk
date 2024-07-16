/**
 * @fileoverview This is the main file for the Fodoole script testing server.
 */
const express = require('express');
const path = require('path');
const app = express();
const port = 30000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/log', (req, res) => {
  console.log('/log', req.body); // You can log the request body if needed
  res.status(200).end(); // Respond with an empty 200 status code
});

app.listen(port);
