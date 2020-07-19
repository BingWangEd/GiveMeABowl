const ERROR_TYPE = {
  RESTAURANT: 'restaurant_fetch_error',
  COORDS: 'coords_fetch_error',
  GET_REQUEST: 'get_request_error',
  SLACK_POST_REQUEST: 'post_to_slack_error',
}

const MESSAGE_TYPE = {
  ERROR: 'error_message',
  RESTAURANT: 'restaurant_result',
}

module.exports = {
  ERROR_TYPE,
  MESSAGE_TYPE,
};
