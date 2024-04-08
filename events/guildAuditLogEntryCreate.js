import Guild_Schema from "../utils/database/Guild_Schema.js"
import { EmbedBuilder, PermissionsBitField } from "discord.js"

export default client => {
    client.on('guildAuditLogEntryCreate', async (auditLogEntry, guild) => {

        if (auditLogEntry.executor.bot) return
        const { action, executorId, executor, targetId, target, reason } = auditLogEntry
        // console.log(auditLogEntry)
        console.log(action)

        const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });
        if (!guildSchema) return

        if (checkDefinition([20, 22, 23], action) && guildSchema.loguserkick) {
            if (action === 20) {
                const logChannel = guild.channels.cache.get(guildSchema.loguserkick);

                if (logChannel) {
                    const reasonText = reason ? `\n\n\`💬\`**Sebep: **${reason}` : ""
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: `${target.username} (${targetId})`, iconURL: target.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kullanıcı sunucudan atıldı.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🤖\`**Kullanıcı Bilgileri: **\n\`-\`Kullanıcı: <@${target.id}>\n\`-\`Kullanıcı İsmi: ${target.username}\n\`-\`Kullanıcı ID: ${targetId}${reasonText}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
            if (action === 22) {
                const logChannel = guild.channels.cache.get(guildSchema.loguserban);

                if (logChannel) {
                    const reasonText = reason ? `\n\n\`💬\`**Sebep: **${reason}` : ""
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: `${target.username} (${targetId})`, iconURL: target.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kullanıcı sunucudan yasaklandı.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🤖\`**Kullanıcı Bilgileri: **\n\`-\`Kullanıcı: <@${target.id}>\n\`-\`Kullanıcı İsmi: ${target.username}\n\`-\`Kullanıcı ID: ${targetId}${reasonText}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
            if (action === 23) {
                const logChannel = guild.channels.cache.get(guildSchema.loguserban);

                if (logChannel) {
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: `${target.username} (${targetId})`, iconURL: target.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kullanıcının sunucudan yasağı kaldırıldı.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🤖\`**Kullanıcı Bilgileri: **\n\`-\`Kullanıcı: <@${targetId}>\n\`-\`Kullanıcı İsmi: ${target.username}\n\`-\`Kullanıcı ID: ${targetId}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
        }
        else if (checkDefinition([10, 11, 12, 13, 15], action) && guildSchema.logchannelupdate) {
            
            if (action === 10) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelupdate);
                if (logChannel) {
                    // const {changes} = auditLogEntry;
                    const channelName = target.name;
                    const channelId = targetId;
                    const channelRawPosition = target.rawPosition;
                    const channelParentId = target.parentId;
                    let channelType = target.type;
                    if(channelType === 0) channelType = "Metin Kanalı"
                    if(channelType === 2) channelType = "Ses Kanalı"
                    if(channelType === 4) channelType = "Kategori"
                    const channelNsfw = target.nsfw ? "Açık" : "Kapalı"
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: "Kanal İşlemleri" });
                    if (channelType === "Kategori") response.setDescription(`\`❔\`**Sunucuda Kategori oluşturuldu.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kanal Tipi: ${channelType}\n\`-\`Kategori: <#${channelId}>\n\`-\`Kategori ID: ${channelId}\n\`-\`Kategori Sırası: ${channelRawPosition}`)
                    else response.setDescription(`\`❔\`**Sunucuda kanal oluşturuldu.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kategori: ${channelParentId ? `<#${channelParentId}>` : "-"}\n\`-\`Kanal Tipi: ${channelType}\n\`-\`Kanal: <#${channelId}>\n\`-\`Kanal Adı: ${channelName}\n\`-\`Kanal ID: ${channelId}\n\`-\`Kanal Sırası: ${channelRawPosition}\n\`-\`Nsfw Durumu: ${channelNsfw}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
            else if (action === 11) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelupdate);
                if (logChannel) {
                    
                    const {changes} = auditLogEntry;                    
                    let msg = ""
                  
                    changes.forEach(change => {
                        switch(change.key) {
                            case "name":
                                msg += `\n\n\`🔊\`**İsim Değişikliği: **\n\`-\`Eski İsim: ${change.old}\n\`-\`Yeni İsim: ${change.new}`;
                                break;
                            case "topic":
                                msg += `\n\n\`🔊\`**Konu Değişikliği: **\n\`-\`Eski Konu: ${change.old}\n\`-\`Yeni Konu: ${change.new}`;
                                break;
                            case "rate_limit_per_user":
                                msg += `\n\n\`🔊\`**Yavaş Mod Süresi Değişikliği: **\n\`-\`Eski Süre: ${change.old}\n\`-\`Yeni Süre: ${change.new}`;
                                break;
                            case "bitrate":
                                msg += `\n\n\`🔊\`**Bit Hızı Değişikliği: **\n\`-\`Eski Süre: ${change.old}\n\`-\`Yeni Süre: ${change.new}`;
                                break;
                            case "user_limit":
                                msg += `\n\n\`🔊\`**Kullanıcı Limiti Değişikliği: **\n\`-\`Eski Süre: ${change.old}\n\`-\`Yeni Süre: ${change.new}`;
                                break;
                            case "rtc_region":
                                msg += `\n\n\`🔊\`**Bölge Değişikliği: **\n\`-\`Eski Süre: ${change.old ? change.old : "-"}\n\`-\`Yeni Süre: ${change.new ? change.new : "-"}`;
                                break;
                            default:
                                break;
                        }
                    });

                    if(msg === "") return


                    const channelName = target.name;
                    const channelId = targetId;
                    const channelRawPosition = target.rawPosition;
                    const channelParentId = target.parentId;
                    let channelType = target.type;
                    if(channelType === 0) channelType = "Metin Kanalı"
                    if(channelType === 2) channelType = "Ses Kanalı"
                    if(channelType === 4) channelType = "Kategori"
                    const channelNsfw = target.nsfw ? "Açık" : "Kapalı"
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: "Kanal İşlemleri" });
                    if (channelType === "Kategori") response.setDescription(`\`❔\`**Sunucuda kanal düzenlendi.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kanal Tipi: ${channelType}\n\`-\`Kategori: <#${channelId}>\n\`-\`Kategori ID: ${channelId}\n\`-\`Kategori Sırası: ${channelRawPosition}`)
                    else response.setDescription(`\`❔\`**Sunucuda kanal düzenlendi.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kategori: ${channelParentId ? `<#${channelParentId}>` : "-"}\n\`-\`Kanal Tipi: ${channelType}\n\`-\`Kanal: <#${channelId}>\n\`-\`Kanal Adı: ${channelName}\n\`-\`Kanal ID: ${channelId}\n\`-\`Kanal Sırası: ${channelRawPosition}\n\`-\`Nsfw Durumu: ${channelNsfw}${msg}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
            else if (action === 12) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelupdate);
                if (logChannel) {
                    // const {changes} = auditLogEntry;
                    const channelName = target.name;
                    const channelId = targetId;
                    let channelType = target.type;
                    if(channelType === 0) channelType = "Metin Kanalı"
                    if(channelType === 2) channelType = "Ses Kanalı"
                    if(channelType === 4) channelType = "Kategori"
                    const channelNsfw = target.nsfw ? "Açık" : "Kapalı"
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: "Kanal Silindi" })
                        .setDescription(`\`❔\`**Sunucuda kanal oluşturuldu**\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kanal Tipi: ${channelType}\n\n\`-\`Kanal Adı: ${channelName}\n\`-\`Kanal ID: ${channelId}\n\`-\`Kanal NSFW: ${channelNsfw}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
            else if (action === 13) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelupdate);
                if (logChannel) {
                    const {changes} = auditLogEntry;
                    console.log(changes)
                    const channelName = target.name;
                    const channelId = targetId;
                    let channelType = target.type;
                    if(channelType === 0) channelType = "Metin Kanalı"
                    if(channelType === 2) channelType = "Ses Kanalı"
                    if(channelType === 4) channelType = "Kategori"
                    const channelNsfw = target.nsfw ? "Açık" : "Kapalı"
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: "Kanal Silindi" })
                        .setDescription(`\`❔\`**Kanala bir rol eklendi.**\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kanal Tipi: ${channelType}\n\n\`-\`Kanal Adı: ${channelName}\n\`-\`Kanal ID: ${channelId}\n\`-\`Kanal NSFW: ${channelNsfw}\n\n\`🔊\`**Eklenen Rol:**\n${changes[1].new === 0 ? `<@&${changes[0].new}>` : `<@${changes[0].new}>`}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
            else if (action === 14) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelupdate);
                if (logChannel) {
                    const {changes} = auditLogEntry;
                    const channelName = target.name;
                    const channelId = targetId;
                    let channelType = target.type;
                    // console.log(auditLogEntry)
                    
                    
                    changes.forEach(change => {
                        if (change.key === 'allow' || change.key === 'deny') {
                            const oldPermissions = BigInt(change.old);
                            const newPermissions = BigInt(change.new);
                            console.log(`İzin değişikliği: Eski izinler: ${oldPermissions}, Yeni izinler: ${newPermissions}`);

                            const changedPermissions = oldPermissions ^ newPermissions;
                            console.log("Değiştirilen izinler:");                 
                            
                            const permissionFlags = Object.entries(PermissionsBitField.Flags);
                            permissionFlags.forEach(([flag, value]) => {
                                if (changedPermissions & BigInt(value)) {
                                    console.log(flag);
                                }
                            });
                        }
                    });
return
                    if(channelType === 0) channelType = "Metin Kanalı"
                    if(channelType === 2) channelType = "Ses Kanalı"
                    if(channelType === 4) channelType = "Kategori"
                    const channelNsfw = target.nsfw ? "Açık" : "Kapalı"
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: "Kanal izinleri değiştirildi" })
                        .setDescription(`\`❔\`**Kanal izinleri değiştirildi.**\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kanal Tipi: ${channelType}\n\n\`-\`Kanal Adı: ${channelName}\n\`-\`Kanal ID: ${channelId}\n\`-\`Kanal NSFW: ${channelNsfw}\n\n\`🔊\`**Değişen İzinler:**\n${changes[1].new === 0 ? `<@&${changes[0].new}>` : `<@${changes[0].new}>`}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }
            else if (action === 15) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelupdate);
                if (logChannel) {
                    const {changes} = auditLogEntry;
                    console.log(changes)
                    const channelName = target.name;
                    const channelId = targetId;
                    let channelType = target.type;
                    if(channelType === 0) channelType = "Metin Kanalı"
                    if(channelType === 2) channelType = "Ses Kanalı"
                    if(channelType === 4) channelType = "Kategori"
                    const channelNsfw = target.nsfw ? "Açık" : "Kapalı"
                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: "Kanal Silindi" })
                        .setDescription(`\`❔\`**Kanaldan bir rol kaldırıldı.**\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🔊\`**Kanal Bilgileri: **\n\`-\`Kanal Tipi: ${channelType}\n\n\`-\`Kanal Adı: ${channelName}\n\`-\`Kanal ID: ${channelId}\n\`-\`Kanal NSFW: ${channelNsfw}\n\n\`🔊\`**Kaldırılan Rol:**\n${changes[1].old === 0 ? `<@&${changes[0].old}>` : `<@${changes[0].old}>`}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }

        }
        else if (checkDefinition([25], action) && guildSchema.logroleupdate) {
            
            if (action === 25) {
                const logChannel = guild.channels.cache.get(guildSchema.logroleupdate);

                if (logChannel) {
                    const {changes} = auditLogEntry;
                    let msgText = ""

                    if(changes[0].key === "$remove"){
                        msgText += `\n\n\`❌\`**Rol kaldırıldı: **\n<@&${changes[0].new[0].id}>`
                    }
                    else if(changes[0].key === "$add"){
                        msgText += `\n\n\`✅\`**Rol Verildi: **\n<@&${changes[0].new[0].id}>`
                    }

                    const response = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: `${target.username} (${targetId})`, iconURL: target.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kullanıcının rolleri değişti.**\n\n\`🤖\`**İşlem Yapan Bilgileri: **\n\`-\`Kullanıcı: <@${executorId}>\n\`-\`Kullanıcı ID: ${executorId}\n\n\`🤖\`**Kullanıcı Bilgileri: **\n\`-\`Kullanıcı: <@${targetId}>\n\`-\`Kullanıcı Adı: ${target.username}\n\`-\`Kullanıcı ID: ${targetId}${msgText}`)
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }
            }

        }


    });

}

function checkDefinition(actions,definition) {
    if (actions.includes(definition)) return true;
    else return false;
}

function logNewValueByKey(changes, keyToFind) {
    // console.log(changes.find(change => change.key === keyToFind))
    const change = changes.find(change => change.key === keyToFind);
        if (change) return change.new
        return;
}



// 14 yapamaıdm kanal izinleri