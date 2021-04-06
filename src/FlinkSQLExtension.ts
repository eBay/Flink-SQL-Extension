import * as vscode from 'vscode';
import { SQLClientExecutor } from './executor/SQLClientExecutor';

export class FlinkSQLExtension {
  executor: SQLClientExecutor;
  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.executor = this.getExecutor();
  }

  executeSql() {
    const documentText = this.getFullDocumentText();
    if (documentText) {
      const separatedStatements = this.separateStatements(documentText);
      this.executor.executeSql(separatedStatements);
    } else {
      vscode.window.showErrorMessage('Cannot find active editor');
    }
  }

  executeSelectedSql() {
    const documentText = this.getSelectedDocumentText();
    if (documentText) {
      const separatedStatements = this.separateStatements(documentText);
      this.executor.executeSql(separatedStatements);
    } else {
      vscode.window.showErrorMessage('Cannot find active editor or did not select any message');
    }
  }

  executeShortInput() {
    vscode.window.showInputBox().then(input => {
      if (input) {
        this.executor.executeShortCommand(input);
      }
    });
  }

  getFullDocumentText(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      return document.getText();
    }
    return null;
  }

  getSelectedDocumentText(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (editor && !editor.selection.isEmpty) {
      return editor.document.getText(editor.selection);
    }

    return null;
  }

  getActiveEditorFileName(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      return editor.document.fileName;
    }
    return null;
  }

  getExecutor() {
    return new SQLClientExecutor(this.context);
  }

  terminateCLI(): void {
    this.executor.terminateCLI();
  }

  separateStatements(statements: string) {
    const separateRegex = /;(?=(?:[^']*'[^']*')*[^']*$)/g;
    const separateReplace = ';\n\n';
    return statements.replace(separateRegex, separateReplace);
  }
}
