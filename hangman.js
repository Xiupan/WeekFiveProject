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

var sessionWord = ''; // variable to store the generated word for the current round, no matter what difficulty
var playerGuessArr = [];
var sessionWordSplit = [];
var sessionWordBlanks = [];
var positionOfGuessArr = [];
var newPositionArr = [];
var temp = 0;

function playerGuessFunction(word, playerGuessInput){
  sessionWordSplit = word.split('');
  for (let p = 0; p < sessionWordSplit.length; p++) { // clones the session word as a blank array
    sessionWordBlanks.push('_');
  }
  for (let i = 0; i < sessionWordSplit.length; ++i) { // compares player guess to an array of the chosen word
    positionOfGuessArr.push(sessionWordSplit.indexOf(playerGuessInput, i));
    console.log('Checking: ' + sessionWordSplit[i]);
  }
  for (let w = 0; w < positionOfGuessArr.length; ++w) { // only takes unique positions and pushes them to a new array
    temp = positionOfGuessArr[w];
    if(positionOfGuessArr[w] !== positionOfGuessArr[w+1]){
      newPositionArr.push(positionOfGuessArr[w]);
      console.log('Unique position found, pushing: ' + newPositionArr);
    }
  }
  for (let q = 0; q < newPositionArr.length; ++q) { // removes the -1 at the end of the player guess array
    if(newPositionArr[q] === -1){
      newPositionArr.splice(q,1);
      console.log('-1 found, splicing: ' + newPositionArr[q]);
    }
  }
  console.log('Target word to apply guesses to: ' + sessionWordSplit);
  console.log('Cloned word full of blanks: ' + sessionWordBlanks);
  for (let r = 0; r < sessionWordBlanks.length; r++) { // nested if in a for in a for... this compares the positional array to the blank array and swaps out a blank for the actual letter if there is a match!
    console.log('Running thru sessionWordBlanks: ' + r);
    for (let y = 0; y < newPositionArr.length; y++) {
      if(r === newPositionArr[y]){
        console.log('Running thru newPositionArr: ' + newPositionArr[y]);
        sessionWordBlanks[r] = sessionWordSplit[r];
      }
      console.log('Replacing blank with the guessed letter: ' + sessionWordBlanks);
    }
  }
}

app.get('/', function(request, response){
  return response.render('index');
});

app.get('/easy', function(request, response){
  sessionWord = randomEasyWord;
  sessionWordSplit = sessionWord.split('');
  return response.render('main-scene', {
    generatedWord: sessionWordSplit,
    hiddenWord: sessionWordBlanks
  });
});

app.get('/normal', function(request, response){
  sessionWord = randomNormalWord;
  sessionWordSplit = sessionWord.split('');
  return response.render('main-scene', {
    generatedWord: sessionWordSplit,
    hiddenWord: sessionWordBlanks
  });
});

app.get('/hard', function(request, response){
  sessionWord = randomHardWord;
  sessionWordSplit = sessionWord.split('');
  return response.render('main-scene', {
    generatedWord: sessionWordSplit,
    hiddenWord: sessionWordBlanks
  });
});

app.post('/main-scene', function(request, response){
  playerGuessArr.push(request.body.userGuessField);
  playerGuessFunction(sessionWord, request.body.userGuessField);
  console.log('The user\'s request: ' + request.body.userGuessField);
  console.log('Stored word split into an array: ' + sessionWordSplit);
  console.log('Player\'s Guess: ' + playerGuessArr);
  console.log('Stored word: ' + sessionWord);
  return response.render('main-scene', {
    generatedWord: sessionWord,
    lettersGuessed: playerGuessArr,
    hiddenWord: sessionWordBlanks
  })
})
