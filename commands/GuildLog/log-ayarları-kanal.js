import fs from 'fs';
import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export const data = {
  name: "log-ayarları-kanal",
  description: "Sunucudaki loglar için kanal seçimi.",
  permission: ["Administrator"],
  botpermission: ["Administrator"],
  cooldown: 10,

  async execute(interaction) {

    const targetValues = interaction.values

    let selectMenuArgs
    try {
      const data = fs.readFileSync('utils/embed_data/guildlogdata.json', 'utf8');
      selectMenuArgs = JSON.parse(data);
    } catch (error) {
      console.error('JSON parse edilirken bir hata oluştu:', error.message);
    }
    
    if (!selectMenuArgs) {
      const response = new EmbedBuilder()
        .setDescription(`\`❌\`Gömülü veri okunamadı. Bot sahibinin görmesi gereken hata.`)
        .setColor("Red")
      try { await interaction.update({ embeds: [response] });} 
      catch (error) {console.error('Güncelleme hatası:', error);}
      return;
    }

    const logType = selectMenuArgs.find(arg => arg.setValue === `${targetValues}`)

    const response = new EmbedBuilder()
      .setAuthor({ name: "Bot • Sunucunun Log Ayarları" })
      .setDescription(`\`💡\`Şuanda \`${logType.setLabel}\` logu için işlem yapıyorsunuz.\n\`💡\`Aşağıdaki menüden kanal seçin.\n\`❕\`Cevap vermek için \`30\` saniyeniz var.`)
      .setColor("Orange")
      .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

    const row1 = new ActionRowBuilder()
      .setComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("logChannelsEdit")
          .setPlaceholder("Kanal Seç")
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('logChannelsDelete')
          .setLabel('Bu Logu Kapat')
          .setStyle('Primary'),
      );
    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('mesajsil-guild')
          .setLabel('Sonlandır')
          .setStyle('Danger'),
        new ButtonBuilder()
          .setCustomId('log-ayarları-geri')
          .setLabel('Geri')
          .setStyle('Secondary'),
      );

    interaction.update({ embeds: [response], components: [row1, row2, row3] }).catch((error) => { console.log(error.message) });
    const collectorMessage = await interaction.message;

    const filter = (i) => (i.customId === 'logChannelsEdit' || i.customId === 'logChannelsDelete');

    const collector = collectorMessage.createMessageComponentCollector({
      filter,
      time: 30_000,
    });

    collector.on('collect', async (i) => {
      if (i.user.id === interaction.user.id) {
        const { values, guild, guildId } = i

        // Kanal Kontrolü

        if (i.customId === 'logChannelsDelete') {
          await Guild_Schema.updateOne({ guild_id: guildId }, { $unset: { [`${logType.schemaKey}`]: 1 } });


          const msgLogSettings = await Promise.all(selectMenuArgs.map(async (arg) => {
            try {
              const logchannelid = await Guild_Schema.findOne({ guild_id: guildId });
              if (logchannelid && logchannelid[arg.schemaKey]) {
                return `\`➕\`**${arg.setLabel}:** <#${logchannelid[arg.schemaKey]}>`;
              }
            } catch (error) {
              console.error(error);
            }
            return `\`➕\`**${arg.setLabel}:** Kapalı`;
          }));


          const response1 = new EmbedBuilder()
            .setAuthor({ name: "Bot • Sunucunun Log Ayarları" })
            .setDescription(`\`💡\`Tüm ayarları aşağıdaki menüden düzenleyebilirsiniz.\n\n${msgLogSettings.join("\n")}`)
            .setColor("Orange")
            .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

          const response2 = new EmbedBuilder()
            .setDescription(`\`✅\`Başarıyla \`${logType.setLabel}\` logları kapatılacak şekilde ayarlandı.`)
            .setColor("Green")

          const row1 = new ActionRowBuilder()
            .setComponents(
              new StringSelectMenuBuilder()
                .setCustomId("log-ayarları-kanal")
                .setPlaceholder("Log Kanallarını Düzenle")
                .addOptions(
                  ...selectMenuArgs.map(option => new StringSelectMenuOptionBuilder()
                    .setLabel(option.setLabel)
                    .setValue(option.setValue)
                  )
                )
            );

          const row2 = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('mesajsil-guild')
                .setLabel('Sonlandır')
                .setStyle('Danger'),
            );


          i.update({ embeds: [response1, response2], components: [row1, row2], ephemeral: true }).catch((error) => { console.log(error.message) });
          collector.stop();
          return;
        }

        const targetChannel = guild.channels.cache.get(`${values}`);
        
        if (!targetChannel) {
          const response2 = new EmbedBuilder()
            .setDescription(`\`❌\`Belirtilen kanal bulunamadı veya erişimim yok.`)
            .setColor("Red")
          i.update({ embeds: [response, response2], ephemeral: true }).catch((error) => { console.log(error.message) });
          return;
        }


        if (targetChannel.type !== 0) {
          const response2 = new EmbedBuilder()
            .setDescription(`\`❌\`Seçilen kanal \`metin kanalı\` olmalı.`)
            .setColor("Red")
          i.update({ embeds: [response, response2], ephemeral: true }).catch((error) => { console.log(error.message) });
          return;
        }

        await Guild_Schema.updateOne({ guild_id: guildId }, { $set: { [`${logType.schemaKey}`]: `${values}`, } }, { upsert: true })


        const msgLogSettings = await Promise.all(selectMenuArgs.map(async (arg) => {
          try {
            const logchannelid = await Guild_Schema.findOne({ guild_id: guildId });
            if (logchannelid && logchannelid[arg.schemaKey]) {
              return `\`➕\`**${arg.setLabel}:** <#${logchannelid[arg.schemaKey]}>`;
            }
          } catch (error) {
            console.error(error);
          }
          return `\`➕\`**${arg.setLabel}:** Kapalı`;
        }));


        const response1 = new EmbedBuilder()
          .setAuthor({ name: "Bot • Sunucunun Log Ayarları" })
          .setDescription(`\`💡\`Tüm ayarları aşağıdaki menüden düzenleyebilirsiniz.\n\n${msgLogSettings.join("\n")}`)
          .setColor("Orange")
          .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const response2 = new EmbedBuilder()
          .setDescription(`\`✅\` <#${values}> kanalına \`${logType.setLabel}\` logları atılacak şekilde ayarlandı.`)
          .setColor("Green")

        const row1 = new ActionRowBuilder()
          .setComponents(
            new StringSelectMenuBuilder()
              .setCustomId("log-ayarları-kanal")
              .setPlaceholder("Log Kanallarını Düzenle")
              .addOptions(
                ...selectMenuArgs.map(option => new StringSelectMenuOptionBuilder()
                  .setLabel(option.setLabel)
                  .setValue(option.setValue)
                )
              )
          );

        const row2 = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('mesajsil-guild')
              .setLabel('Sonlandır')
              .setStyle('Danger'),
          );


        i.update({ embeds: [response1, response2], components: [row1, row2], ephemeral: true }).catch((error) => { console.log(error.message) });

        collector.stop();

      } else {
        const response = new EmbedBuilder()
          .setDescription(`\`❌\`Bunu sadece \`${interaction.user.displayName}\` kullanabilir.`)
          .setColor("Red")
        i.reply({ embeds: [response], ephemeral: true }).catch((error) => { console.log(error.message) });
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        collectorMessage.delete()
      }

    });


  }
};