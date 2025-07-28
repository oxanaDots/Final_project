
const express = require('express');
const cors    = require('cors');
const data    = require('./enterprises.json');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json(data);
});

module.exports = app;
