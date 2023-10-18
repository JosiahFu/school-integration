import { StringIndexed } from '@slack/bolt/dist/types/helpers.js';
import bolt from '@slack/bolt';
import { DB } from './db.js';
import { ChannelEntry, EventEntry } from './index.js';

function plainText(text: string) {
    return { type: 'plain_text', text } as const;
}

export function setupApp(app: bolt.App<StringIndexed>, eventDB: DB<EventEntry>, channelDB: DB<ChannelEntry>) {

    // Listens to incoming messages that contain "hello"
    app.message('hello', async ({ message, say }) => {
        if (message.subtype) return;
        eventDB.addEntry({ content: message.text ?? '' });
        channelDB.addEntry({ id: message.channel });
        // say() sends a message to the channel where the event was triggered
        await say(`Hey there <@${'user' in message ? message.user : ''}>! Here are all the messages you've sent: ${eventDB.query().map(e => e.content).join(',')}`);
    });

    app.command('/assignment', async ({ command, say }) => {
        //     respond({})
        //     command.user_id
        // })

        // app.shortcut('assignment', async ({ shortcut, say }) => {
        say({
            blocks: [
                {
                    type: "header",
                    text: plainText('Add new Assignment')
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: 'static_select', action_id: '_set_grade', options: [
                                { value: '9', text: plainText('9th') },
                                { value: '10', text: plainText('10th') },
                                { value: '11', text: plainText('11th') },
                                { value: '12', text: plainText('12th') },
                            ]
                        },
                        {
                            type: 'static_select', action_id: '_set_subject', options: [
                                { value: 'Math', text: plainText('Math') },
                                { value: 'Physics', text: plainText('Physics') },
                                { value: 'Science', text: plainText('Science') },
                                { value: 'English', text: plainText('English') },
                            ]
                        }
                    ]
                }
            ],
            text: `Hey there <@${command.user_id}>!`
        })
    });

    app.action('button_click', async ({ say }) => {
        say('Clicked');
    })
}
