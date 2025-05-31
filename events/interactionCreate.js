const Discord = require('discord.js')
require('dotenv').config();
const ownerID = process.env.OWNERID_ID
const generic_server = process.env.GENERIC_SERVER
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
try{
        console.log(`Recieved interaction in ${interaction.guild.name}`)
        if (interaction.customId === 'Help'){
                console.log("Recieved Interaction! (Help)")
                if(interaction.values[0] === "first_option"){
            let Moderation = new Discord.EmbedBuilder()
            .setTitle(`Moderation Commands!`)
            .addFields(
                {name: `Warn`, value: `Warns a mentioned user`},
                {name: `Mute`, value: `Mutes a mentioned user`},
                {name: `Kick`, value: `Kicks a mentioned user from the server`},
                {name: `Ban`, value: `Bans a mentioned user from the server`},
                {name: `Modlogs`, value: `Retrieves a user's modlogs from database`},
                {name: `Delete`, value: `Delete an entry from a users modlogs`},
                {name: `Purge`, value: `Bulk deletes a given amount of messages`}
            )
            .setColor("Orange")
        interaction.update({embeds: [Moderation]});
            }
            else if (interaction.values[0] === "second_option"){
                let Fun = new Discord.EmbedBuilder()
            .setTitle(`Fun Commands!`)
            .addFields(
                {name: `8ball`, value: `Ask the 8ball a question and it will respond!`},
                {name: `Train`, value: `Gathers real-time information of arrivals / departures at a given station on the irish rail network`},
                {name: `Station`, value: `Provides information on a given station on the irish rail network`}
            )
            .setColor("Blurple")
            
            interaction.update({embeds: [Fun]})
            }
            if(interaction.values[0] === "third_option"){
                let Misc= new Discord.EmbedBuilder()
                .setTitle(`Misc. Commands!`)
                .addFields(
                    {name: `Suggest`, value: `Have any suggestions for the server? A suggestion for a video? Or any other suggestion? This command will forward your suggestion to the staff team!`},
                    {name: `Ping`, value: `Pings Discord's API and gets a response`},
                    {name: "Constitution", value: "Creates a menu to display constitution articles"}
                )
                .setColor("Yellow")
                interaction.update({embeds: [Misc]})
            }

            if(interaction.values[0] === "fourth_option"){
                let Support = new Discord.EmbedBuilder()
                .setTitle(`Support Info!`)
                .setDescription(`Require support or assistance from a staff member? DM this bot (Genericbot) to create a support thread to contact the staff team in a private setting! Note, abuse of this feature will result in punishment.`)
                .setColor("Green")
                interaction.update({embeds: [Support]})
            }
        }
       // if (interaction.customId === 'Continent'){
        //    console.log("Recieved Interaction! (Continent)")
        //    if(interaction.values[0] === "europe"){
                
        //     const europerole = interaction.guild.roles.cache.find(role => role.id === "795836441078661140");
       
        //     if (interaction.member.roles.cache.has("795836441078661140")){
        //         console.log(`Removing role`)
        //        interaction.member.roles.remove(europerole).catch(error => console.log(`Error occured dm'ng ${interaction.user} ${error}`))
        //        return interaction.reply({content: `Added Europe Role`, ephemeral: true}).catch(error => console.log(`Error occured dm'ng ${interaction.user} ${error}`))
        //     }
         
      //   interaction.member.roles.add(europerole).catch(error => console.log(`Sorry ${message.author}: ${error}`));
       //  return interaction.reply({content: `Added Europe Role`, ephemeral: true}).catch(error => console.log(`Error occured dm'ng ${interaction.user} ${error}`))
        
       if (interaction.customId === 'constitutionlist'){
        console.log("Recieved Interaction! (constitution)")
        if(interaction.values[0] === "A1"){
    let A1E = new Discord.EmbedBuilder()
    .setTitle(`Article I (The Nation)`)
    .addFields(
        {name: `1.1`, value: `The name of the state is the Generic Nation, henceforth referred to as Generic.`},
        {name: `1.2`, value: `The Citizens of Generic are all those who have demonstrated loyalty and have offered an oath of allegiance to the nation, or those whom the government of the nation do decree to be citizens. `},
        {name: `1.3`, value: `The Generic Ideal is defined as cihan. At the basis of the Generic concept of state and sovereignty is the idea of cihânşûmûl, that is, a state that encompasses the whole world.  The main purpose of the Generic state is to ensure the sacred sovereignty of the people of Generic all around the world and to spread Generic ideals everywhere.`},
        {name: `1.4`, value: `The flag of Generic is a bright gold cross upon a burgundy background. The gold cross symbolises the divine right afforded to Generic, and the burgundy represents the wealth and sophistication of its people. `},
        {name: `1.5`, value: `The official language of Generic is Generarian. Generarian is defined to be whatever language the speaker is currently speaking in, provided they are a Citizen. A non-Citizen speaking the same language is not speaking Generarian.`},
        {name: `1.6`, value: `Due to linguistic errors, Generarian does not include the languages American-English and French. `},
        {name: `1.7`, value: `Citizenship of Generic may be revoked at the discretion of the government.`},
        {name: `1.8`, value: `The official religions of Generic are the First Generic Faith and the Second Generic Faith, and are held together. The Second Generic Faith is whatever faith the Citizen happens to believe in. The absence of a faith is also considered to be the Second Generic Faith. The First Generic Faith is unique to the Nation, and will be defined in a later article.`},
        {name: `1.9`, value: `The Generic Nation is deemed to have been established in the year 137 Anno Domini when the Ghost of Solomon appeared to a peasant named Ambrosius who was harvesting olives from a tree in eastern Italy. The ghost commanded Ambrosius to establish the Generic Nation. This shall be expanded on in a later article. `},
    )
    .setColor("Red")
interaction.update({embeds: [A1E]});
    }
    else if (interaction.values[0] === "A2"){
        let A2E = new Discord.EmbedBuilder()
    .setTitle(`Article II (The Government)`)
    .addFields(
        {name: `2.1`, value: `The executive, legislative, and judiciary is the Most Honourable and Eternally Divine Supreme Council of the Generic Nation. This may be referred to as the Supreme Council or the Council`},
        {name: `2.2`, value: `The Supreme Councils member board, in the interest of security and safety, shall not be publicised, information regarding membership of the Supreme Council is not to be shared`},
        {name: `2.3`, value: `Members of the Supreme Council are on the Council for life.`},
        {name: `2.4`, value: `The Supreme Council is infallible. It may not be criticised. It is never wrong.`},
        {name: `2.5`, value: `The Supreme Council may establish any other system of governance at their discretion. `},
        {name: `2.6`, value: `The Supreme Council is Head of Faith of the First Generic Faith`},
        {name: `2.7`, value: `The Supreme Council may make amendments to this constitution, at any  time, without a public vote. Any amendments to the constitution will be applicable to events that happened before the amendment was made.`}
    )
    .setColor("Red")
    
    interaction.update({embeds: [A2E]})
    }
    if(interaction.values[0] === "A3"){
        let A3E= new Discord.EmbedBuilder()
        .setTitle(`Article III (The First Generic Faith)`)
        .addFields(
            {name: `3.1`, value: `The First Generic Faith does not conflict with any other existing faiths. It co-exists with them. 
            `},
            {name: `3.2`, value: `In 137 A.D, the Ghost of Solomon (not to be confused with the legendary King Solomon, the Ghost of Solomon is a gold sphere with dove wings) appeared to a Roman peasant by the name of Ambrosius while he was picking olives from a tree he did not own.
            `},
             {name: `3.3`, value: `Solomon said to Ambrosius, “Ambrosius, go forth and conquer, the divine heaven commands you to conduct cihan. You must form the Generic Nation. Also you should use turmeric, its a powerful antioxidant.”
            `},
             {name: `3.4`, value: `Ambrosius was shocked, however he did not understand a word as the Ghost of Solomon was speaking English, which did not yet exist, and Ambrosius barely managed to speak Latin. 
             `},
             {name: `3.5`, value: `However, he misheard the word turmeric as generic, despite the word generic also being in the sentence, and as he stumbled into the road, stunned by what he saw, he shouted GENERIC GENERIC GENERIC until he collapsed and died of malnutrition minutes later. 
             `},
             {name: `3.6`, value: `Seconds later, a convoy arrived and saw the body of Ambrosius. The lead jumped off his horse, it was Caesar Traianus Hadrianus Augustus, commonly known as Emperor Hadrian. Hadrian heard Ambrosius shouting GENERIC and did not understand the word. However, being an intelligent man, he assumed it was connected to the Latin word genus meaning a race or a sort. Of course, it did not mean this, as Ambrosius misheard. This is how the modern word generic got its meaning. It does not relate to the Generic Nation.
             `},
             {name: `3.7`, value: `Hadrian looked at the olive tree, and saw the Ghost of Solomon, which had not disappeared yet. The Ghost said to Hadrian, “Hadrian, go forth and conquer, the divine heaven commands you to conduct cihan. You must form the Generic Nation. Also you should use turmeric, its a powerful antioxidant.”
             `},
             {name: `3.8`, value: `Hadrian did not understand, as he too did not understand a language that is yet to exist. He replied “Quid dicis?”
             `},
             {name: `3.9`, value: `The Ghost replied “vincere omnia you imbecile”.  “Intelligo” Hadrian responded.”
             `},
             {name: `3.10`, value: `So the Ghost disappeared and Hadrian returned to Rome. In his diary, he wrote of the gold sphere that appeared and told him to conquer everything. He mentioned how it killed that poor peasant. Something to do with “generic”, and it spoke a funny language. Hadrian called it Generarian.
             `},
             {name: `3.11`, value: `The Command of Solomon remained hidden until the Supreme Council discovered Hadrian's writings, and vowed to fulfil this divine prophecy.`}
        )
        .setColor("Red")
        interaction.update({embeds: [A3E]})
    }

    if(interaction.values[0] === "A4"){
        let A4E = new Discord.EmbedBuilder()
        .setTitle(`Article VI (The Rights Of Citizens)`)
        .addFields(
            {name: `4.1`, value: `There are none.`}
        )
        interaction.update({embeds: [A4E]})
    }
    else if(interaction.values[0] === "A5"){
        let A5E = new Discord.EmbedBuilder()
        .setTitle(`Article V (The Wrongs Of Citizens)`)
        .setDescription(`The following actions or behaviours are considered by order of the Supreme Council to be a wrong, and are of a criminal nature, and may be investigated and punished as such under subsequent legislation or directives.`)
        .addFields(
            {name: `5.1`, value: `The demonstration of hostility to the Generic Nation
            `},
            {name: `5.2`, value: `The intentional undertaking of any actions that harm the stability, security, and coherence of the Generic Nation.
            `},
            {name: `5.3`, value: `The creation of any group or organisation that advocates against the actions of the Supreme Council. Opposition to any established civilian government or Supreme Councillors in a civilian capacity is allowed. 
            `},
            {name: `5.4`, value: `Any behaviour against another Citizen that is inflammatory, offensive, destructive, or polarising.
            `},
            {name: `5.5`, value: `Supreme Councillors are exempt from Section 4. 
            `},
            {name: `5.6`, value: `Any behaviour deemed to be based by any governing authority but is in breach of Section 4 is authorised. 
            `},
            {name: `5.7`, value: `Evading or lying to government officials in order to avoid suspicion or investigation.
            `},
            {name: `5.8`, value: `Refusal to cooperate with government orders. 
            `}
        )
        .setColor("Red")
        interaction.update({embeds: [A5E]})
    }

    if(interaction.values[0] === "A6"){
        let A5E = new Discord.EmbedBuilder()
        .setTitle(`Article VI (The Law Courts)`)
        .addFields(
            {name: `6.1`, value: `Any citizen caught in breach of any aspect of the constitution, or committed an act that the state may view as possibly offensive, may be subject to trial by the state through designated courts.
            `},
            {name: `6.2`, value: `There will be 2 court systems, known respectively as the Court of Civility (COC), and the Special Criminal Courts (SCC)
            `},
            {name: `6.3`, value: `It is up to the Supreme council, or any other party authorised by the Supreme council, to decide which court shall hear the trial.`},
            {name: `6.4`, value: `The Court of Civility (CC) will serve as the primary courts, the functional legal entity for the nation. This court shall serve, although not limited to, hearings of trials in which the state is pursuing against any defending party. The CC will consist of no jury. Equally the CC will be responsible for hearings, trials and sittings begun by private members. These courts may be held beyond public view at the discretion of the Ministry of Justice and The Supreme Council.`},
            {name: `6.5`, value: `All verdicts are final, there is no appeal.
            `}
        )
        .setColor("Red")
        interaction.update({embeds: [A5E]})
    }
    if(interaction.values[0] === "A7"){
        let A5E = new Discord.EmbedBuilder()
        .setTitle(`Article VII (The Entities of The State)`)
        .addFields(
            {name: `7.1`, value: `The State may at any time consist of elements formed by The Supreme Council. These entities may serve various roles believed to be necessary to be covered. These entities may be vacated and/or disbanded at the discretion of The Supreme Council. 
            `},
            {name: `7.2`, value: `
            `},
            {name: `7.3`, value: `It is up to the Supreme council, or any other party authorised by the Supreme council, to decide which court shall hear the trial.`},
            {name: `7.4`, value: `The Court of Civility (CC) will serve as the primary courts, the functional legal entity for the nation. This court shall serve, although not limited to, hearings of trials in which the state is pursuing against any defending party. The CC will consist of no jury. Equally the CC will be responsible for hearings, trials and sittings begun by private members. These courts may be held beyond public view at the discretion of the Ministry of Justice and The Supreme Council.`},
            {name: `7.5`, value: `All verdicts are final, there is no appeal.
            `}
        )
        .setColor("Red")
        interaction.update({embeds: [A5E]})
    }
}
} catch(e){
    console.log(e)
    let errorembed = new Discord.EmbedBuilder()
    .setTitle(`An error has occured!`)
    .setDescription(`An error has occured while trying to perform this action, the owner of this bot has been notified.`)
     .setColor("Red")
   await messageCreate.reply({embeds: [errorembed]})
   const owner = messageCreate.guild.members.cache.get(ownerID)
   return owner.user.send(`${e}`)
}
        
     //   }
     //   }
    }
}
