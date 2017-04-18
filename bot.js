const markovTweetGenerator = require('./markov'),
  tweetDownloader = require('./download-tweets'),
  tweetCorpus = require('./read-local-tweets');


async function main() {
  let oldTweets = [],
    newTweets = [];

  await tweetDownloader.run();
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
}


main();