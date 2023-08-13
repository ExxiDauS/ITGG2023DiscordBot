const { hex } = require("color-convert");
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Embed,
  EmbedBuilder,
} = require("discord.js");
const path = require("path");
const { getgateinfo } = require("../../function/getgateinfo");
const { getstudentinfo } = require("../../function/getstudentinfo");
const { incrementtoken } = require("../../function/incrementtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wheel")
    .setDescription("WHeeeeeellllllll!")
    .addStringOption((option) =>
      option
        .setName("studentid")
        .setDescription("รหัสนักศึกษา 8 หลัก")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interactin
   */
  async execute(interactin) {
    if (!getstudentinfo) {
      await interactin.reply({ content: "Error please contact support", ephemeral: true })
    }
    await interactin.deferReply({ ephemeral: true });
    console.time("Wheel");
    let studentinfo = await getstudentinfo(
      interactin.options.getString("studentid")
    );
    let gain = await givefunc(getRndInteger(1, 10), studentinfo.gate);
    await interactin.editReply({ embeds: [gain], ephemeral: true });
    console.timeEnd("Wheel");
  },
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function givefunc(rndnum, gate) {
  if (!incrementtoken) {
    await interactin.reply({ content: "Error please contact support", ephemeral: true })
  }
  try {
    let gateinfo = await getgateinfo(gate);
    let description = "";
    let gaintoken = getRndInteger(50, 100);
    let embed = new EmbedBuilder()
      .setTitle("วงล้อหรรษา")
      .setColor(hex.rgb(gateinfo.hex));
    if (rndnum == 2 || rndnum == 3 || rndnum == 4) {
      description = `ยินดีด้วย คุณได้รับ 30 Token`;
      await incrementtoken(30, gateinfo["_id"]);
    } else if (rndnum == 5 || rndnum == 6 || rndnum == 7) {
      description = `ว๊า แย่จังคุณโดนลบ 30 Token`;
      await incrementtoken(-30, gateinfo["_id"]);
    } else if (rndnum == 8 || rndnum == 9 || rndnum == 10) {
      description = `ว๊า เสียใจจังเลย คุณไม่ได้อะไรเลย`;
    } else {
      description = `ยินดีด้วย คุณได้รับ ${gaintoken} Token`;
      await incrementtoken(gaintoken, gateinfo["_id"]);
    }
    embed.setDescription(description);
    embed.setThumbnail(gateinfo.mascotURL);
    embed.setFooter({ text: `GATE ${gateinfo.gate_name}` });
    return embed;
  } catch (ex) {
    console.log(ex);
    console.log("Retry to run again.");
    return givefunc(rndnum, gate);
  }
}
