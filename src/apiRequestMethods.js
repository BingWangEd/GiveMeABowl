const { ERROR_TYPE } = require('./enums');
const config = require('../config');
const { constructResponse, getRandomRestaurantNumber } = require('./helpers');
const { httpsGetRequest, httpsPostRequest } = require('./httpsMethods');

const fetchCoordsData = async (location) => {
  const locationNoSpace = location.replace(/ /g, "+");
  const OPEN_CAGE_API_KEY = config('OPEN_CAGE_API_KEY');
  const requestUrl = `https://api.opencagedata.com/geocode/v1/geojson?q=${locationNoSpace}&key=${OPEN_CAGE_API_KEY}&pretty=1`;

  try {
    const data = await httpsGetRequest(requestUrl);
    const geometry = data.features[0].geometry;
    return {
      lat: geometry.coordinates[1],
      long: geometry.coordinates[0],
    };
  } catch (error) {
    return ERROR_TYPE.COORDS;
  }
}

const fetchRestaurantData = async (geoLocation) => {
  const { lat, long } = geoLocation;
  const GNAVI_API_KEY = config('GNAVI_API_KEY');
  const requestUrl = `https://api.gnavi.co.jp/RestSearchAPI/v3/?latitude=${lat}&longitude=${long}&keyid=${GNAVI_API_KEY}&range=1&hit_per_page=1`;

  try {
    const data =  await httpsGetRequest(requestUrl);
    const totalHits = data.total_hit_count;
    const restNum = getRandomRestaurantNumber(totalHits);

    const restRequest = requestUrl + `&offset_page=${restNum}`;
    const finalRestData =  await httpsGetRequest(restRequest);
    
    return finalRestData.rest[0];
  } catch (error) {
    return ERROR_TYPE.RESTAURANT;
  }
}

const webhookUrl = config('WEBHOOK_URL');
const sendSlackChannelPostRequest = async (payload, requestUrl = webhookUrl) => {
  const slackBody = constructResponse(payload);
  console.log('slackBody', slackBody);
  httpsPostRequest(requestUrl, slackBody);
}

module.exports = {
  fetchRestaurantData,
  fetchCoordsData,
  sendSlackChannelPostRequest,
};
