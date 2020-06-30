require('dotenv').config();
const http = require('http');
const AREAS_GEO_COORDS = require('./src/areaGeoCoords');
const AREAS = require('./src/enums');
const fetchRestData = require('./src/fetchRestData');
const httpsPostRequest = require('./src/httpsPostRequest');
const { parse } = require('querystring');
const PORT = process.env.PORT;

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let area = AREAS.ROPPONGI_ITCHOME;
    let  responseText = 'Ehhh, I don\'t know this area. Let me just pick a random place ...';
    collectRequestData(req, result => {
      console.log(result);
      // send response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      
      if (result.text === 'Ebisu') {
        console.log('area exists');
        area = 'EBISU';
        responseText = 'So you are going to ...';
      };

      res.write(responseText);
      res.end()
    });

    const pickedRest = await fetchRestData(area);

    const { name, address, url: restUrl, pr, category } = pickedRest
    const payload = {
      name,
      address,
      url: restUrl,
      description: pr.pr_short,
      category,
    }

    console.log('pickedRest: ', pickedRest);
    const url = process.env.WEBHOOK_URL;

    try { 
      const slackResponse = await httpsPostRequest(url, payload);
      console.log('Message response', slackResponse);
    } catch (error) {
      console.log(error);
    }
  }
});

const  collectRequestData = (request, callback) => {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if(request.headers['content-type'] === FORM_URLENCODED) {
    // parse and read data
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      // request content type: application/x-www-form-urlencoded
      callback(parse(body));
    });
  }
  else {
    callback(null);
  }
}

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});
