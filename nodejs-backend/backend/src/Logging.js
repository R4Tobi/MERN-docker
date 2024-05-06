class Logging {
    constructor() {
        
    }

    //color Formatting
    const neutral = "\x1b[0m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const blue = "\x1b[34m";
    const magenta = "\x1b[35m";
    const whiteBG = "\x1b[47m";

    //Logging
    query (message){
        console.log(whiteBG + "QUERY: " + neutral + message);
    }
    warn(message){
        console.log(yellow + "WARN: " + neutral + message);
    };
    error(message){
        consoele.log(red + "ERROR: " + neutral + message);
    };
    success(message){
        console.log(green + "INFO: " + neutral + message);
    };
    info(message){
        console.log(blue + "INFO: " + neutral + message);
    };
    dev(message){
        console.log(magenta + "DEV: " + neutral + message);
    }

}

module.exports = Logging;