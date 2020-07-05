const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.config();

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  OAUTH_TOKEN: process.env.OAUTH_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  GNAVI_API_KEY: process.env.GNAVI_API_KEY,
  OPEN_CAGE_API_KEY: process.env.OPEN_CAGE_API_KEY,
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}