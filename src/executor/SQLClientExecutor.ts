import * as cp from 'child_process';
import * as vscode from 'vscode';
import stripAnsi = require('strip-ansi');
import { getPackagePath, getClientStartCommand } from '../config';

export class SQLClientExecutor {
  context: vscode.ExtensionContext;
  channel: vscode.OutputChannel | null;
  terminal: cp.ChildProcessWithoutNullStreams | null;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.channel = null;
    this.terminal = null;
  }

  executeSql(sql: string): void {
    this.execute(sql);
    console.log('Start submitting job at ' + Date.now());
  }

  execute(sql: string): void {
    // create new terminal
    if (!this.terminal) {
      this.terminal = this.getTerminal();
    }

    const spaces = Array(vscode.workspace.getConfiguration('editor').get('tabSize')).fill('\xa0').join('');
    sql = sql.replace(/\t/g, spaces);
    this.terminal.stdin.write(sql);
    this.terminal.stdin.write('\n');
  }

  executeShortCommand(input: string): void {
    if (!this.terminal) {
      vscode.window.showErrorMessage('No CLI currently running. Cannot submit your input.');
    } else {
      // trim and submit user's command to CLI
      const command = input.trim();
      this.terminal.stdin.write(command);
    }
  }

  getTerminal(): cp.ChildProcessWithoutNullStreams {
    const path = getPackagePath();
    const command = getClientStartCommand();

    const enterDirectory = 'cd ' + path + '\n';
    const startCliCommand = command + '\n';
    console.log(enterDirectory);
    console.log(startCliCommand);

    // Create new terminal
    let terminal = cp.spawn('bash');

    terminal.stderr.on('data', data => {
      console.log('stderr: ', data.toString());
      if (!this.channel) {
        this.channel = vscode.window.createOutputChannel('FlinkSQL CLI');
        this.channel.show(true);
        this.channel.append('stderr: ' + data.toString());
      }
    });

    terminal.stdout.on('data', chunk => {
      const data: string = stripAnsi(chunk.toString());
      console.log('chunk', chunk, data);
      if (!this.channel) {
        this.channel = vscode.window.createOutputChannel('FlinkSQL CLI');
      }
      this.channel.show(true);
      this.channel.append(data);
    });

    terminal.on('exit', data => {
      this.terminal = null;
      console.log('Flink SQL child process exited with code: ', data);
      vscode.window.showInformationMessage(`Flink SQL CLI has exited with code: ${data}`);
    });

    terminal.on('close', code => {
      this.terminal = null;
      console.log('Closed with code: ', code);
      vscode.window.showInformationMessage(`Flink SQL CLI closed with code ${code}`);
    });

    terminal.on('error', err => {
      this.terminal = null;
      console.log('Flink SQL child process met error: ', err);
      vscode.window.showErrorMessage(
        'Your Flink CLI failed to spawn / terminate. \
            Please check your settings and try again.'
      );
    });

    // let command = vscode.workspace.getConfiguration('flinksql.startClientCommand');
    // TODO: formalize this command
    terminal.stdin.write(enterDirectory);
    terminal.stdin.write(startCliCommand);
    // TODO: check spawn status: is the command valid?
    return terminal;
  }

  terminateCLI() {
    if (this.terminal) {
      this.terminal.kill('SIGTERM');
      console.log(`Successfully terminated CLI? ${this.terminal.killed}`);
      // vscode.window.showInformationMessage(`Terminate CLI? ${this.terminal.killed}`);
      this.terminal = null;
    } else {
      vscode.window.showInformationMessage('No running CLI to kill.');
    }
  }
}
