import clc from 'cli-color';
class Logger {
  private static lastLogTime = Date.now()
  static log(message: string, context: string = '') {
    const timestamp = new Date().toLocaleString();
    const pid = process.pid;
    const currentTime = Date.now()
    const diff = currentTime - this.lastLogTime
    console.log(
      `${clc.green('[Nest]')} ${clc.green(pid.toString())}  ${clc.green('-')} ${clc.yellow(timestamp)}     ${clc.green('LOG')} ${clc.yellow(`[${context}]`)} ${clc.green(message)} ${diff}ms`
    );
    Logger.lastLogTime = currentTime
  }
}
export { Logger };
