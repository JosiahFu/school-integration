import 'dotenv/config';
import bolt from '@slack/bolt';
import { writeData } from './db.js';
const { App } = bolt;

// Initializes your app in socket mode with your app token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    if (message.subtype) return;
    writeData({ events: [message.text ?? ''] })
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${'user' in message ? message.user : ''}>!`);
});

// Start your app
await app.start(process.env.PORT || 3000);

console.log('⚡️ Bolt app is running!');
