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
  }
  if(words[i].length >= 6 && words[i].length <= 8){
    normalWords.push(words[i]);
  }
  if(words[i].length >= 8){
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

var sessionWord = ''; // variable to store the generated word for the current round, no matter what difficulty
var playerGuessArr = [];
var sessionWordSplit = [];
var sessionWordBlanks = [];
var positionOfGuessArr = [];
var newPositionArr = [];
var temp = 0;
var guessCountTotal = 8;
var sessionWordBlanksCheck = '';

function playerGuessFunction(word, playerGuessInput){
  sessionWordSplit = word.split('');
  for (let p = 0; p < sessionWordSplit.length; p++) { // clones the session word as a blank array
    sessionWordBlanks.push('_');
  }
  for (let i = 0; i < sessionWordSplit.length; ++i) { // compares player guess to an array of the chosen word
    positionOfGuessArr.push(sessionWordSplit.indexOf(playerGuessInput, i));
  }
  for (let w = 0; w < positionOfGuessArr.length; ++w) { // only takes unique positions and pushes them to a new array
    temp = positionOfGuessArr[w];
    if(positionOfGuessArr[w] !== positionOfGuessArr[w+1]){
      newPositionArr.push(positionOfGuessArr[w]);
    }
  }
  for (let q = 0; q < newPositionArr.length; ++q) { // removes the -1 at the end of the player guess array
    if(newPositionArr[q] === -1){
      newPositionArr.splice(q,1);
    }
  }
  for (let r = 0; r < sessionWordBlanks.length; r++) { // nested if in a for in a for... this compares the positional array to the blank array and swaps out a blank for the actual letter if there is a match!
    for (let y = 0; y < newPositionArr.length; y++) {
      if(r === newPositionArr[y]){
        sessionWordBlanks[r] = sessionWordSplit[r];
      }
    }
  }
  if(newPositionArr.length === 0){
    guessCountTotal--;
  }
  positionOfGuessArr = []; // resets the positional arrays for the next player guess
  newPositionArr = [];
  sessionWordBlanks.length = sessionWordSplit.length; // prevents blank array from increasing every loop iteration
  sessionWordBlanksCheck = sessionWordBlanks.join('');
}

function generateBlankArray(){ // function to generate the blank array
  sessionWordSplit = sessionWord.split('');
  for (let p = 0; p < sessionWordSplit.length; p++) {
    sessionWordBlanks.push('_');
  }
  sessionWordBlanks.length = sessionWordSplit.length;
}

app.get('/', function(request, response){
  return response.render('index');
});

app.get('/easy', function(request, response){
  sessionWord = randomEasyWord;
  generateBlankArray();
  return response.render('main-scene', {
    generatedWord: sessionWordSplit,
    hiddenWord: sessionWordBlanks,
    guessesRemaining: guessCountTotal
  });
});

app.get('/normal', function(request, response){
  sessionWord = randomNormalWord;
  generateBlankArray();
  return response.render('main-scene', {
    generatedWord: sessionWordSplit,
    hiddenWord: sessionWordBlanks,
    guessesRemaining: guessCountTotal
  });
});

app.get('/hard', function(request, response){
  sessionWord = randomHardWord;
  generateBlankArray();
  return response.render('main-scene', {
    generatedWord: sessionWordSplit,
    hiddenWord: sessionWordBlanks,
    guessesRemaining: guessCountTotal
  });
});

app.get('/lose', function(request, response){
  return response.render('lose');
})

app.get('/win', function(request, response){
  return response.render('win');
})

app.post('/main-scene', function(request, response){
  playerGuessArr.push(request.body.userGuessField);
  playerGuessFunction(sessionWord, request.body.userGuessField);
  if(guessCountTotal <= 0){
    return response.redirect('/lose');
  }
  console.log(sessionWordBlanksCheck, sessionWord, sessionWordBlanks);
  if (sessionWordBlanksCheck === sessionWord && guessCountTotal > 0) {
    return response.redirect('/win');
  }
  return response.render('main-scene', {
    generatedWord: sessionWord,
    lettersGuessed: playerGuessArr,
    hiddenWord: sessionWordBlanks,
    guessesRemaining: guessCountTotal
  })
})
