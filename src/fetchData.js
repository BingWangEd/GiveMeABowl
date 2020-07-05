const https = require('https');
const AREAS = require('./enums');
const AREAS_GEO_COORDS = require('./areaGeoCoords');
const config = require('../config');

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

const fetchCoordsData = async (location) => {
  const locationNoSpace = location.replace(/ /g, "+");
  const OPEN_CAGE_API_KEY = config('OPEN_CAGE_API_KEY');
  const requestUrl = `https://api.opencagedata.com/geocode/v1/geojson?q=${locationNoSpace}&key=${OPEN_CAGE_API_KEY}&pretty=1`;

  console.log('coords requestUrl: ', requestUrl);

  try {
    const data = await httpsGetRequest(requestUrl);
    const geometry = data.features[0].geometry;
    return {
      lat: geometry.coordinates[1],
      long: geometry.coordinates[0],
    };
  } catch (error) {
    console.log(`fetch coords got error: ${error}`);
  }
}

const fetchRestData = async (geoLocation) => {
  const { lat, long } = geoLocation;
  const GNAVI_API_KEY = config('GNAVI_API_KEY');
  const requestUrl = `https://api.gnavi.co.jp/RestSearchAPI/v3/?latitude=${lat}&longitude=${long}&keyid=${GNAVI_API_KEY}&range=1&hit_per_page=1`;

  console.log('rest requestUrl: ', requestUrl);

  try {
    const data =  await httpsGetRequest(requestUrl);
    const totalHits = data.total_hit_count;
    const restNum = getRandomRestNumber(totalHits);

    const restRequest = `https://api.gnavi.co.jp/RestSearchAPI/v3/?latitude=${lat}&longitude=${long}&keyid=${GNAVI_API_KEY}&range=1&hit_per_page=1&offset_page=${restNum}`;
    const finalRestData =  await httpsGetRequest(restRequest);
    return finalRestData.rest[0];
  } catch (error) {
    console.log(error);
  }
}

const getRandomRestNumber = (totoalHit) => {
  return Math.floor(Math.random()*(totoalHit-1)+1);
}

module.exports = {
  fetchRestData,
  fetchCoordsData,
};
