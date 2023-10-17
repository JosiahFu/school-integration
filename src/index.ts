import 'dotenv/config';
import bolt from '@slack/bolt';
import { setupApp } from './slackApp.js';
const { App } = bolt;

// Initializes your app in socket mode with your app token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

setupApp(app);

// Start your app
await app.start(process.env.PORT || 3000);

console.log('⚡️ Bolt app is running!');
