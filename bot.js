const tweetDownloader = require('./lib/download-tweets'),
  tweetGenerator = require('./lib/generate-tweets');

async function main() {
  let newTweets = [];

  await tweetDownloader.run();

  newTweets = await tweetGenerator.generateTweetsAsync();
  newTweets.forEach( (tweet) => console.log( tweet.string ) );
}

main();