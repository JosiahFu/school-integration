import { StringIndexed } from '@slack/bolt/dist/types/helpers.js';
import bolt from '@slack/bolt';
import { DB } from './db.js';
import { ChannelEntry, EventEntry } from './index.js';

export function setupApp(app: bolt.App<StringIndexed>, eventDB: DB<EventEntry>, channelDB: DB<ChannelEntry>) {
    // Listens to incoming messages that contain "hello"
    app.message('hello', async ({ message, say }) => {
        if (message.subtype) return;
        eventDB.addEntry({ content: message.text ?? '' });
        channelDB.addEntry({ id: message.channel });
        // say() sends a message to the channel where the event was triggered
        await say(`Hey there <@${'user' in message ? message.user : ''}>! Here are all the messages you've sent: ${eventDB.query().map(e => e.content).join(',')}`);
    });
}
