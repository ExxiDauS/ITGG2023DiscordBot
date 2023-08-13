require('dotenv').config
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getstudentinfo(studentid) {
    try {
        let player = await prisma.player.findMany({
            where:{id_: Number(studentid)}
        })
        return { id: player[0]["id_"], fullname: player[0].fullname, gate: player[0].gate }

    } catch (error) {
        console.log(error)

    }
}
module.exports = { getstudentinfo }
