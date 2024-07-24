import dotenv from 'dotenv'
dotenv.config()

import { Client } from 'discord.js'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
});

client.login(process.env.MTI2MjM3ODM2MzA2MzEwNzYwNQ.Gna3XE.KjTzSXN7JwgHIuG3GYT7HU_RRf_fWZEhROOavM);

// function to read every message sent in the server

client.on("messageCreate", async (message) => {
// client.on('message', message => {})

    console.log(message)

    // example command for reference

    // if (!message?.author.bot) {
    //    message.author.send(`Echo ${message.content}`)
    // }

    if (!message?.author.bot) {
        const mikeify = message.content.split(' ').map(() => 'mike').join(' ');
        message.author.send(mikeify);
    }

    // todo: if the words end in -ing -ify etc replace those too

    // command to enable/disable the bot
    if (message.content.startsWith('!mike disable')) {
        botCanSendMessages = false;
        message.author.send(`Echo ${"no mike mikeifying :("}`);
    }

    if (message.content.startsWith('!mike enable')) {
        botCanSendMessages = true;
        message.author.send(`Echo ${"mikeification activated"}`);
    }
});