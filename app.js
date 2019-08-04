const _ = require('lodash'),
  express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser');

const Dictionary = require('./dic/Dictionary'),
  wordCheck = require('./wordChecker'),
  wordCorrection = require('./wordCorrection');

const app = express(),
  port = 3003;

// initialize global var.
global.Dictionaries = null;
// 
global.history = {};


app.use(express.static('./static/'));  // static content
app.use(cors());  //enalbe cross original access.


app.use(express.json()); // to support JSON-encoded bodies


// build the default dictionary *async*
// store in global.Dictionaries
let buildDefaultDictionary = async () => {

  let dicDefault = new Dictionary('./static/text_lib/corpus-challenge5.txt');
  // let dicDefault = new Dictionary('./static/text_lib/test.txt');

  await dicDefault.buildDictionary();
  console.log('Default Dictionary built');
  global.Dictionaries = [dicDefault];
};

buildDefaultDictionary();

// request handler
let lookUpHandler = (req, res) => {
  console.log('request received.');

  // for GET and POST
  let word = req.query.word || req.body.word;
  // shallow, indepth, thorough
  let method = req.query.word || req.body.word;

  if (!method) {
    method = 'shallow'
  }

  if (!word) {
    res.json('no word.');
    return;
  }

  try {
    console.log('looking up for word : ' + word);
    let { isFound, results } = wordCheck.checkUp(word);

    if (isFound) {
      console.info('word : ' + word + ' was found.');
      res.json("found");
    } else {
      console.error('word :' + word + ' not found. correcting word.');
      // res.send(wordCorrection.correct(word, results, method));
      // res.set('Content-Type', 'application/json');
      res.json(wordCorrection.correct(word, method));
    }

  } catch (e) {
    if (e.message === 'noDic') {
      res.send('No Dictionary Loaded.');
      return;
    }

    throw e;
  }

  res.end();

}

app.get('/lookup', lookUpHandler);
app.post('/lookup', lookUpHandler);
app.listen(port, () => { console.log('App is listening at port ' + port + '') });