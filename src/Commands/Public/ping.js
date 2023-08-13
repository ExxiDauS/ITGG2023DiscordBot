const { Prisma } = require('@prisma/client');
const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interactin
     */
    async execute(interactin) {

        await prisma.player.findMany({
            where:{
                id:66070017
            }
        })
        .then((data) => {
            console.log(data)
        })
        

        interactin.reply({ content: "pong!", ephemeral: true })
    }

}
