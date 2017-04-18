const Twit = require('twit'),
      storage = require('node-persist');

let twit;

storage.initSync();

try {
  twit = new Twit({
    consumer_key:         process.env.INPUT_TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.INPUT_TWITTER_CONSUMER_SECRET,
    access_token:         process.env.INPUT_TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.INPUT_TWITTER_ACCESS_TOKEN_SECRET
  });
  
  
  
} catch(err) {
  console.error(err);
  console.error("Sorry, your .env file does not have the correct settings in order to tweet");
}

async function getOlderTweets(twitterName){
  let sinceId = await storage.getItem(twitterName+":since_id"),
      maxId = await storage.getItem(twitterName+":max_id");
  
}

async function getRecentTweets(twitterName) {
  
}

async function main(){
  let twitterAccountResponse = await twit.get('account/settings'),
      twitterName;
  twitterName = twitterAccountResponse.data.screen_name;
  if (twitterName){
    console.log("Ready to download tweets for", twitterName);
    await getOlderTweets(twitterName);
    await getRecentTweets(twitterName);
  } else {
    console.error("Unable to download tweets");
    console.error(twitterAccountResponse.data);
  }
  
}
// main();
