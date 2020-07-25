const http = require('http');
const config = require('./config');
const { findRestaurant } = require('./src/apiRequestMethods');
const { parse } = require('querystring');

const PORT = config('PORT');
const DEFAULT_AREA = 'Roppongi Itchome';

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') return;

  const result = await collectRequestData(req, (result) => {
    if (!result) return;

    // send response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const area = result.text === '' ? DEFAULT_AREA : result.text;
    const responseText = result.text === '' ? `Ehhh, you didn\'t specify any area. I\'ll just go with ${area} ...` : `${area}? Nice pick! You are going to ...`;
    
    res.write(responseText);
    res.end();

    return {
      area,
    }
  });

  const { area } = result;
  
  findRestaurant(area);
});

const collectRequestData = (request, callback) => {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  let result = null;
  return new Promise((resolve, reject) => {
    if(request.headers['content-type'] === FORM_URLENCODED) {
      // parse and read data
      let body = [];
      request.on('data', chunk => {
        body.push(chunk);
      });
      request.on('end', () => {
        // request content type: application/x-www-form-urlencoded
        body = Buffer.concat(body).toString();
        result = callback(parse(body));
        resolve(result);
      });
    } else {
      reject(callback(null)); // call error
    }
  });
}

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});
