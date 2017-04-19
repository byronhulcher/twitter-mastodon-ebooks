var storage = require('node-persist'),
    Mastodon = require('mastodon'),
    mastodon;

storage.initSync({
  dir: './.data/storage'
});

try {
  mastodon = new Mastodon({
    'access_token': process.env.OUTPUT_MASTODON_ACCESS_TOKEN,
    'api_url': process.env.OUTPUT_MASTODON_API || 'https://mastodon.social/api/v1/'
  });
  console.log("Ready to toot!");
} catch(err) {
  console.error(err);
  console.error("Sorry, your .env file does not have the correct settings in order to toot");
}

function postToot(status){
  console.log("Tooting!");
  mastodon.post('statuses', { status: status }, function(err, data, response) {
    console.log(`Posted status: ${status}`);
  });
}

// A few things will prevent a toot from going out:
//  - The correct keys aren't in .env
//  - The status is too long
//  - This bot tweeted less than POST_DELAY_IN_MINUTES minutes ago
module.exports.tryToToot = function(status){
  var now = Date.now(), // time since epoch in millisecond
      lastRun = storage.getItemSync("lastRun") || 0, // last time we were run in milliseconds
      postDelay = process.env.POST_DELAY_IN_MINUTES || 60;// time to delay between tweets in minutes
  
  if (!mastodon){
    console.error("Sorry, have haven't setup Mastodon yet in your .env")
    return false;
  }
  if (now - lastRun <= (1000 * 60 * postDelay)) { // Only post every process.env.POST_DELAY_IN_MINUTES or 60 minutes
    console.error(`It's too soon, we only post every ${postDelay} minutes. It's only been ${ Math.floor((now - lastRun) / 60 / 1000 ) } minutes`);
    return false;
  }
  if (!status || status.length == 0) { // Only post every process.env.POST_DELAY_IN_MINUTES or 60 minutes
    console.error('Empty status provided');
    return false;
  }
  if (status.length > 500){
    console.error(`Status too long: ${status}`);
    return false;
  }
    
  storage.setItemSync("lastRun", now);
  postToot(status);
  return true;
}