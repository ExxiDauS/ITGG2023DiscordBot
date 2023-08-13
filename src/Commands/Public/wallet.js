const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getstudentinfo } = require('../../function/getstudentinfo');
const { getgateinfo } = require('../../function/getgateinfo');
const { hex } = require('color-convert');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('wallet')
        .setDescription("Check your team's token")
        .addStringOption(option =>
            option.setName('studentid')
                .setDescription('รหัสนักศึกษา 8 หลัก')
                .setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interactin
     */
    async execute(interactin) {
        await interactin.deferReply();
        let studentinfo = await getstudentinfo(interactin.options.getString('studentid'));
        let gateinfo = await getgateinfo(studentinfo.gate);
        let embed = new EmbedBuilder()
            .setTitle(gateinfo.gate_name)
            .setDescription(`${gateinfo.token_amount} TOKEN`)
            .setColor(hex.rgb(gateinfo.hex))
        await interactin.editReply({ embeds: [embed], ephemeral: true })
    }

}