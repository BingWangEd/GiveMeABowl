const http = require('http');
const { MESSAGE_TYPE, ERROR_TYPE } = require('./src/enums');
const config = require('./config');
const {
  fetchRestaurantData,
  fetchCoordsData,
  sendSlackChannelPostRequest
} = require('./src/apiRequestMethods');
const { parse } = require('querystring');

const PORT = config('PORT');
const DEFAULT_AREA = 'Roppongi Itchome';

const errorMessage = {
  [ERROR_TYPE.RESTAURANT]: "It seems like we cannot find any restaurant around this place. I only know Tokyo\'s restaurants.",
  [ERROR_TYPE.COORDS]: "It seems like we cannot find this location.",
};

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
  
  let areaCoords;
  try {
    areaCoords = await fetchCoordsData(area);
  } catch {
    // errorPostRequest();
    // httpsErrorPostRequest(url, errorMessage[areaCoords]);
    return;
  }
  
  let pickedRest;
  try {
    pickedRest = await fetchRestaurantData(areaCoords);
  } catch {
    // errorPostRequest();
    // httpsErrorPostRequest(url, errorMessage[pickedRest]); // need to return here
    return;
  }

  const { name, address, url, pr, category, opentime } = pickedRest;
  const payload = {
    name,
    address,
    url,
    description: pr.pr_short,
    category,
    opentime,
    message_type: MESSAGE_TYPE.RESTAURANT,
  }

  try { 
    const slackResponse = await sendSlackChannelPostRequest(payload);
    console.log('Message response', slackResponse);
  } catch (error) {
    console.log(error);
    // errorPostRequest();
    return
  }
});

const  collectRequestData = async (request, callback) => {
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
