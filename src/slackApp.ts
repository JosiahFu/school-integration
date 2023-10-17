import { StringIndexed } from '@slack/bolt/dist/types/helpers.js';
import bolt from '@slack/bolt';
import * as db from './db.js';

export function setupApp(app: bolt.App<StringIndexed>) {
    // Listens to incoming messages that contain "hello"
    app.message('hello', async ({ message, say }) => {
        if (message.subtype) return;
        db.addEntry({ content: message.text ?? '' });
        // say() sends a message to the channel where the event was triggered
        await say(`Hey there <@${'user' in message ? message.user : ''}>! Here are all the messages you've sent: ${db.query().map(e => e.content).join(',')}`);
    });
}
