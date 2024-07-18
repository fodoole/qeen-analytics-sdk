/**
 * @fileoverview This is the main file for the Fodoole script testing server.
 */
const express = require('express');
const path = require('path');
const app = express();
const port = 30000;

// Middleware to parse JSON bodies
app.use(express.json());

function logRawBody(req, _, next) {
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    try {
      req.body = JSON.parse(body);
    } catch (error) {
      req.body = body;
    }
    console.log('/log', JSON.stringify(req.body, null, 2), '\n');
    req.rawBody = body;
    next();
  });
}

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Serve React testing app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.post('/log', logRawBody, (_, __, next) => {
  next();
}, (_, res) => {
  res.status(200).end();
});

app.listen(port);
