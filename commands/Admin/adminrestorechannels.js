import { EmbedBuilder, Collection } from "discord.js"
import fs from 'fs';

const ownerId = process.env.ownerid;
export const data = {
  name: "adminrestorechannels",
  description: "Kanal geri yükleme komutu.",
  botpermission: ["Administrator"],
  async execute(interaction) {
    if(interaction.member.id !== ownerId) return

    let msg = ""
    const newGuild = await interaction.client.guilds.fetch(interaction.guild.id);
    const replaceMap = {};


    const guildData0 = JSON.parse(fs.readFileSync('./utils/backup/rolesBackup.json', 'utf8'));

    const roleReferences = await createRoles(guildData0, newGuild);
    const roleMentions = roleReferences.map(role => {
      if (role.new.name === "Yönetici") replaceMap["1216163497801547838"] = role.new.id;
      if (role.new.name === "</>") replaceMap["1216168813247205416"] = role.new.id;
      if (role.new.name === "Sunucu Botu") replaceMap["1216168581692129330"] = role.new.id;
      if (role.new.name === "Admin") replaceMap["1216163543758671892"] = role.new.id;
      if (role.new.name === "Moderatör") replaceMap["1216163570723852338"] = role.new.id;
      if (role.new.name === "Discord Yetkilisi") replaceMap["1216163977135001671"] = role.new.id;
      if (role.new.name === "Bot") replaceMap["1216168455892504576"] = role.new.id;
      if (role.new.name === "Sponsor") replaceMap["1216164343633281134"] = role.new.id;
      if (role.new.name === "Youtube Abonesi") replaceMap["1216164374700494938"] = role.new.id;
      if (role.new.name === "Nitro Booster") replaceMap["1216164421987078174"] = role.new.id;
      if (role.new.name === "Üye") replaceMap["1216165063858323648"] = role.new.id;
      if (role.new.name === "Cezalı") replaceMap["1216464187312574535"] = role.new.id;
      if (role.new.name === "🏆") replaceMap["1224739177069936710"] = role.new.id;
      if (role.new.name === "🔑") replaceMap["1217267048409858148"] = role.new.id;
      replaceMap["1216163263507861534"] = interaction.guild.id;
      return `<@&${role.new.id}>`;

    }).join('\n');
    msg += `\n\n**Roles restored:**\n${roleMentions}`


    const guildData = JSON.parse(fs.readFileSync('./utils/backup/categoriesBackup.json', 'utf8'));

    const updatedGuildData = await guildData.map(channel => {
      if (channel.permOverwrites) {
        channel.permOverwrites = channel.permOverwrites.map(overwrite => {
          if (overwrite.id in replaceMap) {
            overwrite.id = replaceMap[overwrite.id];
          }
          return overwrite;
        });
      }
      return channel;
    });

    const categoryReferences = await createCategories(updatedGuildData, newGuild);
    const categoryMentions = categoryReferences.map(category => {
      if (category.new.name === "bilgi") replaceMap["1216168181844938802"] = category.new.id;
      if (category.new.name === "metin kanalları") replaceMap["1216170106883674252"] = category.new.id;
      if (category.new.name === "sohbet kanalları") replaceMap["1216171039701340210"] = category.new.id;
      if (category.new.name === "özel oda") replaceMap["1216172830421684297"] = category.new.id;
      if (category.new.name === "yönetim") replaceMap["1216173196148215808"] = category.new.id;
      if (category.new.name === "loglar") replaceMap["1216173682872029234"] = category.new.id;
      if (category.new.name === "Destek - Kayıt") replaceMap["1224732312189665320"] = category.new.id;
      return `<#${category.new.id}>`;
      
    }).join('\n');
    msg += `\n\n**Categories restored:**\n${categoryMentions}`

    const guildData2 = JSON.parse(fs.readFileSync('./utils/backup/textChannelsBackup.json', 'utf8'));

    const updatedGuild2Data = await guildData2.map(channel => {
      if (channel.permOverwrites) {
        channel.permOverwrites = channel.permOverwrites.map(overwrite => {
          if (overwrite.id in replaceMap) {
            overwrite.id = replaceMap[overwrite.id];
          }
          return overwrite;
        });
      }

      if (channel.parentCat && channel.parentCat in replaceMap) {
        channel.parentCat = replaceMap[channel.parentCat];
      }

      return channel;
    });

    const textChannelReferences = await createTextChannels(updatedGuild2Data, newGuild);
    const textChannelMentions = textChannelReferences.map(texthannel => `<#${texthannel.new.id}>`).join('\n');  

    msg += `\n\n**Text Channels restored:**\n${textChannelMentions}`



    
    const guildData3 = JSON.parse(fs.readFileSync('./utils/backup/voiceChannelsBackup.json', 'utf8'));

    const updatedGuild3Data = await guildData3.map(channel => {
      if (channel.permOverwrites) {
        channel.permOverwrites = channel.permOverwrites.map(overwrite => {
          if (overwrite.id in replaceMap) {
            overwrite.id = replaceMap[overwrite.id];
          }
          return overwrite;
        });
      }

      if (channel.parentCat && channel.parentCat in replaceMap) {
        channel.parentCat = replaceMap[channel.parentCat];
      }

      return channel;
    });
    
    const voiceChannelReferences = await createVoiceChannels(updatedGuild3Data, newGuild);
    const voiceChannelMentions = voiceChannelReferences.map(voicehannel => `<#${voicehannel.new.id}>`).join('\n');  

    msg += `\n\n**Voice Channels restored:**\n${voiceChannelMentions}`



    const response = new EmbedBuilder()
      .setAuthor({ name: "Bot • Roles are restored" })
      .setDescription(`${msg || "-"}`)
      .setColor("Green")
      .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

    interaction.channel.send({ embeds: [response], components: [] });
  }
};

