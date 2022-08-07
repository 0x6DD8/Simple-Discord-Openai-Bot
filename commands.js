(function() {
    module.exports.loadSlashCommands = function(clientId, guildId) {
        const { REST, Routes, SlashCommandBuilder } = require('discord.js');
        const { botToken } = require('./config.json');

        const commands = [
            new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with pong!'),

            new SlashCommandBuilder()
            .setName('echo')
            .setDescription('Replies with your input!')
            .addStringOption(option =>
                option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)),

            new SlashCommandBuilder().setName('openai')
            .setDescription('fanfics')
            .addStringOption(option =>
                option.setName('input')
                .setDescription('input')
                .setRequired(true)),
        ].map(command => command.toJSON());

        const rest = new REST({ version: '10' }).setToken(botToken);
        (async() => {
            try {

                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

            } catch (error) {
                console.error(error);
            }
        })();
    }
}());