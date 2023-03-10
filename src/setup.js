// env variables
import * as dotenv from 'dotenv'
dotenv.config();

// read input from console
import * as readline from 'readline'
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('close', () => process.exit(0));
export const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));


// openai setup
import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);