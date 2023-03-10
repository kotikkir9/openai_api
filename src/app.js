import chalk from 'chalk';
import { createOrAppend, createFolder } from './utility.js';
import { prompt, openai } from './setup.js';

// creates the 'chats' dir if it doesn't exist
createFolder('./chats');

// creates a new file for each time the app in running
const path = './chats/' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.md';
createOrAppend(path);

// chat loop
(async () => {
    const dateString = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let initialMessage = `Hello! I am ChatGPT, a large language model trained by OpenAI. My knowledge cutoff is set at 2021, and today\'s date is ${dateString}. How can I assist you today?\n`;

    const messages = [
        { role: 'assistant', content: initialMessage },
    ];

    while (true) {
        try {
            const input = await prompt("> ");
            input === 'exit' && process.exit(0);

            messages.push({ role: 'user', content: input });
            createOrAppend(path, input, { question: true });

            const completion  = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages,
            });

            const message = completion.data.choices[0].message;
            console.log(chalk.cyan(message.content + '\n'));
            messages.push(message);
            createOrAppend(path, message.content, { response: true });

        } catch (e) {
            console.error(chalk.red("Unable to prompt", e));
            process.exit(0);
        }
    }
})();