const express = require('express');
const mustacheExpress = require('mustache-express');
var fs = require('fs');

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const easyWords = [];
const normalWords = [];
const hardWords = [];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

var randomEasyWord = easyWords[getRandomIntInclusive(0, easyWords.length)];
var randomNormalWord = normalWords[getRandomIntInclusive(0, normalWords.length)];
var randomHardWord = hardWords[getRandomIntInclusive(0, hardWords.length)];

var sessionWord = '';
var playerGuessArr = [];
var playerGuess = '';
var sessionWordSplit = [];
var sessionWordBlanks = [];
var positionOfGuessArr = [];
var newPositionArr = [];
var temp = 0;
var guessCountTotal = 8;
var sessionWordBlanksCheck = '';
var errorResponse = 'Default Error'
var playerGuessCharCode = 0;
var playerGuessLowercase = '';

function playerGuessFunction(word, playerGuessInput){
  sessionWordSplit = word.split('');
  playerGuessCharCode = playerGuessInput.charCodeAt(0);
  if (playerGuessInput === '') { // validates if the textbox is not empty
    console.log('Please enter a valid guess.');
    errorResponse = 'Please enter a valid guess.';
    return;
  } else if (playerGuessInput.length > 1) { // validates if more than one letter is entered
    console.log('Please only guess one letter at a time.');
    errorResponse = 'Please only guess one letter at a time.';
    return;
  } else if (playerGuessCharCode < 97 || playerGuessCharCode > 122){ // validates if the guess is not a letter
    console.log('Please only use valid characters as a guess.');
    errorResponse = 'Please only use valid characters as a guess.';
    return;
  } else if (playerGuessArr.indexOf(playerGuessInput) != -1){ // validates that a guess is not repeated
    console.log('You already guessed that letter.');
    errorResponse = 'You already guessed that letter.';
    return;
  }
  playerGuessArr.push(playerGuessLowercase);
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
  if(newPositionArr.length === 0){ // if player makes a wrong guess, deduct a guess from the total count
    guessCountTotal--;
  }
  positionOfGuessArr = []; // resets the positional arrays for the next player guess
  newPositionArr = [];
  sessionWordBlanks.length = sessionWordSplit.length; // prevents blank array from increasing every loop iteration
  sessionWordBlanksCheck = sessionWordBlanks.join('');
  errorResponse = '';
}

function generateBlankArray(){ // function to generate the blank array
  sessionWordSplit = sessionWord.split('');
  for (let p = 0; p < sessionWordSplit.length; p++) {
    sessionWordBlanks.push('_');
  }
  sessionWordBlanks.length = sessionWordSplit.length;
}

module.exports = {
  getRandomIntInclusive: getRandomIntInclusive,
  playerGuessFunction: playerGuessFunction,
  generateBlankArray: generateBlankArray,
  words: words,
  easyWords: easyWords,
  normalWords: normalWords,
  hardWords: hardWords,
  randomEasyWord: randomEasyWord,
  randomNormalWord: randomNormalWord,
  randomHardWord: randomHardWord,
  sessionWord: sessionWord,
  playerGuessArr: playerGuessArr,
  playerGuess: playerGuess,
  sessionWordSplit: sessionWordSplit,
  sessionWordBlanks: sessionWordBlanks,
  positionOfGuessArr: positionOfGuessArr,
  newPositionArr: newPositionArr,
  temp: temp,
  guessCountTotal: guessCountTotal,
  sessionWordBlanksCheck: sessionWordBlanksCheck,
  errorResponse: errorResponse,
  playerGuessCharCode: playerGuessCharCode,
  playerGuessLowercase: playerGuessLowercase
}
