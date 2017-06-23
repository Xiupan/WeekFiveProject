const express = require('express');
const expressSession = require('express-session');
const mustacheExpress = require('mustache-express');
const parseUrl = require('parseurl');
const bodyParser = require('body-parser');

var fs = require('fs');
var Busboy = require('busboy');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, function () {
  console.log('Successfully started Hangman application!');
});

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const easyWords = [];
const normalWords = [];
const hardWords = [];

// for loop that creates different arrays of varying difficulty words
for (let i = 0; i < words.length; ++i) {
  if(words[i].length >= 4 && words[i].length <= 6){
    easyWords.push(words[i]);
  } else if(words[i].length >= 6 && words[i].length <= 8){
    normalWords.push(words[i]);
  } else if(words[i].length >= 8){
    hardWords.push(words[i]);
  }
}

// function to grab a random integer between a specified min and max
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// uses the random integer function to select a random word from the proper array of words
var randomEasyWord = easyWords[getRandomIntInclusive(0, easyWords.length)];
var randomNormalWord = normalWords[getRandomIntInclusive(0, normalWords.length)];
var randomHardWord = hardWords[getRandomIntInclusive(0, hardWords.length)];

app.get('/', function(request, response){
  response.render('index');
});

app.get('/easy', function(request, response){
  response.render('main-scene', {
    generatedWord: randomEasyWord
  });
});

app.get('/normal', function(request, response){
  response.render('main-scene', {
    generatedWord: randomNormalWord
  });
});

app.get('/hard', function(request, response){
  response.render('main-scene', {
    generatedWord: randomHardWord
  });
});

app.post('/main-scene', function(request, response){
  response.render('main-scene', {

  })
  console.log(request.body.userGuessField);
})
