import chalk from 'chalk';
import { createOrAppend, createFolder } from './utility.js';
import { prompt, openai } from './setup.js';

const CHAT_DIR = './chats';
// in fact 4096, but there is no gpt-3.5-turbo tokenizer package for NodeJS yet, so I'm relying on the token usage provided by the server response.
const TOKENS_LIMIT = 4000;

let tokens = {};

// creates the 'chats' dir if it doesn't exist
createFolder(CHAT_DIR);

// creates a new file for each time the app in running
const path = CHAT_DIR + '/' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.md';

(async () => {
    const dateString = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let initialMessage = `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: ${dateString}`;

    const messages = [
        { role: 'system', content: initialMessage },
    ];

    while (true) {
        try {
            const input = await prompt("> ");
            (input.toLowerCase() === 'exit' || input.toLowerCase() === 'q') && process.exit(0);

            // Check whether content complies with OpenAI's usage policies.
            // https://platform.openai.com/docs/usage-policies/usage-policies
            const req = await fetch('https://api.openai.com/v1/moderations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({ input }),
            });

            const moderationResult = await req.json();
            if (moderationResult.results[0].flagged) {
                for (const [key, val] of Object.entries(moderationResult.results[0].categories)) {
                    if (val === true) {
                        console.log(chalk.red(`The content do not comply with OpenAI's usage policies. Category: ${key}.\n` ))       
                        break;
                    }
                }
                continue;
            }

            messages.push({ role: 'user', content: input });
            createOrAppend(path, input, { question: true });

            const completion  = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages,
                // stream: true, // TODO: make the response to a stream instead?
                // max_tokens: 7,
                // temperature: 1,
            });

            tokens = completion.data.usage;
            const message = completion.data.choices[0].message;
            messages.push(message);
            console.log(chalk.cyan(message.content + '\n'));
            createOrAppend(path, message.content, { response: true });

            if (tokens?.total_tokens >= TOKENS_LIMIT) {
                console.log(chalk.yellow(`Your token usage (${tokens?.total_tokens}) is close to the maximum allowed amount (4096).\nTherefore, this chat will be closed, see you next time.`))
                process.exit(0);
            }

        } catch (e) {
            console.error(chalk.red("Unable to prompt", e));
            process.exit(0);
        }
    }
})();
