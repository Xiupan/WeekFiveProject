const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const functions = require('../models/functions');
// const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(request, response){
  return response.render('index');
});

app.get('/easy', function(request, response){
  functions.sessionWord = functions.randomEasyWord;
  functions.generateBlankArray();
  return response.render('main-scene', {
    generatedWord: functions.sessionWordSplit,
    hiddenWord: functions.sessionWordBlanks,
    guessesRemaining: functions.guessCountTotal
  });
});

app.get('/normal', function(request, response){
  functions.sessionWord = functions.randomNormalWord;
  functions.generateBlankArray();
  return response.render('main-scene', {
    generatedWord: functions.sessionWordSplit,
    hiddenWord: functions.sessionWordBlanks,
    guessesRemaining: functions.guessCountTotal
  });
});

app.get('/hard', function(request, response){
  functions.sessionWord = functions.randomHardWord;
  functions.generateBlankArray();
  return response.render('main-scene', {
    generatedWord: functions.sessionWordSplit,
    hiddenWord: functions.sessionWordBlanks,
    guessesRemaining: functions.guessCountTotal
  });
});

app.get('/lose', function(request, response){
  functions.randomEasyWord = functions.easyWords[functions.getRandomIntInclusive(0, functions.easyWords.length)];
  functions.randomNormalWord = functions.normalWords[functions.getRandomIntInclusive(0, functions.normalWords.length)];
  functions.randomHardWord = functions.hardWords[functions.getRandomIntInclusive(0, functions.hardWords.length)];
  functions.sessionWord = '';
  functions.playerGuessArr = [];
  functions.playerGuess = '';
  functions.sessionWordSplit = [];
  functions.sessionWordBlanks = [];
  functions.positionOfGuessArr = [];
  functions.newPositionArr = [];
  functions.guessCountTotal = 8;
  return response.render('lose');
});

app.get('/win', function(request, response){
  functions.randomEasyWord = functions.easyWords[functions.getRandomIntInclusive(0, functions.easyWords.length)];
  functions.randomNormalWord = functions.normalWords[functions.getRandomIntInclusive(0, functions.normalWords.length)];
  functions.randomHardWord = functions.hardWords[functions.getRandomIntInclusive(0, functions.hardWords.length)];
  functions.sessionWord = '';
  functions.playerGuessArr = [];
  functions.playerGuess = '';
  functions.sessionWordSplit = [];
  functions.sessionWordBlanks = [];
  functions.positionOfGuessArr = [];
  functions.newPositionArr = [];
  functions.guessCountTotal = 8;
  return response.render('win');
});

app.post('/main-scene', function(request, response){
  functions.playerGuess = request.body.userGuessField;
  functions.playerGuessLowercase = functions.playerGuess.toLowerCase();
  functions.playerGuessFunction(functions.sessionWord, functions.playerGuessLowercase);
  if(functions.guessCountTotal <= 0){
    return response.redirect('/lose');
  }
  if (functions.sessionWordBlanksCheck === functions.sessionWord && functions.guessCountTotal > 0) {
    return response.redirect('/win');
  }
  return response.render('main-scene', {
    generatedWord: functions.sessionWord,
    lettersGuessed: functions.playerGuessArr,
    hiddenWord: functions.sessionWordBlanks,
    guessesRemaining: functions.guessCountTotal,
    error: functions.errorResponse
  });
})

module.exports = app;
