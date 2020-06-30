const https = require('https');

const httpsPostRequest = async (requestUrl, postMessage) => {
  const { name, address, url, description, category } = postMessage;
  const descriptionModified = description.length === 0 ? `Owner\'s too lazy to say anything about this restaurant. All I know is it offers *${category}* food ...` : description;
  const slackBody = {
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
          }
        ],
      },
    ],
  }
  
  const options = {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    }
  }

  return new Promise((resolve, reject) => {
    const req = https.request(requestUrl, options, (res) => {
      let data = '';
  
      console.log('Status Code:', res.statusCode);
  
      res.on('data', (chunk) => {
          data += chunk;
      });
  
      res.on('end', () => {
        console.log('data: ', data);
        resolve(data);
      });
  
    }).on("error", (err) => {
        reject(new Error(`Post request error: ${err.message}`));
    });
  
    req.write(JSON.stringify(slackBody));
    req.end();
  })
}

module.exports = httpsPostRequest;
