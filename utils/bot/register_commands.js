import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10"
import { EmbedBuilder } from "discord.js";


export default async guild => {

    const { client } = guild

    const rest = new REST({ version: "10" }).setToken(process.env.token)


    // const body = client.commands.map(command => command.slash_data)
    const body = client.commands
        .map(command => command.slash_data)
        .filter(slashData => slashData !== undefined);
    console.log(body)

    try {
        console.log("Command edits running...")

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body }
        )
        console.log("Command edits succesful.")
        return body

    } catch (e) {
        if (e.code == 50001) {
            const embed = new EmbedBuilder()
                .setDescription("Slash Komutlar Başarılı bir şekilde kaydedilemedi")
                .setColor("RED")

            const owner = await guild.fetchOwner()
            owner.send({ embeds: [embed] }).catch(() => { })
        }
    }

}