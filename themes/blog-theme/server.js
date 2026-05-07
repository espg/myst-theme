// Express-based server for serving prod-built Remix artifacts.
// Modeled on the published myst-templates/book-theme zip's server.js.
// Mystmd's `myst build --html` runs `npm run start` from this dir; that
// command executes `node ./server.js` here, which serves the static
// public/build/_assets/ and routes everything else through the Remix
// handler in build/index.js.
//
// This avoids `remix dev` (which the source theme's `npm run start`
// invokes) — `remix dev` deletes public/build/ on startup, breaking the
// asset copy that mystmd does at the end of the static-html build.
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { createRequestHandler } = require('@remix-run/express');
const { installGlobals } = require('@remix-run/node');

installGlobals();

const BUILD_DIR = path.join(process.cwd(), 'build');

const app = express();

app.use(compression());
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/myst_assets_folder', express.static('public/build', { immutable: true, maxAge: '1y' }));

// Everything else (favicon.ico, thebe assets, …) is cached for an hour.
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

app.all(
  '*',
  createRequestHandler({
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
  }),
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // mystmd's `myst start` / `myst build --html` parses this stdout line for
  // the "server ready" signal — it specifically scans for "http://" to detect
  // when to begin crawling. Don't change the format.
  console.log(`Express server listening at http://localhost:${port}`);
});
