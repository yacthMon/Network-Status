let blessed = require('blessed');
class Monitor {
  constructor() {
    this.debugMode = false;
    this.screen = blessed.screen({
      smartCSR: true
    })
    this.statusBody = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      tags: true
    });
    this.bodyLog = blessed.box({
      top: 8,
      left: 0,
      width: '50%',
      height: '50%',
      tags: true,
      scrollable: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: '#f0f0f0'
        },
        hover: {
          bg: 'green'
        }
      }
    });
    this.bodyNetworkConfig = blessed.box({
      top: 1,
      left: 0,
      width: '30%',
      height: '25%',
      tags: true,
      scrollable: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: '#f0f0f0'
        },
        hover: {
          bg: 'green'
        }
      }
    });

    this.screen.append(this.statusBody);
    this.screen.append(this.bodyLog);
    this.screen.append(this.bodyNetworkConfig);

    this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
      return process.exit(0);
    });

    //== Catch error ===========================================
    this.error = (err, code) => {
      this.log(`{red-fg}[${(code ? `Error ${code} `: "uncaughtException")}]{/red-fg} update in errors log ${this.fullCurrentTime()}`);
    }
    console.error = this.error;
    process.on('uncaughtException', this.error);
    process.on('exit', (code) => {
      this.logNormal.write(shurdownServerText + " with code : " + code);
      this.logError.write(shurdownServerText + " with code : " + code);
    });
    let runningCheck = ["|", "/", "-", "\\"];
    let indexRunning = 0;
    this.processStatus = setInterval(()=>{
      indexRunning = ++indexRunning == 4 ? 0 : indexRunning;
      this.status(`{bold}{green-fg}[${runningCheck[indexRunning]}] Network Status v0.0.1 ___ {/green-fg}{/bold}`)
    },100);

    this.bodyNetworkConfig.pushLine("Network config");
    this.setConfig({publicIP : '.. loading ..', privateIP:'.. loading ..', gateway:'.. loading ..', dns:'.. loading ..'})
    this.log("Initial System . . .");
  }

  status(text) {
    this.statusBody.setLine(0, text);
    this.screen.render();
  }

  info(text) {
    this.bodyLog.pushLine(text);
    this.bodyLog.setScroll(this.bodyLog.getScrollHeight());
    this.screen.render();
  }

  log(text) {
    let logText = "[" + this.currentTime() + "] " + text
    this.bodyLog.pushLine(logText);
    this.bodyLog.setScrollPerc(100);
    this.screen.render();
  }

  currentTime() {
    let time = new Date();
    return `${((time.getHours() < 10) ? "0" : "")}${time.getHours()}:${((time.getMinutes() < 10) ? "0" : "")}${time.getMinutes()}:${((time.getSeconds() < 10) ? "0" : "")}${time.getSeconds()}`;
  }

  fullCurrentTime() {
    let time = new Date();
    return `[${time.getDate()}/${(time.getMonth() + 1)}/${time.getFullYear()}] ${this.currentTime()}:${time.getMilliseconds()}`;
  }

  setConfig({publicIP, privateIP, gateway, dns}){
    publicIP ? this.bodyNetworkConfig.setLine(1, `Public IP  : {bold}${publicIP}{/bold}`):''
    privateIP ? this.bodyNetworkConfig.setLine(2, `Private IP : {bold}${privateIP}{/bold}`):''
    gateway ? this.bodyNetworkConfig.setLine(3, `Gateway    : {bold}${gateway}{/bold}`):''
    dns ? this.bodyNetworkConfig.setLine(4, `DNS        : {bold}${dns}{/bold}`):''
    this.screen.render();
  }
}
module.exports = Monitor;