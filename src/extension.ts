import * as vscode from 'vscode';
import { FlinkSQLExtension } from './FlinkSQLExtension';
import { FlinkSQLCompletionProvider } from './features/FlinkSQLCompletionProvider';
import { FlinkSQLHoverProvider } from './features/FlinkSQLHoverProvider';
import { renderSnippetExplorer, insertSnippet, copyToClipboard } from './explorer/SnippetExplorer';
import { ExtendedTreeItem } from 'react-vsc-treeview';
import { renderMonitorExplorer, openExternalView } from './explorer/MonitorExplorer';
import { ViewLoader } from './view/ViewLoader';
import { refreshJobsEvent, refreshTaskManagersEvent } from './events/explorerEvents';
import * as dotenv from 'dotenv';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "vsc-flink-sql-ext" is now active!');

  // config environment variable
  dotenv.config({
    path: path.join(context.extensionPath, '.env'),
  });

  const flinkSqlExtension = new FlinkSQLExtension(context);

  // show info message and execute command to settings panel when first open extension
  vscode.window
    .showInformationMessage(
      'Welcome to FlinkSQL Extension, please go to settings to configure. Also make sure you have started a [local cluster](https://ci.apache.org/projects/flink/flink-docs-release-1.12/try-flink/local_installation.html#step-2-start-a-cluster)',
      'Go to Settings'
    )
    .then(value => {
      if (value === 'Go to Settings') {
        vscode.commands.executeCommand('workbench.action.openSettings', 'flinksql');
      }
    });

  context.subscriptions.push(
    // editor execution
    vscode.commands.registerCommand('flinksql.editor.execute', () => flinkSqlExtension.executeSql()),
    vscode.commands.registerCommand('flinksql.editor.execute_selection', () => flinkSqlExtension.executeSelectedSql()),
    vscode.commands.registerCommand('flinksql.editor.execute_input', () => flinkSqlExtension.executeShortInput()),
    // Flink web view
    vscode.commands.registerCommand('flinksql.webview.open', () => {
      ViewLoader.showWebview(context);
    }),
    vscode.commands.registerCommand('flinksql.webview.refresh', () => {
      // see: https://stackoverflow.com/a/53057785/12733140
      vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
    }),

    // snippets explorer
    vscode.commands.registerCommand('flinksql.explorer.insert_snippet', (node: ExtendedTreeItem) =>
      insertSnippet(node)
    ),
    vscode.commands.registerCommand('flinksql.explorer.copy_to_clipboard', (node: ExtendedTreeItem) =>
      copyToClipboard(node)
    ),
    renderSnippetExplorer(context),

    // monitor explorer
    vscode.commands.registerCommand('flinksql.webview.open_external_view', (node: ExtendedTreeItem) =>
      openExternalView(node)
    ),
    vscode.commands.registerCommand('flinksql.explorer.refresh_monitor', () => {
      refreshJobsEvent.fire();
      refreshTaskManagersEvent.fire();
    }),
    renderMonitorExplorer(context),

    // terminating CLI
    vscode.commands.registerCommand('flinksql.editor.terminate', () => flinkSqlExtension.terminateCLI()),

    // add keyword auto-complete
    vscode.languages.registerCompletionItemProvider('flinksql', new FlinkSQLCompletionProvider()),

    // add hover for functions
    vscode.languages.registerHoverProvider('flinksql', new FlinkSQLHoverProvider())
  );
}

export function deactivate() {}
