var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var rollResults = 'Results: ';
        switch (cmd){
            case 'roll':
                let solicitedRoll = args[1];
                let dices = solicitedRoll.split(';')
                let sum = 0;               
                dices.forEach((dice,index)=>{
                    let currentResult = '['
                    let times = parseInt(dice.substring(0,dice.indexOf('d')));
                    let currentDice = parseInt(dice.substring(dice.indexOf('d')+1));
                    for(var i=1;i<=times;i++){
                        let currentRoll = Math.floor(Math.random() * currentDice) + 1;
                        sum += currentRoll;
                        if (i>1)
                            currentResult = `${currentResult}, ${currentRoll}`
                        else
                            currentResult = `${currentResult} ${currentRoll}`
                        
                    }
                    if (dices.length > 1){
                        if (index == dices.length -1)
                            currentResult = `${currentResult} ]`                    
                        else
                            currentResult = `${currentResult} ];`                    
                    }
                    else{
                        currentResult = `${currentResult} ]`                    
                    }
                    rollResults = `${rollResults} ${currentResult}`
                })

                let bonusArgument = args.find(function(element){
                    return element.includes('--')
                });
                console.log(bonusArgument)

                if (bonusArgument){
                    if  (bonusArgument.includes('crit')){
                        sum = sum * 2;
                    }
                }

                let solicitedBonus = args[2];
                if (solicitedBonus){
                    let toAdd = parseInt(solicitedBonus.substring(solicitedBonus.indexOf('+')+1));
                    sum += toAdd;        
                    rollResults = `${rollResults} ${solicitedBonus}`
                }                

                rollResults =  `${rollResults} Total: ${sum}`

                bot.sendMessage({
                    to: channelID,
                    message: rollResults
                })
                break;
            case "help":
                var helpMessage = ` - Use !roll. \r\n - Separate different dice with ; Ex: 1d4;2d6. \r\n - You can add your modifier with a + sign with a blank space between it and the dice, Ex: 2d4 +2. \r\n - You can use --crit at the end of the command to double just the dice`
                bot.sendMessage({
                to: channelID,
                message: helpMessage
                })
                break;
        }        
     }
});