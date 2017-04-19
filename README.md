Too busy with Twitter to post on Mastodon? Create a generative Mastodon bot using Markov chains and your own Twitter archive. 

How to build your own bot:
- Click the settings above and "Remix" this project!
- Create an account on a Mastodon instance. Check out [http://botsin.space](http://botsin.space) which is specifically made for bots and bot allies.
- Modify how frequently it will be allowed to post by settings POST_DELAY_IN_MINUTES in `.env`
- Add the API url for the Mastodon instance to MASTODON_API in `.env`. This will look something like `https://mastodon.social/api/v1/` or `https://botsin.space/api/v1/`. Make sure this matches the domain you registered on!
- Get your [Mastodon OAuth token](https://tinysubversions.com/notes/mastodon-bot/index.html) and add it to OUTPUT_MASTODON_ACCESS_TOKEN in `.env` 
- Get your [Twitter OAuth tokens](http://botwiki.org/tutorials/how-to-create-a-twitter-app ) and add them to `.env` 
- Send a GET or POST request to `{Glitch URL}/toot` (for instance: `https://twitter-mastodon-ebooks.glitch.me/toot` for the `twitter-mastodon-ebooks` project)
- Use a cron or uptime service (like [Uptime Robot](http://uptimerobot.com)) to hit the above URL to trigger the bot regularly


🤖 [Byron Hulcher](http://twitter.com/hypirlink)