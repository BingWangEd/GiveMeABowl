const http = require('http');
const { AREAS, ERROR_TYPE } = require('./src/enums');
const config = require('./config');
const {
  fetchRestData,
  fetchCoordsData,
} = require('./src/fetchData');
const { httpsPostRequest, httpsErrorPostRequest } = require('./src/httpsPostRequest');
const { parse } = require('querystring');
const PORT = config('PORT');

const errorMessage = {
  [ERROR_TYPE.REST]: "It seems like we cannot find any restaurant around this place. I only know Tokyo\'s restaurants.",
  [ERROR_TYPE.COORDS]: "It seems like we cannot find this location.",
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let area = AREAS.ROPPONGI_ITCHOME;
    let  responseText = 'Ehhh, you didn\'t specify any area. I\'ll just go with Roppongi Itchome ...';
    collectRequestData(req, async result => {
      if (!result) return;

      console.log(result);
      // send response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      
      if (result.text !== '') {
        responseText = `${result.text}? Nice pick! You are going to ...`;
        area = result.text
      }

      res.write(responseText);
      res.end();

      const url = config('WEBHOOK_URL');

      const areaCoords = await fetchCoordsData(area);
      
      if (areaCoords === ERROR_TYPE.COORDS) {
        console.log('area coords error: ', areaCoords);
        httpsErrorPostRequest(url, errorMessage[areaCoords]);
      }
      // shoud return directly afterwards
      const pickedRest = await fetchRestData(areaCoords);
      
      if (pickedRest === ERROR_TYPE.REST) {
        console.log('picked restaurant error: ', errorMessage[pickedRest]);
        httpsErrorPostRequest(url, pickedRest); // need to return here
      }

      const { name, address, url: restUrl, pr, category } = pickedRest
      const payload = {
        name,
        address,
        url: restUrl,
        description: pr.pr_short,
        category,
      }

      try { 
        const slackResponse = await httpsPostRequest(url, payload);
        console.log('Message response', slackResponse);
      } catch (error) {
        console.log(error);
      }
    });
  }
});

const  collectRequestData = (request, callback) => {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if(request.headers['content-type'] === FORM_URLENCODED) {
    // parse and read data
    let body = [];
    request.on('data', chunk => {
      body.push(chunk);
    });
    request.on('end', () => {
      // request content type: application/x-www-form-urlencoded
      body = Buffer.concat(body).toString();
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
