const markovStatusGenerator = require('./markov'),
  tweetCorpus = require('./read-local-tweets');

async function generateStatusesAsync() {
  let oldTweets = [],
    newStatuses = [];

  oldTweets = await tweetCorpus.getTweetsAsync();

  markovStatusGenerator.build(oldTweets);
  for (let i = 0; i < 10; i++) {
    try {
      newStatuses.push(markovStatusGenerator.generateStatus());
    } catch (error) {}
  }
  newStatuses.sort((a, b) => a.score < b.score);
  
  return newStatuses;
}

module.exports = {
  generateStatusesAsync
};
