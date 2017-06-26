const express = require('express');
const expressSession = require('express-session');
const mustacheExpress = require('mustache-express');
const parseUrl = require('parseurl');
const bodyParser = require('body-parser');
const routes = require("./routes/index")
var fs = require('fs');
const app = express();

app.use('/', routes);

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.listen(3000, function () {
  console.log('Successfully started Hangman application!');
});
