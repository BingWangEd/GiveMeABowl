const https = require('https');

const httpsGetRequest = (requestUrl) => {
  return new Promise((resolve, reject) => {
    https.get(requestUrl, (res) => {
      console.log('Get request response status code: ', res.statusCode);
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(res.statusCode);
      }

      let data = '';
    
      // A chunk of data has been recieved.
      res.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      console.error(`Get request error: ${error.message}`);
      reject(error);
    }).end();
  });
};

const httpsPostRequest = (reqUrl, reqBody) => {
  const options = {
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(reqUrl, options, (res) => {
      let data = '';
  
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(res.statusCode);
      }

      res.on('data', (chunk) => {
          data += chunk;
      });
  
      res.on('end', () => {
        resolve(data);
      });
  
    }).on("error", (err) => {
      reject(new Error(`Post request error: ${err.message}`));
    });
    req.write(JSON.stringify(reqBody));
    req.end();
  })
};

module.exports = { 
  httpsGetRequest,
  httpsPostRequest,
};
