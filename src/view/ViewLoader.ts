import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getDashboardUrl } from '../config';
import { Router, Page } from './router/Router';
import { RouterMessage, ReloadMessage } from './messages/messageTypes';

export class ViewLoader {
  // use Singleton Pattern to make sure always only one webview panel get displayed
  public static currentPanel?: vscode.WebviewPanel;

  private panel: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private disposables: vscode.Disposable[];
  private router: Router;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.disposables = [];
    this.router = new Router();

    this.panel = vscode.window.createWebviewPanel('flinkDashboard', 'Flink DashBoard', vscode.ViewColumn.One, {
      enableScripts: true,
      // might cause memory issue, need more test
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'resources')),
      ],
    });

    // render webview
    this.renderWebview();

    this.panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables
    );

    this.panel.webview.onDidReceiveMessage(
      (message: RouterMessage | ReloadMessage) => {
        // receive message from webview in extension
        if (message.type === 'ROUTER') {
          // change route
          this.router.route((message as RouterMessage).payload);
          // re-render view
          this.renderWebview();
        } else if (message.type === 'RELOAD') {
          // see: https://stackoverflow.com/a/53057785/12733140
          vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
        }
      },
      null,
      this.disposables
    );
  }

  private renderWebview() {
    // pass vscode variable to webview context
    const html = this.render(this.router.getCurrentPage());
    const baseUrl = getDashboardUrl();
    this.panel.webview.html = html
      .replace('{#baseUrl#}', baseUrl)
      .replace('{#currentPage#}', this.router.getCurrentPage());
  }

  static showWebview(context: vscode.ExtensionContext) {
    const cls = this;
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
    if (cls.currentPanel) {
      cls.currentPanel.reveal(column);
    } else {
      cls.currentPanel = new cls(context).panel;
    }
  }

  static postMessageToWebview(message: any) {
    // post message from extension to webview
    const cls = this;
    cls.currentPanel?.webview.postMessage(message);
  }

  public dispose() {
    ViewLoader.currentPanel = undefined;

    // reset router
    this.router.reset();

    // Clean up our resources
    this.panel.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private getStaticFilePath() {
    if (process.env.VIEW_ENV === 'dev') {
      // in dev mode, use cdn for better debugging
      return {
        vuePath: 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js',
        antdStylePath: 'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.css',
        antdScriptPath: 'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.js',
      };
    } else {
      // in production mode, use minified local files
      return {
        vuePath: this.panel.webview.asWebviewUri(
          vscode.Uri.file(path.join(this.context.extensionPath, 'resources', 'lib', 'vue.min.js'))
        ),
        antdStylePath: this.panel.webview.asWebviewUri(
          vscode.Uri.file(path.join(this.context.extensionPath, 'resources', 'lib', 'antd.min.css'))
        ),
        antdScriptPath: this.panel.webview.asWebviewUri(
          vscode.Uri.file(path.join(this.context.extensionPath, 'resources', 'lib', 'antd.min.js'))
        ),
      };
    }
  }

  private getWebviewUriFilePaths(folderPath: string) {
    const files = fs
      .readdirSync(folderPath)
      .filter(file => fs.statSync(path.join(folderPath, file)).isFile())
      .map(f => this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(folderPath, f))));
    return files;
  }

  private getScriptStringFromFiles(files: vscode.Uri[]) {
    const s = files.reduce((result, file) => {
      result += `<script src="${file}"></script>`;
      return result;
    }, '');

    return s;
  }

  private getStyleStringFromFiles(files: vscode.Uri[]) {
    const s = files.reduce((result, file) => {
      result += `<link rel="stylesheet" type="text/css" href="${file}">`;
      return result;
    }, '');

    return s;
  }

  render(page: Page) {
    const { antdScriptPath, antdStylePath, vuePath } = this.getStaticFilePath();

    const pagePath = vscode.Uri.file(path.join(this.context.extensionPath, 'resources', 'pages', `${page}.html`));
    const pageStylePath = this.panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'resources', 'styles', `${page}.css`))
    );
    const pageScriptPath = this.panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'resources', 'components', `${page}.vue.js`))
    );

    const content = fs.readFileSync(pagePath.fsPath, 'utf-8');

    // utils
    const utilsScriptPath = this.panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'resources', 'utils', 'index.js'))
    );

    // common files
    const commonScriptPaths = this.getWebviewUriFilePaths(
      path.join(this.context.extensionPath, 'resources', 'components', 'common')
    );
    const commonStylePaths = this.getWebviewUriFilePaths(
      path.join(this.context.extensionPath, 'resources', 'styles', 'common')
    );
    // customize files
    const customizeScriptPaths = this.getWebviewUriFilePaths(
      path.join(this.context.extensionPath, 'resources', 'components', 'customize')
    );
    const customizeStylePaths = this.getWebviewUriFilePaths(
      path.join(this.context.extensionPath, 'resources', 'styles', 'customize')
    );

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="${antdStylePath}">
        ${this.getStyleStringFromFiles(customizeStylePaths)}
        ${this.getStyleStringFromFiles(commonStylePaths)}
        <link rel="stylesheet" type="text/css" href="${pageStylePath}">
        <title>Flink SQL DashBoard</title>

        <style>
        /* base layout */
        body {
          padding: 0;
          margin: 0;
        }

        /* content */
        .content {
          margin: 24px;
          height: 100%;
          flex: 1 1 auto;
        }
        </style>
      </head>
  
      <body>
        <div id="app">
          <a-layout style="min-height: 100vh">
            <nav-bar></nav-bar>
            <a-layout>
              <header-bar></header-bar>
              <a-layout-content class="content">
                ${content}
              </a-layout-content>
            </a-layout>
          </a-layout>
        </div>

        <script>
          const baseUrl = "{#baseUrl#}"
          const currentPage = "{#currentPage#}"
        </script>
        <script src="${utilsScriptPath}"></script>
        <script src="${vuePath}"></script>
        <script src="${antdScriptPath}"></script>
        <script>
          Vue.use(antd)
          Vue.prototype.$vscode = acquireVsCodeApi();
        </script>
        ${this.getScriptStringFromFiles(customizeScriptPaths)}
        ${this.getScriptStringFromFiles(commonScriptPaths)}
        <script src="${pageScriptPath}"></script>
        <script>
          new Vue({ el: '#app' })
        </script>
      </body>
      </html>`;
  }
}
