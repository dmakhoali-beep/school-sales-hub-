const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : Buffer.from(event.body, 'utf8');

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'ivyafrica.app.n8n.cloud',
      path: '/webhook/7cdd8d37-2cbc-4e04-b24a-6d8fcbaeda26',
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': rawBody.length
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true })
      }));
    });
    req.on('error', () => resolve({
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    }));
    req.write(rawBody);
    req.end();
  });
};
