import { InputBlock, KnownBlock, PlainTextElement, PlainTextOption } from '@slack/bolt';

function plainText(text: string): PlainTextElement {
    return { type: 'plain_text', text } as const;
}
function options<T extends string>(choices: readonly T[]): PlainTextOption[] {
    return choices.map(e => ({ value: e, text: plainText(e) }));
}
function input(title: string, id: string, element: InputBlock['element']): KnownBlock {
    return {
        type: 'input',
        label: plainText(title),
        block_id: id,
        element
    };
}

export { plainText, options, input }
