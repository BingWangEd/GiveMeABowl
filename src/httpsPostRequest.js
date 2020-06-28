const https = require('https');

const httpsPostRequest = async (requestUrl, postMessage) => {

  const slackBody = {
    mkdwn: true,
    text: 'You are going to: ',
    attachments: [{
      color: 'good',
      text: `${postMessage.name} @ ${postMessage.address}`,
    }]
  }
  
  const options = {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    }
  }

  return new Promise((resolve, reject) => {
    const req = https.request(requestUrl, options, (res) => {
      let data = '';
  
      console.log('Status Code:', res.statusCode);
  
      res.on('data', (chunk) => {
          data += chunk;
      });
  
      res.on('end', () => {
        console.log('data: ', data);
        resolve(data);
      });
  
    }).on("error", (err) => {
        reject(new Error(`Post request error: ${err.message}`));
    });
  
    req.write(JSON.stringify(slackBody));
    req.end();
  })
}

module.exports = httpsPostRequest;
