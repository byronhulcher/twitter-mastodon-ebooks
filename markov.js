let Markov = require('markov-strings'),
  markov;

const newTweetOptions = {
  maxLength: 140,
  minWords: 3,
  minScore: 80,
  maxTries: 20000
};

module.exports.build = (tweets) => {
  markov = new Markov(tweets);
  markov.buildCorpusSync();
};

module.exports.generateTweet = () => markov.generateSentenceSync(newTweetOptions);

module.exports.generateTweetAsync = () => markov.generateSentenceSync(newTweetOptions);