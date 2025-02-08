const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const cityRouter = require('./routes/city');
const errorController = require('./controller/error');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const docsConfig = require('./docs/config');

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: false, // MUST be false if using wildcard '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept, Origin, X-Requested-With'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/cities', cityRouter);

// DOCS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docsConfig));

app.all('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
