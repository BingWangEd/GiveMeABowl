const ERROR_TYPE = {
  RESTAURANT: 'restaurant_fetch_error',
  COORDS: 'coords_fetch_error',
  SLACK: 'post_to_slack_channel_error'
}

const MESSAGE_TYPE = {
  ERROR: 'error_message',
  RESTAURANT: 'restaurant_result',
}

module.exports = {
  ERROR_TYPE,
  MESSAGE_TYPE,
};
