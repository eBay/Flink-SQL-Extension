import * as vscode from "vscode";
import reservedKeywords from "./reservedKeywords.json";

export class FlinkSQLHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    const currentWord = document.getText(range);

    const { flinkSQLFunctions } = reservedKeywords;
    const hoveredWordDetail = flinkSQLFunctions.filter(
      (f) => f.label.toUpperCase() === currentWord.toUpperCase()
    );
    let contents: vscode.MarkdownString[] = [];
    if (hoveredWordDetail.length > 0) {
      contents = [
        new vscode.MarkdownString(hoveredWordDetail[0].detail),
        new vscode.MarkdownString(hoveredWordDetail[0].documentation),
      ];
    }

    return new vscode.Hover(contents);
  }
}
