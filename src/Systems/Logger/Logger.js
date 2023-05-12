class Logger{

    Log(message, title = ""){
        console.log(`LOG\t[${this.#GetTimeString()}] [ ${title} ] ${message}`)
    }
    
    Error(message, title = ""){
        console.error(`\x1b[41mERROR\t\x1b[0m\x1b[31m[${this.#GetTimeString()}] [ ${title} ] ${message}\x1b[0m`)
    }

    Warn(message, title = ""){
        console.warn(`\x1b[43mWARN\t\x1b[0m\x1b[33m[${this.#GetTimeString()}] [ ${title} ] ${message}\x1b[0m`)
    }

    Info(message, title = ""){
        console.info(`\x1b[46mINFO\t\x1b[0m\x1b[36m[${this.#GetTimeString()}] [ ${title} ] ${message}\x1b[0m`)
    }

    Success(message, title = ""){
        console.log(`\x1b[42mSUCCESS\t\x1b[0m\x1b[32m[${this.#GetTimeString()}] [ ${title} ] ${message}\x1b[0m`)
    }

    #GetTimeRaw(){
        return Date.now();
    }

    #GetTimeString(){
        const now = new Date();
        return `${now.getMilliseconds()}.${now.getSeconds()}.${now.getMinutes()}.${now.getHours()}-${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    }

}
module.exports = new Logger();