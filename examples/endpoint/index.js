const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const cors = require('cors');
const url = require('url');
const port = 4000;

// Enable CORS for all routes
app.use(cors());

app.use('/contentconfig', (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`); 
  const pathname = parsedUrl.pathname; 
  const filePath = path.join(__dirname, 'contentconfig', pathname); 

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);  
      if (err.code === 'ENOENT') {
        res.status(404).send('File not found');
      } else {
        res.status(500).send('Server error');
      }
      return;
    }

    const productsNamesOptimized = ['product1', 'product2', 'product3', 'product4', 'product5', 'product6', 'product7', 'product8', 'product9', 'product10'];
    const productsDescriptionsOptimized = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8', 'description9', 'description10'];

    const index = Math.floor(Math.random() * 10);
    let modifiedData = data.replace("{{descriptionToBeReplaced}}", productsDescriptionsOptimized[index]).replace("{{nameToBeReplaced}}", productsNamesOptimized[index]);

    res.setHeader('Content-Type', 'application/json');
    res.send(modifiedData);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
