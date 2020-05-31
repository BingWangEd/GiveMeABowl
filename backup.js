const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = SLACK_SIGNING_SECRET;
const http = require('http');
const slackEvents = createEventAdapter(slackSigningSecret);
const port = 3000;
//${server.address().port}

const startServer = async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);

  // Log a message when the server is ready
  console.log(`Listening for events on ${server.address().port}`);
}

startServer();

const bot = new SlackBot({
  token: oathToken,
  name: 'bOwlBot'
});

// Start Handler
bot.on('start', () => {
  const params = {
    icon_emoji: ':smiley:'
  }

  bot.postMessageToChannel('general', 'Get ready to eat!', params);
})


const request =  require('request-promise');
const getData = async function() {
  const json = await request({
    url: 'https://next.json-generator.com/api/json/get/4kkDelMju',
    json: true
  });

  return json.map(person => ({
    age: person.age,
    email: person.email,
  }))
}


//const inquiry = https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=${GnaviRestAPIKey}&latitude=${location.lat}&longitude=${location.log}&hit_per_page=${HIT_PER_PAGE}&range=${RANGE}&offset=${restNumber}`;

const sendRquest = async function() {
  try {
    const people = await getData();
    console.log(people)

    const slackBody = {
      mkdwn: true,
      text: '<!channel_name>Slack Msg',
      attachments: people.map(person => ({
        color: 'good',
        text: `*${person.email}* and their name is ${person.email}`,
    }))
}

const res = await request({
    url: `https://hooks.slack.com/services/${webHook}`,
    method: 'POST',
    body: slackBody,
    json: true
  })

  console.log(res)

  } catch (e) {
    console.log('our error:', e);
  }
  debugger;
};

sendRquest();