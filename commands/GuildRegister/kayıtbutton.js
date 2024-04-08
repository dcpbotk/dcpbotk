import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder } from "discord.js"

export const data = {
  name: "kayıtbutton",
  description: "Kullanıcıyı kayıt eder.",
  botpermission: ["ManageRoles"],
  cooldown: 5,

  async execute(interaction) {
    if (interaction.type !== 3) return

    const { member, guild, message } = interaction;

    let roleIdToAdd;
    let registerModRoleId;
    let registerChannelId

    // Kayıt ayarları kontrolü
    const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });

    if (guildSchema) {
      if (guildSchema.registerrole) {
        roleIdToAdd = guildSchema.registerrole;
      }
      if (guildSchema.registermodrole) {
        registerModRoleId = guildSchema.registermodrole;
      }
      if (guildSchema.registerchannel) {
        registerChannelId = guildSchema.registerchannel;
      }
    }


    if (!roleIdToAdd || !registerModRoleId || !registerChannelId) {
      const response = new EmbedBuilder()
        .setAuthor({ name: "Bot • Kayıt" })
        .setDescription(`\`❕\`<@${member.id}>, kayıt ayarları hatalı veya sistem kapalı.\n\`❔\`Kayıt ayarlarını\`/kayıt-ayarları\` açın. \`Kayıt Rolü, Kayıt Moderatörü ve Kayıt Kanalı\` ayarlarını belirleyin.`)
        .setColor("Red");
      interaction.reply({ embeds: [response], ephemeral: true });

      return;
    }


    //Yetkili rolü kontrolü
    if (!member.roles.cache.some(role => role.id === registerModRoleId)) {      
        const response = new EmbedBuilder()
          .setAuthor({ name: "Bot • Kayıt" })
          .setDescription(`\`❕\`<@${member.id}>, malesef işlem yapamadınız.\n\`❔\`Bunu <@&${registerModRoleId}> rolü olmadan yapamazsınız.`)
          .setColor("Red")
        interaction.reply({ embeds: [response], ephemeral: true });      
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId("kayıt")
      .setTitle("Şikayetinizi Girin")
      .setComponents(
        new ActionRowBuilder()
          .setComponents(
            new TextInputBuilder()
              .setCustomId(message.embeds[0].footer.text)
              .setLabel("Kullanıcı Adı")
              .setMaxLength(50)
              .setPlaceholder("Kullanıcı Adı Giriniz")
              .setRequired(false)
              .setStyle("Short")
          )
      )
    interaction.showModal(modal)

  }
};