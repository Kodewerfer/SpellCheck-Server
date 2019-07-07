const _ = require('lodash'),
  express = require('express')

const Dictionary = require('./dic/Dictionary'),
  wordCheck = require('./wordChecker'),
  wordCorrection = require('./wordCorrection');

const app = express(),
  port = 3003;

// initialize global var.
global.Dictionaries = null;
// 
global.history = {};

// static content
app.use(express.static('./static/'));

// build the default dictionary *async*
// store in global.Dictionaries
let buildDefaultDictionary = async () => {

  let dicDefault = new Dictionary('./static/text_lib/corpus-challenge5.txt');
  // let dicDefault = new Dictionary('./static/text_lib/1.text');

  await dicDefault.buildDictionary();
  console.log('Default Dictionary built');
  global.Dictionaries = [dicDefault];
}
buildDefaultDictionary();

// request handler
let lookUpHandler = (req, res) => {
  // res.send('Done');

  let word = req.query.word;

  // shallow, indepth, thorough
  let method = req.query.method;

  if (!method) {
    method = 'shallow'
  }

  if (!word) {
    res.send('no word.');
    return;
  }

  try {

    let { isFound, results } = wordCheck.checkUp(word);

    if (isFound) {
      res.send("found");
    } else {
      // res.send(wordCorrection.correct(word, results, method));
      res.send(wordCorrection.correct(word, method));
    }

  } catch (e) {
    if (e.message === 'noDic') {
      res.send('No Dictionary Loaded.');
      return;
    }

    throw e;
  }



}

app.get('/lookup', lookUpHandler);
app.post('/lookup', lookUpHandler);
app.listen(port, () => { console.log('App is listening at port ' + port + '') });