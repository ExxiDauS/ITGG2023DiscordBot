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
const mongoose = require('mongoose');
const Gamelog = require('../../models/playerdata')
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
    await interactin.deferReply({ ephemeral: true });
    let studentinfo = await getstudentinfo(
      interactin.options.getString("studentid")
    );
    let playerplay = await playerat(studentinfo, 3);
    if (!playerplay) { await interactin.editReply({ content: "You're out of quota for today!, Come back later!!", ephemeral: true }); return };
    if (!getstudentinfo) { await interactin.editReply({ content: "Error please contact support", ephemeral: true }); return };

    console.time("Wheel");

    let gain = await givefunc(getRndInteger(1, 10), studentinfo.gate);
    await interactin.editReply({ embeds: [gain], ephemeral: true });
    console.timeEnd("Wheel");
    //count player Attempt
  },
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function playerat(studentinfo, quotamax) {
  const startDay = new Date().setHours(0, 0, 0, 0);

  const endDay = new Date().setHours(23, 59, 59, 999);
  try {
    let query = {
      studentID: studentinfo.id,
      playedAt: new Date(startDay),
    }
    const quota = await Gamelog.find(query).exec();
    console.log(quota)
    console.log(quota.length >= quotamax ? 'Full Quota' : `Not full quota (${quota.length}/${quotamax})`);
    if (quota.length >= quotamax) {
      return false
    } else {
      let newlog = new Gamelog({
        studentID: studentinfo.id,
        playedAt: new Date(startDay),
      })
      await newlog.save();
      return true;
    }

  } catch (error) {
    console.log(error)
  }
};

async function givefunc(rndnum, gate) {
  if (!incrementtoken) {
    await interactin.editReply({ content: "Error please contact support", ephemeral: true })
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
