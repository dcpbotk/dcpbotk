import { EmbedBuilder  } from "discord.js"
export default (description, color = "BLUE", title = "") => {
    //RED - GREEN - INFO
    if(color == "RED") color = "RED"
    else if(color == "GREEN") color = "GREEN"
    else if(color == "INFO") color = "YELLOW"
    
    const response = new EmbedBuilder()
        .setDescription(description)
        .setColor(color)
        .setTitle(title)

    return response
}