import 'dotenv/config';
import bolt from '@slack/bolt';
import { setupApp } from './slackApp.js';
import { DB } from './db.js';
import { ChannelEntry, EventEntry } from './data.js';
const { App } = bolt;

const EVENT_SAVE_FILE = 'save/events.json';
const CHANNEL_SAVE_FILE = 'save/channels.json';

const eventDB = new DB<EventEntry>(EVENT_SAVE_FILE);
const channelDB = new DB<ChannelEntry>(CHANNEL_SAVE_FILE);

// Initializes your app in socket mode with your app token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

setupApp(app, eventDB, channelDB);

// Start your app
await app.start(process.env.PORT || 3000);

console.log('⚡️ Bolt app is running!');

export type { EventEntry, ChannelEntry };
