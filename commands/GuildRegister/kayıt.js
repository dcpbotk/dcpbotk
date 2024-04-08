import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js"

export const data = {
  name: "kayıt",
  description: "Kullanıcıyı kayıt eder.",
  botpermission: ["ManageRoles"],
  cooldown: 5,

  async execute(interaction) {
    const { guild, member, type } = interaction;
    if (type !== 0 && type !== 2 && type !== 5) return

    const memberId = member.id;
    let targetUserId = "0";
    let requestedName;
    let roleIdToAdd;
    let roleIdToRemove;
    let errorStatus;
    let registerModRoleId;
    let registerChannelId

    // Kayıt ayarları kontrolü
    const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });

    if (guildSchema) {
      if (guildSchema.registerrole) {
        roleIdToAdd = guildSchema.registerrole;
      }
      if (guildSchema.registerunrole) {
        roleIdToRemove = guildSchema.registerunrole;
      }
      if (guildSchema.registermodrole) {
        registerModRoleId = guildSchema.registermodrole;
      }
      if (guildSchema.registerchannel) {
        registerChannelId = guildSchema.registerchannel;
      }
    }

    if (!roleIdToAdd || !registerModRoleId || !registerChannelId) {
      if (type === 2 || type === 5) {
        const response = new EmbedBuilder()
          .setAuthor({ name: "Bot • Kayıt" })
          .setDescription(`\`❕\`<@${memberId}>, kayıt ayarları hatalı veya sistem kapalı.\n\`❔\`Kayıt ayarlarını(\`/kayıt-ayarları\`) açın. \`Kayıt Rolü, Kayıt Moderatörü ve Kayıt Kanalı\` ayarlarını belirleyin.`)
          .setColor("Red");
        interaction.reply({ embeds: [response], ephemeral: true });
      }
      return;
    }

    //Yetkili rolü kontrolü
    if (!member.roles.cache.some(role => role.id === registerModRoleId)) {
      if (type === 2 || type === 5) {
        const response = new EmbedBuilder()
          .setAuthor({ name: "Bot • Kayıt" })
          .setDescription(`\`❕\`<@${memberId}>, malesef işlem yapamadınız.\n\`❔\`Bunu <@&${registerModRoleId}> rolü olmadan yapamazsınız.`)
          .setColor("Red")
        interaction.reply({ embeds: [response], ephemeral: true });
      }
      return;
    }


    // interaction.type Kontrolleri
    if (interaction.type === 0) {
      const { content, mentions } = interaction;
      const args = content.slice(1).trim().split(/ +/)
      targetUserId = mentions.members.first()?.id || args[1]
      requestedName = args[2];
    }
    else if (interaction.type === 2) {
      const { options } = interaction;
      targetUserId = options?._hoistedOptions?.[0]?.user.id;
      requestedName = options?._hoistedOptions?.[1]?.value;
    }
    else if (interaction.type === 5) {
      const { fields } = interaction;
      const componentsfetch = fields.components[0].components[0]
      targetUserId = componentsfetch.customId
      requestedName = componentsfetch.value
    }


    // Kullanıcı kontrolü
    const targetMember = await guild.members.fetch(targetUserId)
      .catch((err) => {
        console.log(err.message)
      })

    if (!targetMember) {
      const response = new EmbedBuilder()
        .setAuthor({ name: "Bot • Kayıt" })
        .setDescription(`\`❕\`<@${memberId}>, malesef işlem yapamadınız.\n\`❔\`<@${targetUserId}> kullanıcısı sunucuda bulunmuyor.`)
        .setColor("Red")
      interaction.reply({ embeds: [response] })
      return
    }

    // Rol kontrolleri
    if (targetMember.roles?.cache?.has(roleIdToAdd)) {
      const response = new EmbedBuilder()
        .setAuthor({ name: "Bot • Kayıt" })
        .setDescription(`\`❕\`<@${memberId}>, malesef işlem yapamadınız.\n\`❔\`<@${targetUserId}> kullanıcısında zaten <@&${roleIdToAdd}> rolü bulunuyor.`)
        .setColor("Red")

      if (type !== 5) {
        interaction.reply({ embeds: [response] })
      }
      else {

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('kayıtbutton')
              .setLabel('Kayıt Et')
              .setStyle('Success')
              .setDisabled(true),
          );

        interaction.update({ embeds: [interaction.message.embeds[0], response], components: [row] })
      }
      return
    }


    // İsim değiştirme Kontrolü
    if (requestedName) {
      await targetMember.setNickname(requestedName, 'Kayıt')
        .catch((error) => {
          errorStatus = true;
          console.log(error.message)
          if (error.code === 50013) {
            const response = new EmbedBuilder()
              .setAuthor({ name: "Bot • Kayıt" })
              .setDescription(`\`❕\`<@${memberId}>, malesef işlem yapamadınız.\n\`❔\`<@${targetMember.id}> kullanıcınının ismini değiştirmeye iznim yok.`)
              .setColor("Red");
            if (type !== 5) {
              interaction.reply({ embeds: [response] })
            }
            else {
      
              const row = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('kayıtbutton')
                    .setLabel('Kayıt Et')
                    .setStyle('Success')
                    .setDisabled(true),
                );
      
              interaction.update({ embeds: [interaction.message.embeds[0], response], components: [row] })
            }
          }
        })
    }
    if (errorStatus) return


    // Rolleri al-ver ve son mesajı at
    try {
      if (roleIdToAdd) {
        await targetMember.roles.add(roleIdToAdd);
      }
      if (roleIdToRemove) {
        await targetMember.roles.remove(roleIdToRemove);
      }


      const response = new EmbedBuilder()
        .setAuthor({ name: "Bot • Kayıt" })
        .setDescription(`\`✅\`<@${memberId}> tarafından <@${targetUserId}> kullanıcısı ${requestedName ? `\`${requestedName}\` takma adıyla` : "başarıyla"} kayıt oldu.`)
        .setColor("Orange")


      if (type !== 5) {
        interaction.reply({ embeds: [response] })
      }
      else {

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('kayıtbutton')
              .setLabel('Kayıt Et')
              .setStyle('Success')
              .setDisabled(true),
          );

        interaction.update({ embeds: [interaction.message.embeds[0], response], components: [row] })
      }

    } catch (error) {
      console.log(error)
      if (error.code === 10011) {
        const response = new EmbedBuilder()
          .setAuthor({ name: "Bot • Kayıt" })
          .setDescription(`\`❕\`<@${memberId}>, kayıt ayarları hatalı.\n\`❔\`Kayıt ayarlarını(\`/kayıt-ayarları\`) açın. \`Kayıtsız Rolü ve Kayıt Rolü\` ayarlarını düzenleyin.`) 
          .setColor("Red")
        interaction.reply({ embeds: [response] })
      }
      else if (error.code === 50013) {
        const response = new EmbedBuilder()
          .setAuthor({ name: "Bot • Kayıt" })
          .setDescription(`\`❕\`<@${memberId}>, malesef işlem yapamadınız.\n\`❔\`<@&${roleIdToAdd}> veya <@&${roleIdToRemove}> rollerini alıp-vermeye iznim yok.`)
          .setColor("Red")
        interaction.reply({ embeds: [response] })
      }
    }


  }
};


export const slash_data = {
  name: data.name,
  description: data.description,
  options: [
    {
      name: "kullanıcı",
      description: "Lütfen kullanıcıyı girin",
      type: 6,
      required: true
    },
    {
      name: "isim",
      description: "Kullanıcının istediği ismi girin.",
      type: 3,
    },
  ]
}