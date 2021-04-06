import * as vscode from 'vscode';

export function getDashboardUrl() {
  const dashboardUrl = vscode.workspace.getConfiguration('flinksql').get('dashboardUrl', 'http://localhost:8081');
  // e.g. return localhost:8081 if input is localhost:8081/
  return dashboardUrl.endsWith('/') ? dashboardUrl.slice(0, -1) : dashboardUrl;
}

export function getPackagePath() {
  const packagePath = vscode.workspace.getConfiguration('flinksql').get('packagePath');
  return packagePath;
}

export function getClientStartCommand() {
  const startCommand = vscode.workspace.getConfiguration('flinksql').get('startClientCommand', './bin/sql-client.sh embedded');
  return startCommand;
}
