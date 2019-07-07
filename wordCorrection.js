const _ = require('lodash');

let trySwap = (word, ref) => {
  // swap letters from before or after the error.

  let result = {};

  for (let index = 0; index < word.length; index++) {

    let isFirstLetter = (index === 0),
      islastLetter = (index === word.length - 1);

    let newWord = '';
    if (!isFirstLetter) {
      let arrWord = word.split('');
      let temp = arrWord[index];
      arrWord[index] = arrWord[index - 1];
      arrWord[index - 1] = temp;

      newWord = arrWord.join('');
      if (ref[newWord] && !result[newWord]) {
        result[newWord] = true;
      }
    }

    if (!islastLetter) {
      let arrWord = word.split('');
      let temp = arrWord[index];
      arrWord[index] = arrWord[index + 1];
      arrWord[index + 1] = temp;

      newWord = arrWord.join('');

      if (ref[newWord] && !result[newWord]) {
        result[newWord] = true;
      }
    }
  }

  return _.keys(result);

}

let tryDeleting = (word, ref) => {

  let results = {};

  for (let index = 0; index < word.length; index++) {

    let arrWord = word.split('');
    arrWord.splice(index, 1);
    let newWord = arrWord.join('');
    if (ref[newWord] && !results[newWord]) {
      results[newWord] = true;
    }

  }

  return _.keys(results);
}

let tryAdding = (word, ref) => {

  let results = {};

  for (let index = 0; index <= word.length; index++) {

    // iterate over letters
    for (let l = 0; l < 26; l++) {
      let arrWord = word.split('');
      let letter = (l + 10).toString(36);

      arrWord.splice(index, 0, letter);

      let newWord = arrWord.join('');

      if (ref[newWord] && !results[newWord]) {
        results[newWord] = true;
      }
    }

  }

  return _.keys(results);

}

let tryAltSpelling = (word, ref) => {

  let results = {};

  for (let index = 0; index < word.length; index++) {

    // iterate over letters
    for (let l = 0; l < 26; l++) {
      let arrWord = word.split('');
      let letter = (l + 10).toString(36);

      arrWord.splice(index, 1, letter);

      let newWord = arrWord.join('');

      if (ref[newWord] && !results[newWord]) {
        results[newWord] = true;
      }
    }

  }

  return _.keys(results);

}


module.exports = {
  // correct: (word, guidelines, method) => {
  correct: (word, method) => {

    let correction = [];

    // look in all dictionaries.
    for (let i = 0; i < global.Dictionaries.length; i++) {
      let { wordReference, wordCount } = global.Dictionaries[i];

      let swaps = trySwap(word, wordReference);

      let deletes = tryDeleting(word, wordReference);

      let addings = tryAdding(word, wordReference);

      let altSpelling = tryAltSpelling(word, wordReference);

      let candidates = _.uniq(_.concat(swaps, deletes, addings, altSpelling));

      candidates = candidates.map((val, ind) => {
        return {
          word: val,
          hits: wordReference[val]
        }
      });

      let candidatesSorted = _.sortBy(candidates, ['hits']);

      correction.push(candidatesSorted);

      debugger;
    }

    return correction;
  }
}