const https = require('https');

const httpsGetRequest = async (requestUrl) => {
  return new Promise((resolve, reject) => {
    https.get(requestUrl, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(ERROR_TYPE.GET_REQUEST);
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
      reject(ERROR_TYPE.GET_REQUEST);
    }).end();
  });
};

const httpsPostRequest = async (reqUrl, reqBody) => {

  const options = {
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(reqUrl, options, (res) => {
      let data = '';
  
      console.log('Slack post request\'s response status code:', res.statusCode);
  
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
