import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Events, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';

// API
const apiKey = '';
const apiUrl = '';
// https://danbooru.donmai.us/posts?tags=silver_wolf_%28honkai%3A_star_rail%29
// https://testbooru.donmai.us/

const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  };

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.login(process.env.DISCORD_TOKEN);

// Reads every message
client.on("messageCreate", async (message) => {
    console.log(message);

});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'speechbubble') {
    
        const imageUrl = interaction.options.getString('url');
        if (!imageUrl) {
            console.error('No URL provided.');
            return interaction.editReply('Please provide a valid image URL.');
        }
    
        const baseImageUrl = "https://files.catbox.moe/pch85y.png";

        // Load image
        const inputImage = await loadImage(imageUrl);
        const canvas = createCanvas(inputImage.width, inputImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(inputImage, 0, 0, canvas.width, canvas.height);

        // Load speechbubble
        const baseImage = await loadImage(baseImageUrl);
        const baseImageHeight = canvas.height * 0.2; // 20% of the canvas height
        ctx.drawImage(baseImage, 0, 0, canvas.width, baseImageHeight);
        const buffer = canvas.toBuffer();

        // Create an attachment
        const attachment = new AttachmentBuilder(buffer, { name: 'output.png' });
        await interaction.reply({ files: [attachment] });

    } else if (commandName === 'silverwolf') {
        // API call
        // API URL: https://testbooru.donmai.us/
        async function searchImages(apiKey) {
            const params = new URLSearchParams({
                tags: 'silverwolf',
                api_key: apiKey,
                limit: 100
            });

            try {
                const response = await fetch(`${apiUrl}?${params}`);

                // Check if the response is actually JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const errorText = await response.text();
                    console.error('Non-JSON response received:', errorText);
                    throw new Error('Received non-JSON response from API');
                }

                const data = await response.json();
                console.log('API Response:', data); // Debug line
                return data.map((post) => ({
                    title: post.tags,
                    url: post.large_file_url || post.file_url // Use large file URL or fallback to file URL
                }));
            } catch (error) {
                console.error('Error fetching images:', error);
                throw error;
            }
        }

        try {
            console.log('Searching for images with query: silverwolf');
            const results = await searchImages(apiKey);
            console.log('Search Results:', results);

            if (results.length === 0) {
                return interaction.reply('No images found for your search.');
            }

            // Pick a random image from the results
            const randomImage = results[Math.floor(Math.random() * results.length)];
            console.log('Selected Random Image:', randomImage);

            // Create an embed for the random image
            const embed = new EmbedBuilder()
                .setTitle('😍')
                .setDescription(`Here's your image!`)
                .setColor('#0099ff')
                .setFooter({ text: 'Source: Danbooru' })
                .setImage(randomImage.url);

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error handling command:', error);
            interaction.reply('Error handling command. Please try again later.');
        }

    } else if (commandName === 'help') {
        const exampleEmbed = new EmbedBuilder()
        .setColor(0xFFB6C1) //
        .setTitle('Help Commands') //
        .setDescription(`
        /help - shows all commands

        /8ball - returns a random 8ball answer

        /cf - coinflip time

        /pingspam (user) - spam pings someone

        /speechbubble (image url) - returns a speech bubble of that image

        /avatar (user) - returns avatar in a .jpg format

        /dice - returns a number 1-6

        /roll (number) - returns a number 1-number, 100 by default

        /ping - shows ping to the bot

        /silverwolf - returns random image of silverwolf from danbooru`)
        .setImage('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/07f1b69a-5074-4394-8a19-44dd55298130/dgq4mwc-cc552be5-3aba-4c34-aba5-d7e8ec73d07b.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA3ZjFiNjlhLTUwNzQtNDM5NC04YTE5LTQ0ZGQ1NTI5ODEzMFwvZGdxNG13Yy1jYzU1MmJlNS0zYWJhLTRjMzQtYWJhNS1kN2U4ZWM3M2QwN2IucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.E0li2Yu8hddq61T6jbI9wi43enTRBnozuihSaZRE_Ww')
        await interaction.reply({ embeds: [exampleEmbed] });
        return;

    } else if (commandName === 'dice') {
        const number = Math.floor(Math.random() * 6) + 1;
        await interaction.reply(`🎲 ${number} 🎲`);

    } else if (commandName === 'roll') {
        const sides = interaction.options.getInteger('sides') || 100;
        const number = Math.floor(Math.random() * sides) + 1;
        await interaction.reply(`${interaction.user.username} rolls ${number} point(s)`);

    } else if (commandName === 'ping') {
        await interaction.reply(`🏓 Latency is ${Date.now() - interaction.createdTimestamp}ms.`);
    
    } else if (commandName === 'cf') {
        const number = Math.floor(Math.random() * 2) + 1;
        if (number === 1) {
            await interaction.reply('Heads meow');
        } else {
            await interaction.reply('Tails meow');
        }

    } else if (commandName === '8ball') {
        const number = Math.floor(Math.random() * 20);
        const responses = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
        await interaction.reply(responses[number]);

    } else if (commandName === 'avatar') {
        const user = interaction.options.getUser('user') || interaction.user;
        const avatar = user.displayAvatarURL({ format: 'jpg', size: 1024 });
        await interaction.reply(avatar);

    } else if (commandName === 'pingspam') {
        const user = interaction.options.getUser('user');
        const interval = setInterval(() => {
            interaction.channel.send(`<@${user.id}>`);
        }, 1000); // in ms
        setTimeout(() => {
            clearInterval(interval);
        }, 10000);
        await interaction.reply(`Pinging ${user.username}!`);

    } else {
        await interaction.reply('Command not found!');
    }
});

console.log('Bot is up 👍');
