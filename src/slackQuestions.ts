import { input, options } from './slackMacros.js';
import { ViewOutput } from '@slack/bolt';

type QuestionType = 'text' | 'text_multiline' | readonly string[];
interface Question {
    title: string;
    type: QuestionType;
}
function Question<T extends QuestionType>(title: string, type: T) {
    return { title, type };
}
type Responses<T extends Record<string, Question>> = {
    [K in keyof T]: (T[K]['type'] extends 'text' ? string : T[K]['type'] extends 'text_multiline' ? string : T[K]['type'] extends readonly string[] ? T[K]['type'][number] : never);
};
function questionToBlock(id: string, question: Question) {
    return input(question.title, id, (() => {
        switch (question.type) {
            case 'text':
                return { type: 'plain_text_input' };
            case 'text_multiline':
                return { type: 'plain_text_input', multiline: true };
            default:
                return { type: 'static_select', options: options(question.type) };
        }
    })());
}
function unwrapResponses<T extends Record<string, Question>>(rawResponses: ViewOutput['state']['values']) {
    return Object.fromEntries(Object.keys(rawResponses).map(key => {
        const input = Object.values(rawResponses[key])[0];
        return [key, input.type === 'plain_text_input' ? input.value : input.selected_option!.value];
    })) as Responses<T>;

}

export { Question, Responses, questionToBlock, unwrapResponses };
