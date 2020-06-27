require('dotenv').config();
const http = require('http');
const fetchRestData = require('./src/fetchRestData');
const { parse } = require('querystring');
const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    collectRequestData(req, result => {
      console.log(result);
      // send response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      // const json = JSON.stringify({
      //   test: 'Let\'s see where you should go ...',
      // })
      res.write('Let\'s see where you should go ...');
      res.end()
    });

    fetchRestData();
  }
});

const  collectRequestData = (request, callback) => {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if(request.headers['content-type'] === FORM_URLENCODED) {
    // parse and read data
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        callback(parse(body));
    });
  }
  else {
    callback(null);
  }
}

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});
