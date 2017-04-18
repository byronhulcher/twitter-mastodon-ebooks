const Twit = require('twit'),
  storage = require('node-persist'),
  bignum = require('bignum'),
  he = require('he'),
  fileWriter = require('./file-writer');

let defaultTweetOptions = {
    count: 200,
    include_rts: false,
    contributor_details: false,
    trim_user: true,
    tweet_mode: 'extended',
  },
  twit;

storage.initSync();

try {
  twit = new Twit({
    consumer_key:         process.env.INPUT_TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.INPUT_TWITTER_CONSUMER_SECRET,
    access_token:         process.env.INPUT_TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.INPUT_TWITTER_ACCESS_TOKEN_SECRET
  });
} catch (err) {
  console.error('Sorry, your .env file does not have the correct settings in order to tweet');
  throw err;
}

function decodeHTMLFromTweets(tweets) {
  return tweets.map ( ( tweet) => he.decode(tweet) );
}

function replaceNewlinesInTweets(tweets) {
  return tweets.map( (tweet)=> tweet.replace(/(\r\n|\n|\r)/gm,' ') );
}

function getCleanTweetTexts(tweets) {
  let tweetTexts = tweets.map( (tweet) => tweet.full_text );

  tweetTexts = replaceNewlinesInTweets(tweetTexts);
  tweetTexts = decodeHTMLFromTweets(tweetTexts);
  return tweetTexts;
}


async function getTweets(twitterName, paging) {
  let sinceId = await storage.getItem(twitterName + ':since_id'),
    maxId = await storage.getItem(twitterName + ':max_id'),
    totalCount = 0,
    options = {},
    timelineResponse,
    tweets;

  do {
    if (paging == 'max_id' && maxId) {
      options = { max_id: bignum(maxId).sub(100).toString() };
    } else if (paging == 'since_id' && sinceId) {
      options = { since_id: bignum(sinceId).add(100).toString() };
    }
    timelineResponse = await twit.get('statuses/user_timeline', Object.assign({}, defaultTweetOptions, options));
    tweets = timelineResponse.data;
    // console.log('Got', tweets.length, 'tweets');
    if (tweets && tweets.length > 0) {
      if (!sinceId || tweets[0].id > sinceId) {
        sinceId = tweets[0].id;
      }
      if (!maxId || tweets[tweets.length - 1].id < maxId) {
        maxId = tweets[tweets.length - 1].id;
      }
      fileWriter.writeToFile('./saved-tweets/tweets' + '.txt', getCleanTweetTexts(tweets) );
      totalCount += tweets.length;
    }
  } while (tweets && tweets.length > 0);

  if (sinceId) {
    await storage.setItem(twitterName + ':since_id', sinceId);
  }
  if (maxId) {
    await storage.setItem(twitterName + ':max_id', maxId);
  }
  
  return totalCount;
}

async function getOlderTweets(twitterName) {
  return await getTweets(twitterName, 'max_id');
}

async function getRecentTweets(twitterName) {
  return await getTweets(twitterName, 'since_id');
}

async function main() {
  let twitterAccountResponse = await twit.get('account/settings'),
    newTweetCount,
    oldTweetCount,
    twitterName;

  twitterName = twitterAccountResponse.data.screen_name;
  if (twitterName) {
    console.log('Ready to download tweets for', twitterName);
    oldTweetCount = await getOlderTweets();
    newTweetCount = await getRecentTweets();
    console.log("Downloaded", oldTweetCount + newTweetCount, "tweets");
  } else {
    console.error(twitterAccountResponse.data);
    throw ("Unable to download tweets");
  }
}

module.exports.run = main;
