const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  return new Promise((resolve) => {
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body);

    const contentType = event.headers['content-type'] ||
                        event.headers['Content-Type'] || '';

    const req = https.request({
      hostname: 'ivyafrica.app.n8n.cloud',
      path: '/webhook/7cdd8d37-2cbc-4e04-b24a-6d8fcbaeda26',
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': body.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ success: true })
        });
      });
    });

    req.on('error', (err) => {
      // Still return 200 — we don't want to block the user
      resolve({
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true })
      });
    });

    req.write(body);
    req.end();
  });
};
