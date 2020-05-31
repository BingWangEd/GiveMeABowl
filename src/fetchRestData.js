const https = require('https');
require('dotenv').config();

https.get(`https://api.gnavi.co.jp/RestSearchAPI/v3/?latitude=35.656&longitude=139.72466&keyid=${process.env.GNAVI_API_KEY}&range=1`, (res) => {
  console.log('res.statusCode: ', res.statusCode);
  let data = '';

  // A chunk of data has been recieved.
  res.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  res.on('end', () => {
    console.log(JSON.parse(data));
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});