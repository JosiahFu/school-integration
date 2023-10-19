import { StringIndexed } from '@slack/bolt/dist/types/helpers.js';
import { DB } from './db.js';
import { ChannelEntry, EventEntry } from './index.js';
import { plainText } from './slackMacros.js';
import { App } from '@slack/bolt';
import { Question, questionToBlock, unwrapResponses } from './slackQuestions.js';

const assignmentQuestions = {
    title: Question('Title', 'text'),
    grade: Question('Grade', ['9', '10', '11', '12'] as const),
    subject: Question('Subject', ['History', 'Math'] as const),
    description: Question('Description', 'text_multiline'),
} satisfies Record<string, Question>

export function setupApp(app: App<StringIndexed>, eventDB: DB<EventEntry>, channelDB: DB<ChannelEntry>) {
    channelDB

    app.command('/assignment', async ({ ack, client, body }) => {
        await client.views.open({
            // Pass a valid trigger_id within 3 seconds of receiving it
            trigger_id: body.trigger_id,
            // View payload
            view: {
                type: 'modal',
                callback_id: 'assignment',
                title: plainText('Add Assignment'),
                blocks: Object.entries(assignmentQuestions).map(e => questionToBlock(...e)),
                submit: plainText('Submit'),
            }
        });

        ack();
    });

    app.view('assignment', async ({ payload, ack }) => {
        const responses = unwrapResponses<typeof assignmentQuestions>(payload.state.values);
        eventDB.addEntry(responses);
        ack();
    })
}
