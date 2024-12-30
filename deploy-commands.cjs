const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');

const commands = [
    {
        name: 'speechbubble',
        description: 'Overlay a speech bubble on an image',
        options: [
            {
                name: 'url',
                description: 'The URL of the image',
                type: 3,
                required: true,
            }
        ]
    },
    {
        name: '8ball',
        description: 'Ask the magic 8-ball a question',
        options: [
            {
                name: 'question',
                description: 'The question to ask the magic 8-ball',
                type: 3,
                required: true,
            }
        ]
    },
    {
        name: 'cf',
        description: 'Flip a coin',
    },
    {
        name: 'pingspam',
        description: 'Spam ping a user',
        options: [
            {
                name: 'user',
                description: 'The user to ping',
                type: 6,
                required: true,
            }
        ]
    },
    {
        name: 'avatar',
        description: 'Get the avatar of a user',
        options: [
            {
                name: 'user',
                description: 'The user to get the avatar of',
                type: 6,
                required: false,
            }
        ]
    },
    {
        name: 'dice',
        description: 'Roll a dice',
    },
    {
        name: 'ping',
        description: 'Check the bot\'s latency',
    },
    {
        name: 'silverwolf',
        description: 'Returns a picture of Silverwolf from Danbooru',
    },
    {
        name: 'roll',
        description: 'Roll a dice with a specified number of sides',
        options: [
            {
                name: 'sides',
                description: 'The number of sides on the dice',
                type: 4,
                required: false,
            }
        ]
    },
    {
        name: 'help',
        description: 'Lists all commands',
    }
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Command usage 👍');
    } catch (error) {
        console.error(error);
    }
})();
