import clc from 'cli-color';
class Logger {
  static log(message: string, context: string = '') {
    const timestamp = new Date().toLocaleString();
    const pid = process.pid;
    console.log(
      `${clc.green('[Nest]')} ${clc.green(pid.toString())}  ${clc.green('-')} ${clc.yellow(timestamp)}     ${clc.green('LOG')} ${clc.yellow(`[${context}]`)} ${clc.green(message)}`
    );
  }
}
export { Logger };
