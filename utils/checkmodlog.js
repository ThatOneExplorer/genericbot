require('dotenv').config();
const ownerID = process.env.OWNERID_ID;
const generic_server = process.env.GENERIC_SERVER;
const MEMBER_COUNT = process.env.MEMBER_COUNT;

const mongoose = require("mongoose")
const punishments = require("../models/ModSchema");
    async function checkmodlog(member){
        try{
                let data = await punishments.findOne({
                    GuildID: member.guild.id,
                    UserID: member.id
                })
                if(data){
                console.log(`${member.user.tag} already has existing modlogs`)
                } else if (!data){
                    console.log(`${member.user.tag} does not have existing modlogs`)
                    let newData = new punishments({
                GuildID: member.guild.id,
                UserID: member.id,
                    });
                    await newData.save()
                    console.log(`created database entry for ${member.user.tag}`);
                }
} catch(e){
    console.log(e)
    const owner = member.guild.members.cache.get(ownerID)
    owner.user.send(e)
}
    }
module.exports = { checkmodlog }