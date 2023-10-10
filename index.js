

// const { Client } = require('whatsapp-web.cjs');
// const qrcode = require('qrcode-terminal');
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
// require('dotenv').config()
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config()

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

client.on('message', message => {
    console.log(message.body);

    if(message.body.startsWith("#")) {
        runCompletion(message.body.substring(1)).then(result => message.reply(result));
    }
});

async function runCompletion (message) {
    const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo",
  messages: [
    {
      "role": "user",
      "content": ""
    }
  ],
  temperature: 1,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
    });
    return completion.data.choices[0].text;
}