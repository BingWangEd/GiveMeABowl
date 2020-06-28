const https = require('https');
const AREAS = require('./enums');
const AREAS_GEO_COORDS = require('./areaGeoCoords');

const httpsGetRequest = async (requestUrl) => {
  return new Promise((resolve, reject) => {
    https.get(requestUrl, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Fetch https get request got Status Code: ${res.statusCode}`));
      }

      let data = '';
    
      // A chunk of data has been recieved.
      res.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      res.on('end', () => {
        //console.log(JSON.parse(data));
        resolve(JSON.parse(data));
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    }).end();
  });
}

const fetchRestData = async (location = AREAS.ROPPONGI_ITCHOME) => {
  const { lat, long } = AREAS_GEO_COORDS[location];
  const requestUrl = `https://api.gnavi.co.jp/RestSearchAPI/v3/?latitude=${lat}&longitude=${long}&keyid=${process.env.GNAVI_API_KEY}&range=1&hit_per_page=1`;

  try {
    const data =  await httpsGetRequest(requestUrl);
    const totalHits = data.total_hit_count;
    const restNum = getRandomRestNumber(totalHits);

    const restRequest = `https://api.gnavi.co.jp/RestSearchAPI/v3/?latitude=${lat}&longitude=${long}&keyid=${process.env.GNAVI_API_KEY}&range=1&hit_per_page=1&offset_page=${restNum}`;
    const finalRestData =  await httpsGetRequest(restRequest);
    return finalRestData.rest[0];
  } catch (error) {
    console.log(error);
  }
}

const getRandomRestNumber = (totoalHit) => {
  return Math.floor(Math.random()*(totoalHit-1)+1);
}

module.exports = fetchRestData;
