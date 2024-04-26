import Logger from "./Logger";

class LoggerConsole implements Logger{
    log(message: string): void {
        console.log(message);
    }
}

export default LoggerConsole;