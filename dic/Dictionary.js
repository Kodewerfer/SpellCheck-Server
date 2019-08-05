const fs = require('fs');
const _ = require('lodash');
const readline = require('readline');

let dictionary = {};
let wordReference = {};
let wordCount = 0;

// ** deprecated **
// recursive, loop each word in the array, to init entries.
let initDictionary = (words, ind) => {

  if (!ind) {
    ind = 0;
  }

  if (ind === words.length) {
    return true;
  }

  let theWord = words[ind];
  if (theWord !== '') {
    initWord(theWord);
  }

  return initWordReference(words, ind + 1);

}

// recursively adding each word into the dictionary.
let initWordReference = (words, ind) => {

  if (!ind) {
    ind = 0;
  }

  if (ind === words.length) {
    return wordCount;
  }

  let theWord = words[ind];
  if (theWord !== '') {
    initWord(theWord);
    wordCount++;
  }

  return initWordReference(words, ind + 1);

}

// **deprecated**
// recursive, check if word exists, create new entry otherwise.
let initEntries = (word, ind, prevDicEnt) => {

  if (ind === word.length) {
    return false;
  }

  if (!ind) {
    ind = 0;
  }

  let letter = word[ind];

  if (!prevDicEnt) {
    prevDicEnt = dictionary;
  }

  // create a new entry if dose not exsits.
  let currentDicEnt = prevDicEnt[letter];
  let nextEnt = {};
  // create enty if not found
  if (!currentDicEnt) {
    currentDicEnt = prevDicEnt;
    currentDicEnt[letter] = {};

    if (ind + 1 === word.length) {
      currentDicEnt[letter] = {
        'word': word
      }
      wordReference[word] = 1;
    }
    nextEnt = currentDicEnt[letter];
  } else {
    // move on to the next otherwise.
    nextEnt = currentDicEnt;
  }

  if (currentDicEnt['word'] === word) {
    wordReference[word] += 1;
    return true;
  }

  return initWord(word, ind + 1, nextEnt);
}

let initWord = (word) => {

  if (wordReference[word]) {
    wordReference[word] += 1;
  } else {
    wordReference[word] = 1;
  }

  return true;
}


class Dictionary {

  constructor(file) {
    this.baseFile = file
    this.wordCount = 0;
    this.wordReference = null;
    return this;
  }

  buildDictionary() {
    let lineReading = readline.createInterface({
      input: fs.createReadStream(this.baseFile)
    });

    return new Promise((resolve, reject) => {

      try {

        lineReading.on('line', (data) => {

          // remove all punctuations
          let punctuationlessLine = _.replace(data, /[\\\+\[\]\|<>?,\/#!$%\^&\*;:{}=\_`~()"“”]/g, "");
          punctuationlessLine = _.replace(punctuationlessLine, /\s{2,}/g, " ");
          punctuationlessLine = _.replace(punctuationlessLine, /\./g, "");
          punctuationlessLine = punctuationlessLine.toLocaleLowerCase();

          // remove all number
          let numberlessLine = _.replace(punctuationlessLine, /[0-9]/g, '');
          // remove whitespace before and after the words.
          numberlessLine = _.trim(numberlessLine);

          // turn the line into an array.
          // *may have extra whitespaces in*
          numberlessLine = numberlessLine.split(' ');

          if (numberlessLine && numberlessLine.length !== 0 && numberlessLine[0] !== '') {
            initWordReference(numberlessLine);
          }

        });

        lineReading.on('close', () => {
          this.wordReference = wordReference;
          this.wordCount = wordCount;
          resolve(true);
        });

      } catch (e) {
        reject(e);
      }


    });

  }
}

module.exports = Dictionary



