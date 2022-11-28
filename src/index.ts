import app from './app';
import * as dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';

const PORT = process.env.PORT || 3009;

dotenv.config();
// localhost https
if (process.env.NODE_ENV !== 'production') {
  const server = https
    .createServer(
      {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
      },
      app,
    )
    .listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  server.setTimeout(120000);
} else {
  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`),
  );
  server.setTimeout(120000);
}
