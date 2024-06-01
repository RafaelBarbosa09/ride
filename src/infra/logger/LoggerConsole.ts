import Logger from "../../application/logger/Logger";

class LoggerConsole implements Logger{
    log(message: string): void {
        console.log(message);
    }
}

export default LoggerConsole;