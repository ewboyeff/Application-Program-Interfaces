import server from '../dist/server/server.js';

export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url || '/', `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
  }

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : req;

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body,
    duplex: body ? 'half' : undefined,
  });

  const response = await server.fetch(request);

  res.status(response.status);
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }

  const buf = Buffer.from(await response.arrayBuffer());
  res.end(buf);
}
