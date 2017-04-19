let Markov = require('markov-strings'),
  markov;

const newStatusOptions = {
  maxLength: Math.floor(Math.random() * (140 - 100)) + 100,
  minWords: 5,
  minScore: Math.floor(Math.random() * (90 - 50)) + 50,
  maxTries: 20000
};

module.exports.build = (tweets) => {
  markov = new Markov(tweets);
  markov.buildCorpusSync();
};

module.exports.generateStatus = () => markov.generateSentenceSync(newStatusOptions);
module.exports.generateStatusAsync = () => markov.generateSentence(newStatusOptions);
