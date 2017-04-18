const markovTweetGenerator = require('./markov'),
      tweetCorpus = require('./read-local-tweets');

async function main(){
  let tweets = await tweetCorpus.getTweetsAsync(),
    newTweets = [],
    markov;
  
  markov = markovTweetGenerator.build(tweets);
  for(let i = 0; i < 10; i++){
    try{
      newTweets.push(markovTweetGenerator.generateTweet())
    } catch(error) {
      return false;
    }
  }
  newTweets.sort((a, b) => a.score < b.score);
  newTweets.forEach( (tweet) => console.log( tweet.string ) );
}

main();