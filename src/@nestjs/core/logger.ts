import clc from 'cli-color'
export class Logger {
  private static lastLogTime = Date.now();
  static log(message: string, context: string) {
    // 获取当前时间戳
    const timestamp = new Date().toLocaleString();
    const currentTime = Date.now();
    // 获取当前进程
    const pid = process.pid;
    const diffTime = currentTime - this.lastLogTime;
    console.log(`[${clc.green('Nest')}] ${clc.green(pid.toString())} - ${clc.yellow(timestamp)} - ${clc.green(context)} - ${clc.yellow(message)} +${diffTime}ms`);
    this.lastLogTime = currentTime;
  }
}
