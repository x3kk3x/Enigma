require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const PREFIX = "mystery!";

// Bot ready event
client.once('ready', () => {
    console.log(`🟢 Enigma is online as ${client.user.tag}!`);
});

const API_KEY = process.env.RIDDLE_API_KEY;

// Listen for messages
client.on('messageCreate', async (message) => {
    console.log(`Received message: "${message.content}" from ${message.author.tag}`); // Debug message content

    if (message.author.bot) {
        console.log("Ignored a bot message."); // Debug bot check
        return;
    }

    if (message.content === PREFIX) { // Directly match the prefix
        console.log("Fetching riddle from API..."); // Debug API call
        try {
            // Fetch a riddle from API Ninja
            const riddleResponse = await axios.get('https://api.api-ninjas.com/v1/riddles', {
                headers: { 'X-Api-Key': API_KEY }
            });
            const riddle = riddleResponse.data[0];
            console.log("Riddle fetched successfully:", riddle); // Debug riddle response
            message.channel.send(`Here's your riddle: ${riddle.question}\n*(Reply with your answer, but beware—I may mislead you!)*`);
        } catch (error) {
            console.error("Error fetching riddle:", error.response?.data || error.message); // Debug API error
            message.channel.send("I couldn't fetch a riddle right now. Try again later!");
        }
    } else {
        console.log("User replied with an answer."); // Debug user response
        const responses = [
            "You're chasing shadows!",
            "Not even close, mortal.",
            "A clever attempt... but not clever enough.",
            "Are you sure about that? Think again.",
            "You're walking in circles!"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        message.reply(randomResponse);
    }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
