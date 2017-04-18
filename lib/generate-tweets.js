const markovTweetGenerator = require('./markov'),
  tweetCorpus = require('./read-local-tweets');

async function generateTweetsAsync() {
  let oldTweets = [],
    newTweets = [];

  oldTweets = await tweetCorpus.getTweetsAsync();

  markovTweetGenerator.build(oldTweets);
  for (let i = 0; i < 10; i++) {
    try {
      newTweets.push(markovTweetGenerator.generateTweet());
    } catch (error) {
      return false;
    }
  }
  newTweets.sort((a, b) => a.score < b.score);
  newTweets.forEach( (tweet) => console.log( tweet.string ) );

  return newTweets;
}

module.exports = {
  generateTweetsAsync
};
