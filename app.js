// const nodeify = require('./nodeify');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  //call nodeify
});

app.listen(port);