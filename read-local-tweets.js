const readline = require('readline');
const fs = require('fs');
const utf8 = require('to-utf-8');
const he = require('he');

function isNotRetweet(tweet){
  return tweet.indexOf("RT @") != 0 ;
}
function isOkayTweet(tweet){
  return isNotRetweet(tweet);
}

function filterTweets(tweets){
  return tweets.filter( isOkayTweet );
}

function stripAtsFromTweets(tweets){
  return tweets.map( (tweet) => tweet.replace( /@([\dA-Za-z\-\_]+) ?/g, '' ) );
}

function stripUrlsFromTweets(tweets){
  return tweets.map( (tweet) => tweet.replace( / ?https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, '' ) );
}

function decodeHTMLFromTweets(tweets){
  console.log(tweets.length);
  return tweets.map ( ( tweet) => he.decode(tweet) )
}

function cleanUpTweets(tweets){
  tweets = filterTweets(tweets);
  tweets = stripAtsFromTweets(tweets);
  tweets = stripUrlsFromTweets(tweets);
  tweets = decodeHTMLFromTweets(tweets);
  return tweets;
}

module.exports.readTweetsAsync = () =>{
  return new Promise((resolve, reject) => {
    let allTweets = [];
    const rl = readline.createInterface({
      input: fs.createReadStream('tweets.txt').pipe(utf8())
    });

    rl.on('line', (line) => allTweets.push(line) )

    rl.on('close', () => resolve(cleanUpTweets(allTweets) ) )
 });
}