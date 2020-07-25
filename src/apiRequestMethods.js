const { ERROR_TYPE } = require('./enums');
const config = require('../config');
const { constructResponse, getRandomRestaurantNumber } = require('./helpers');
const { httpsGetRequest, httpsPostRequest } = require('./httpsMethods');
const { MESSAGE_TYPE } = require('./enums');

const errorMessage = {
  [ERROR_TYPE.RESTAURANT]: "It seems like we cannot find any restaurant around this place. I only know Tokyo\'s restaurants.",
  [ERROR_TYPE.COORDS]: "It seems like we cannot find this location.",
  [ERROR_TYPE.SLACK]: "We tried to post to this channel but failed.",
};

const findRestaurant = async (location) => {
  try {
    const coordsData = await fetchCoordsData(location);

    const restaurantResult1 = await fetchRestaurantData(coordsData);
    const totalHits = restaurantResult1.total_hit_count;
    const restNum = getRandomRestaurantNumber(totalHits);

    const finalRestaurantData =  await fetchRestaurantData(coordsData, restNum);
    const pickedRestaurant = finalRestaurantData.rest[0];

    const { name, address, url, pr, category, opentime } = pickedRestaurant;
    const payload = {
      name,
      address,
      url,
      description: pr.pr_short,
      category,
      opentime,
      message_type: MESSAGE_TYPE.RESTAURANT,
    }

    sendSlackChannelPostRequest(payload);
  } catch (error) {
    sendSlackChannelPostRequest({
      message_type: MESSAGE_TYPE.ERROR,
      error_message: errorMessage[error],
    });
    return;
  }
}

const fetchCoordsData = async (location) => {
  // get area longitude and latitude based on location name
  const locationNoSpace = location.replace(/ /g, "+");
  const OPEN_CAGE_API_KEY = config('OPEN_CAGE_API_KEY');
  const coordsRequestUrl = `https://api.opencagedata.com/geocode/v1/geojson?q=${locationNoSpace}&key=${OPEN_CAGE_API_KEY}&pretty=1`;

  try {
    const coordsData = await httpsGetRequest(coordsRequestUrl);
    const [ long, lat ] = coordsData.features[0].geometry.coordinates;
    return { lat, long }; 
  } catch (error) {
    console.log('get coords error: ', error);
    throw ERROR_TYPE.COORDS;
  }
}

const fetchRestaurantData = async (geoLocation, offsetPage = 1) => {
  const { lat, long } = geoLocation;
  const GNAVI_API_KEY = config('GNAVI_API_KEY');
  const requestUrl = `https://api.gnavi.co.jp/RestSearchAPI/v3/?latitude=${lat}&longitude=${long}&keyid=${GNAVI_API_KEY}&range=1&hit_per_page=1&&offset_page=${offsetPage}`;

  try {
    const data =  await httpsGetRequest(requestUrl);
    return data;
  } catch (error) {
    console.log('get restaurant error: ', error);
    throw ERROR_TYPE.RESTAURANT;
  }
}

const webhookUrl = config('WEBHOOK_URL');
const sendSlackChannelPostRequest = async (payload, requestUrl = webhookUrl) => {
  const slackBody = constructResponse(payload);
  try {
    httpsPostRequest(requestUrl, slackBody);
  } catch (error) {
    console.log('post to slack channel error: ', error);
    throw ERROR_TYPE.SLACK;
  }
}

module.exports = {
  findRestaurant
};
