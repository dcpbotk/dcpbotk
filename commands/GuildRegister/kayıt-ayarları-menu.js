import fs from 'fs';
import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export const data = {
  name: "kayıt-ayarları-menu",
  description: "Sunucudaki kayıt ayarları için menü seçimi.",
  permission: ["Administrator"],
  botpermission: ["Administrator"],
  cooldown: 10,

  async execute(interaction) {

    const targetValues = interaction.values

    let selectMenuArgs
    try {
      const data = fs.readFileSync('utils/embed_data/guildregisterdata.json', 'utf8');
      selectMenuArgs = JSON.parse(data);
    } catch (error) {
      console.error('JSON parse edilirken bir hata oluştu:', error.message);
    }

    if (!selectMenuArgs) {
      const response = new EmbedBuilder()
        .setDescription(`\`❌\`Gömülü veri okunamadı. Bot sahibinin görmesi gereken hata.`)
        .setColor("Red")
      try { await interaction.update({ embeds: [response] }); }
      catch (error) { console.error('Güncelleme hatası:', error); }
      return;
    }

    const logType = selectMenuArgs.find(arg => arg.setValue === `${targetValues}`)

    const response = new EmbedBuilder()
      .setAuthor({ name: "Bot • Sunucunun Kayıt Ayarları" })
      .setDescription(`\`💡\`Şuanda \`${logType.setLabel}\` için işlem yapıyorsunuz.\n\`💡\`Aşağıdaki menüden seçim yapabilirsiniz.\n\`❕\`Cevap vermek için \`30\` saniyeniz var.`)
      .setColor("Orange")
      .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

    let row1;
    if (targetValues[0] === "1" || targetValues[0] === "2" || targetValues[0] === "9") {
      row1 = new ActionRowBuilder()
        .setComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId("registerSettingsMenuChannel")
            .setPlaceholder("Kanal Seç")
        );
    }
    else if (targetValues[0] === "3") {
      const selectMenuArgs = [
        { setLabel: "Metin", setValue: "Metin" },
        { setLabel: "Resim", setValue: "Resim" },
      ]

      row1 = new ActionRowBuilder()
        .setComponents(
          new StringSelectMenuBuilder()
            .setCustomId("registerSettingsMenu")
            .setPlaceholder("Seçim Yap")
            .addOptions(
              ...selectMenuArgs.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.setLabel)
                .setValue(option.setValue)
              )
            )
        );
    }
    else if (targetValues[0] === "4" || targetValues[0] === "6" || targetValues[0] === "7" || targetValues[0] === "8") {
      row1 = new ActionRowBuilder()
        .setComponents(
          new RoleSelectMenuBuilder()
            .setCustomId("registerSettingsMenuRole")
            .setPlaceholder("Rol Seç")
        );
    }
    else if (targetValues[0] === "5") {
      const selectMenuArgs = [
        { setLabel: "Buton + Komut", setValue: "Buton+Komut" },
        { setLabel: "Komut", setValue: "Komut" },
      ]

      row1 = new ActionRowBuilder()
        .setComponents(
          new StringSelectMenuBuilder()
            .setCustomId("registerSettingsMenu")
            .setPlaceholder("Seçim Yap")
            .addOptions(
              ...selectMenuArgs.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.setLabel)
                .setValue(option.setValue)
              )
            )
        );
    }
    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('registersettingsDelete')
          .setLabel('Bu Ayarı Kapat')
          .setStyle('Primary'),
      );
    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('mesajsil-guild')
          .setLabel('Sonlandır')
          .setStyle('Danger'),
        new ButtonBuilder()
          .setCustomId('kayıt-ayarları-geri')
          .setLabel('Geri')
          .setStyle('Secondary'),
      );

    interaction.update({ embeds: [response], components: [row1, row2, row3] }).catch((error) => { console.log(error.message) });
    const collectorMessage = await interaction.message;

    const filter = (i) => (i.customId === 'registerSettingsMenu' || i.customId === 'registerSettingsMenuChannel' || i.customId === 'registerSettingsMenuRole' || i.customId === 'registersettingsDelete' || i.customId === 'kayıt-ayarları-geri');

    const collector = collectorMessage.createMessageComponentCollector({
      filter,
      time: 30_000,
    });

    collector.on('collect', async (i) => {
      if (i.user.id === interaction.user.id) {
        const { values, guild, guildId } = i

        if (i.customId === 'registersettingsDelete') {
          await Guild_Schema.updateOne({ guild_id: guildId }, { $unset: { [`${logType.schemaKey}`]: 1 } });


          const msgLogSettings = await Promise.all(selectMenuArgs.map(async (arg) => {
            try {
              const readingkey = await Guild_Schema.findOne({ guild_id: guildId });
              if (readingkey && readingkey[arg.schemaKey] && (arg.schemaKey === "logguildinput" || arg.schemaKey === "logguildoutput" || arg.schemaKey === "registerchannel")) {
                return `\`➕\`**${arg.setLabel}:** <#${readingkey[arg.schemaKey]}>`;
              }
                            else if (readingkey && readingkey[arg.schemaKey] && (arg.schemaKey === "memberdaddRole" || arg.schemaKey === "registerrole" || arg.schemaKey === "registerunrole" || arg.schemaKey === "registermodrole")) {

                return `\`➕\`**${arg.setLabel}:** <@&${readingkey[arg.schemaKey]}>`;
              }
              else if (readingkey && readingkey[arg.schemaKey]) {
                return `\`➕\`**${arg.setLabel}:** ${readingkey[arg.schemaKey]}`;
              }
            } catch (error) {
              console.error(error);
            }
            return `\`➕\`**${arg.setLabel}:** Kapalı`;
          }));


          const response1 = new EmbedBuilder()
            .setAuthor({ name: "Bot • Sunucunun Kayıt Ayarları" })
            .setDescription(`\`💡\`Tüm ayarları aşağıdaki menüden düzenleyebilirsiniz.\n\n${msgLogSettings.join("\n")}`)
            .setColor("Orange")
            .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

          const response2 = new EmbedBuilder()
            .setDescription(`\`✅\`Başarıyla \`${logType.setLabel}\` kapatılacak şekilde ayarlandı.`)
            .setColor("Green")

          const row1 = new ActionRowBuilder()
            .setComponents(
              new StringSelectMenuBuilder()
                .setCustomId("kayıt-ayarları-menu")
                .setPlaceholder("Kayıt Ayarlarını Düzenle")
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
        if (i.customId === 'kayıt-ayarları-geri') {
          collector.stop();
          return
        }

        // Kanal kontrolü
        let finished = false;

        if (targetValues[0] === "1" || targetValues[0] === "2") {
          const targetChannel = guild.channels.cache.get(`${values}`);

          if (!targetChannel) {
            const response2 = new EmbedBuilder()
              .setDescription(`\`❌\`Belirtilen kanal bulunamadı veya erişimim yok.`)
              .setColor("Red")
            i.update({ embeds: [response, response2], ephemeral: true }).catch((error) => { console.log(error.message) });
            finished = true;
            return
          }

          if (targetChannel.type !== 0) {
            const response2 = new EmbedBuilder()
              .setDescription(`\`❌\`Seçilen kanal \`metin kanalı\` olmalı.`)
              .setColor("Red")
            i.update({ embeds: [response, response2], ephemeral: true }).catch((error) => { console.log(error.message) });
            finished = true;
          }

        }

        if (finished) return;


        await Guild_Schema.updateOne({ guild_id: guildId }, { $set: { [`${logType.schemaKey}`]: `${values}`, } }, { upsert: true })

        const msgLogSettings = await Promise.all(selectMenuArgs.map(async (arg) => {
          try {
            const readingkey = await Guild_Schema.findOne({ guild_id: guildId });
            if (readingkey && readingkey[arg.schemaKey] && (arg.schemaKey === "logguildinput" || arg.schemaKey === "logguildoutput" || arg.schemaKey === "registerchannel")) {
              return `\`➕\`**${arg.setLabel}:** <#${readingkey[arg.schemaKey]}>`;
            }
                          else if (readingkey && readingkey[arg.schemaKey] && (arg.schemaKey === "memberdaddRole" || arg.schemaKey === "registerrole" || arg.schemaKey === "registerunrole" || arg.schemaKey === "registermodrole")) {

              return `\`➕\`**${arg.setLabel}:** <@&${readingkey[arg.schemaKey]}>`;
            }
            else if (readingkey && readingkey[arg.schemaKey]) {
              return `\`➕\`**${arg.setLabel}:** ${readingkey[arg.schemaKey]}`;
            }
          } catch (error) {
            console.error(error);
          }
          return `\`➕\`**${arg.setLabel}:** Kapalı`;
        }));


        const response1 = new EmbedBuilder()
          .setAuthor({ name: "Bot • Sunucunun Kayıt Ayarları" })
          .setDescription(`\`💡\`Tüm ayarları aşağıdaki menüden düzenleyebilirsiniz.\n\n${msgLogSettings.join("\n")}`)
          .setColor("Orange")
          .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const response2 = new EmbedBuilder()
          .setDescription(`\`✅\`Başarıyla \`${logType.setLabel}\` ayarlandı.`)
          .setColor("Green")

        const row1 = new ActionRowBuilder()
          .setComponents(
            new StringSelectMenuBuilder()
              .setCustomId("kayıt-ayarları-menu")
              .setPlaceholder("Kayıt Ayarlarını Düzenle")
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