const express = require('express'),
      tweetDownloader = require('./lib/download-tweets'),
      statusGenerator = require('./lib/generate-statuses'),
      mastodon = require('./lib/mastodon.js'); // this require() will log an error if you don't have your .env file setup correctly

async function generateStatuses(){
  let newStatuses = await statusGenerator.generateStatusesAsync();
  return newStatuses.map( (status) => status.string );
}

async function generateStatus() {
  let newStatuses = await generateStatuses();
  if (newStatuses && newStatuses.length > 0){
    return newStatuses[0];
  } else {
    return undefined;
  }
}

async function main() {
  let app = express(),
      newStatuses = [],
      listener;

  try {
    await tweetDownloader.run();
  } catch(error) {
    console.error("Unable to download tweets", error);
  }
  
  app.use(express.static('public')); // serve static files like index.html http://expressjs.com/en/starter/static-files.html

  app.all("/toot", async function (request, response) { // send a GET or POST to /toot to trigger a toot http://expressjs.com/en/starter/basic-routing.html
    var newStatus = await generateStatus();

    console.log("Got a hit!");
    if (mastodon.tryToToot(newStatus)){ // Some things could prevent us from tooting. Find out more in mastodon.js
      response.sendStatus(200);  // We successfully tweeted
    } else {
      response.sendStatus(200); // Something prevented us from toot
    }
  });

  // listen for requests :)
  listener = app.listen(process.env.PORT, async function () {
    let statuses;
    console.log('Your app is listening on port ' + listener.address().port);
    // statuses = await generateStatuses();
    // console.log('Here are some statuses:');
    // for (status of statuses){ console.log(status); };
    console.log("✨🤖✨")
  });
}

main();