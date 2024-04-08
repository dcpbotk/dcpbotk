import Guild_Schema from "../utils/database/Guild_Schema.js"
import { EmbedBuilder } from "discord.js"

export default client => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {

        const { guild } = newMember;
        const oldMemberdisplayName= oldMember.displayName;
        const newMemberdisplayName= newMember.displayName;
        const newMemberUser= newMember.user;
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        // if (oldRoles.size !== newRoles.size) {

        //     const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });

        //     if (guildSchema && guildSchema.logroleadd) {
        //         const logChannel = guild.channels.cache.get(guildSchema.logroleadd);

        //         if (logChannel) {

        //             const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        //             const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
        
        //             let logMessage = "";
        
        //             if (addedRoles.size > 0) {
        //                 logMessage += `\n\`✅\`**Eklenen rol:**\n\`-\`${addedRoles.map(role => `<@&${role.id}>`).join(', ')}`;
        //             }
            
        //             if (removedRoles.size > 0) {
        //                 logMessage += `\n\`❌\`**Kaldırılan rol:**\n\`-\`${removedRoles.map(role => `<@&${role.id}>`).join(', ')}`;
        //             }

        //             const response = new EmbedBuilder()
        //                 .setColor("Orange")
        //                 .setAuthor({ name: `${newMemberUser.username} (${newMemberUser.id})`, iconURL: newMemberUser.displayAvatarURL() })
        //                 .setDescription(`\`❔\`**Kullanıcının sunucuda rolleri değişti.**\n\n\`🤖\`**Kullanıcı Bilgileri: **\n\`-\`Kullanıcı: <@${newMemberUser.id}>\n\`-\`Kullanıcı Adı: ${newMemberUser.username}\n\`-\`Kullanıcı ID: ${newMemberUser.id}\n${logMessage}`)

        //             await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
        //         }
        //     }
           
        // }
        // else 
        if (oldMemberdisplayName !== newMemberdisplayName) {

            const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });

            if (guildSchema && guildSchema.logusernamechange) {
                const logChannel = guild.channels.cache.get(guildSchema.logusernamechange);

                if (logChannel) {

                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: `${newMemberUser.username} (${newMemberUser.id})`, iconURL: newMemberUser.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kullanıcının sunucuda takma adı değişti.**\n\n\`🤖\`**Kullanıcı Bilgileri: **\n\`-\`Kullanıcı Adı: ${newMemberUser.username}\n\`-\`Kullanıcı ID: ${newMemberUser.id}`)
                        .addFields(
                            { name: 'Eski Takma Adı:', value: `${oldMemberdisplayName}`, inline: true },
                            { name: 'Yeni Takma Adı:', value: `${newMemberdisplayName}`, inline: true }
                        )

                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
           
        }       

    });

}