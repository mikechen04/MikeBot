import dotenv from 'dotenv';
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import pkg from 'discord.js'

// Takes image.txt and puts it into a const
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageFilePath = path.join(__dirname, 'images.txt');
const imageLinks = fs.readFileSync(imageFilePath, 'utf-8').split('\n').filter(Boolean);

// For the API
const apiKey = '7WDoEjkQt9cfWy4h7iT6u3ay';
const apiUrl = 'https://danbooru.donmai.us/posts.json?tags=silver_wolf_(honkai:_star_rail)&login=aheriez&api_key=7WDoEjkQt9cfWy4h7iT6u3ay&limit=10';
const api_key = '7WDoEjkQt9cfWy4h7iT6u3ay';
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

let botCanSendMessages = true; 
// let botCanSendMessagesButNotMikeify = true;
// In the future maybe have an option to disable the mikeify but keep stuff like speech bubble, inside jokes etc


// Read every message sent in the server 
client.on("messageCreate", async (message) => {
    console.log(message);

    if (message.content.startsWith('!mike help')) {
        if (botCanSendMessages === true) {
            const exampleEmbed = new EmbedBuilder()
            .setColor(0xFFB6C1) //
            .setTitle('THE JASKARAN OF JUDGING.') //
            .setDescription(`
                -=+=-
                !mike help - LISTS ALL COMMANDS!!
                !mike disable - DISABLES MIKE!!!
                !mike enable - ENABLES MIKEIFYING!!!
                !mike meow - old mike commands!!!!!!
                !mike jizz - meow
                !mike silverwolf - SILVERWOLF IMAGES!!!!!
                !mike goon - gooning`)
            .setImage('https://cdn.discordapp.com/attachments/446498978201337857/1277904706395574282/image.png?ex=66cedd00&is=66cd8b80&hm=bc264f12ee13cff9490b9a23eab55a481432c87452f65d0bd8ec01ae0b2d42b5&')

            // Send the embed to the same channel where the command was sent
            message.channel.send({ embeds: [exampleEmbed] });
            message.react('🇲')
            message.react('🇮')
            message.react('🇰')
            message.react('🇪')
            return;
        }
    }
    
    // Help command
    if (message.content.startsWith('!mike meow')) {
        if (botCanSendMessages === true) {
            message.channel.send(`Mike COMMANDS!!!
-=+=-
!mike help - LISTS ALL COMMANDS!!
!mike disable - DISABLES MIKE!!!
!mike enable - ENABLES MIKEIFYING!!!`);
        }
        return;
    }
    

    if (message.content.startsWith('!mike nuke')) {
        if (botCanSendMessages) {
            const interval = setInterval(() => {
                message.channel.send('<@587053859772432384>');
            }, 1000); // in ms
            setTimeout(() => {
                clearInterval(interval);
            }, 100000000); 
        }
    }

    // Command to enable/disable the bot

    // IN THE FUTURE MAKE THEM LIKE LOADING SCREENS
    if (message.content.startsWith('!mike disable')) {
        if (botCanSendMessages == false){
            message.channel.send('mikeification ALREADY DISABLED!!!!!!!');
            return;
        }
        botCanSendMessages = false;
        message.channel.send('no more mikeifying :(');
        return;
    }

    if (message.content.startsWith('!mike enable')) {
        if (botCanSendMessages == true){
            message.channel.send('mikeification ALREADY ENABLED!!!!!!!');
            return;
        }
        botCanSendMessages = true;
        message.channel.send('mikeification activated');
        return;
    }

    if (message.content.startsWith('!mike jizz')) {
        if (botCanSendMessages == true){
            message.channel.send('https://cdn.discordapp.com/attachments/446498978201337857/1277904706395574282/image.png?ex=66cedd00&is=66cd8b80&hm=bc264f12ee13cff9490b9a23eab55a481432c87452f65d0bd8ec01ae0b2d42b5&');
            return;
        }
    }

    // Speech bubble on top of an image sent by user

    if (message.content.startsWith('!mike bubble')) {
        if (botCanSendMessages == true){
            return;
        }
    }

    if (message.content.startsWith('!mike goon')) {
        if (botCanSendMessages == true){
            const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
            message.channel.send(randomImage);
            return;
        }
    }

    // API call
    // API URL: https://testbooru.donmai.us/
    async function searchImages(apiKey, tags) {
        const params = new URLSearchParams({
            tags,
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
    
    if (message.content.startsWith('!mike silverwolf')) {
        const args = message.content.split(' ').slice(1);
        const searchQuery = args.join(' ');
    
        if (!searchQuery) {
            return message.reply('Please provide some tags to search.');
        }
    
        try {
            console.log('Searching for images with query:', searchQuery);
            const results = await searchImages(apiKey, searchQuery);
            console.log('Search Results:', results);
    
            if (results.length === 0) {
                return message.reply('No images found for your search.');
            }
    
            // Pick a random image from the results
            const randomImage = results[Math.floor(Math.random() * results.length)];
            console.log('Selected Random Image:', randomImage);
    
            // Create an embed for the random image
            const embed = new EmbedBuilder()
                .setTitle('GOONER ALERT!!!')
                .setDescription(`PLAP PLAP PLAP PLAP PLAP`)
                .setColor('#0099ff')
                .setFooter({ text: 'source: danbooru' })
                .setImage(randomImage.url)
                // .addFields({ 
                //     name: 'Tags', 
                //    value: randomImage.title || 'No tags available' // Handle undefined title
                // });
    
            await message.reply({ embeds: [embed] });
    
        } catch (error) {
            console.error('Error handling command:', error);
            message.reply('DOESNT WORK TRY LATER.');
        }
    }
    
    
    // ----------
    // Certain words in this section will trigger images or messages
    // ----------

    if (message.content.startsWith('skibidi')) {
        if (botCanSendMessages == true){
            message.channel.send('SKIBIDI TOILET!!!!!!!!!!!!!!!!')
            return;
        }
    }

    if (message.content.startsWith('gimmick')) {
        if (botCanSendMessages == true){
            message.channel.send('i need a gimmick girlfriend in the rank ranges of 5-25k, must be a female (optional) and can play low ar, ez, reading, percision')
            return;
        }
    }

    if (message.content.includes('gta 6')) {
        if (botCanSendMessages == true){
            message.channel.send('^^^^ WE GOT THIS BEFORE GTA 6!!!!!!')
            return;
        }
    }

    if (message.content.includes('a girl without a cock')) {
        if (botCanSendMessages == true){
            message.channel.send('is like an angel without wings')
            return;
        }
    }

    // ----------
    // End
    // ----------

    // Command to increase time it takes between mikeifying messages
    if (message.content.includes('a girl without a cock')) {
        if (botCanSendMessages == true){
            message.channel.send('is like an angel without wings')
            return;
        }
    }

    // Create a /mike command, which brings up buttons & settings
    // One for enable bot, one for disable
    // 

    // Replaces every word with 'mike' along with certain suffixes 
     if (!message.author.bot && botCanSendMessages) {
         const words = message.content.split(' ');
         const mikeify = words.map(word => {
             if (word.endsWith('ify')) {
                 return 'mikeify';
             } else if (word.endsWith('ing')) {
                 return 'mikeing';
             } else if (word.endsWith('s')) {
                 return 'mikes';
             }
             return 'mike';
         }).join(' '); 
         message.channel.send(mikeify);
     }
});
