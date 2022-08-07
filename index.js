const { Client, GatewayIntentBits, bold } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { botToken, openaiToken, openaiOrganizationId } = require('./config.json');
const coms = require('./commands.js')
const configuration = new Configuration({
    organization: openaiOrganizationId,
    apiKey: openaiToken
});
const openai = new OpenAIApi(configuration);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(guilds => {
        coms.loadSlashCommands(client.user.id, guilds.id);
        console.log(`Slash commands of Guild ${guilds.name} are refreshed`);
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    if (interaction.commandName === 'echo') {
        const string = interaction.options.getString('input');
        await interaction.reply(string);
    }

    if (interaction.commandName === 'openai') {
        const string = interaction.options.getString('input');

        const completion = await openai.createCompletion({
            model: "text-ada-001",
            prompt: string,
            max_tokens: 300 - string.length
        });
        await interaction.reply(bold(string) + completion.data.choices[0].text);
    }

});

client.login(botToken);