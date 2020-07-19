const { MESSAGE_TYPE } = require('./enums');

const constructResponse = (payload) => {
  switch(payload.message_type) {
    case MESSAGE_TYPE.RESTAURANT:
      const { name, address, url, description, category, opentime } = payload;
      const descriptionModified = description.length === 0 ? `Owner\'s too lazy to say anything about this restaurant. All I know is it offers *${category}* food ...` : description;
      const opentimeModified = description.length === 0 ? `No idea ...` : opentime;

      return {
        mkdwn: true,
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*${name}* @ ${address}`
            }
          },
        ],
        attachments: [
          {
            color: '#F6D55C',
            blocks: [
              {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `:chopsticks: <${url}| Learn More>`
                }
              },
              {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `:bento: ${descriptionModified}`
                }
              },
              {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `:watch: ${opentimeModified}`
                }
              }
            ],
          },
        ],
      }
    case MESSAGE_TYPE.ERROR:
      return {
        mkdwn: true,
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `This is awkward :zany_face:. ${payload.error_message} Try again? :drooling_face:`
            }
          },
        ],
      };
    default:
      return {
        mkdwn: true,
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": 'This is awkward :zany_face:. Something went wrong. Try again? :drooling_face:'
            }
          },
        ],
      };
  };
};

const getRandomRestaurantNumber = (totoalHit) => {
  return Math.floor(Math.random()*(totoalHit-1)+1);
}

module.exports = {
  constructResponse,
  getRandomRestaurantNumber
};