declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly SLACK_SIGNING_SECRET: string;
            readonly SLACK_CLIENT_SECRET: string;
            readonly SLACK_CLIENT_ID: string;
            readonly SLACK_APP_ID: string;
            readonly SLACK_BOT_TOKEN: string;
            readonly SLACK_APP_TOKEN: string;
            readonly PORT?: string;
        }
    }
}

export { }
