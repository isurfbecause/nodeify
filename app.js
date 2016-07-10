const nodeify = require('./nodeify');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', function() {
  nodeify();
  console.log('ran nodify');
});

app.listen(port, () => console.log(`listening on on port ${port}`));
