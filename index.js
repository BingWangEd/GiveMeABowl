const http = require('http');
const AREAS = require('./src/enums');
const config = require('./config');
const {
  fetchRestData,
  fetchCoordsData,
} = require('./src/fetchData');
const httpsPostRequest = require('./src/httpsPostRequest');
const { parse } = require('querystring');
const PORT = config('PORT');

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let area = AREAS.ROPPONGI_ITCHOME;
    let  responseText = 'Ehhh, you didn\'t specify any area. I\'ll just go with Roppongi Itchome ...';
    collectRequestData(req, result => {
      console.log(result);
      // send response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      
      if (result.text !== '') {
        responseText = `${result.text}? Nice pick! You are going to ...`;
        area = result.text
      }

      res.write(responseText);
      res.end()
    });

    const areaCoords = await fetchCoordsData(area);
    console.log('area coords: ', areaCoords);
    const pickedRest = await fetchRestData(areaCoords);
    console.log('picked restaurant: ', pickedRest);

    const { name, address, url: restUrl, pr, category } = pickedRest
    const payload = {
      name,
      address,
      url: restUrl,
      description: pr.pr_short,
      category,
    }

    const url = config('WEBHOOK_URL');

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
