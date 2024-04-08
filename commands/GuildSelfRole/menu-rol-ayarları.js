import fs from 'fs';
import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export const data = {
  name: "menu-rol-ayarları",
  description: "Sunucudaki menu-rol ayarlarını düzenler.",
  permission: ["Administrator"],
  botpermission: ["Administrator"],
  cooldown: 10,

  async execute(interaction) {

    const { guildId } = interaction

    let selectMenuArgs
    try {
      const data = fs.readFileSync('utils/embed_data/guildselfrolemenudata.json', 'utf8');
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

    const msgLogSettings = await Promise.all(selectMenuArgs.map(async (arg) => {
      try {
        const readingkey = await Guild_Schema.findOne({ guild_id: guildId });
        if (readingkey && readingkey[arg.schemaKey] && (arg.schemaKey === "selfrolemenu")) {

          let selfRolesMenuArray = readingkey[arg.schemaKey].split(',');
          selfRolesMenuArray = selfRolesMenuArray.map(item => item.trim());
          let selfRolesMenuString = '';
          selfRolesMenuArray.forEach(roleId => {
            selfRolesMenuString += `\n\`-\`ID:${roleId}: <@&${roleId}>`;
          });

          return `\`➕\`**${arg.setLabel}:** ${selfRolesMenuString}`;
        }
        else if (readingkey && readingkey[arg.schemaKey] && (arg.schemaKey === "selfrolemenud")) {
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

    const response = new EmbedBuilder()
      .setAuthor({ name: "Bot • Sunucunun Menu-Rol Ayarları" })
      .setDescription(`\`💡\`Tüm ayarları aşağıdaki menüden düzenleyebilirsiniz.\n\n${msgLogSettings.join("\n")}`)
      .setColor("Orange")
      .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

    const row1 = new ActionRowBuilder()
      .setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("mrol-ayarları-menu")
          .setPlaceholder("Menu Rol Ayarlarını Düzenle")
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
        new ButtonBuilder()
          .setCustomId('mrol-menu-send')
          .setLabel('Menüyü Gönder')
          .setStyle('Success'),
      );

    interaction.reply({ embeds: [response], components: [row1, row2] }).catch((error) => { console.log(error.message) });

  }
};

export const slash_data = {
  name: data.name,
  description: data.description,
}