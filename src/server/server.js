/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom';
import serverRoutes from '../frontend/routes/serverRoutes'
import reducer from '../frontend/reducers';
import initialState from '../frontend/utils/initialState';

dotenv.config();

const { ENV, PORT} = process.env;
const app = express();

if (ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Development conifg');
    const webpackConfig = require('../../webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    const serverConfig = { port: PORT, hot: true };

    app.use(webpackDevMiddleware(compiler, serverConfig));
    app.use(webpackHotMiddleware(compiler));


    const setResponse = (html) => {
      return(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta charset="utf-8" />
        <link rel="stylesheet" href="assets/app.css" type="text/css">
        <title>RichyFlix</title>
      </head>
      <body>s
        <div id="app">${html}</div>
        <script src="assets/app.js" type="text/javascript"></script>
      </body>
    </html>
    `);
  };

    const renderApp = (req, res) => {
      const store = createStore(reducer, initialState);
      const html = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={{}}>
            {renderRoutes(serverRoutes)}
          </StaticRouter>
        </Provider>
      );

      res.send(setResponse(html));
    };

    app.get('*', renderApp);

    app.listen(PORT, (err) => {
      if (err) {
          // eslint-disable-next-line no-console
          console.log('hubo un error', err);
      } else {
          // eslint-disable-next-line no-console
          console.log(`servidor escuchando en server ${PORT}`);
      }
  })
};




