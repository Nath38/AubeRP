const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client()

var prefix = "?"
const warns = JSON.parse(fs.readFileSync('./warns.json'))

client.on('ready', () => {
    console.log('Le bot est prêt!')
    client.user.setGame(prefix + 'help')
    console.log('Joue à ' + prefix + 'help')
  });



client.on('guildMemberAdd', member =>{
    var role = member.guild.roles.find('name', '👨‍🎓Citoyen👨‍🎓')
    member.addRole(role)
});

  client.on('guildMemberRemove', member =>{
    let embed = new Discord.RichEmbed()
        .setDescription(':cry: **' + member.user.username + '** a quitté ' + member.guild.name)
        .setColor('#B22222')
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('608337514595483662').send(embed)
 
});

client.on('guildMemberAdd', member =>{
    let embed = new Discord.RichEmbed()
        .setDescription(':tada: **' + member.user.username + '** a rejoint ' + member.guild.name)
        .setColor('#7FFF00')
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('608337514595483662').send(embed)
 
});

client.on('message', message => {
    if (message.content === prefix + 'help') {
      var help_embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle('Voici les commandes !')
      .setDescription('Mon prefix est **' + prefix + '** et pour utiliser un commande faites **' + prefix +'<Commande>**')
      .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
      .addField('ping', "Pour s'avoir le ping du bot")
      .addField('infractions', "Pour vois tous les warn d'une personne")
      .addField('membre', 'Pour savoir combien somme ton sur le serveur')
      .addField('serveur', "Pour plus d'information sur le serveur")
      .addField('workshop', 'Lien du workshop du Prison RP')
      .addField('infractions', "Toutes les infractions d'un joueur")
      .addField('help2', 'Commande administrateur')
      .setTimestamp()
      message.delete()
      message.channel.send(help_embed);
    }
  })

client.on('message', message => {
    if (message.content === prefix + 'help2') {
      var help_embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle('Voici les commandes administrateur !')
      .setDescription("Mon prefix est **" + prefix + "** et pour utiliser un commande faites **" + prefix +"<Commande>**")
      .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
      .addField('clear', 'Clear des message')
      .addField('mute', 'Mute un joueur')
      .addField('Unmute', 'UnMute un joueur')
      .addField('ban', 'Ban un joueur')
      .addField('kick', 'Kick un joueur')
      .addField('warn', 'Warn un joueur')
      .addField('unwarn', 'Unwarn un joueur')
      .addField('say', "Message d'annonce pour le serveur")
      .addField('mp', 'MP tous le discord')
      .setTimestamp()
      message.delete()
      message.channel.send(help_embed);
    }
  })

  client.on('message', async message => {
    if(message.content.startsWith(prefix + 'mp')){
  
      var args = message.content.split(" ").slice(1);
      var msge = args.join(' ');
  
      if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) return message.channel.send("Tu ne peux pas utiliser cette commande.");
      if(!msge) return message.channel.send('Precise un message !')
  
      var mpall = new Discord.RichEmbed()
      .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
      .setTimestamp()
      .setColor('RANDOM')
      .addField('Annonce à lire', msge);
      message.delete()
      message.guild.members.map(m => m.send(mpall))
    }
  });

  client.on('message', async message => {
    if(message.content.startsWith(prefix + 'say')){
  
      var args = message.content.split(" ").slice(1);
      var messageToBot = args.join(' ');
  
      if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) return message.channel.send("Tu ne peux pas utiliser cette commande.");
      if(!messageToBot) return message.channel.send('Precise un message !')
  
      var say = new Discord.RichEmbed()
      .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
      .setTimestamp()
      .setColor('RANDOM')
      .addField('Annonce à lire', messageToBot);
      message.delete()
      message.channel.send(say);
    }
  });

  client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
  
    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let count = args[1]
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(parseInt(count) + 1)
    }
  
    if (args[0].toLowerCase() === prefix + "mute") {
      message.delete()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Membre introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        let userrole = message.guild.roles.find(role => role.name === '👨‍🎓Citoyen👨‍🎓')
        if (muterole) {
            member.removeRole(userrole)
            member.addRole(muterole)
            message.channel.send(member + ' a été mute :white_check_mark:')
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then((role) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
                message.channel.send(member + ' a été mute :white_check_mark:')
            })
        }
    }
  })

  client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "warn") {
      message.delete()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas warn ce membre")
        let reason = args.slice(2).join(' ')
        if (!reason) return message.channel.send("Veuillez indiquer une raison")
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
    }
 
    if (args[0].toLowerCase() === prefix + "infractions") {
      message.delete()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
            .addField('10 derniers warns', ((warns[member.id]) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
            .setTimestamp()
        message.channel.send(embed)
    }
        //unmute
        if(args[0].toLowerCase() === prefix + "unmute"){
          message.delete()
          if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
          let member = message.mentions.members.first()
          if(!member) return message.channel.send("Membre introuvable")
          if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.")
          if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne pas unmute ce membre.")
          let muterole = message.guild.roles.find(role => role.name === 'Muted')
          let userrole = message.guild.roles.find(role => role.name === '👨‍🎓Citoyen👨‍🎓')
          if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
          if(userrole && member.roles.has(userrole.id)) member.addRole(userrole)
          message.channel.send(member + ' a été unmute :white_check_mark:')
      }
   
      //unwarn
      if(args[0].toLowerCase() === prefix + "unwarn"){
        message.delete()
          let member = message.mentions.members.first()
          if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
          if(!member) return message.channel.send("Membre introuvable")
          if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
          if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne pas unwarn ce membre.")
          if(!warns[member.id]|| !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
          warns[member.id].shift()
          fs.writeFileSync('./warns.json',JSON.stringify(warns))
          message.channel.send("Le dernier warn de " +member+ " a été retiré :white_check_mark:")
     
      }
  })

  client.on('message', message => {
    if (message.content === prefix + 'ping') {
      var ping_embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
      .addField('Le ping du bot est de :', Math.round(client.ping) + 'ms')
      .setTimestamp()
      message.delete()
      message.channel.send(ping_embed);
    }
  })

  client.on('message', message => {
    if (message.content === prefix + 'membre') {
      var membre_embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
      .addField('Nous sommes : ', message.guild.memberCount + ' sur ' + message.guild.name)
      .setTimestamp()
      message.delete()
      message.channel.send(membre_embed);
    }
  })

  client.on('message', message => {
    if (message.content === prefix + 'serveur') {
      var server_embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription("Informations du serveur")
      .setFooter('Commande exécuter par : ' + message.author.tag, message.author.avatarURL)
      .addField("Server Name", message.guild.name)
      .addField("Créé le", message.guild.createdAt)
      .addField("Vous avez rejoint le", message.member.joinedAt)
      .addField("Total Membre", message.guild.memberCount);
      message.delete()
      message.channel.send(server_embed);
    }
  })

  client.on('message', message => {
    if (message.content === prefix + 'workshop') {
      message.reply('Le workshop du prison RP: https://steamcommunity.com/sharedfiles/filedetails/?id=1775480472')
      message.delete()
    }
  })

client.login(process.env.TOKEN);