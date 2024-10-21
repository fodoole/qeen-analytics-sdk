const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const cors = require('cors');
const port = 4000;

// Enable CORS for all routes
app.use(cors());

app.use('/contentconfig', (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const filePath = path.join(__dirname, 'contentconfig', pathname);
  const queryParams = req.query;
  const productsNamesOptimized = ['product1', 'product2', 'product3', 'product4', 'product5', 'product6', 'product7', 'product8', 'product9', 'product10'];
  const productsDescriptionsOptimized = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8', 'description9', 'description10'];
  const index = Math.floor(Math.random() * 10);
  const pageUrl = queryParams.pageUrl;
  let config;

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

    try {
      config = JSON.parse(data);
      config.requestUrl = pageUrl;
      console.log(`Request URL: ${pageUrl}`);
    } catch (parseError) {
      console.error(`Error parsing JSON: ${parseError.message}`);
      res.status(500).send('Server error');
      return;
    }


    // Page URL is on the product page with no optimized content available
    if (pageUrl && (pageUrl.includes('/products/')) && (pageUrl.includes('48') || pageUrl.includes('49'))) {
      config.isPdp = true;
      config.contentId = "-";
      config.contentServingId = "123654789";
      config.rawContentSelectors = [];
    }
    // Page URL is on the product page
    else if (pageUrl && (pageUrl.includes('/products/'))) {
      config.isPdp = true;
      config.contentId = "optmised";
      config.contentServingId = "123654789";
      config.rawContentSelectors = [
        {
          "uid": "1",
          "path": "#name",
          "value": productsNamesOptimized[index]
        },
        {
          "uid": "2",
          "path": "#description",
          "value": productsDescriptionsOptimized[index]
        }
      ];
    }
    // Page URL is on a non-product page
    else if (pageUrl){
      config.isPdp = false;
      config.contentId = "-";
      config.contentServingId = "0";
      config.rawContentSelectors = [];
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(config));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
