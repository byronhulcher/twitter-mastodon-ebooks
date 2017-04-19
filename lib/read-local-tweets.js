const readline = require('readline'),
  fs = require('fs'),
  utf8 = require('to-utf-8');

function isNotRetweet(tweet) {
  return tweet.indexOf('RT @') != 0 ;
}
function isOkayTweet(tweet) {
  return isNotRetweet(tweet);
}

function filterTweets(tweets) {
  return tweets.filter( isOkayTweet );
}

function stripAtsFromTweets(tweets) {
  return tweets.map( (tweet) => tweet.replace( /@([\dA-Za-z\-\_]+) ?/g, '' ) );
}

function stripUrlsFromTweets(tweets) {
  return tweets.map( (tweet) => tweet.replace( / ?https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, '' ) );
}



function cleanUpTweets(tweets) {
  tweets = filterTweets(tweets);
  tweets = stripAtsFromTweets(tweets);
  tweets = stripUrlsFromTweets(tweets);
  return tweets;
}

module.exports.getTweetsAsync = () =>{
  return new Promise((resolve) => {
    let allTweets = [];
    const rl = readline.createInterface({
      input: fs.createReadStream('./.data/tweets.txt').pipe(utf8())
    });

    rl.on('line', (line) => allTweets.push(line) );

    rl.on('close', () => {
      console.log("Read", allTweets.length, "tweets");
      resolve( cleanUpTweets(allTweets) ) 
    });
  });
};
