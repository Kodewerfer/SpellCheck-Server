const _ = require('lodash');

// Try to quickly look up for the word in dictionary use object index.
let lookUpWordQuick = (hiCount, word) => {

  word = word.toLocaleLowerCase();

  // found the word.
  if (hiCount[word]) {
    return true;
  }

  return false;
}

// *** deprecated ***
let lookUpwordFine = (dictionary, word) => {
  word = word.toLocaleLowerCase();

  let lookUpString = "dictionary";
  let result = {}

  let validString = "";
  for (let i = 0; i < word.length; i++) {
    lookUpString += "[" + "'" + word[i] + "'" + "]";
    result = eval(lookUpString);

    if (!result || _.isEmpty(result)) {

      return {
        errorIndex: i,
        validString: validString
      };

    }

    validString = lookUpString;

  }

  return 'noRootError';
}

let checkUpHelper = (word) => {

  let isFound = false,
    results = {};

  for (let i = 0; i < global.Dictionaries.length; i++) {

    let dictionary = global.Dictionaries[i],
      dictionaryActual = dictionary.dictionary,
      wordReference = dictionary.wordReference;

    if (lookUpWordQuick(wordReference, word)) {
      isFound = true;
      break;

    } else {
      isFound = false;
      // results[i] = lookUpwordFine(dictionaryActual, word);
    }


  }

  return {
    isFound: isFound,
    results: results
  }
}

module.exports = {
  checkUp: (word) => {

    if (!word) {
      return false;
    }

    if (!global.Dictionaries || !global.Dictionaries.length) {
      throw new Error('noDic');
    }

    return checkUpHelper(word);

  }
};