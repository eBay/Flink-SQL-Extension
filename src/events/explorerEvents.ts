import * as vscode from 'vscode';

// event to trigger Monitor Explorer refresh
export const refreshTaskManagersEvent = new vscode.EventEmitter<void>();
export const refreshJobsEvent = new vscode.EventEmitter<void>();
