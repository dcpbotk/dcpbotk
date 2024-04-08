import fs from 'fs';
import { EmbedBuilder } from "discord.js"
const ownerId = process.env.ownerid;

export const data = {
  name: "adminbackupchannels",
  description: "Channels backup command.",
  botpermission: ["Administrator"],
  async execute(interaction) {
    if(interaction.member.id !== ownerId) return

    let msg = ""
  
    await backupRoles(interaction.guild)
      .then(roles => {

        const roleList = roles.map(role => `• ${role.name}`).join('\n');
        msg += `\n\n**Backup of roles:**\n${roleList}`

      })
      .catch(error => console.log(`An error occurred during role backup:   ${error.message}`));


    await backupCategories(interaction.guild)
      .then(categories => {

        const categoryList = categories.map(category => `• ${category.name}`).join('\n');
        msg += `\n\n**Backup of categories:**\n${categoryList}`

      })
      .catch(error => console.log(`An error occurred during category backup:   ${error.message}`));


    await backupTextChannels(interaction.guild)
      .then(textChannels => {

        const textChannelList = textChannels.map(textChannel => `• ${textChannel.name}`).join('\n');

        msg += `\n\n**Backup of text channels:**\n${textChannelList}`
      })
      .catch(error => console.log(`An error occurred during textChannel backup:   ${error.message}`));

    await backupVoiceChannels(interaction.guild)
      .then(voiceChannels => {

        const voiceChannelList = voiceChannels.map(voiceChannel => `• ${voiceChannel.name}`).join('\n');

        msg += `\n\n**Backup of voice channels:**\n${voiceChannelList}`
      })
      .catch(error => console.log(`An error occurred during voiceChannel backup:   ${error.message}`));
    const response = new EmbedBuilder()
      .setAuthor({ name: "Bot • Channels backed up" })
      .setDescription(`${msg || "-"}`)
      .setColor("Green")
      .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

    interaction.channel.send({ embeds: [response], components: [] });


  }
};

function backupRoles(guild) {
  let roleCollection = guild.roles.cache.sort((a, b) => b.position - a.position);

  let roles = roleCollection.map(role => {

    return {
      idOld: role.id,
      name: role.name,
      hexColor: role.hexColor,
      hoist: role.hoist,
      mentionable: role.mentionable,
      position: role.position,
      rawPosition: role.rawPosition,
      defaultRole: guild.roles.everyone.id === role.id,
      permBitfield: role.permissions.bitfield.toString(),
    };
  });

  const backupData = JSON.stringify(roles, null, 2);

  fs.writeFileSync('utils/backup/rolesBackup.json', backupData, 'utf-8');
  return Promise.resolve(roles);
}
function backupCategories(guild) {
  let categoryCollection = guild.channels.cache.filter(c => c.type === 4);
  categoryCollection = categoryCollection.sort((a, b) => a.position - b.position);

  let categories = categoryCollection.map(category => {
    let permOverwritesCollection = category.permissionOverwrites.cache.filter(permOverwrite => permOverwrite.type === 0);
    permOverwritesCollection = permOverwritesCollection.filter(permOverwrite => guild.roles.cache.has(permOverwrite.id));
    let permOverwrites = permOverwritesCollection.map(permOverwrite => {
      return {
        id: permOverwrite.id,
        allowed: permOverwrite.allow.bitfield.toString(),
        denied: permOverwrite.deny.bitfield.toString(),
      };
    });

    return {
      name: category.name,
      position: category.position,
      rawPosition: category.rawPosition,
      permOverwrites: permOverwrites,
    };
  });

  const backupData = JSON.stringify(categories, null, 2);

  fs.writeFileSync('utils/backup/categoriesBackup.json', backupData, 'utf-8');
  return Promise.resolve(categories);
}
function backupTextChannels(guild) {
  let textChannelCollection = guild.channels.cache.filter(c => c.type === 0);
  textChannelCollection = textChannelCollection.sort((a, b) => a.position - b.position);

  let textChannels = textChannelCollection.map(textChannel => {
    let permOverwritesCollection = textChannel.permissionOverwrites.cache.filter(permOverwrite => permOverwrite.type === 0);
    permOverwritesCollection = permOverwritesCollection.filter(permOverwrite => guild.roles.cache.has(permOverwrite.id));
    let permOverwrites = permOverwritesCollection.map(permOverwrite => {
      return {
        id: permOverwrite.id,
        allowed: permOverwrite.allow.bitfield.toString(),
        denied: permOverwrite.deny.bitfield.toString(),
      };
    });

    return {
      name: textChannel.name,
      topic: textChannel.topic,
      nsfw: textChannel.nsfw,
      isSystemChannel: guild.systemChannelID === textChannel.id,
      position: textChannel.position,
      rawPosition: textChannel.rawPosition,
      parentCat: textChannel.parentId,
      permLocked: textChannel.permissionsLocked ? textChannel.permissionsLocked : false,
      permOverwrites: textChannel.permissionsLocked ? null : permOverwrites,
    };
  });

  const backupData = JSON.stringify(textChannels, null, 2);

  fs.writeFileSync('utils/backup/textChannelsBackup.json', backupData, 'utf-8');
  return Promise.resolve(textChannels);
}
function backupVoiceChannels(guild) {
  let voiceChannelCollection = guild.channels.cache.filter(c => c.type === 2);
  voiceChannelCollection = voiceChannelCollection.sort((a, b) => a.position - b.position);

  let voiceChannels = voiceChannelCollection.map(voiceChannel => {
    let permOverwritesCollection = voiceChannel.permissionOverwrites.cache.filter(permOverwrite => permOverwrite.type === 2);
    permOverwritesCollection = permOverwritesCollection.filter(permOverwrite => guild.roles.cache.has(permOverwrite.id));
    let permOverwrites = permOverwritesCollection.map(permOverwrite => {
      return {
        id: permOverwrite.id,
        allowed: permOverwrite.allow.bitfield.toString(),
        denied: permOverwrite.deny.bitfield.toString(),
      };
    });

    return {
      name: voiceChannel.name,
      region: voiceChannel.rtcRegion,
      position: voiceChannel.position,
      rawPosition: voiceChannel.rawPosition,
      parentCat: voiceChannel.parentId,
      bitrate: voiceChannel.bitrate,
      userLimit: voiceChannel.userLimit,
      isAfkChannel: guild.afkChannelId === voiceChannel.id,
      permLocked: voiceChannel.permissionsLocked ? voiceChannel.permissionsLocked : false,
      permOverwrites: voiceChannel.permissionsLocked ? null : permOverwrites,
    };
  });

  const backupData = JSON.stringify(voiceChannels, null, 2);

  fs.writeFileSync('utils/backup/voiceChannelsBackup.json', backupData, 'utf-8');
  return Promise.resolve(voiceChannels);
}