async function createRoles(guildData, newGuild) {
  try {
    let roleReferences = new Collection();

    for (let i = 0; i < guildData.length; i++) {
      let role = guildData[i];


      if (role.defaultRole) {
        let everyoneRole = newGuild.roles.everyone;
        await everyoneRole.setPermissions(BigInt(role.permBitfield));
        roleReferences.set(role.idOld, { new: newGuild.roles.everyone, old: role });
      } else {
        let newRole = {
          name: role.name,
          color: role.hexColor,
          hoist: role.hoist,
          mentionable: role.mentionable,
          permissions: BigInt(role.permBitfield),
        };

        let createdRole = await newGuild.roles.create(newRole);       
        await createdRole.setPosition(0);
        console.log(`Role created: ${createdRole.name}`);
        roleReferences.set(createdRole.id, { new: createdRole, old: role });
      }    
    }

    return roleReferences;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createCategories(guildData, newGuild) {
  try {
    let categoryReferences = new Collection();

    for (let i = 0; i < guildData.length; i++) {
      let category = guildData[i];

      let overwrites = category.permOverwrites.map(permOver => {
        return {
          id: permOver.id,
          allow: BigInt(permOver.allowed),
          deny: BigInt(permOver.denied),
        };
      });

      let options = {
        name: category.name,
        type: 4,
        permissionOverwrites: overwrites,
      };

      let createdCategory = await newGuild.channels.create(options);
      console.log(`Category created: ${createdCategory.name}`);
      categoryReferences.set(createdCategory.id, { new: createdCategory, old: category });
    }

    return categoryReferences;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createTextChannels(guildData, newGuild) {
  try {
    let textChannelReferences = new Collection();

    for (let i = 0; i < guildData.length; i++) {
      let textChannel = guildData[i];

      let options = {
        name: textChannel.name,
        type: 0,
        nsfw: textChannel.nsfw,
        topic: textChannel.topic,
      };

      if (textChannel.parentCat) {
        options.parent = textChannel.parentCat
      }

      if (!textChannel.permLocked) {
        options.permissionOverwrites = textChannel.permOverwrites.map(permOver => {
          return {
            id: permOver.id,
            allow: BigInt(permOver.allowed),
            deny: BigInt(permOver.denied),
          };
        });
      }

      let createdTextChannel = await newGuild.channels.create(options);
      console.log(`Text channel created: ${createdTextChannel.name}`);
      textChannelReferences.set(createdTextChannel.id, { new: createdTextChannel, old: textChannel });
    }

    return textChannelReferences;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createVoiceChannels(guildData, newGuild) {
  try {
    let voiceChannelReferences = new Collection();

    for (let i = 0; i < guildData.length; i++) {
      let voiceChannel = guildData[i];
      
      let options = {
        name: voiceChannel.name,
        type: 2,
        bitrate: voiceChannel.bitrate,
        userLimit: voiceChannel.userLimit,
      };

      if (voiceChannel.parentCat) {
        options.parent = voiceChannel.parentCat
      }

      if (!voiceChannel.permLocked) {
        options.permissionOverwrites = voiceChannel.permOverwrites.map(permOver => {
          return {
            id: permOver.id,
            allow: BigInt(permOver.allowed),
            deny: BigInt(permOver.denied),
          };
        });
      }

      let createdVoiceChannel = await newGuild.channels.create(options);
      console.log(`Voice channel created: ${createdVoiceChannel.name}`);
      voiceChannelReferences.set(createdVoiceChannel.id, { new: createdVoiceChannel, old: voiceChannel });
    }

    return voiceChannelReferences;
  } catch (err) {
    console.error(err);
    throw err;
  }
}



